# Luna Café & Eatery Operations System

## Product purpose

Luna POS is an offline-first point-of-sale and café operations system for Luna Café & Eatery, located at Pedu GOIL Filling Station, Cape Coast.

The system supports fast counter ordering, a customer-facing live order display, and owner-level business operations management.

## Applications

### 1. Staff POS

A tablet-first application used by counter staff to:

- Create dine-in and takeaway orders.
- Browse product categories and product image cards.
- Select product variants, such as Small or Large.
- Add optional modifiers and add-ons.
- Apply enabled discounts.
- Toggle tax according to business rules.
- Record cash, Mobile Money, and card payments.
- Update order status.
- Print or reprint receipts.
- Continue taking orders during internet outages.

### 2. Customer Display

A second read-only tablet screen facing the customer.

It shows:

- The current order being created at the paired staff counter.
- Items, variants, quantities, discounts, tax, subtotal, and amount due.
- Payment prompts and payment confirmation.
- Preparing and Ready status messages.
- A branded Luna idle/welcome screen when no active order exists.

The customer display cannot edit orders or show private business/customer information.

### 3. Owner Back Office

An owner/manager application that provides:

- Dashboard with daily sales and operations overview.
- All-order history and receipt access.
- Product, category, variant, add-on, price, cost, and availability management.
- Sales, tax, discount, payment, refund, and cancellation reporting.
- Estimated gross-profit and daily operating-profit reporting.
- Expense tracking.
- Receipt, tax, discount, device, sync, and general business settings.
- Data export, backup, and future restore functionality.

## Initial constraints

- No staff authentication in the first version.
- Multiple staff may operate separate POS tablets.
- The staff POS remains the source of truth for an active order.
- Customer displays are paired to one counter POS and are read-only.
- The application must remain usable offline.
- Orders must persist locally before any cloud synchronization attempt.
- Every paid/cancelled/refunded transaction must remain historically traceable.
- Currency is Ghana cedi: GH₵.

## MVP success criteria

A staff member can create a café order, choose a product variant, change quantity, add tax or a discount, record payment, create a receipt-ready order record, and show the customer a live read-only version of the order.

An owner can later see reliable daily sales, payments, discounts, taxes, product performance, and estimated profit information.