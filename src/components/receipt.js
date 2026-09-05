import { formatDateTime, formatShortGhs } from '../utils/formatters.js'
import { getCartItemLineTotal, getCartItemUnitTotal } from '../utils/order-utils.js'

const BUSINESS = {
  name: 'Luna Café & Eatery',
  tagline: 'Taste the Luna Delight...',
  address: 'Pedu GOIL Filling Station, Cape Coast',
  phone: '059 367 6875',
  social: '@Lunacafegh',
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function getPaymentMethodLabel(paymentMethod) {
  const labels = {
    cash: 'Cash',
    momo: 'Mobile Money',
    card: 'Card',
  }

  return labels[paymentMethod] || paymentMethod
}

function getOrderTypeLabel(orderType) {
  return orderType === 'dine-in' ? 'Dine-in' : 'Takeaway'
}

function getReceiptHeading(order) {
  return order.paymentStatus === 'PAID'
    ? 'Payment received'
    : 'Order summary — payment pending'
}

function getModifierText(item) {
  if (!item.modifiers || item.modifiers.length === 0) {
    return item.variantName
  }

  return `${item.variantName} · ${item.modifiers
    .map((modifier) => modifier.name)
    .join(' · ')}`
}

function renderReceiptItem(item) {
  return `
    <article class="receipt__item">
      <div class="receipt__item-top">
        <span class="receipt__item-name">${escapeHtml(item.productName)}</span>
        <strong class="receipt__item-total">
          ${formatShortGhs(getCartItemLineTotal(item))}
        </strong>
      </div>

      <div class="receipt__item-meta">
        <span>${item.quantity} × ${formatShortGhs(getCartItemUnitTotal(item))}</span>
        <span>${escapeHtml(getModifierText(item))}</span>
      </div>
    </article>
  `
}

export function renderReceipt(order) {
  const payment = order.payments?.[0]
  const isPaid = order.paymentStatus === 'PAID'

  return `
    <section class="receipt" id="printable-receipt" aria-labelledby="receipt-title">
      <header class="receipt__header">
        <p class="receipt__brand">LUNA</p>
        <h2 class="receipt__business-name" id="receipt-title">
          ${BUSINESS.name}
        </h2>
        <p class="receipt__tagline">${BUSINESS.tagline}</p>
        <p class="receipt__business-detail">${BUSINESS.address}</p>
        <p class="receipt__business-detail">
          ${BUSINESS.phone} · ${BUSINESS.social}
        </p>
      </header>

      <section class="receipt__status">
        <strong>${getReceiptHeading(order)}</strong>
      </section>

      <section class="receipt__meta">
        <div>
          <span>Order</span>
          <strong>${escapeHtml(order.orderNumber)}</strong>
        </div>

        <div>
          <span>Type</span>
          <strong>${getOrderTypeLabel(order.orderType)}</strong>
        </div>

        <div>
          <span>Created</span>
          <strong>${formatDateTime(new Date(order.createdAt))}</strong>
        </div>

        <div>
          <span>Device</span>
          <strong>${escapeHtml(order.sourceDevice)}</strong>
        </div>
      </section>

      <div class="receipt__divider"></div>

      <section class="receipt__items" aria-label="Ordered items">
        ${order.items.map((item) => renderReceiptItem(item)).join('')}
      </section>

      <div class="receipt__divider"></div>

      <section class="receipt__totals">
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

        <div class="receipt__grand-total">
          <span>Total</span>
          <strong>${formatShortGhs(order.total)}</strong>
        </div>
      </section>

      <div class="receipt__divider"></div>

      <section class="receipt__payment">
        <div>
          <span>Payment status</span>
          <strong>${isPaid ? 'Paid' : 'Payment pending'}</strong>
        </div>

        ${
          payment
            ? `
              <div>
                <span>Method</span>
                <strong>${getPaymentMethodLabel(payment.method)}</strong>
              </div>

              ${
                payment.method === 'cash'
                  ? `
                    <div>
                      <span>Cash received</span>
                      <strong>${formatShortGhs(payment.cashReceived)}</strong>
                    </div>

                    <div>
                      <span>Change</span>
                      <strong>${formatShortGhs(payment.change)}</strong>
                    </div>
                  `
                  : ''
              }

              <div>
                <span>Payment time</span>
                <strong>${formatDateTime(new Date(payment.recordedAt))}</strong>
              </div>
            `
            : ''
        }
      </section>

      <footer class="receipt__footer">
        <p>Thank you for choosing Luna Café & Eatery.</p>
        <p>Please keep this receipt for your records.</p>
      </footer>
    </section>
  `
}

export function renderReceiptDialog(order) {
  return `
    <dialog class="receipt-dialog" aria-labelledby="receipt-dialog-title">
      <div class="receipt-dialog__content">
        <header class="receipt-dialog__header">
          <div>
            <p class="receipt-dialog__eyebrow">80 mm receipt preview</p>
            <h2 class="receipt-dialog__title" id="receipt-dialog-title">
              ${escapeHtml(order.orderNumber)}
            </h2>
          </div>

          <button
            class="icon-button"
            type="button"
            data-close-receipt
            aria-label="Close receipt preview"
          >
            ×
          </button>
        </header>

        <div class="receipt-dialog__preview">
          ${renderReceipt(order)}
        </div>

        <footer class="receipt-dialog__footer">
          <button
            class="button button--secondary"
            type="button"
            data-close-receipt
          >
            Close
          </button>

          <button
            class="button button--primary"
            type="button"
            data-print-receipt
          >
            Print receipt
          </button>
        </footer>
      </div>
    </dialog>
  `
}

export function getReceiptPrintDocument(order) {
  const receiptMarkup = renderReceipt(order)

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(order.orderNumber)} — Luna Receipt</title>

        <style>
          @page {
            size: 80mm auto;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            width: 80mm;
            min-width: 80mm;
            max-width: 80mm;
            height: auto;
            min-height: 0;
            margin: 0;
            padding: 0;
            background: #ffffff;
            color: #111111;
            font-family: Arial, Helvetica, sans-serif;
          }

          .receipt {
            width: 80mm;
            margin: 0;
            padding: 4mm;
            background: #ffffff;
            color: #111111;
            font-size: 10px;
            line-height: 1.4;
          }

          .receipt__header {
            text-align: center;
          }

          .receipt__brand {
            margin: 0;
            color: #fa1e00;
            font-family: Arial Black, Arial, Helvetica, sans-serif;
            font-size: 20px;
            font-style: italic;
            font-weight: 900;
            letter-spacing: -1.5px;
            line-height: 1;
            text-shadow: 1px 1px 0 #fd9303;
          }

          .receipt__business-name {
            margin: 3px 0 0;
            color: #111111;
            font-size: 11px;
            line-height: 1.2;
          }

          .receipt__tagline {
            margin: 2px 0 0;
            color: #4c453e;
            font-size: 9px;
            font-style: italic;
          }

          .receipt__business-detail {
            margin: 2px 0 0;
            color: #4c453e;
            font-size: 8px;
          }

          .receipt__status {
            margin-top: 12px;
            padding: 5px;
            border: 1px solid #111111;
            color: #111111;
            font-size: 8px;
            letter-spacing: 0.5px;
            text-align: center;
            text-transform: uppercase;
          }

          .receipt__meta,
          .receipt__totals,
          .receipt__payment {
            display: grid;
            gap: 5px;
          }

          .receipt__meta {
            margin-top: 12px;
          }

          .receipt__meta > div,
          .receipt__totals > div,
          .receipt__payment > div {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 10px;
          }

          .receipt__meta span,
          .receipt__totals span,
          .receipt__payment span {
            color: #4c453e;
          }

          .receipt__meta strong,
          .receipt__totals strong,
          .receipt__payment strong {
            max-width: 62%;
            color: #111111;
            font-weight: 700;
            text-align: right;
            overflow-wrap: anywhere;
          }

          .receipt__divider {
            margin: 12px 0;
            border-top: 1px dashed #777777;
          }

          .receipt__items {
            display: grid;
            gap: 8px;
          }

          .receipt__item {
            display: grid;
            gap: 2px;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .receipt__item-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 10px;
          }

          .receipt__item-name {
            max-width: 70%;
            color: #111111;
            font-weight: 700;
            overflow-wrap: anywhere;
          }

          .receipt__item-total {
            flex: 0 0 auto;
            color: #111111;
            text-align: right;
          }

          .receipt__item-meta {
            display: grid;
            gap: 1px;
            color: #4c453e;
            font-size: 8px;
            overflow-wrap: anywhere;
          }

          .receipt__grand-total {
            margin-top: 5px;
            padding-top: 8px;
            border-top: 1px solid #111111;
            color: #111111 !important;
            font-size: 11px;
            font-weight: 700;
          }

          .receipt__grand-total strong {
            font-size: 12px;
          }

          .receipt__footer {
            margin-top: 14px;
            color: #4c453e;
            font-size: 8px;
            text-align: center;
          }

          .receipt__footer p {
            margin: 2px 0 0;
          }

          @media print {
            html,
            body,
            .receipt {
              width: 80mm;
              min-width: 80mm;
              max-width: 80mm;
              height: auto;
              min-height: 0;
              margin: 0;
              padding: 4mm;
              overflow: visible;
            }

            .receipt {
              padding: 4mm;
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        </style>
      </head>

      <body>
        ${receiptMarkup}
      </body>
    </html>
  `
}