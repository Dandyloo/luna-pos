import './styles/tokens.css'
import './styles/global.css'
import './styles/launcher.css'
import './styles/orders.css'
import './styles/pos.css'

import { renderItemCustomizationDialog } from './components/item-customization-dialog.js'
import { renderOrderCard, renderOrdersEmptyState } from './components/order-card.js'
import { renderOrderDetails } from './components/order-details.js'
import { renderPaymentDialog } from './components/payment-dialog.js'
import { renderNoProductsState, renderProductCard } from './components/product-card.js'
import { categories, menuItems, modifierGroups } from './data/menu-data.js'
import { calculateOrderTotals } from './utils/financial-utils.js'
import { formatShortGhs } from './utils/formatters.js'
import { getAppUrl, getCurrentApp } from './modules/app-router.js'
import {
  addCartItem,
  createCartItem,
  getCartItemLineTotal,
  getCartItemUnitTotal,
  getCartQuantity,
  getCartSubtotal,
  updateCartItemQuantity,
} from './utils/order-utils.js'
import { getCategoryById, handleProductImageError } from './utils/product-utils.js'
import {
  getAllOrders,
  getOrderCount,
  saveOrder,
} from './services/order-repository.js'

const app = document.querySelector('#app')

const DEMO_TAX_RATE = 0.15
const CURRENT_DEVICE_NAME = 'Counter Tablet 1'

