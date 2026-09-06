function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export function renderBackOfficeSettings({
  taxSettings,
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
            Configure tax behaviour for new Luna POS orders.
          </p>
        </div>
      </header>

      <section class="back-office-notice" role="status">
        <span class="back-office-notice__mark" aria-hidden="true">i</span>
        <p>
          Tax is calculated exclusively: when enabled on an order, it is added
          on top of the menu subtotal after discounts. Existing completed orders
          will never be recalculated when these settings change.
        </p>
      </section>

      <form class="settings-form" data-tax-settings-form novalidate>
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
              <small class="product-edit-field__hint">
                This name appears in order summaries and receipts.
              </small>
            </label>

            <label class="product-edit-field">
              <span>Tax rate (%)</span>
              <input
                type="number"
                value="${(taxSettings.rate * 100).toFixed(2).replace(/\.00$/, '')}"
                min="0"
                max="100"
                step="0.01"
                inputmode="decimal"
                data-tax-setting="rate"
                placeholder="20"
                ${isSaving ? 'disabled' : ''}
              />
              <small class="product-edit-field__hint">
                Enter 20 for a 20% rate.
              </small>
            </label>
          </div>

          <section class="settings-toggle-row">
            <div>
              <h3>Enable tax in Staff POS</h3>
              <p>
                When disabled, staff cannot add tax to an order.
              </p>
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
                When enabled, every new order starts with tax selected. Staff may
                still turn it off for an individual order.
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
            <p>
              Tax is added after the subtotal and any eligible discount.
            </p>
          </section>
        </section>

        <footer class="settings-form__footer">
          <button
            class="button button--primary"
            type="submit"
            data-save-tax-settings
            ${isSaving ? 'disabled' : ''}
          >
            ${isSaving ? 'Saving settings...' : 'Save tax settings'}
          </button>
        </footer>
      </form>
    </section>
  `
}