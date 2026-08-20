# AgriVil API Reference

> **Base Route**: `/api/**`

---

## 1. Payments & Webhooks

### A. Paystack Webhook (`/api/webhooks/paystack`)
- **Method**: `POST`
- **Description**: Handles mobile money (MTN MoMo, Telecel Cash, AT Money) and card payment webhooks from Paystack.
- **Verification**: Validates `x-paystack-signature` using HMAC SHA512 with `PAYSTACK_SECRET_KEY`.
- **Events Handled**:
  - `charge.success`: Reconciles order payment status, assigns 3PL dispatch queue.
  - `transfer.success`: Settles farmer wallet balance directly to grower MoMo accounts.

### B. Stripe Webhook (`/api/webhooks/stripe`)
- **Method**: `POST`
- **Description**: Handles international diaspora payments via card and Apple Pay.

---

## 2. Third-Party Logistics (3PL) & Dispatch

### A. 3PL Dispatch Webhook (`/api/3pl/webhook`)
- **Method**: `POST`
- **Description**: Receives real-time telemetry updates from chilled cold-chain courier vans.
- **Status Updates**: `PICKED_UP`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`.

### B. Order Tracking API (`/api/3pl/track/[reference]`)
- **Method**: `GET`
- **Description**: Returns live delivery coordinates, estimated arrival window, and cold-chain temperature telemetry ($< 8^\circ\text{C}$).

---

## 3. Media Upload (`/api/upload`)
- **Method**: `POST`
- **Description**: Handles secure upload of smallholder grower harvest photos and crop certificates.