const applicationCards = [
  {
    appName: 'pos',
    icon: 'POS',
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
    icon: 'CD',
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
    icon: 'BO',
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
  { id: 'new-order', icon: '01', label: 'New Order' },
  { id: 'orders', icon: '02', label: 'Orders' },
  { id: 'sales', icon: '03', label: 'Sales' },
  { id: 'items', icon: '04', label: 'Items' },
  { id: 'settings', icon: '05', label: 'Settings' },
]

const orderFilterOptions = [
  { id: 'all', label: 'All' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'payment-pending', label: 'Payment Pending' },
  { id: 'paid', label: 'Paid' },
  { id: 'completed', label: 'Completed' },
]

const posState = {
  activeView: 'new-order',
  selectedCategoryId: 'all',
  searchQuery: '',
  showPopularOnly: false,
  orderType: 'dine-in',
  cartItems: [],
  activeProductId: null,
  isTaxEnabled: false,
  isDiscountEnabled: false,
  discountType: 'percentage',
  discountValue: '',
  discountError: '',
  isPaymentDialogOpen: false,
  paymentMethod: 'cash',
  cashReceived: '',
  paymentError: '',
  lastSubmittedOrder: null,
  savedOrderCount: 0,
  isSavingOrder: false,
  saveOrderError: '',
  orders: [],
  selectedOrderId: null,
  ordersFilter: 'all',
  isLoadingOrders: false,
  ordersLoadError: '',
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function getOrderTotals() {
  return calculateOrderTotals({
    subtotal: getCartSubtotal(posState.cartItems),
    isDiscountEnabled: posState.isDiscountEnabled,
    discountType: posState.discountType,
    discountValue: posState.discountValue,
    isTaxEnabled: posState.isTaxEnabled,
    taxRate: DEMO_TAX_RATE,
  })
}

function getVisibleProducts() {
  const normalizedQuery = posState.searchQuery.trim().toLowerCase()

  return menuItems.filter((product) => {
    const matchesCategory =
      posState.selectedCategoryId === 'all' ||
      product.categoryId === posState.selectedCategoryId

    const matchesPopular = !posState.showPopularOnly || product.isPopular

    const searchableText = [
      product.name,
      product.description,
      getCategoryById(product.categoryId)?.name ?? '',
      ...product.variants.map((variant) => variant.name),
    ]
      .join(' ')
      .toLowerCase()

    const matchesSearch =
      normalizedQuery === '' || searchableText.includes(normalizedQuery)

    return matchesCategory && matchesPopular && matchesSearch
  })
}

function getFilteredOrders() {
  return posState.orders.filter((order) => {
    if (posState.ordersFilter === 'all') {
      return true
    }

    if (posState.ordersFilter === 'preparing') {
      return order.fulfilmentStatus === 'PREPARING'
    }

    if (posState.ordersFilter === 'ready') {
      return order.fulfilmentStatus === 'READY'
    }

    if (posState.ordersFilter === 'payment-pending') {
      return order.paymentStatus === 'UNPAID'
    }

    if (posState.ordersFilter === 'paid') {
      return order.paymentStatus === 'PAID'
    }

    if (posState.ordersFilter === 'completed') {
      return order.fulfilmentStatus === 'COMPLETED'
    }

    return true
  })
}

function getSelectedOrder() {
  return (
    posState.orders.find((order) => order.id === posState.selectedOrderId) ||
    null
  )
}

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
            <span class="launcher__brand-moon" aria-hidden="true">L</span>
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

function renderPosNavigation() {
  return posNavigation
    .map(
      (item) => `
        <button
          class="pos-nav-item ${
            posState.activeView === item.id ? 'pos-nav-item--active' : ''
          }"
          type="button"
          data-pos-view="${item.id}"
          aria-current="${posState.activeView === item.id ? 'page' : 'false'}"
        >
          <span class="pos-nav-item__icon" aria-hidden="true">${item.icon}</span>
          <span class="pos-nav-item__label">${item.label}</span>
        </button>
      `,
    )
    .join('')
}

function renderPosCategories() {
  const allCategoryButton = `
    <button
      class="category-filter ${
        posState.selectedCategoryId === 'all' && !posState.showPopularOnly
          ? 'category-filter--active'
          : ''
      }"
      type="button"
      data-category-id="all"
      aria-pressed="${
        posState.selectedCategoryId === 'all' && !posState.showPopularOnly
      }"
    >
      <span class="category-filter__icon" aria-hidden="true"></span>
      All Items
    </button>
  `

  const popularButton = `
    <button
      class="category-filter ${
        posState.showPopularOnly ? 'category-filter--active' : ''
      }"
      type="button"
      data-popular-filter="true"
      aria-pressed="${posState.showPopularOnly}"
    >
      <span class="category-filter__icon" aria-hidden="true"></span>
      Popular
    </button>
  `

  const categoryButtons = categories
    .filter((category) => category.id !== 'all')
    .map(
      (category) => `
        <button
          class="category-filter ${
            posState.selectedCategoryId === category.id &&
            !posState.showPopularOnly
              ? 'category-filter--active'
              : ''
          }"
          type="button"
          data-category-id="${category.id}"
          aria-pressed="${
            posState.selectedCategoryId === category.id &&
            !posState.showPopularOnly
          }"
        >
          <span class="category-filter__icon" aria-hidden="true"></span>
          ${escapeHtml(category.name)}
        </button>
      `,
    )
    .join('')

  return `${allCategoryButton}${popularButton}${categoryButtons}`
}

function renderProducts() {
  const visibleProducts = getVisibleProducts()

  if (visibleProducts.length === 0) {
    return renderNoProductsState()
  }

  return visibleProducts.map((product) => renderProductCard(product)).join('')
}

function renderCartItem(cartItem) {
  const modifierNames = cartItem.modifiers.map((modifier) => modifier.name)
  const details = [cartItem.variantName, ...modifierNames].join(' · ')

  return `
    <article class="cart-item">
      <img
        class="cart-item__image"
        src="${cartItem.image}"
        alt=""
        width="640"
        height="640"
        loading="lazy"
        data-fallback-image="${cartItem.fallbackImage}"
      />

      <div class="cart-item__content">
        <div class="cart-item__top-row">
          <span class="cart-item__name">${escapeHtml(cartItem.productName)}</span>
          <span class="cart-item__line-total">
            ${formatShortGhs(getCartItemLineTotal(cartItem))}
          </span>
        </div>

        <span class="cart-item__details">${escapeHtml(details)}</span>

        <div class="cart-item__bottom-row">
          <span class="cart-item__unit-price">
            ${formatShortGhs(getCartItemUnitTotal(cartItem))} each
          </span>

          <div class="cart-item__quantity" aria-label="Quantity controls">
            <button
              class="cart-item__quantity-button"
              type="button"
              data-decrease-cart-item="${cartItem.id}"
              aria-label="Decrease ${cartItem.productName} quantity"
            >
              −
            </button>

            <span class="cart-item__quantity-value">${cartItem.quantity}</span>

            <button
              class="cart-item__quantity-button"
              type="button"
              data-increase-cart-item="${cartItem.id}"
              aria-label="Increase ${cartItem.productName} quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </article>
  `
}

function renderAdjustments(totals, hasItems) {
  const discountSummary = posState.isDiscountEnabled
    ? posState.discountType === 'percentage'
      ? `${posState.discountValue || 0}% selected`
      : `${formatShortGhs(Number(posState.discountValue) || 0)} selected`
    : 'Not applied'

  return `
    <section class="order-panel__adjustments" aria-label="Order adjustments">
      <section class="order-adjustment">
        <div class="order-adjustment__header">
          <span class="order-adjustment__label">Tax</span>

          <button
            class="toggle-control"
            type="button"
            data-toggle-tax
            aria-label="Toggle tax"
            aria-pressed="${posState.isTaxEnabled}"
            ${hasItems && !posState.isSavingOrder ? '' : 'disabled'}
          ></button>
        </div>

        <span class="order-adjustment__value">
          ${
            posState.isTaxEnabled
              ? `${(DEMO_TAX_RATE * 100).toFixed(0)}% tax is applied`
              : 'Tax is not applied'
          }
        </span>
      </section>

      <section class="order-adjustment">
        <div class="order-adjustment__header">
          <span class="order-adjustment__label">Discount</span>

          <button
            class="toggle-control"
            type="button"
            data-toggle-discount
            aria-label="Toggle discount"
            aria-pressed="${posState.isDiscountEnabled}"
            ${hasItems && !posState.isSavingOrder ? '' : 'disabled'}
          ></button>
        </div>

        <span class="order-adjustment__value" data-discount-summary>
          ${discountSummary}
        </span>

        <div class="order-adjustment__controls">
          <select
            class="adjustment-select"
            data-discount-type
            aria-label="Discount type"
            ${
              posState.isDiscountEnabled && hasItems && !posState.isSavingOrder
                ? ''
                : 'disabled'
            }
          >
            <option value="percentage" ${
              posState.discountType === 'percentage' ? 'selected' : ''
            }>
              Percentage
            </option>
            <option value="fixed" ${
              posState.discountType === 'fixed' ? 'selected' : ''
            }>
              Fixed amount
            </option>
          </select>

          <input
            class="adjustment-input"
            type="number"
            inputmode="decimal"
            min="0"
            max="${
              posState.discountType === 'percentage' ? '100' : totals.subtotal
            }"
            step="0.01"
            placeholder="${
              posState.discountType === 'percentage' ? '0–100' : 'Amount'
            }"
            value="${escapeHtml(posState.discountValue)}"
            data-discount-value
            aria-label="Discount value"
            ${
              posState.isDiscountEnabled && hasItems && !posState.isSavingOrder
                ? ''
                : 'disabled'
            }
          />
        </div>

        <p class="order-adjustment__hint" data-discount-hint>
          ${
            posState.discountType === 'percentage'
              ? 'Enter a discount from 0% to 100%.'
              : `Maximum discount: ${formatShortGhs(totals.subtotal)}`
          }
        </p>

        <p
          class="order-adjustment__error"
          data-discount-error
          role="alert"
          ${posState.discountError ? '' : 'hidden'}
        >
          ${escapeHtml(posState.discountError)}
        </p>
      </section>
    </section>
  `
}

function renderOrderPanel() {
  const totals = getOrderTotals()
  const cartQuantity = getCartQuantity(posState.cartItems)
  const hasItems = posState.cartItems.length > 0
  const isDisabled = !hasItems || posState.isSavingOrder

  return `
    <aside class="pos-order-panel" aria-labelledby="order-panel-title">
      <header class="order-panel__header">
        <div>
          <p class="order-panel__eyebrow">Current order</p>
          <h2 class="order-panel__title" id="order-panel-title">Order #Draft</h2>
        </div>

        <button
          class="order-panel__icon-button"
          type="button"
          data-clear-order
          aria-label="Clear current order"
          ${isDisabled ? 'disabled' : ''}
        >
          ×
        </button>
      </header>

      ${
        hasItems
          ? `
            <section
              class="order-panel__items"
              aria-label="${cartQuantity} item${cartQuantity === 1 ? '' : 's'} in current order"
            >
              ${posState.cartItems.map((cartItem) => renderCartItem(cartItem)).join('')}
            </section>
          `
          : `
            <section class="order-panel__empty" aria-label="Empty order">
              <div class="order-panel__empty-content">
                <div class="order-panel__empty-icon" aria-hidden="true"></div>
                <p class="order-panel__empty-title">Your order is empty</p>
                <p class="order-panel__empty-copy">
                  Select an item from the menu to begin this customer’s order.
                </p>
              </div>
            </section>
          `
      }

      ${renderAdjustments(totals, hasItems)}

      ${
        posState.saveOrderError
          ? `
            <p class="order-save-error" role="alert">
              ${escapeHtml(posState.saveOrderError)}
            </p>
          `
          : ''
      }

      <footer class="order-panel__footer">
        <div class="order-panel__summary">
          <div class="order-summary-row">
            <span>Subtotal</span>
            <span class="order-summary-row__value" data-subtotal-value>
              ${formatShortGhs(totals.subtotal)}
            </span>
          </div>

          <div
            class="order-summary-row"
            data-discount-row
            ${totals.discountAmount > 0 ? '' : 'hidden'}
          >
            <span>Discount</span>
            <span class="order-summary-row__value" data-discount-total>
              − ${formatShortGhs(totals.discountAmount)}
            </span>
          </div>

          <div class="order-summary-row">
            <span>Tax</span>
            <span class="order-summary-row__value" data-tax-total>
              ${formatShortGhs(totals.taxAmount)}
            </span>
          </div>

          <div class="order-summary-row order-summary-row--total">
            <span>Total</span>
            <span class="order-summary-row__value" data-order-total>
              ${formatShortGhs(totals.total)}
            </span>
          </div>
        </div>

        <div class="order-panel__actions">
          <button
            class="order-panel__action"
            type="button"
            data-open-payment
            ${isDisabled ? 'disabled' : ''}
          >
            Take payment
          </button>

          <button
            class="order-panel__action order-panel__action--secondary"
            type="button"
            data-send-to-preparation
            ${isDisabled ? 'disabled' : ''}
          >
            ${
              posState.isSavingOrder
                ? 'Saving order...'
                : 'Send to preparation'
            }
          </button>
        </div>
      </footer>
    </aside>
  `
}

function getProductModifierGroups(product) {
  return product.modifierGroupIds
    .map((modifierGroupId) =>
      modifierGroups.find((group) => group.id === modifierGroupId),
    )
    .filter(Boolean)
}

function renderActiveCustomizationDialog() {
  if (!posState.activeProductId) {
    return ''
  }

  const product = menuItems.find(
    (menuItem) => menuItem.id === posState.activeProductId,
  )

  if (!product) {
    return ''
  }

  return renderItemCustomizationDialog(
    product,
    getProductModifierGroups(product),
  )
}

function getPaymentMethodLabel(paymentMethod) {
  const labels = {
    cash: 'Cash',
    momo: 'Mobile Money',
    card: 'Card',
  }

  return labels[paymentMethod] || 'Payment'
}

function getFulfilmentStatusLabel(fulfilmentStatus) {
  const labels = {
    PLACED: 'Placed',
    PREPARING: 'Preparing',
    READY: 'Ready',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  }

  return labels[fulfilmentStatus] || fulfilmentStatus
}

function renderOrderConfirmation() {
  if (!posState.lastSubmittedOrder) {
    return ''
  }

  const order = posState.lastSubmittedOrder
  const isPaid = order.paymentStatus === 'PAID'

  return `
    <section class="order-confirmed" role="status" aria-live="polite">
      <p class="order-confirmed__eyebrow">
        ${isPaid ? 'Payment received' : 'Payment pending'}
      </p>

      <h2 class="order-confirmed__title">
        Order ${order.orderNumber} saved locally
      </h2>

      <p class="order-confirmed__copy">
        ${order.itemCount} item${order.itemCount === 1 ? '' : 's'} ·
        ${formatShortGhs(order.total)} ·
        ${isPaid ? getPaymentMethodLabel(order.payments?.[0]?.method) : 'Unpaid'} ·
        ${getFulfilmentStatusLabel(order.fulfilmentStatus)}
      </p>

      <button class="order-confirmed__button" type="button" data-start-new-order>
        Start new order
      </button>
    </section>
  `
}

function renderOrdersWorkspace() {
  const filteredOrders = getFilteredOrders()
  const selectedOrder = getSelectedOrder()

  return `
    <section class="pos-workspace" aria-labelledby="orders-title">
      <header class="pos-header">
        <div>
          <p class="pos-header__eyebrow">${CURRENT_DEVICE_NAME}</p>
          <h1 class="pos-header__title" id="orders-title">Orders</h1>
        </div>

        <div class="pos-header__actions">
          <span class="connection-status" title="Orders are currently stored only on this device">
            <span class="connection-status__dot" aria-hidden="true"></span>
            Local mode
          </span>

          <button class="pos-header__button" type="button" data-refresh-orders>
            Refresh
          </button>
        </div>
      </header>

      <div class="pos-divider"></div>

      ${
        posState.ordersLoadError
          ? `
            <p class="order-save-error" role="alert">
              ${escapeHtml(posState.ordersLoadError)}
            </p>
          `
          : ''
      }

      <section class="orders-workspace">
        <section class="orders-list-panel" aria-labelledby="orders-list-title">
          <header class="orders-list-panel__header">
            <p class="orders-list-panel__eyebrow">Saved locally</p>
            <h2 class="orders-list-panel__title" id="orders-list-title">
              Order queue
            </h2>

            <p class="orders-list-panel__count">
              ${
                posState.isLoadingOrders
                  ? 'Loading orders...'
                  : `${filteredOrders.length} order${
                      filteredOrders.length === 1 ? '' : 's'
                    } shown`
              }
            </p>

            <div class="orders-filter-row" aria-label="Order filters">
              ${orderFilterOptions
                .map(
                  (filter) => `
                    <button
                      class="orders-filter ${
                        posState.ordersFilter === filter.id
                          ? 'orders-filter--active'
                          : ''
                      }"
                      type="button"
                      data-orders-filter="${filter.id}"
                      aria-pressed="${posState.ordersFilter === filter.id}"
                    >
                      ${filter.label}
                    </button>
                  `,
                )
                .join('')}
            </div>
          </header>

          <div class="orders-list" aria-live="polite">
            ${
              posState.isLoadingOrders
                ? '<p class="orders-list-panel__count">Loading saved orders...</p>'
                : filteredOrders.length > 0
                  ? filteredOrders
                      .map((order) =>
                        renderOrderCard(
                          order,
                          order.id === posState.selectedOrderId,
                        ),
                      )
                      .join('')
                  : renderOrdersEmptyState()
            }
          </div>
        </section>

        <aside class="orders-details-panel">
          ${renderOrderDetails(selectedOrder)}
        </aside>
      </section>
    </section>
  `
}

function renderNewOrderWorkspace() {
  const visibleProductCount = getVisibleProducts().length

  return `
    <section class="pos-workspace" aria-labelledby="pos-title">
      <header class="pos-header">
        <div>
          <p class="pos-header__eyebrow">${CURRENT_DEVICE_NAME}</p>
          <h1 class="pos-header__title" id="pos-title">New order</h1>
        </div>

        <div class="pos-header__actions">
          <span class="connection-status" title="Orders are currently stored only on this device">
            <span class="connection-status__dot" aria-hidden="true"></span>
            Local mode
          </span>

          <button class="pos-header__button" type="button" data-pos-view="orders">
            ${posState.savedOrderCount} saved order${
              posState.savedOrderCount === 1 ? '' : 's'
            }
          </button>
        </div>
      </header>

      <div class="pos-order-options" aria-label="Order type">
        <button
          class="order-type-button ${
            posState.orderType === 'dine-in' ? 'order-type-button--active' : ''
          }"
          type="button"
          data-order-type="dine-in"
          aria-pressed="${posState.orderType === 'dine-in'}"
          ${posState.isSavingOrder ? 'disabled' : ''}
        >
          Dine-in
        </button>

        <button
          class="order-type-button ${
            posState.orderType === 'takeaway' ? 'order-type-button--active' : ''
          }"
          type="button"
          data-order-type="takeaway"
          aria-pressed="${posState.orderType === 'takeaway'}"
          ${posState.isSavingOrder ? 'disabled' : ''}
        >
          Takeaway
        </button>
      </div>

      <div class="pos-divider"></div>

      <section aria-labelledby="menu-title">
        <div class="pos-menu-toolbar">
          <div>
            <h2 class="pos-menu-toolbar__title" id="menu-title">Menu</h2>
            <p class="pos-menu-toolbar__meta" data-product-count>
              ${visibleProductCount} item${
                visibleProductCount === 1 ? '' : 's'
              } available
            </p>
          </div>

          <label class="pos-search">
            <span class="pos-search__icon" aria-hidden="true"></span>
            <input
              class="pos-search__input"
              type="search"
              placeholder="Search menu"
              aria-label="Search Luna menu"
              value="${escapeHtml(posState.searchQuery)}"
              autocomplete="off"
              autocapitalize="none"
              spellcheck="false"
              ${posState.isSavingOrder ? 'disabled' : ''}
            />
          </label>
        </div>

        <div class="pos-category-scroll" aria-label="Menu categories">
          ${renderPosCategories()}
        </div>

        <div class="pos-products-grid" aria-live="polite">
          ${renderProducts()}
        </div>
      </section>
    </section>
  `
}

function renderPos() {
  const workspace =
    posState.activeView === 'orders'
      ? renderOrdersWorkspace()
      : renderNewOrderWorkspace()

  app.innerHTML = `
    <main class="pos-layout">
      <aside class="pos-sidebar" aria-label="Staff POS navigation">
        <div>
          <div class="pos-sidebar__brand" aria-label="Luna Café and Eatery">
            <span class="pos-sidebar__brand-mark" aria-hidden="true">L</span>
            <span>LUNA</span>
          </div>

          <p class="pos-sidebar__subtitle">Café & Eatery POS</p>
        </div>

        <nav class="pos-sidebar__nav" aria-label="Primary navigation">
          ${renderPosNavigation()}
        </nav>

        <div class="pos-sidebar__footer">
          <section class="pos-sidebar__device" aria-label="Current device">
            <p class="pos-sidebar__device-label">Current device</p>
            <p class="pos-sidebar__device-name">${CURRENT_DEVICE_NAME}</p>
          </section>

          <a class="pos-sidebar__back-link" href="${getAppUrl('launcher')}">
            <span aria-hidden="true">←</span>
            <span>System launcher</span>
          </a>
        </div>
      </aside>

      ${workspace}

      ${
        posState.activeView === 'new-order'
          ? renderOrderPanel()
          : '<aside class="pos-order-panel" aria-label="Orders workspace information"><section class="order-panel__empty"><div class="order-panel__empty-content"><div class="order-panel__empty-icon" aria-hidden="true"></div><p class="order-panel__empty-title">Order queue</p><p class="order-panel__empty-copy">Select an order from the Orders workspace to review its details.</p></div></section></aside>'
      }
    </main>

    ${renderActiveCustomizationDialog()}

    ${
      posState.isPaymentDialogOpen
        ? renderPaymentDialog({
            total: getOrderTotals().total,
            paymentMethod: posState.paymentMethod,
            cashReceived: posState.cashReceived,
            error: posState.paymentError,
          })
        : ''
    }

    ${renderOrderConfirmation()}
  `

  attachPosEventListeners()

  if (posState.activeProductId) {
    const dialog = document.querySelector('.customization-dialog')

    if (dialog && !dialog.open) {
      dialog.showModal()
    }
  }

  if (posState.isPaymentDialogOpen) {
    const paymentDialog = document.querySelector('.payment-dialog')

    if (paymentDialog && !paymentDialog.open) {
      paymentDialog.showModal()
    }
  }
}

function updateProductsArea() {
  const productsGrid = document.querySelector('.pos-products-grid')
  const productCount = document.querySelector('[data-product-count]')

  if (!productsGrid || !productCount) {
    renderPos()
    return
  }

  const visibleProducts = getVisibleProducts()

  productsGrid.innerHTML =
    visibleProducts.length === 0
      ? renderNoProductsState()
      : visibleProducts.map((product) => renderProductCard(product)).join('')

  productCount.textContent = `${visibleProducts.length} item${
    visibleProducts.length === 1 ? '' : 's'
  } available`

  attachProductImageFallbacks()
  attachProductCardListeners()
}

function updateFinancialDisplay() {
  const totals = getOrderTotals()
  const subtotalValue = document.querySelector('[data-subtotal-value]')
  const discountRow = document.querySelector('[data-discount-row]')
  const discountTotal = document.querySelector('[data-discount-total]')
  const taxTotal = document.querySelector('[data-tax-total]')
  const orderTotal = document.querySelector('[data-order-total]')
  const discountSummary = document.querySelector('[data-discount-summary]')
  const discountHint = document.querySelector('[data-discount-hint]')
  const discountError = document.querySelector('[data-discount-error]')
  const discountInput = document.querySelector('[data-discount-value]')

  if (
    !subtotalValue ||
    !discountRow ||
    !discountTotal ||
    !taxTotal ||
    !orderTotal ||
    !discountSummary ||
    !discountHint ||
    !discountError ||
    !discountInput
  ) {
    renderPos()
    return
  }

  subtotalValue.textContent = formatShortGhs(totals.subtotal)
  taxTotal.textContent = formatShortGhs(totals.taxAmount)
  orderTotal.textContent = formatShortGhs(totals.total)

  if (totals.discountAmount > 0) {
    discountRow.hidden = false
    discountTotal.textContent = `− ${formatShortGhs(totals.discountAmount)}`
  } else {
    discountRow.hidden = true
  }

  discountSummary.textContent = posState.isDiscountEnabled
    ? posState.discountType === 'percentage'
      ? `${posState.discountValue || 0}% selected`
      : `${formatShortGhs(Number(posState.discountValue) || 0)} selected`
    : 'Not applied'

  discountHint.textContent =
    posState.discountType === 'percentage'
      ? 'Enter a discount from 0% to 100%.'
      : `Maximum discount: ${formatShortGhs(totals.subtotal)}`

  discountInput.max =
    posState.discountType === 'percentage' ? '100' : String(totals.subtotal)

  if (posState.discountError) {
    discountError.hidden = false
    discountError.textContent = posState.discountError
  } else {
    discountError.hidden = true
    discountError.textContent = ''
  }
}

function updateCashPaymentDisplay() {
  const paymentDialog = document.querySelector('.payment-dialog')

  if (!paymentDialog || posState.paymentMethod !== 'cash') {
    return
  }

  const total = getOrderTotals().total
  const cashValue = Number(posState.cashReceived)
  const validCashAmount = Number.isFinite(cashValue) && cashValue >= 0
  const change = validCashAmount ? Math.max(cashValue - total, 0) : 0
  const balance = validCashAmount ? Math.max(total - cashValue, 0) : total

  const balanceValue = paymentDialog.querySelector('[data-payment-balance]')
  const changeValue = paymentDialog.querySelector('[data-payment-change]')
  const paymentError = paymentDialog.querySelector('[data-payment-error]')

  if (balanceValue) {
    balanceValue.textContent = formatShortGhs(balance)
  }

  if (changeValue) {
    changeValue.textContent = formatShortGhs(change)
  }

  if (paymentError) {
    if (posState.paymentError) {
      paymentError.hidden = false
      paymentError.textContent = posState.paymentError
    } else {
      paymentError.hidden = true
      paymentError.textContent = ''
    }
  }
}

function attachProductImageFallbacks() {
  document.querySelectorAll('.product-card__image').forEach((image) => {
    image.addEventListener(
      'error',
      () => {
        handleProductImageError(image, image.dataset.fallbackImage)
      },
      { once: true },
    )
  })
}

function attachCartImageFallbacks() {
  document.querySelectorAll('.cart-item__image').forEach((image) => {
    image.addEventListener(
      'error',
      () => {
        handleProductImageError(image, image.dataset.fallbackImage)
      },
      { once: true },
    )
  })
}

function attachProductCardListeners() {
  document.querySelectorAll('[data-product-id]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!posState.isSavingOrder) {
        openProductCustomization(button.dataset.productId)
      }
    })
  })
}

