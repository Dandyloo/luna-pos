import { formatDateTime, formatShortGhs } from '../utils/formatters.js'

function getPaymentLabel(order) {
  return order.paymentStatus === 'PAID' ? 'Paid' : 'Payment pending'
}

function getPaymentClass(order) {
  return order.paymentStatus === 'PAID'
    ? 'status-badge--success'
    : 'status-badge--warning'
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

function getFulfilmentClass(order) {
  const classes = {
    PLACED: 'status-badge--neutral',
    PREPARING: 'status-badge--info',
    READY: 'status-badge--ready',
    COMPLETED: 'status-badge--success',
    CANCELLED: 'status-badge--danger',
  }

  return classes[order.fulfilmentStatus] || 'status-badge--neutral'
}

export function renderOrderCard(order, isSelected) {
  return `
    <button
      class="order-card ${isSelected ? 'order-card--selected' : ''}"
      type="button"
      data-select-order="${order.id}"
      aria-pressed="${isSelected}"
    >
      <span class="order-card__header">
        <span class="order-card__number">${order.orderNumber}</span>
        <span class="order-card__time">${formatDateTime(new Date(order.createdAt))}</span>
      </span>

      <span class="order-card__meta">
        <span>${order.orderType === 'dine-in' ? 'Dine-in' : 'Takeaway'}</span>
        <span>${order.itemCount} item${order.itemCount === 1 ? '' : 's'}</span>
      </span>

      <span class="order-card__footer">
        <span class="order-card__total">${formatShortGhs(order.total)}</span>

        <span class="order-card__statuses">
          <span class="status-badge ${getPaymentClass(order)}">
            ${getPaymentLabel(order)}
          </span>

          <span class="status-badge ${getFulfilmentClass(order)}">
            ${getFulfilmentLabel(order)}
          </span>
        </span>
      </span>
    </button>
  `
}

export function renderOrdersEmptyState() {
  return `
    <section class="orders-empty-state">
      <div class="orders-empty-state__mark" aria-hidden="true">0</div>
      <h2 class="orders-empty-state__title">No saved orders yet</h2>
      <p class="orders-empty-state__copy">
        Orders sent to preparation or paid at the counter will appear here.
      </p>
    </section>
  `
}