'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  products as seedProducts,
  farmers as seedFarmers,
  orders as seedOrders,
  ledger as seedLedger,
  supportTickets as seedTickets,
} from '@/lib/golden-acres/data'
import {
  getCatalogSnapshot,
  persistProduct,
  persistProductStock,
  persistProductReview,
  persistFarmer,
  persistFarmerPatch,
} from '@/app/actions/catalog'
import { persistOrderStatus } from '@/app/actions/orders'
import type {
  Product,
  Farmer,
  Order,
  OrderItem,
  OrderStatus,
  LedgerEntry,
  Refund,
  SupportTicket,
  TicketCategory,
  TicketStatus,
  TicketMessage,
  PaymentMethod,
  StockStatus,
  ProduceCategory,
  ProductReviewStatus,
  GhanaRegion,
  Notification,
  NotificationKind,
} from '@/lib/golden-acres/types'

/**
 * Golden Acres shared data store.
 *
 * This is the single mutable source of truth shared across all four surfaces
 * (customer storefront, farmer portal, CS/Ops console, BI dashboard). Actions
 * taken on one surface immediately reflect on the others.
 *
 * Persistence is localStorage-backed for the front-end / mock phase — this is
 * the seam that will be swapped for Neon + server actions once the flagship is
 * approved. Component contracts (the hooks below) stay identical after the swap.
 */

const STORAGE_KEY = 'ga-store-v1'

// ---- inputs ----
export interface CreateOrderInput {
  reference: string
  customerName: string
  customerPhone: string
  items: {
    product: Product
    qty: number
  }[]
  address: {
    ghanaPostGPS: string
    area: string
    region?: GhanaRegion
    lat: number
    lng: number
  }
  slot: { date: string; window: string }
  payment: { method: PaymentMethod }
  subtotalEstimate: number
  deliveryFee: number
}

export interface AddProductInput {
  farmerId: string
  name: string
  category: ProduceCategory
  pricePerKg: number
  stockKg: number
  image?: string
  refrigerationRequired?: boolean
  organic?: boolean
  description?: string
  /** When true (self-service listing), the product goes live immediately. */
  autoPublish?: boolean
}

export interface CreateFarmerInput {
  id: string // matches the FarmerAccount.farmerId
  name: string
  farmName: string
  region: GhanaRegion
  town: string
  bio?: string
  story?: string
  photo?: string
  cover?: string
  methods?: string[]
  certifications?: string[]
  pickupGPS?: string
}

export interface CreateTicketInput {
  customerName: string
  customerPhone?: string
  customerEmail?: string
  orderRef?: string
  category: TicketCategory
  subject: string
  message: string
}

interface DataStoreCtx {
  hydrated: boolean
  // collections
  products: Product[]
  liveProducts: Product[] // approved + visible in the storefront
  pendingProducts: Product[] // awaiting moderation
  farmers: Farmer[]
  orders: Order[]
  ledger: LedgerEntry[]
  tickets: SupportTicket[]
  notifications: Notification[]
  // selectors
  productsByFarmer: (farmerId: string) => Product[]
  ordersByFarmer: (farmerId: string) => Order[]
  ordersForCustomer: (opts: { phone?: string; refs?: string[] }) => Order[]
  orderByRef: (reference: string) => Order | undefined
  getFarmer: (id: string) => Farmer | undefined
  notificationsFor: (phone: string) => Notification[]
  // order mutations
  createOrder: (input: CreateOrderInput) => Order
  /** Insert a server-persisted order into the in-memory store (idempotent by reference). */
  ingestOrder: (order: Order) => void
  setOrderStatus: (reference: string, status: OrderStatus) => void
  advanceOrder: (reference: string) => void
  /** Merge an authoritative server order (e.g. 3PL webhook result) into state. */
  applyServerOrder: (order: Order) => void
  addRefund: (reference: string, refund: Refund) => void
  // notification mutations
  notify: (n: {
    forPhone: string
    kind: NotificationKind
    title: string
    body: string
    href?: string
  }) => void
  markNotificationsRead: (phone: string) => void
  // product mutations
  addProduct: (input: AddProductInput) => Product
  setProductStock: (productId: string, stockKg: number) => void
  setProductReview: (productId: string, review: ProductReviewStatus) => void
  // farmer mutations
  createFarmer: (input: CreateFarmerInput) => Farmer
  updateFarmer: (farmerId: string, patch: Partial<Farmer>) => void
  // ticket mutations
  createTicket: (input: CreateTicketInput) => SupportTicket
  replyToTicket: (
    ticketId: string,
    msg: { author: 'customer' | 'support'; authorName: string; body: string },
  ) => void
  setTicketStatus: (ticketId: string, status: TicketStatus) => void
  resetDemoData: () => void
}

