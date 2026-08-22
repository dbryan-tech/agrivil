# 05 — Staff & Business Systems (admin BI, ops/logistics console, support desk)

> **Owns:** `app/admin/**` (BI dashboard), `app/support/**` (staff desk +
> login), `components/golden-acres/{dashboard,ops}/**` — bi-dashboard,
> promotions, announcements, kyc sections; ops-console (1,762 lines),
> fleet-map; support components (`help/ticket-thread.tsx` is customer-side;
> staff queue lives here).
> **Job:** give the internal team instruments that read at a glance and act
> precisely — a calm control room, not a wall of widgets.

## 1. Current state audit

- `/admin` = `BiDashboard` (483 lines): KPI summary, GMV/CAC/CLV series,
  spoilage rows, demand forecast (recharts), plus section components for
  promotions/announcements/KYC.
- `/support` = staff login + ticket surface; ops console is a separate 1.7k-
  line component with fleet map covering logistics.
- Auth: RouteGuard role=staff via `/support/login`.
- **Diagnosis:** real analytical depth exists (FEFO, spoilage, forecast) but
  presentation is dashboard-generic: chart-card soup, dense tables, no
  hierarchy between "must act" and "nice to monitor". Three sub-systems
  (BI, ops, support) feel like three different apps.

## 2. Unified console frame

One shared staff shell (new `components/golden-acres/staff/console-frame.tsx`)
used by `/admin`, ops views, and support:
- Left rail nav (collapsible): Overview · Logistics · Catalog & FEFO ·
  Promotions · KYC & Sellers · Support · Announcements.
- Top strip: environment pill (prod/test), search palette (⌘K jumping to any
  order ref / farmer / product), user chip.
- Light-mode only (consistent with the owner's stated admin preference on
  sibling project); ink-on-canvas, hairlines over cards; charts restyled to
  the token palette with tabular-number axes.

## 3. Overview (BI dashboard rebuild)

- **Top of page = exceptions, not vanity:** exception feed (orders breaching
  SLA, stock-outs imminent by FEFO, payout failures, open critical tickets)
  as actionable hairline rows — each row deep-links into its system.
- KPI band as StatBlocks (GMV + delta, active customers, on-time %, spoilage)
  with sparklines; deltas colored only when meaningful (green/red semantics).
- Charts below the fold, one per question: revenue trend, CAC/CLV, demand
  forecast by category. Every chart has a plain-language takeaway line above
  it ("Forecast says okra demand doubles next week — 4 farmers can cover it.").

## 4. Logistics / ops console

- Restructure the 1.7k-line monolith into route sections under the frame:
  **Live board** (fleet map + active runs list synchronized selection),
  **Runs** (table w/ status ribbons, driver assignment, ETA breaches),
  **Hubs** (capacity, cold-chain health), **3PL handoff** (payload inspector,
  webhook log with replay action for failed events).
- Fleet map: dark-ink canvas variant, driver dots with status color, run
  selected → side sheet with timeline (dotted progress grammar reused from
  consumer tracking — same visual language inside and out).
- Webhook/event log entries show payload diff on failure; replay is
  confirm-guarded.

## 5. Support desk

- Queue-first: filterable ticket rows (priority, category, age), SLA clock
  column that turns amber→red; bulk assign.
- Ticket view: customer context sidebar (orders, LTV, prior tickets) + thread
  pane; refund/credit actions call existing server actions with typed reason
  codes (fault party: Farmer/3PL/Hub) — traceability preserved per master
  instructions §17.
- Macros/canned replies with variables; every outgoing message previewable.

## 6. Catalog, promotions, KYC, announcements

- Promotions section (already purity-fixed): keep logic, reskin to frame;
  add usage-progress vs usageLimit as quiet bars; expiry states from the
  post-mount nowMs pattern.
- KYC review: document viewer + approve/reject-with-reason; queue counts in
  nav badge.
- Catalog/FEFO monitor: expiry-bucket heatmap by batch (what ships first and
  why), delist/pending moderation queue with farmer context.

## 7. Data wiring rules

- All reads/writes go through existing server actions
  (`app/actions/{admin,payouts,support,logistics,announcements,promotions,
  farmer-kyc}.ts`). No new client-side data paths. Mock BI series stay until
  real analytics exist, labeled "sample data" in-chart to avoid false confidence.

## 8. Acceptance checklist

- [ ] Single staff shell across admin/ops/support; no orphan styling.
- [ ] Exception feed answers "what needs me right now" in <5 seconds.
- [ ] Every table: sortable, empty state, loading skeleton, CSV export where
      data volume justifies it.
- [ ] Webhook replay guarded + logged.
- [ ] tsc + build clean; owner walkthrough approval before merge.
