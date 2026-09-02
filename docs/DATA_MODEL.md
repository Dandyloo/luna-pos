# Initial Data Model

This is the first high-level data model. It will guide the local IndexedDB model and the later cloud PostgreSQL schema.

## Core entities

| Entity | Purpose |
| --- | --- |
| Category | Groups menu products, such as Boba, Coffee, Pizza, Snacks, Meals, and Desserts |
| Product | A sellable menu item with name, image, category, availability, description, and base details |
| Product Variant | A selectable version of a product, such as Small, Large, Regular, or Family Size |
| Modifier Group | A group of optional or required choices, such as Sugar Level, Ice Level, Toppings, or Pizza Extras |
| Modifier Option | A specific add-on or choice inside a modifier group |
| Order | The permanent transaction record, including totals, status, payment state, timestamps, and source device |
| Order Item | A product/variant/modifier snapshot sold inside an order |
| Payment | A payment record for cash, Mobile Money, card, or future split payments |
| Tax Rule | A configured tax name, percentage, enabled state, and calculation method |
| Discount | A configured promotion or recorded discount applied to an order |
| Expense | An operational expense entered by the owner for daily profit reporting |
| Device | A known POS or customer-display device and its pairing details |
| Sync Queue Item | A local change waiting to synchronize with the central server |

## Important financial rule

Order items must preserve snapshots of their product name, selling price, cost price, variant, modifiers, discount, and tax outcome at the time of checkout.

Changing a product price later must never alter an older receipt, sales report, or profit report.

## Initial order state machine

```text
DRAFT
  → PLACED
  → PAID
  → PREPARING
  → READY
  → COMPLETED

DRAFT / PLACED / PAID
  → CANCELLED

PAID / PREPARING / READY / COMPLETED
  → REFUNDED
```

## Initial financial formulas

```text
Subtotal = sum(order item line totals)

Discount total = sum(all valid applied discounts)

Taxable amount = subtotal - eligible discounts

Tax total = taxable amount × configured tax rate

Order total = subtotal - discount total + tax total

Estimated gross profit = net sales - total saved item costs

Daily operating profit = estimated gross profit - recorded daily expenses
```