const Ctx = createContext<DataStoreCtx | null>(null)

function nowISO() {
  return new Date().toISOString()
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function stockStatusFor(stockKg: number, threshold: number): StockStatus {
  if (stockKg <= 0) return 'delisted'
  if (stockKg <= threshold) return 'low'
  return 'in-stock'
}

// ---- Fulfilment progression ----
// The happy-path lifecycle used by both the auto-advance simulator and the
// ops console "advance" control.
const STATUS_CHAIN: OrderStatus[] = [
  'placed',
  'picking',
  'packed',
  'out-for-delivery',
  'delivered',
]

const STEP_NOTE: Record<OrderStatus, { note: string; location?: string }> = {
  placed: { note: 'Order received and routed to the aggregation hub.' },
  picking: {
    note: 'Farmers are harvesting and picking your items.',
    location: 'Aggregation Hub — Accra',
  },
  packed: {
    note: 'Your basket is packed and quality-checked.',
    location: 'Aggregation Hub — Accra',
  },
  'out-for-delivery': {
    note: 'Your rider is on the way with your order.',
    location: 'En route',
  },
  delivered: { note: 'Delivered. Enjoy your fresh produce!' },
  cancelled: { note: 'Order cancelled.' },
}

const STATUS_TITLE: Record<OrderStatus, string> = {
  placed: 'Order placed',
  picking: 'Being picked',
  packed: 'Packed & ready',
  'out-for-delivery': 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Order cancelled',
}

// Mock rider pool — assigned when an order goes out for delivery.
const DRIVERS = [
  { id: 'd1', name: 'Kwame Osei', vehicle: 'Cold-chain van · GR 2841-23' },
  { id: 'd2', name: 'Abena Owusu', vehicle: 'Insulated bike · M 559-21' },
  { id: 'd3', name: 'Yaw Darko', vehicle: 'Cold-chain van · GT 1190-22' },
  { id: 'd4', name: 'Esi Mensa', vehicle: 'Insulated bike · M 712-24' },
]

function nextStatus(current: OrderStatus): OrderStatus | null {
  const i = STATUS_CHAIN.indexOf(current)
  if (i < 0 || i >= STATUS_CHAIN.length - 1) return null
  return STATUS_CHAIN[i + 1]
}

/** Apply a status transition to an order, enriching threePL + driver + POD. */
function applyStatusToOrder(o: Order, status: OrderStatus): Order {
  const meta = STEP_NOTE[status]
  let threePL = {
    ...o.threePL,
    status,
    events: [
      ...o.threePL.events,
      { ts: nowISO(), status, note: meta.note, location: meta.location },
    ],
  }

  if (status === 'out-for-delivery' && !threePL.driverId) {
    const driver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)]
    threePL = {
      ...threePL,
      driverId: driver.id,
      driverName: driver.name,
      vehicle: driver.vehicle,
      trackingNumber:
        'GA3PL-' + Math.floor(100000 + Math.random() * 900000).toString(),
    }
  }

  if (status === 'delivered' && !threePL.pod) {
    threePL = {
      ...threePL,
      pod: {
        photo: '/golden-acres/produce/placeholder.png',
        signature: o.customerName,
        geo: { lat: o.address.lat, lng: o.address.lng },
        capturedAt: nowISO(),
      },
    }
  }

  return { ...o, status, threePL }
}

function notificationForStatus(o: Order, status: OrderStatus): Omit<
  Notification,
  'id' | 'read' | 'createdAt'
> {
  return {
    forPhone: o.customerPhone,
    kind: 'order',
    title: `${o.reference} · ${STATUS_TITLE[status]}`,
    body: STEP_NOTE[status].note,
    href: `/orders/${o.reference}`,
  }
}

