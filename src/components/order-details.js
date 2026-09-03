import { formatDateTime, formatShortGhs } from '../utils/formatters.js'
import { getCartItemLineTotal, getCartItemUnitTotal } from '../utils/order-utils.js'

function getPaymentLabel(order) {
  return order.paymentStatus === 'PAID' ? 'Paid' : 'Payment pending'
}

function getFulfilmentLabel(order) {
  const labels = {
    PLACED: 'Placed',
    PREPARING: 'Preparing',
    READY: 'Ready',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  }

  return labels[order.fulfilmentStatus] || order.fulfilmentStatus
}

export function renderOrderDetails(order) {
  if (!order) {
    return `
      <section class="order-details-empty">
        <div class="order-details-empty__mark" aria-hidden="true">+</div>
        <h2 class="order-details-empty__title">Select an order</h2>
        <p class="order-details-empty__copy">
          Choose an order from the list to view its full details.
        </p>
      </section>
    `
  }

  const payment = order.payments?.[0]
  const modifierLabels = (cartItem) =>
    cartItem.modifiers.length > 0
      ? ` · ${cartItem.modifiers.map((modifier) => modifier.name).join(' · ')}`
      : ''

  return `
    <section class="order-details" aria-labelledby="order-details-title">
      <header class="order-details__header">
        <div>
          <p class="order-details__eyebrow">Order details</p>
          <h2 class="order-details__title" id="order-details-title">
            ${order.orderNumber}
          </h2>
        </div>

        <span class="order-details__total">${formatShortGhs(order.total)}</span>
      </header>

      <section class="order-details__status-grid" aria-label="Order status">
        <div class="order-details__status">
          <span class="order-details__status-label">Payment</span>
          <strong>${getPaymentLabel(order)}</strong>
        </div>

        <div class="order-details__status">
          <span class="order-details__status-label">Fulfilment</span>
          <strong>${getFulfilmentLabel(order)}</strong>
        </div>

        <div class="order-details__status">
          <span class="order-details__status-label">Order type</span>
          <strong>${order.orderType === 'dine-in' ? 'Dine-in' : 'Takeaway'}</strong>
        </div>

        <div class="order-details__status">
          <span class="order-details__status-label">Source</span>
          <strong>${order.sourceDevice}</strong>
        </div>
      </section>

      <section class="order-details__section">
        <h3 class="order-details__section-title">Items</h3>

        <div class="order-details__items">
          ${order.items
            .map(
              (item) => `
                <article class="order-details-item">
                  <div>
                    <p class="order-details-item__name">${item.productName}</p>
                    <p class="order-details-item__meta">
                      ${item.variantName}${modifierLabels(item)}
                    </p>
                    <p class="order-details-item__meta">
                      ${item.quantity} × ${formatShortGhs(getCartItemUnitTotal(item))}
                    </p>
                  </div>

                  <strong class="order-details-item__total">
                    ${formatShortGhs(getCartItemLineTotal(item))}
                  </strong>
                </article>
              `,
            )
            .join('')}
        </div>
      </section>

      <section class="order-details__section">
        <h3 class="order-details__section-title">Order summary</h3>

        <div class="order-details__summary">
          <div>
            <span>Subtotal</span>
            <strong>${formatShortGhs(order.subtotal)}</strong>
          </div>

          ${
            order.discount?.amount > 0
              ? `
                <div>
                  <span>Discount</span>
                  <strong>− ${formatShortGhs(order.discount.amount)}</strong>
                </div>
              `
              : ''
          }

          <div>
            <span>Tax</span>
            <strong>${formatShortGhs(order.tax?.amount || 0)}</strong>
          </div>

          <div class="order-details__summary-total">
            <span>Total</span>
            <strong>${formatShortGhs(order.total)}</strong>
          </div>
        </div>
      </section>

      <section class="order-details__section">
        <h3 class="order-details__section-title">Timeline</h3>

        <div class="order-details__timeline">
          <div>
            <span>Created</span>
            <strong>${formatDateTime(new Date(order.createdAt))}</strong>
          </div>

          <div>
            <span>Last updated</span>
            <strong>${formatDateTime(new Date(order.updatedAt))}</strong>
          </div>

          ${
            payment
              ? `
                <div>
                  <span>Payment</span>
                  <strong>
                    ${
                      payment.method === 'momo'
                        ? 'Mobile Money'
                        : payment.method === 'card'
                          ? 'Card'
                          : 'Cash'
                    } · ${formatDateTime(new Date(payment.recordedAt))}
                  </strong>
                </div>
              `
              : `
                <div>
                  <span>Payment</span>
                  <strong>Not received</strong>
                </div>
              `
          }
        </div>
      </section>
    </section>
  `
}