function openProductCustomization(productId) {
  const product = menuItems.find((menuItem) => menuItem.id === productId)

  if (!product || !product.isAvailable || posState.isSavingOrder) {
    return
  }

  const hasMultipleVariants = product.variants.length > 1
  const hasModifiers = getProductModifierGroups(product).length > 0

  if (!hasMultipleVariants && !hasModifiers) {
    const cartItem = createCartItem({
      product,
      variant: product.variants[0],
    })

    posState.cartItems = addCartItem(posState.cartItems, cartItem)
    renderPos()
    return
  }

  posState.activeProductId = product.id
  renderPos()
}

function closeProductCustomization() {
  posState.activeProductId = null
  renderPos()
}

function addCustomizedProductToCart() {
  const dialog = document.querySelector('.customization-dialog')
  const product = menuItems.find(
    (menuItem) => menuItem.id === posState.activeProductId,
  )

  if (!dialog || !product) {
    closeProductCustomization()
    return
  }

  const formData = new FormData(dialog.querySelector('form'))
  const variantId = formData.get('variant') || product.variants[0].id

  const selectedVariant = product.variants.find(
    (variant) => variant.id === variantId,
  )

  const selectedModifiers = getProductModifierGroups(product).flatMap(
    (group) => {
      const optionIds =
        group.selectionType === 'multiple'
          ? formData.getAll(`modifier-${group.id}`)
          : [formData.get(`modifier-${group.id}`)].filter(Boolean)

      return optionIds
        .map((optionId) =>
          group.options.find((option) => option.id === optionId),
        )
        .filter(Boolean)
    },
  )

  const cartItem = createCartItem({
    product,
    variant: selectedVariant,
    modifiers: selectedModifiers,
  })

  posState.cartItems = addCartItem(posState.cartItems, cartItem)
  posState.activeProductId = null
  renderPos()
}

