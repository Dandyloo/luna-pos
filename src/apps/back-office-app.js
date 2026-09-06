import { renderBackOfficeDashboard } from '../components/back-office-dashboard.js'
import { renderBackOfficeMenu } from '../components/back-office-menu.js'
import { categories, menuItems as defaultMenuItems } from '../data/menu-data.js'
import {
  getAllMenuOverrides,
  saveMenuOverride,
} from '../services/menu-repository.js'
import { getAllOrders } from '../services/order-repository.js'
import { formatShortGhs } from '../utils/formatters.js'
import { createEffectiveMenu } from '../utils/menu-utils.js'
import { getAppUrl } from '../modules/app-router.js'
import { handleProductImageError } from '../utils/product-utils.js'
import { getDashboardReport } from '../utils/report-utils.js'

export const backOfficeState = {
  activeView: 'dashboard',
  orders: [],
  menuOverrides: [],
  selectedCategoryId: 'all',
  menuSearchQuery: '',
  isLoading: false,
  isSavingMenu: false,
  error: '',
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export function getEffectiveMenuItems() {
  return createEffectiveMenu(defaultMenuItems, backOfficeState.menuOverrides)
}

const backOfficeNavigation = [
  { id: 'dashboard', number: '01', label: 'Dashboard' },
  { id: 'orders', number: '02', label: 'Orders' },
  { id: 'sales', number: '03', label: 'Sales & Reports' },
  { id: 'items', number: '04', label: 'Menu & Items' },
  { id: 'settings', number: '05', label: 'Settings' },
]

function renderBackOfficeNavigation() {
  return backOfficeNavigation
    .map(
      (item) => `
        <button
          class="back-office-nav-item ${
            backOfficeState.activeView === item.id
              ? 'back-office-nav-item--active'
              : ''
          }"
          type="button"
          data-back-office-view="${item.id}"
          aria-current="${
            backOfficeState.activeView === item.id ? 'page' : 'false'
          }"
        >
          <span class="back-office-nav-item__number" aria-hidden="true">
            ${item.number}
          </span>
          <span class="back-office-nav-item__label">${item.label}</span>
        </button>
      `,
    )
    .join('')
}

function renderBackOfficePlaceholder(title, description) {
  return `
    <section class="back-office-dashboard">
      <header class="back-office-dashboard__header">
        <div>
          <p class="back-office-dashboard__eyebrow">Luna Back Office</p>
          <h1 class="back-office-dashboard__title">${title}</h1>
          <p class="back-office-dashboard__subtitle">${description}</p>
        </div>
      </header>

      <section class="back-office-notice" role="status">
        <span class="back-office-notice__mark" aria-hidden="true">i</span>
        <p>This section is planned for an upcoming build step.</p>
      </section>
    </section>
  `
}

export function renderBackOffice(appElement) {
  const report = getDashboardReport(backOfficeState.orders)
  const effectiveMenuItems = getEffectiveMenuItems()

  let mainContent = ''

  if (backOfficeState.isLoading) {
    mainContent = `
      <section class="back-office-dashboard">
        <p class="back-office-dashboard__subtitle">
          Loading local business data...
        </p>
      </section>
    `
  } else if (backOfficeState.activeView === 'dashboard') {
    mainContent = renderBackOfficeDashboard(report)
  } else if (backOfficeState.activeView === 'items') {
    mainContent = renderBackOfficeMenu({
      categories,
      menuItems: effectiveMenuItems,
      selectedCategoryId: backOfficeState.selectedCategoryId,
      searchQuery: backOfficeState.menuSearchQuery,
      isSaving: backOfficeState.isSavingMenu,
    })
  } else if (backOfficeState.activeView === 'orders') {
    mainContent = renderBackOfficePlaceholder(
      'Orders',
      'A dedicated owner-level order management view will be added after menu management.',
    )
  } else if (backOfficeState.activeView === 'sales') {
    mainContent = renderBackOfficePlaceholder(
      'Sales & Reports',
      'Expanded sales reports and export tools will be added in a later phase.',
    )
  } else {
    mainContent = renderBackOfficePlaceholder(
      'Settings',
      'Tax, discounts, receipt, device, and business settings will be added in a later phase.',
    )
  }

  appElement.innerHTML = `
    <main class="back-office-layout">
      <aside class="back-office-sidebar" aria-label="Back Office navigation">
        <div>
          <div class="back-office-sidebar__brand" aria-label="Luna Café and Eatery">
            <span class="back-office-sidebar__brand-mark" aria-hidden="true">L</span>
            <span>LUNA</span>
          </div>

          <p class="back-office-sidebar__subtitle">Owner Back Office</p>
        </div>

        <nav class="back-office-sidebar__nav" aria-label="Back Office sections">
          ${renderBackOfficeNavigation()}
        </nav>

        <div class="back-office-sidebar__footer">
          <section class="back-office-sidebar__mode">
            <p class="back-office-sidebar__mode-label">Data mode</p>
            <p class="back-office-sidebar__mode-value">Local device records</p>
          </section>

          <a class="back-office-sidebar__back-link" href="${getAppUrl('launcher')}">
            <span aria-hidden="true">←</span>
            <span>System launcher</span>
          </a>
        </div>
      </aside>

      <section class="back-office-main">
        ${
          backOfficeState.error
            ? `
              <p class="order-save-error" role="alert">
                ${escapeHtml(backOfficeState.error)}
              </p>
            `
            : ''
        }

        ${mainContent}
      </section>
    </main>
  `

  attachBackOfficeEventListeners(appElement)
}

function attachBackOfficeEventListeners(appElement) {
  appElement.querySelectorAll('[data-back-office-view]').forEach((button) => {
    button.addEventListener('click', () => {
      backOfficeState.activeView = button.dataset.backOfficeView
      renderBackOffice(appElement)
    })
  })

  appElement
    .querySelector('[data-refresh-back-office]')
    ?.addEventListener('click', () => {
      loadBackOfficeData(appElement)
    })

  appElement.querySelectorAll('[data-menu-category]').forEach((button) => {
    button.addEventListener('click', () => {
      backOfficeState.selectedCategoryId = button.dataset.menuCategory
      renderBackOffice(appElement)
    })
  })

  appElement
    .querySelector('[data-menu-search]')
    ?.addEventListener('input', (event) => {
      backOfficeState.menuSearchQuery = event.target.value
      renderBackOffice(appElement)
    })

  appElement
    .querySelectorAll('[data-toggle-product-availability]')
    .forEach((button) => {
      button.addEventListener('click', () => {
        toggleProductAvailability(appElement, button.dataset.toggleProductAvailability)
      })
    })

  appElement.querySelectorAll('.menu-item-row__image').forEach((image) => {
    image.addEventListener(
      'error',
      () => {
        handleProductImageError(image, image.dataset.fallbackImage)
      },
      { once: true },
    )
  })
}

async function toggleProductAvailability(appElement, productId) {
  if (backOfficeState.isSavingMenu) {
    return
  }

  const effectiveMenuItems = getEffectiveMenuItems()
  const product = effectiveMenuItems.find((item) => item.id === productId)

  if (!product) {
    return
  }

  backOfficeState.isSavingMenu = true
  backOfficeState.error = ''
  renderBackOffice(appElement)

  try {
    const previousOverride =
      backOfficeState.menuOverrides.find(
        (override) => override.id === productId,
      ) || {}

    const updatedOverride = {
      ...previousOverride,
      id: product.id,
      isAvailable: !product.isAvailable,
      updatedAt: new Date().toISOString(),
    }

    await saveMenuOverride(updatedOverride)

    const existingOverrideIndex = backOfficeState.menuOverrides.findIndex(
      (override) => override.id === productId,
    )

    if (existingOverrideIndex >= 0) {
      backOfficeState.menuOverrides = backOfficeState.menuOverrides.map(
        (override) =>
          override.id === productId ? updatedOverride : override,
      )
    } else {
      backOfficeState.menuOverrides = [
        ...backOfficeState.menuOverrides,
        updatedOverride,
      ]
    }
  } catch (error) {
    console.error('Failed to update product availability:', error)
    backOfficeState.error =
      'Product availability could not be saved. Please try again.'
  } finally {
    backOfficeState.isSavingMenu = false
    renderBackOffice(appElement)
  }
}

export async function loadBackOfficeData(appElement) {
  backOfficeState.isLoading = true
  backOfficeState.error = ''
  renderBackOffice(appElement)

  try {
    const [orders, menuOverrides] = await Promise.all([
      getAllOrders(),
      getAllMenuOverrides(),
    ])

    backOfficeState.orders = orders
    backOfficeState.menuOverrides = menuOverrides
  } catch (error) {
    console.error('Failed to load Back Office data:', error)
    backOfficeState.error =
      'Back Office data could not be loaded from this device. Please refresh and try again.'
  } finally {
    backOfficeState.isLoading = false
    renderBackOffice(appElement)
  }
}