interface Persisted {
  products: Product[]
  farmers: Farmer[]
  orders: Order[]
  ledger: LedgerEntry[]
  tickets: SupportTicket[]
  notifications: Notification[]
}

// A few seed notifications for the demo customer (Nana Adjei) so the bell
// shows real content on first load.
const DEMO_PHONE = '+233 24 555 0142'
function seedNotifications(): Notification[] {
  const t = Date.now()
  return [
    {
      id: 'n-seed-1',
      forPhone: DEMO_PHONE,
      kind: 'order',
      title: 'GA-24817 · Out for delivery',
      body: 'Your rider is on the way with your order.',
      href: '/orders/GA-24817',
      read: false,
      createdAt: new Date(t - 1000 * 60 * 18).toISOString(),
    },
    {
      id: 'n-seed-2',
      forPhone: DEMO_PHONE,
      kind: 'reward',
      title: 'You reached Harvest tier',
      body: 'Enjoy 1.25× points and free delivery over GH₵150.',
      href: '/account',
      read: false,
      createdAt: new Date(t - 1000 * 60 * 60 * 26).toISOString(),
    },
    {
      id: 'n-seed-3',
      forPhone: DEMO_PHONE,
      kind: 'promo',
      title: 'Back in season: Sweet mangoes',
      body: 'Auntie Ama just listed a fresh batch — grab them before they sell out.',
      href: '/shop',
      read: true,
      createdAt: new Date(t - 1000 * 60 * 60 * 50).toISOString(),
    },
  ]
}