function validateDiscountValue(value) {
  if (!posState.isDiscountEnabled || value === '') {
    return ''
  }

  const numericValue = Number(value)

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return 'Enter a valid discount value.'
  }

  if (posState.discountType === 'percentage' && numericValue > 100) {
    return 'Percentage discount cannot be more than 100%.'
  }

  const subtotal = getCartSubtotal(posState.cartItems)

  if (posState.discountType === 'fixed' && numericValue > subtotal) {
    return `Fixed discount cannot exceed ${formatShortGhs(subtotal)}.`
  }

  return ''
}

function updateDiscountValue(value) {
  posState.discountValue = value
  posState.discountError = validateDiscountValue(value)
  updateFinancialDisplay()
}

function createOrderSnapshot({
  paymentStatus,
  paymentMethod = null,
  cashReceived = null,
}) {
  const totals = getOrderTotals()
  const now = new Date()
  const itemCount = getCartQuantity(posState.cartItems)

  return {
    id: crypto.randomUUID(),
    orderNumber: `LUNA-${String(Date.now()).slice(-6)}`,
    orderType: posState.orderType,
    paymentStatus,
    fulfilmentStatus: 'PREPARING',
    status: 'OPEN',
    items: structuredClone(posState.cartItems),
    subtotal: totals.subtotal,
    discount: {
      isEnabled: posState.isDiscountEnabled,
      type: posState.isDiscountEnabled ? posState.discountType : null,
      inputValue: posState.isDiscountEnabled ? posState.discountValue : null,
      amount: totals.discountAmount,
    },
    tax: {
      isEnabled: posState.isTaxEnabled,
      rate: posState.isTaxEnabled ? DEMO_TAX_RATE : 0,
      amount: totals.taxAmount,
    },
    total: totals.total,
    payments:
      paymentStatus === 'PAID'
        ? [
            {
              id: crypto.randomUUID(),
              method: paymentMethod,
              amount: totals.total,
              cashReceived,
              change:
                paymentMethod === 'cash'
                  ? Number((cashReceived - totals.total).toFixed(2))
                  : 0,
              recordedAt: now.toISOString(),
            },
          ]
        : [],
    sourceDevice: CURRENT_DEVICE_NAME,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    itemCount,
  }
}

