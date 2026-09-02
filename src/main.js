import './styles/tokens.css'
import './styles/global.css'
import './styles/launcher.css'

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

function renderPlaceholder(appName) {
  const pageDetails = {
    pos: {
      eyebrow: 'Counter tablet',
      title: 'Staff POS',
      description:
        'Phase 1 will build the full tablet ordering interface: sidebar, categories, product cards, variants, cart, tax, discounts, payments, and order completion.',
    },
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

  renderPlaceholder(currentApp)
}

renderApp()