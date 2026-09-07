function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatPercentage(value) {
  return Number(value).toFixed(2).replace(/\.00$/, '')
}

function formatFixedAmount(value) {
  return value === null || value === undefined ? '' : value
}

export function renderBackOfficeSettings({
  taxSettings,
  discountSettings,
  isSaving,
  error,
  successMessage,
}) {
  return `
    <section class="back-office-settings" aria-labelledby="settings-title">
      <header class="back-office-dashboard__header">
        <div>
          <p class="back-office-dashboard__eyebrow">Business configuration</p>
          <h1 class="back-office-dashboard__title" id="settings-title">
            Settings
          </h1>
          <p class="back-office-dashboard__subtitle">
            Configure tax and discount rules used by new Luna POS orders.
          </p>
        </div>
      </header>

      <section class="back-office-notice" role="status">
        <span class="back-office-notice__mark" aria-hidden="true">i</span>
        <p>
          New settings affect future orders only. Existing orders preserve their
          original tax and discount details.
        </p>
      </section>

      ${
        error
          ? `
            <p class="settings-form__message settings-form__message--error" role="alert">
              ${escapeHtml(error)}
            </p>
          `
          : ''
      }

      ${
        successMessage
          ? `
            <p class="settings-form__message settings-form__message--success" role="status">
              ${escapeHtml(successMessage)}
            </p>
          `
          : ''
      }

      <form class="settings-form" data-business-settings-form novalidate>
        <section class="settings-panel">
          <header class="settings-panel__header">
            <div>
              <p class="settings-panel__eyebrow">Tax configuration</p>
              <h2 class="settings-panel__title">Checkout tax</h2>
            </div>

            <span class="settings-panel__status">
              ${
                taxSettings.isGloballyEnabled
                  ? 'Available in POS'
                  : 'Disabled in POS'
              }
            </span>
          </header>

          <div class="settings-form__grid">
            <label class="product-edit-field">
              <span>Tax name</span>
              <input
                type="text"
                value="${escapeHtml(taxSettings.name)}"
                maxlength="40"
                data-tax-setting="name"
                placeholder="VAT"
                ${isSaving ? 'disabled' : ''}
              />
            </label>

            <label class="product-edit-field">
              <span>Tax rate (%)</span>
              <input
                type="number"
                value="${formatPercentage(taxSettings.rate * 100)}"
                min="0"
                max="100"
                step="0.01"
                inputmode="decimal"
                data-tax-setting="rate"
                placeholder="20"
                ${isSaving ? 'disabled' : ''}
              />
            </label>
          </div>

          <section class="settings-toggle-row">
            <div>
              <h3>Enable tax in Staff POS</h3>
              <p>When disabled, staff cannot add tax to an order.</p>
            </div>

            <button
              class="toggle-control"
              type="button"
              data-toggle-tax-global
              aria-label="Enable tax in Staff POS"
              aria-pressed="${taxSettings.isGloballyEnabled}"
              ${isSaving ? 'disabled' : ''}
            ></button>
          </section>

          <section class="settings-toggle-row">
            <div>
              <h3>Enable tax by default</h3>
              <p>
                When enabled, new orders start with tax selected. Staff can still
                turn it off per order.
              </p>
            </div>

            <button
              class="toggle-control"
              type="button"
              data-toggle-tax-default
              aria-label="Enable tax by default on new orders"
              aria-pressed="${taxSettings.isEnabledByDefault}"
              ${taxSettings.isGloballyEnabled && !isSaving ? '' : 'disabled'}
            ></button>
          </section>

          <section class="settings-calculation-note">
            <span class="settings-calculation-note__label">Calculation type</span>
            <strong>Exclusive tax</strong>
            <p>Tax is added after discounts and is not included in menu prices.</p>
          </section>
        </section>

        <section class="settings-panel">
          <header class="settings-panel__header">
            <div>
              <p class="settings-panel__eyebrow">Discount configuration</p>
              <h2 class="settings-panel__title">Staff discounts</h2>
            </div>

            <span class="settings-panel__status">
              ${
                discountSettings.isPercentageEnabled ||
                discountSettings.isFixedAmountEnabled
                  ? 'Available in POS'
                  : 'Disabled in POS'
              }
            </span>
          </header>

          <p class="settings-panel__description">
            Discounts are off by default on every new order. These settings
            control which types staff can select.
          </p>

          <section class="settings-toggle-row">
            <div>
              <h3>Enable percentage discounts</h3>
              <p>Allows discounts such as 10% or 15%.</p>
            </div>

            <button
              class="toggle-control"
              type="button"
              data-toggle-percentage-discount
              aria-label="Enable percentage discounts"
              aria-pressed="${discountSettings.isPercentageEnabled}"
              ${isSaving ? 'disabled' : ''}
            ></button>
          </section>

          <label class="product-edit-field settings-form__limit-field">
            <span>Maximum percentage discount (%)</span>
            <input
              type="number"
              value="${formatPercentage(discountSettings.maxPercentage)}"
              min="0"
              max="100"
              step="0.01"
              inputmode="decimal"
              data-discount-setting="maxPercentage"
              placeholder="100"
              ${
                discountSettings.isPercentageEnabled && !isSaving
                  ? ''
                  : 'disabled'
              }
            />
            <small class="product-edit-field__hint">
              Enter 100 to allow up to a full percentage discount.
            </small>
          </label>

          <section class="settings-toggle-row">
            <div>
              <h3>Enable fixed-amount discounts</h3>
              <p>Allows discounts such as GH₵10.00.</p>
            </div>

            <button
              class="toggle-control"
              type="button"
              data-toggle-fixed-discount
              aria-label="Enable fixed amount discounts"
              aria-pressed="${discountSettings.isFixedAmountEnabled}"
              ${isSaving ? 'disabled' : ''}
            ></button>
          </section>

          <label class="product-edit-field settings-form__limit-field">
            <span>Maximum fixed discount (GH₵)</span>
            <input
              type="number"
              value="${formatFixedAmount(discountSettings.maxFixedAmount)}"
              min="0"
              step="0.01"
              inputmode="decimal"
              data-discount-setting="maxFixedAmount"
              placeholder="No separate cap"
              ${
                discountSettings.isFixedAmountEnabled && !isSaving
                  ? ''
                  : 'disabled'
              }
            />
            <small class="product-edit-field__hint">
              Leave blank to limit the discount only by the order subtotal.
            </small>
          </label>
        </section>

        <footer class="settings-form__footer">
          <button
            class="button button--primary"
            type="submit"
            data-save-business-settings
            ${isSaving ? 'disabled' : ''}
          >
            ${isSaving ? 'Saving settings...' : 'Save settings'}
          </button>
        </footer>
      </form>
    </section>
  `
}