function resetDraftOrder() {
  posState.cartItems = []
  posState.isTaxEnabled = false
  posState.isDiscountEnabled = false
  posState.discountType = 'percentage'
  posState.discountValue = ''
  posState.discountError = ''
  posState.isPaymentDialogOpen = false
  posState.paymentMethod = 'cash'
  posState.cashReceived = ''
  posState.paymentError = ''
  posState.saveOrderError = ''
}

async function persistSubmittedOrder(order) {
  posState.isSavingOrder = true
  posState.saveOrderError = ''
  renderPos()

  try {
    await saveOrder(order)
    posState.savedOrderCount = await getOrderCount()
    posState.lastSubmittedOrder = order
    resetDraftOrder()
  } catch (error) {
    console.error('Failed to save order locally:', error)
    posState.saveOrderError =
      'Order was not saved. Please try again before clearing this order.'
  } finally {
    posState.isSavingOrder = false
    renderPos()
  }
}

async function sendOrderToPreparation() {
  if (posState.cartItems.length === 0 || posState.isSavingOrder) {
    return
  }

  const order = createOrderSnapshot({
    paymentStatus: 'UNPAID',
  })

  await persistSubmittedOrder(order)
}

function openPaymentDialog() {
  if (posState.cartItems.length === 0 || posState.isSavingOrder) {
    return
  }

  posState.isPaymentDialogOpen = true
  posState.paymentMethod = 'cash'
  posState.cashReceived = ''
  posState.paymentError = ''
  renderPos()
}

