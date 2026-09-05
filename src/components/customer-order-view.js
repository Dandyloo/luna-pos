import { formatShortGhs } from '../utils/formatters.js'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function renderCustomerOrderItem(item) {
  const modifiers =
    item.modifiers.length > 0
      ? ` · ${item.modifiers.map((modifier) => modifier.name).join(' · ')}`
      : ''

  return `
    <article class="customer-order-item">
      <div class="customer-order-item__main">
        <p class="customer-order-item__name">${escapeHtml(item.productName)}</p>
        <p class="customer-order-item__meta">
          ${escapeHtml(item.variantName)}${escapeHtml(modifiers)}
        </p>
      </div>

      <div class="customer-order-item__price">
        <span class="customer-order-item__quantity">×${item.quantity}</span>
        <strong>${formatShortGhs(item.lineTotal)}</strong>
      </div>
    </article>
  `
}

export function renderCustomerOrderView(draft) {
  const orderType = draft.orderType === 'dine-in' ? 'Dine-in' : 'Takeaway'

  return `
    <main class="customer-display" aria-label="Luna customer display">
      <section class="customer-display__frame">
        <header class="customer-display__header">
          <div class="customer-display__brand">
            <span class="customer-display__brand-mark" aria-hidden="true">L</span>

            <div>
              <p class="customer-display__brand-name">LUNA</p>
              <p class="customer-display__brand-subtitle">Café & Eatery</p>
            </div>
          </div>

          <span class="customer-display__connection customer-display__connection--connected">
            <span class="customer-display__connection-dot" aria-hidden="true"></span>
            Reviewing your order
          </span>
        </header>

        <section class="customer-order">
          <header class="customer-order__header">
            <div>
              <p class="customer-order__eyebrow">Your order</p>
              <h1 class="customer-order__title">Please check your items</h1>
            </div>

            <span class="customer-order__type">${orderType}</span>
          </header>

          <section class="customer-order__items" aria-label="Current order items">
            ${draft.items.map((item) => renderCustomerOrderItem(item)).join('')}
          </section>

          <section class="customer-order__summary" aria-label="Order total">
            <div class="customer-order__summary-row">
              <span>Subtotal</span>
              <strong>${formatShortGhs(draft.subtotal)}</strong>
            </div>

            ${
              draft.discountAmount > 0
                ? `
                  <div class="customer-order__summary-row">
                    <span>Discount</span>
                    <strong>− ${formatShortGhs(draft.discountAmount)}</strong>
                  </div>
                `
                : ''
            }

            <div class="customer-order__summary-row">
              <span>Tax</span>
              <strong>${formatShortGhs(draft.taxAmount)}</strong>
            </div>

            <div class="customer-order__summary-row customer-order__summary-row--total">
              <span>Total</span>
              <strong>${formatShortGhs(draft.total)}</strong>
            </div>
          </section>

          <footer class="customer-order__footer">
            <p>Please confirm your order with the counter team before payment.</p>
          </footer>
        </section>

        <footer class="customer-display__footer">
          <span>Pedu GOIL Filling Station, Cape Coast</span>
          <strong>059 367 6875 · @Lunacafegh</strong>
        </footer>
      </section>
    </main>
  `
}