import './styles/tokens.css'
import './styles/global.css'
import './styles/launcher.css'
import './styles/pos.css'

import { getAppUrl, getCurrentApp } from './modules/app-router.js'

const app = document.querySelector('#app')

const applicationCards = [
  {
    appName: 'pos',
    icon: '🧾',
    label: 'Counter tablet',
    title: 'Staff POS',
    description:
      'The fast, touch-friendly workspace for taking café orders and recording payments.',
    features: [
      'Menu, variants, add-ons',
      'Tax, discounts, and payments',
      'Offline-first order records',
    ],
    linkText: 'Open Staff POS',
  },
  {
    appName: 'customer-display',
    icon: '✨',
    label: 'Second tablet',
    title: 'Customer Display',
    description:
      'A live, read-only view that lets the customer confirm their order and follow its status.',
    features: [
      'Live basket and order total',
      'Payment confirmation prompts',
      'Preparing and ready states',
    ],
    linkText: 'Open Customer Display',
  },
  {
    appName: 'back-office',
    icon: '📊',
    label: 'Owner workspace',
    title: 'Back Office',
    description:
      'The control centre for menu management, operations, reports, daily sales, and profit.',
    features: [
      'Orders and sales reporting',
      'Items, prices, costs, settings',
      'Daily profit and expense tracking',
    ],
    linkText: 'Open Back Office',
  },
]

const posNavigation = [
  { icon: '⌑', label: 'New Order', isActive: true },
  { icon: '◫', label: 'Orders', isActive: false },
  { icon: '◈', label: 'Sales', isActive: false },
  { icon: '▦', label: 'Items', isActive: false },
  { icon: '⚙', label: 'Settings', isActive: false },
]

const posCategories = [
  { icon: '🍽️', label: 'All Items', isActive: true },
  { icon: '🔥', label: 'Popular', isActive: false },
  { icon: '🍳', label: 'Breakfast', isActive: false },
  { icon: '🥐', label: 'Quick Bites', isActive: false },
  { icon: '🍕', label: 'Pizza', isActive: false },
  { icon: '🧋', label: 'Luna Boba', isActive: false },
  { icon: '☕', label: 'Hot Drinks', isActive: false },
  { icon: '🥤', label: 'Soft Drinks', isActive: false },
]

function renderLauncher() {
  const cards = applicationCards
    .map(
      (card) => `
        <article class="launcher-card">
          <div class="launcher-card__icon" aria-hidden="true">${card.icon}</div>

          <p class="launcher-card__label">${card.label}</p>

          <h2 class="launcher-card__title">${card.title}</h2>

          <p class="launcher-card__description">${card.description}</p>

          <ul class="launcher-card__features">
            ${card.features.map((feature) => `<li>${feature}</li>`).join('')}
          </ul>

          <a class="launcher-card__link" href="${getAppUrl(card.appName)}">
            ${card.linkText}
          </a>
        </article>
      `,
    )
    .join('')

  app.innerHTML = `
    <main class="launcher">
      <header class="launcher__header">
        <div>
          <div class="launcher__brand" aria-label="Luna Café and Eatery">
            <span class="launcher__brand-moon" aria-hidden="true">◒</span>
            <span>LUNA</span>
          </div>

          <p class="launcher__header-copy">
            Café & Eatery Operations System
          </p>
        </div>

        <span class="launcher__environment">
          <span class="status-dot" aria-hidden="true"></span>
          Local development
        </span>
      </header>

      <section class="launcher__grid" aria-label="Luna application workspaces">
        ${cards}
      </section>
    </main>
  `
}

function renderProductSkeletons() {
  return Array.from(
    { length: 9 },
    () => `
      <article class="product-skeleton" aria-hidden="true">
        <div class="product-skeleton__image"></div>
        <div class="product-skeleton__content">
          <div class="product-skeleton__line product-skeleton__line--title"></div>
          <div class="product-skeleton__line"></div>
          <div class="product-skeleton__line product-skeleton__line--short"></div>
        </div>
      </article>
    `,
  ).join('')
}

