import { formatShortGhs } from '../utils/formatters.js'

function getPaymentMessage(order) {
  return order.paymentStatus === 'PAID'
    ? 'Payment received'
    : 'Payment pending'
}

function getStatusContent(stateType, order) {
  if (stateType === 'ready') {
    return {
      eyebrow: 'Your order is ready',
      title: 'Ready for collection',
      copy: 'Please collect your order from the Luna counter. Thank you for choosing Luna Café & Eatery.',
      label: 'Ready',
    }
  }

  if (order.paymentStatus === 'PAID') {
    return {
      eyebrow: 'Payment received',
      title: 'Your order is being prepared',
      copy: 'Thank you. Our team is preparing your order now.',
      label: 'Preparing',
    }
  }

  return {
    eyebrow: 'Order received',
    title: 'Your order is being prepared',
    copy: 'Your order has been sent to the Luna team. Please complete payment at the counter when requested.',
    label: 'Payment pending',
  }
}

export function renderCustomerOrderStatus({ stateType, order }) {
  const content = getStatusContent(stateType, order)
  const isReady = stateType === 'ready'

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
            ${isReady ? 'Ready for collection' : 'Order confirmed'}
          </span>
        </header>

        <section class="customer-status">
          <div class="customer-status__card ${
            isReady ? 'customer-status__card--ready' : ''
          }">
            <div class="customer-status__mark" aria-hidden="true">
              ${isReady ? '✓' : '•'}
            </div>

            <p class="customer-status__eyebrow">${content.eyebrow}</p>

            <h1 class="customer-status__title">${content.title}</h1>

            <p class="customer-status__copy">${content.copy}</p>

            <section class="customer-status__order-summary" aria-label="Order summary">
              <div>
                <span>Order</span>
                <strong>${order.orderNumber}</strong>
              </div>

              <div>
                <span>Items</span>
                <strong>${order.itemCount} item${
                  order.itemCount === 1 ? '' : 's'
                }</strong>
              </div>

              <div>
                <span>${getPaymentMessage(order)}</span>
                <strong>${formatShortGhs(order.total)}</strong>
              </div>
            </section>

            <span class="customer-status__label">${content.label}</span>
          </div>
        </section>

        <footer class="customer-display__footer">
          <span>Pedu GOIL Filling Station, Cape Coast</span>
          <strong>059 367 6875 · @Lunacafegh</strong>
        </footer>
      </section>
    </main>
  `
}