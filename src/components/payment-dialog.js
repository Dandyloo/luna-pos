import { formatShortGhs } from '../utils/formatters.js'

export function renderPaymentDialog({ total, paymentMethod, cashReceived, error }) {
  const cashValue = Number(cashReceived)
  const validCashAmount = Number.isFinite(cashValue) && cashValue >= 0
  const change = validCashAmount ? Math.max(cashValue - total, 0) : 0
  const balance = validCashAmount ? Math.max(total - cashValue, 0) : total

  return `
    <dialog class="payment-dialog" aria-labelledby="payment-dialog-title">
      <form class="payment-dialog__form" method="dialog">
        <header class="payment-dialog__header">
          <div>
            <p class="payment-dialog__eyebrow">Complete order</p>
            <h2 class="payment-dialog__title" id="payment-dialog-title">
              Payment
            </h2>
          </div>

          <button
            class="icon-button"
            type="button"
            data-close-payment
            aria-label="Close payment screen"
          >
            ×
          </button>
        </header>

        <div class="payment-dialog__body">
          <section class="payment-total" aria-label="Amount due">
            <span class="payment-total__label">Amount due</span>
            <strong class="payment-total__value">${formatShortGhs(total)}</strong>
          </section>

          <fieldset class="payment-methods">
            <legend class="payment-methods__title">Payment method</legend>

            <div class="payment-methods__grid">
              <label class="payment-method">
                <input
                  type="radio"
                  name="payment-method"
                  value="cash"
                  ${paymentMethod === 'cash' ? 'checked' : ''}
                />
                <span class="payment-method__content">Cash</span>
              </label>

              <label class="payment-method">
                <input
                  type="radio"
                  name="payment-method"
                  value="momo"
                  ${paymentMethod === 'momo' ? 'checked' : ''}
                />
                <span class="payment-method__content">Mobile Money</span>
              </label>

              <label class="payment-method">
                <input
                  type="radio"
                  name="payment-method"
                  value="card"
                  ${paymentMethod === 'card' ? 'checked' : ''}
                />
                <span class="payment-method__content">Card</span>
              </label>
            </div>
          </fieldset>

          ${
            paymentMethod === 'cash'
              ? `
                <section class="cash-payment">
                  <label class="cash-payment__label" for="cash-received">
                    Cash received
                  </label>

                  <input
                    class="cash-payment__input"
                    id="cash-received"
                    data-field-name="cash-received"
                    type="number"
                    inputmode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="Enter amount received"
                    value="${cashReceived}"
                    data-cash-received
                    autocomplete="off"
                  />

                  <div class="cash-payment__summary">
                    <div class="cash-payment__row">
                      <span>Balance</span>
                      <strong>${formatShortGhs(balance)}</strong>
                    </div>

                    <div class="cash-payment__row cash-payment__row--change">
                      <span>Change</span>
                      <strong>${formatShortGhs(change)}</strong>
                    </div>
                  </div>
                </section>
              `
              : `
                <section class="non-cash-payment">
                  <p class="non-cash-payment__title">
                    ${
                      paymentMethod === 'momo'
                        ? 'Confirm Mobile Money payment'
                        : 'Confirm card payment'
                    }
                  </p>

                  <p class="non-cash-payment__copy">
                    ${
                      paymentMethod === 'momo'
                        ? 'Confirm that the customer has completed the Mobile Money payment before recording this order as paid.'
                        : 'Confirm that the card payment has been approved before recording this order as paid.'
                    }
                  </p>
                </section>
              `
          }

          ${
            error
              ? `<p class="payment-dialog__error" role="alert">${error}</p>`
              : ''
          }
        </div>

        <footer class="payment-dialog__footer">
          <button
            class="button button--secondary"
            type="button"
            data-close-payment
          >
            Cancel
          </button>

          <button class="button button--primary" type="submit" data-confirm-payment>
            Confirm payment
          </button>
        </footer>
      </form>
    </dialog>
  `
}