function closePaymentDialog() {
  if (posState.isSavingOrder) {
    return
  }

  posState.isPaymentDialogOpen = false
  posState.paymentError = ''
  renderPos()
}

function validatePayment() {
  const total = getOrderTotals().total

  if (posState.paymentMethod !== 'cash') {
    return ''
  }

  const cashReceived = Number(posState.cashReceived)

  if (!Number.isFinite(cashReceived) || posState.cashReceived === '') {
    return 'Enter the amount received from the customer.'
  }

  if (cashReceived < total) {
    return `Cash received must be at least ${formatShortGhs(total)}.`
  }

  return ''
}

async function completeCurrentPayment() {
  if (posState.isSavingOrder) {
    return
  }

  const paymentError = validatePayment()

  if (paymentError) {
    posState.paymentError = paymentError
    updateCashPaymentDisplay()
    return
  }

  const order = createOrderSnapshot({
    paymentStatus: 'PAID',
    paymentMethod: posState.paymentMethod,
    cashReceived:
      posState.paymentMethod === 'cash'
        ? Number(posState.cashReceived)
        : null,
  })

  await persistSubmittedOrder(order)
}

function startNewOrder() {
  posState.lastSubmittedOrder = null
  posState.activeView = 'new-order'
  renderPos()
}

async function refreshSavedOrderCount() {
  try {
    posState.savedOrderCount = await getOrderCount()
  } catch (error) {
    console.error('Failed to read locally saved order count:', error)
  }
}