function seedState(): Persisted {
  // Normalise seed catalog: everything authored is already live.
  return {
    products: seedProducts.map((p) => ({
      ...p,
      reviewStatus: p.reviewStatus ?? 'live',
    })),
    farmers: seedFarmers.map((f) => ({ ...f })),
    orders: seedOrders.map((o) => ({ ...o })),
    ledger: seedLedger.map((l) => ({ ...l })),
    tickets: seedTickets.map((t) => ({ ...t })),
    notifications: seedNotifications(),
  }
}

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(seedState)
  const [hydrated, setHydrated] = useState(false)
  // References of orders placed this session — only these auto-advance, so the
  // seeded ops queue stays stable while a freshly placed order feels alive.
  const simRefs = useRef<Set<string>>(new Set())

  // Rehydrate from localStorage (orders / ledger / tickets / notifications are
  // still localStorage-backed pending their own migration tasks), then overlay
  // the live catalog (products + farmers) from Neon so every surface reads the
  // same DB-backed source of truth.
  useEffect(() => {
    let cancelled = false

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Persisted>
        // NOTE: products/farmers are intentionally NOT restored from localStorage.
        // The catalog is authoritative from the DB (overlaid just below) and the
        // in-memory seed is the complete fallback. Restoring a stale cached catalog
        // (e.g. an older, smaller listing set) would make whole categories appear
        // empty and the shop filters feel broken. Only session data is restored.
        setState((cur) => ({
          products: cur.products,
          farmers: cur.farmers,
          orders: saved.orders ?? cur.orders,
          ledger: saved.ledger ?? cur.ledger,
          tickets: saved.tickets ?? cur.tickets,
          notifications: saved.notifications ?? cur.notifications,
        }))
      }
    } catch {
      /* ignore corrupt store */
    }

    // Pull live catalog from the database (authoritative for products/farmers,
    // and for orders placed through the real checkout). DB orders are merged
    // ahead of the seeded ops queue, de-duplicated by reference, so the farmer
    // portal, CS console and BI all read the same persisted orders.
    getCatalogSnapshot()
      .then((snap) => {
        if (cancelled) return
        setState((cur) => {
          const dbRefs = new Set(snap.orders.map((o) => o.reference))
          const mergedOrders = [
            ...snap.orders,
            ...cur.orders.filter((o) => !dbRefs.has(o.reference)),
          ]
          return {
            ...cur,
            products: snap.products,
            farmers: snap.farmers,
            orders: mergedOrders,
          }
        })
      })
      .catch((e) => {
        console.log('[v0] catalog hydrate failed, using local cache:', e)
      })
      .finally(() => {
        if (!cancelled) setHydrated(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Persist on change (after hydrate, so we don't clobber storage).
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* quota — ignore in demo */
    }
  }, [state, hydrated])

  // Cross-tab sync: reflect changes made in other tabs/surfaces.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setState(JSON.parse(e.newValue) as Persisted)
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // ---------- order mutations ----------
  const createOrder = useCallback((input: CreateOrderInput): Order => {
    const items: OrderItem[] = input.items.map(({ product, qty }) => ({
      productId: product.id,
      name: product.name,
      image: product.image,
      farmerId: product.farmerId,
      qty,
      unit: product.unit,
      estWeightKg: product.estWeightKg,
      priceEstimate: product.variableWeight
        ? Math.round(product.estWeightKg * product.pricePerKg * qty * 100) / 100
        : Math.round(product.priceMin * qty * 100) / 100,
      refrigerationRequired: product.refrigerationRequired,
    }))
    const refrigerated = items.some((i) => i.refrigerationRequired)
    const total =
      Math.round((input.subtotalEstimate + input.deliveryFee) * 100) / 100

    const order: Order = {
      id: 'o-' + Date.now(),
      reference: input.reference,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      items,
      status: 'placed',
      placedAt: nowISO(),
      payment: { method: input.payment.method, status: 'paid' },
      address: {
        ghanaPostGPS: input.address.ghanaPostGPS,
        area: input.address.area,
        region: input.address.region ?? 'Greater Accra',
        lat: input.address.lat,
        lng: input.address.lng,
      },
      slot: input.slot,
      subtotalEstimate: input.subtotalEstimate,
      deliveryFee: input.deliveryFee,
      total,
      threePL: {
        trackingNumber: null,
        driverId: null,
        driverName: null,
        vehicle: null,
        refrigeration: refrigerated,
        status: 'placed',
        events: [
          {
            ts: nowISO(),
            status: 'placed',
            note: 'Order received and routed to the aggregation hub.',
          },
        ],
      },
      fault: 'None',
      refunds: [],
    }

    simRefs.current.add(order.reference)
    const placedNote: Notification = {
      id: 'n-' + Date.now(),
      forPhone: order.customerPhone,
      kind: 'order',
      title: `${order.reference} · Order placed`,
      body: 'We received your order and routed it to the hub.',
      href: `/orders/${order.reference}`,
      read: false,
      createdAt: nowISO(),
    }
    setState((s) => ({
      ...s,
      orders: [order, ...s.orders],
      notifications: [placedNote, ...s.notifications],
    }))
    return order
  }, [])

  const ingestOrder = useCallback((order: Order) => {
    // The order has already been persisted to Neon by the server action; mirror
    // it into the in-memory store so the confirmation page, order history, CS
    // console and BI reflect it immediately without waiting for a re-hydrate.
    simRefs.current.add(order.reference)
    setState((s) => {
      if (s.orders.some((o) => o.reference === order.reference)) return s
      const placedNote: Notification = {
        id: 'n-' + Date.now(),
        forPhone: order.customerPhone,
        kind: 'order',
        title: `${order.reference} · Order placed`,
        body: 'We received your order and routed it to the hub.',
        href: `/orders/${order.reference}`,
        read: false,
        createdAt: nowISO(),
      }
      return {
        ...s,
        orders: [order, ...s.orders],
        notifications: [placedNote, ...s.notifications],
      }
    })
  }, [])

  const setOrderStatus = useCallback(
    (reference: string, status: OrderStatus) => {
      setState((s) => {
        const target = s.orders.find((o) => o.reference === reference)
        if (!target) return s
        const updated = applyStatusToOrder(target, status)
        // Persist the hub-side transition to Neon (carrier owns the delivery leg).
        persistOrderStatus(reference, updated.status, updated.threePL).catch((e) =>
          console.log('[v0] persistOrderStatus failed:', e),
        )
        const note: Notification = {
          id: 'n-' + Date.now(),
          read: false,
          createdAt: nowISO(),
          ...notificationForStatus(updated, status),
        }
        return {
          ...s,
          orders: s.orders.map((o) => (o.reference === reference ? updated : o)),
          notifications: [note, ...s.notifications],
        }
      })
    },
    [],
  )

  // Advance one step along the happy-path lifecycle (ops control + simulator).
  const advanceOrder = useCallback((reference: string) => {
    setState((s) => {
      const target = s.orders.find((o) => o.reference === reference)
      if (!target) return s
      const next = nextStatus(target.status)
      if (!next) return s
      const updated = applyStatusToOrder(target, next)
      persistOrderStatus(reference, updated.status, updated.threePL).catch((e) =>
        console.log('[v0] persistOrderStatus failed:', e),
      )
      const note: Notification = {
        id: 'n-' + Date.now(),
        read: false,
        createdAt: nowISO(),
        ...notificationForStatus(updated, next),
      }
      return {
        ...s,
        orders: s.orders.map((o) => (o.reference === reference ? updated : o)),
        notifications: [note, ...s.notifications],
      }
    })
  }, [])

  // Merge an authoritative server-side order (e.g. carrier webhook result) into
  // the store. Used by the live tracking map's poll so every surface reflects
  // the persisted delivery state without a full re-hydrate.
  const applyServerOrder = useCallback((order: Order) => {
    setState((s) => {
      if (!s.orders.some((o) => o.reference === order.reference)) {
        return { ...s, orders: [order, ...s.orders] }
      }
      return {
        ...s,
        orders: s.orders.map((o) => (o.reference === order.reference ? order : o)),
      }
    })
  }, [])

  const addRefund = useCallback((reference: string, refund: Refund) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) =>
        o.reference === reference
          ? {
              ...o,
              refunds: [...o.refunds, refund],
              fault: refund.fault,
              payment: {
                ...o.payment,
                status: refund.type === 'full' ? 'refunded' : 'partial-refund',
              },
            }
          : o,
      ),
    }))
  }, [])

  // ---------- product mutations ----------
  const addProduct = useCallback((input: AddProductInput): Product => {
    const threshold = Math.max(5, Math.round(input.stockKg * 0.15))
    const pricePerKg = input.pricePerKg
    const product: Product = {
      id: 'p-' + Date.now(),
      slug: slugify(input.name) + '-' + Math.floor(Math.random() * 9000 + 1000),
      name: input.name,
      category: input.category,
      farmerId: input.farmerId,
      image: input.image || '/golden-acres/produce/placeholder.png',
      unit: 'kg',
      variableWeight: true,
      estWeightKg: 1,
      pricePerKg,
      priceMin: Math.round(pricePerKg * 0.9 * 100) / 100,
      priceMax: Math.round(pricePerKg * 1.1 * 100) / 100,
      refrigerationRequired: input.refrigerationRequired ?? false,
      shelfLifeDays: 7,
      expiryDate: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
      stockKg: input.stockKg,
      lowStockThreshold: threshold,
      status: stockStatusFor(input.stockKg, threshold),
      organic: input.organic ?? false,
      season: 'In season',
      tags: ['New'],
      description:
        input.description ||
        `Freshly listed ${input.name.toLowerCase()} from the farm.`,
      reviewStatus: input.autoPublish ? 'live' : 'pending',
    }
    setState((s) => ({ ...s, products: [product, ...s.products] }))
    // Persist to Neon (optimistic UI already updated).
    persistProduct(product).catch((e) =>
      console.log('[v0] persistProduct failed:', e),
    )
    return product
  }, [])

  const setProductStock = useCallback((productId: string, stockKg: number) => {
    let nextStatus: StockStatus = 'in-stock'
    setState((s) => ({
      ...s,
      products: s.products.map((p) => {
        if (p.id !== productId) return p
        nextStatus = stockStatusFor(stockKg, p.lowStockThreshold)
        return { ...p, stockKg, status: nextStatus }
      }),
    }))
    persistProductStock(productId, stockKg, nextStatus).catch((e) =>
      console.log('[v0] persistProductStock failed:', e),
    )
  }, [])

  const setProductReview = useCallback(
    (productId: string, review: ProductReviewStatus) => {
      setState((s) => ({
        ...s,
        products: s.products.map((p) =>
          p.id === productId ? { ...p, reviewStatus: review } : p,
        ),
      }))
      persistProductReview(productId, review).catch((e) =>
        console.log('[v0] persistProductReview failed:', e),
      )
    },
    [],
  )

  // ---------- farmer mutations ----------
  const createFarmer = useCallback((input: CreateFarmerInput): Farmer => {
    const farmer: Farmer = {
      id: input.id,
      slug:
        slugify(input.farmName || input.name) +
        '-' +
        Math.floor(Math.random() * 9000 + 1000),
      name: input.name,
      farmName: input.farmName,
      photo: input.photo || '/golden-acres/farmers/placeholder.jpg',
      cover: input.cover,
      bio: input.bio || `New grower joining Golden Acres from ${input.town}.`,
      story:
        input.story ||
        'This farmer just joined Golden Acres. Their story is coming soon — check back to learn how they grow.',
      methods: input.methods?.length ? input.methods : ['Freshly harvested'],
      certifications: input.certifications ?? [],
      region: input.region,
      town: input.town,
      pickupGPS: input.pickupGPS || 'GA-000-0000',
      location: { lat: 5.696, lng: -0.0166 },
      farmToHubRadiusKm: 40,
      rating: 0,
      reviewCount: 0,
      joinedYear: new Date().getFullYear(),
      onTimeRate: 1,
    }
    setState((s) =>
      s.farmers.some((f) => f.id === farmer.id)
        ? s
        : { ...s, farmers: [...s.farmers, farmer] },
    )
    persistFarmer(farmer).catch((e) =>
      console.log('[v0] persistFarmer failed:', e),
    )
    return farmer
  }, [])

  const updateFarmer = useCallback(
    (farmerId: string, patch: Partial<Farmer>) => {
      setState((s) => ({
        ...s,
        farmers: s.farmers.map((f) =>
          f.id === farmerId ? { ...f, ...patch } : f,
        ),
      }))
      persistFarmerPatch(farmerId, patch).catch((e) =>
        console.log('[v0] persistFarmerPatch failed:', e),
      )
    },
    [],
  )

  // ---------- ticket mutations ----------
  const createTicket = useCallback((input: CreateTicketInput): SupportTicket => {
    const ref = 'CS-' + Math.floor(1043 + Math.random() * 900)
    const ts = nowISO()
    const ticket: SupportTicket = {
      id: 't-' + Date.now(),
      reference: ref,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      orderRef: input.orderRef,
      category: input.category,
      subject: input.subject,
      status: 'open',
      priority: input.category === 'payment' ? 'high' : 'normal',
      createdAt: ts,
      updatedAt: ts,
      messages: [
        {
          id: 'm-' + Date.now(),
          author: 'customer',
          authorName: input.customerName,
          body: input.message,
          sentAt: ts,
        },
      ],
    }
    setState((s) => ({ ...s, tickets: [ticket, ...s.tickets] }))
    return ticket
  }, [])

  const replyToTicket = useCallback<DataStoreCtx['replyToTicket']>(
    (ticketId, msg) => {
      const message: TicketMessage = {
        id: 'm-' + Date.now(),
        author: msg.author,
        authorName: msg.authorName,
        body: msg.body,
        sentAt: nowISO(),
      }
      setState((s) => {
        const ticket = s.tickets.find((t) => t.id === ticketId)
        const tickets = s.tickets.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                messages: [...t.messages, message],
                updatedAt: nowISO(),
                status: (msg.author === 'support' ? 'pending' : 'open') as TicketStatus,
              }
            : t,
        )
        // When support replies, drop a notification for the customer.
        let notifications = s.notifications
        if (msg.author === 'support' && ticket?.customerPhone) {
          notifications = [
            {
              id: 'n-' + Date.now(),
              forPhone: ticket.customerPhone,
              kind: 'support',
              title: `${ticket.reference} · Support replied`,
              body: msg.body.slice(0, 90),
              href: '/help',
              read: false,
              createdAt: nowISO(),
            },
            ...s.notifications,
          ]
        }
        return { ...s, tickets, notifications }
      })
    },
    [],
  )

  const setTicketStatus = useCallback(
    (ticketId: string, status: TicketStatus) => {
      setState((s) => ({
        ...s,
        tickets: s.tickets.map((t) =>
          t.id === ticketId ? { ...t, status, updatedAt: nowISO() } : t,
        ),
      }))
    },
    [],
  )

  // ---------- notification mutations ----------
  const notify = useCallback<DataStoreCtx['notify']>((n) => {
    setState((s) => ({
      ...s,
      notifications: [
        {
          id: 'n-' + Date.now(),
          read: false,
          createdAt: nowISO(),
          ...n,
        },
        ...s.notifications,
      ],
    }))
  }, [])

  const markNotificationsRead = useCallback((phone: string) => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) =>
        n.forPhone === phone ? { ...n, read: true } : n,
      ),
    }))
  }, [])

  const resetDemoData = useCallback(() => {
    simRefs.current.clear()
    setState(seedState())
  }, [])

  // ---------- live delivery simulator ----------
  // Every few seconds, nudge any order placed this session along the hub-side
  // lifecycle (placed → picking → packed) so tracking feels alive in the demo.
  // The out-for-delivery → delivered leg is intentionally NOT auto-advanced here:
  // it's owned by the 3PL dispatch + webhook flow (the single source of truth),
  // so it survives reload and reflects real carrier telemetry on the map.
  const DWELL_MS = 9000
  useEffect(() => {
    if (!hydrated) return
    const timer = setInterval(() => {
      setState((s) => {
        let changed = false
        let notifications = s.notifications
        const orders = s.orders.map((o) => {
          if (!simRefs.current.has(o.reference)) return o
          // Stop at packed — the carrier takes over the delivery leg.
          if (o.status !== 'placed' && o.status !== 'picking') return o
          const next = nextStatus(o.status)
          if (!next) return o
          const last = o.threePL.events[o.threePL.events.length - 1]
          const lastTs = last ? Date.parse(last.ts) : 0
          if (Date.now() - lastTs < DWELL_MS) return o
          changed = true
          const updated = applyStatusToOrder(o, next)
          persistOrderStatus(o.reference, updated.status, updated.threePL).catch(
            (e) => console.log('[v0] persistOrderStatus (sim) failed:', e),
          )
          notifications = [
            {
              id: 'n-' + Date.now() + '-' + o.reference,
              read: false,
              createdAt: nowISO(),
              ...notificationForStatus(updated, next),
            },
            ...notifications,
          ]
          return updated
        })
        return changed ? { ...s, orders, notifications } : s
      })
    }, 3000)
    return () => clearInterval(timer)
  }, [hydrated])

  const value = useMemo<DataStoreCtx>(() => {
    const liveProducts = state.products.filter(
      (p) => (p.reviewStatus ?? 'live') === 'live',
    )
    const pendingProducts = state.products.filter(
      (p) => p.reviewStatus === 'pending',
    )
    return {
      hydrated,
      products: state.products,
      liveProducts,
      pendingProducts,
      farmers: state.farmers,
      orders: state.orders,
      ledger: state.ledger,
      tickets: state.tickets,
      notifications: state.notifications,
      productsByFarmer: (farmerId) =>
        state.products.filter((p) => p.farmerId === farmerId),
      ordersByFarmer: (farmerId) =>
        state.orders.filter((o) =>
          o.items.some((it) => it.farmerId === farmerId),
        ),
      ordersForCustomer: ({ phone, refs }) =>
        state.orders.filter(
          (o) =>
            (phone && o.customerPhone === phone) ||
            (refs && refs.includes(o.reference)),
        ),
      orderByRef: (reference) =>
        state.orders.find((o) => o.reference === reference),
      getFarmer: (id) => state.farmers.find((f) => f.id === id),
      notificationsFor: (phone) =>
        state.notifications
          .filter((n) => n.forPhone === phone)
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
      createOrder,
      ingestOrder,
      setOrderStatus,
      advanceOrder,
      applyServerOrder,
      addRefund,
      notify,
      markNotificationsRead,
      addProduct,
      setProductStock,
      setProductReview,
      createFarmer,
      updateFarmer,
      createTicket,
      replyToTicket,
      setTicketStatus,
      resetDemoData,
    }
  }, [
    state,
    hydrated,
    createOrder,
    ingestOrder,
    setOrderStatus,
    advanceOrder,
    applyServerOrder,
    addRefund,
    notify,
    markNotificationsRead,
    addProduct,
    setProductStock,
    setProductReview,
    createFarmer,
    updateFarmer,
    createTicket,
    replyToTicket,
    setTicketStatus,
    resetDemoData,
  ])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useDataStore(): DataStoreCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useDataStore must be used within DataStoreProvider')
  return ctx
}