function renderPos() {
  const navigation = posNavigation
    .map(
      (item) => `
        <button
          class="pos-nav-item ${item.isActive ? 'pos-nav-item--active' : ''}"
          type="button"
          aria-current="${item.isActive ? 'page' : 'false'}"
        >
          <span class="pos-nav-item__icon" aria-hidden="true">${item.icon}</span>
          <span class="pos-nav-item__label">${item.label}</span>
        </button>
      `,
    )
    .join('')

  const categories = posCategories
    .map(
      (category) => `
        <button
          class="category-filter ${
            category.isActive ? 'category-filter--active' : ''
          }"
          type="button"
          aria-pressed="${category.isActive}"
        >
          <span class="category-filter__icon" aria-hidden="true">
            ${category.icon}
          </span>
          ${category.label}
        </button>
      `,
    )
    .join('')

  app.innerHTML = `
    <main class="pos-layout">
      <aside class="pos-sidebar" aria-label="Staff POS navigation">
        <div>
          <div class="pos-sidebar__brand" aria-label="Luna Café and Eatery">
            <span class="pos-sidebar__brand-moon" aria-hidden="true">◒</span>
            <span>LUNA</span>
          </div>

          <p class="pos-sidebar__subtitle">Café & Eatery POS</p>
        </div>

        <nav class="pos-sidebar__nav" aria-label="Primary navigation">
          ${navigation}
        </nav>

        <div class="pos-sidebar__footer">
          <section class="pos-sidebar__device" aria-label="Current device">
            <p class="pos-sidebar__device-label">Current device</p>
            <p class="pos-sidebar__device-name">Counter Tablet 1</p>
          </section>

          <a class="pos-sidebar__back-link" href="${getAppUrl('launcher')}">
            <span aria-hidden="true">←</span>
            <span>System launcher</span>
          </a>
        </div>
      </aside>

      <section class="pos-workspace" aria-labelledby="pos-title">
        <header class="pos-header">
          <div>
            <p class="pos-header__eyebrow">Counter Tablet 1</p>
            <h1 class="pos-header__title" id="pos-title">New order</h1>
          </div>

          <div class="pos-header__actions">
            <span class="connection-status" title="Cloud sync is not configured yet">
              <span class="connection-status__dot" aria-hidden="true"></span>
              Local mode
            </span>

            <button class="pos-header__button" type="button">
              ☷ Open orders
            </button>
          </div>
        </header>

        <div class="pos-order-options" aria-label="Order type">
          <button
            class="order-type-button order-type-button--active"
            type="button"
            aria-pressed="true"
          >
            🍽️ Dine-in
          </button>

          <button class="order-type-button" type="button" aria-pressed="false">
            🥡 Takeaway
          </button>
        </div>

        <div class="pos-divider"></div>

        <section aria-labelledby="menu-title">
          <div class="pos-menu-toolbar">
            <div>
              <h2 class="pos-menu-toolbar__title" id="menu-title">Menu</h2>
              <p class="pos-menu-toolbar__meta">Select an item to add it to the order</p>
            </div>

            <label class="pos-search">
              <span class="pos-search__icon" aria-hidden="true">⌕</span>
              <input
                class="pos-search__input"
                type="search"
                placeholder="Search menu"
                aria-label="Search menu"
                disabled
              />
            </label>
          </div>

          <div class="pos-category-scroll" aria-label="Menu categories">
            ${categories}
          </div>

          <div class="pos-products-placeholder" aria-label="Menu product cards loading soon">
            ${renderProductSkeletons()}
          </div>
        </section>
      </section>

      <aside class="pos-order-panel" aria-labelledby="order-panel-title">
        <header class="order-panel__header">
          <div>
            <p class="order-panel__eyebrow">Current order</p>
            <h2 class="order-panel__title" id="order-panel-title">Order #Draft</h2>
          </div>

          <button
            class="order-panel__icon-button"
            type="button"
            aria-label="Clear current order"
            disabled
          >
            ⌫
          </button>
        </header>

        <section class="order-panel__empty" aria-label="Empty order">
          <div>
            <div class="order-panel__empty-icon" aria-hidden="true">🧋</div>
            <p class="order-panel__empty-title">Your order is empty</p>
            <p class="order-panel__empty-copy">
              Select an item from the menu to begin this customer’s order.
            </p>
          </div>
        </section>

        <footer>
          <div class="order-panel__summary">
            <div class="order-summary-row">
              <span>Subtotal</span>
              <span class="order-summary-row__value">GH₵ 0.00</span>
            </div>

            <div class="order-summary-row">
              <span>Tax</span>
              <span class="order-summary-row__value">GH₵ 0.00</span>
            </div>

            <div class="order-summary-row order-summary-row--total">
              <span>Total</span>
              <span class="order-summary-row__value">GH₵ 0.00</span>
            </div>
          </div>

          <button class="order-panel__action" type="button" disabled>
            Continue to payment
          </button>
        </footer>
      </aside>
    </main>
  `
}

function renderPlaceholder(appName) {
  const pageDetails = {
    'customer-display': {
      eyebrow: 'Second tablet',
      title: 'Customer Display',
      description:
        'Phase 4 will build a read-only live customer screen with order items, totals, payment prompts, and preparation status updates.',
    },
    'back-office': {
      eyebrow: 'Owner workspace',
      title: 'Back Office',
      description:
        'Phase 7 will build the owner dashboard, menu management, reports, settings, daily sales, costs, expenses, and profit overview.',
    },
  }

  const page = pageDetails[appName]

  app.innerHTML = `
    <main class="route-placeholder">
      <section class="route-placeholder__card" aria-labelledby="page-title">
        <p class="route-placeholder__eyebrow">${page.eyebrow}</p>

        <h1 class="route-placeholder__title" id="page-title">
          ${page.title}
        </h1>

        <p class="route-placeholder__copy">
          ${page.description}
        </p>

        <a class="route-placeholder__back-link" href="${getAppUrl('launcher')}">
          ← Return to Luna system launcher
        </a>
      </section>
    </main>
  `
}

function renderApp() {
  const currentApp = getCurrentApp()

  if (currentApp === 'launcher') {
    renderLauncher()
    return
  }

  if (currentApp === 'pos') {
    renderPos()
    return
  }

  renderPlaceholder(currentApp)
}

renderApp()