async function loadOrders() {
  posState.isLoadingOrders = true
  posState.ordersLoadError = ''
  renderPos()

  try {
    posState.orders = await getAllOrders()
    posState.savedOrderCount = posState.orders.length

    const selectedOrderStillExists = posState.orders.some(
      (order) => order.id === posState.selectedOrderId,
    )

    if (!selectedOrderStillExists) {
      posState.selectedOrderId = posState.orders[0]?.id || null
    }
  } catch (error) {
    console.error('Failed to load saved orders:', error)
    posState.ordersLoadError =
      'Saved orders could not be loaded from this device. Please refresh and try again.'
  } finally {
    posState.isLoadingOrders = false
    renderPos()
  }
}

function attachPosEventListeners() {
  const searchInput = document.querySelector('.pos-search__input')

  searchInput?.addEventListener('input', (event) => {
    posState.searchQuery = event.target.value
    updateProductsArea()
  })

  document.querySelectorAll('[data-pos-view]').forEach((button) => {
    button.addEventListener('click', async () => {
      const requestedView = button.dataset.posView

      if (requestedView === 'orders') {
        posState.activeView = 'orders'
        await loadOrders()
        return
      }

      if (requestedView === 'new-order') {
        posState.activeView = 'new-order'
        renderPos()
      }
    })
  })

  document.querySelectorAll('[data-orders-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      posState.ordersFilter = button.dataset.ordersFilter
      const filteredOrders = getFilteredOrders()

      const selectedOrderIsVisible = filteredOrders.some(
        (order) => order.id === posState.selectedOrderId,
      )

      if (!selectedOrderIsVisible) {
        posState.selectedOrderId = filteredOrders[0]?.id || null
      }

      renderPos()
    })
  })

  document.querySelectorAll('[data-select-order]').forEach((button) => {
    button.addEventListener('click', () => {
      posState.selectedOrderId = button.dataset.selectOrder
      renderPos()
    })
  })

  document.querySelector('[data-refresh-orders]')?.addEventListener('click', () => {
    loadOrders()
  })

  document.querySelectorAll('[data-category-id]').forEach((button) => {
    button.addEventListener('click', () => {
      posState.selectedCategoryId = button.dataset.categoryId
      posState.showPopularOnly = false
      renderPos()
    })
  })

  document.querySelectorAll('[data-popular-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      posState.showPopularOnly = !posState.showPopularOnly
      posState.selectedCategoryId = 'all'
      renderPos()
    })
  })

  document.querySelectorAll('[data-order-type]').forEach((button) => {
    button.addEventListener('click', () => {
      posState.orderType = button.dataset.orderType
      renderPos()
    })
  })

  attachProductCardListeners()
  attachProductImageFallbacks()
  attachCartImageFallbacks()

  document.querySelectorAll('[data-increase-cart-item]').forEach((button) => {
    button.addEventListener('click', () => {
      const cartItemId = button.dataset.increaseCartItem
      const cartItem = posState.cartItems.find(
        (item) => item.id === cartItemId,
      )

      if (!cartItem || posState.isSavingOrder) {
        return
      }

      posState.cartItems = updateCartItemQuantity(
        posState.cartItems,
        cartItemId,
        cartItem.quantity + 1,
      )

      posState.discountError = validateDiscountValue(posState.discountValue)
      renderPos()
    })
  })

  document.querySelectorAll('[data-decrease-cart-item]').forEach((button) => {
    button.addEventListener('click', () => {
      const cartItemId = button.dataset.decreaseCartItem
      const cartItem = posState.cartItems.find(
        (item) => item.id === cartItemId,
      )

      if (!cartItem || posState.isSavingOrder) {
        return
      }

      posState.cartItems = updateCartItemQuantity(
        posState.cartItems,
        cartItemId,
        cartItem.quantity - 1,
      )

      posState.discountError = validateDiscountValue(posState.discountValue)
      renderPos()
    })
  })

  document.querySelector('[data-clear-order]')?.addEventListener('click', () => {
    if (!posState.isSavingOrder) {
      resetDraftOrder()
      renderPos()
    }
  })

  document.querySelector('[data-toggle-tax]')?.addEventListener('click', () => {
    if (!posState.isSavingOrder) {
      posState.isTaxEnabled = !posState.isTaxEnabled
      renderPos()
    }
  })

  document
    .querySelector('[data-toggle-discount]')
    ?.addEventListener('click', () => {
      if (!posState.isSavingOrder) {
        posState.isDiscountEnabled = !posState.isDiscountEnabled
        posState.discountError = validateDiscountValue(posState.discountValue)
        renderPos()
      }
    })

  document
    .querySelector('[data-discount-type]')
    ?.addEventListener('change', (event) => {
      if (!posState.isSavingOrder) {
        posState.discountType = event.target.value
        posState.discountError = validateDiscountValue(posState.discountValue)
        renderPos()
      }
    })

  document
    .querySelector('[data-discount-value]')
    ?.addEventListener('input', (event) => {
      updateDiscountValue(event.target.value)
    })

  document.querySelectorAll('[data-close-customization]').forEach((button) => {
    button.addEventListener('click', () => {
      closeProductCustomization()
    })
  })

  document
    .querySelector('[data-add-customized-item]')
    ?.addEventListener('click', (event) => {
      event.preventDefault()
      addCustomizedProductToCart()
    })

  document.querySelector('[data-open-payment]')?.addEventListener('click', () => {
    openPaymentDialog()
  })

  document
    .querySelector('[data-send-to-preparation]')
    ?.addEventListener('click', () => {
      sendOrderToPreparation()
    })

  document.querySelectorAll('[data-close-payment]').forEach((button) => {
    button.addEventListener('click', () => {
      closePaymentDialog()
    })
  })

  document.querySelectorAll('input[name="payment-method"]').forEach((input) => {
    input.addEventListener('change', (event) => {
      if (!posState.isSavingOrder) {
        posState.paymentMethod = event.target.value
        posState.paymentError = ''
        renderPos()
      }
    })
  })

  document
    .querySelector('[data-cash-received]')
    ?.addEventListener('input', (event) => {
      posState.cashReceived = event.target.value
      posState.paymentError = ''
      updateCashPaymentDisplay()
    })

  document
    .querySelector('[data-confirm-payment]')
    ?.addEventListener('click', (event) => {
      event.preventDefault()
      completeCurrentPayment()
    })

  document
    .querySelector('[data-start-new-order]')
    ?.addEventListener('click', () => {
      startNewOrder()
    })
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

async function renderApp() {
  const currentApp = getCurrentApp()

  if (currentApp === 'launcher') {
    renderLauncher()
    return
  }

  if (currentApp === 'pos') {
    await refreshSavedOrderCount()
    renderPos()
    return
  }

  renderPlaceholder(currentApp)
}

renderApp()