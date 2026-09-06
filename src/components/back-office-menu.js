import { formatShortGhs } from '../utils/formatters.js'
import {
  getMenuAvailabilityTotals,
  getMenuCategoryProductCount,
  getMenuImageStatus,
} from '../utils/menu-utils.js'
import { getProductStartingPrice } from '../utils/product-utils.js'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function renderVariantSummary(product) {
  if (product.variants.length === 1) {
    const variant = product.variants[0]
    return `${variant.name}: ${formatShortGhs(variant.price)}`
  }

  return product.variants
    .map((variant) => `${variant.name}: ${formatShortGhs(variant.price)}`)
    .join(' · ')
}

export function renderBackOfficeMenu({
  categories,
  menuItems,
  selectedCategoryId,
  searchQuery,
  isSaving,
}) {
  const availabilityTotals = getMenuAvailabilityTotals(menuItems)

  const visibleItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategoryId === 'all' || item.categoryId === selectedCategoryId

    const normalizedQuery = searchQuery.trim().toLowerCase()

    const matchesSearch =
      normalizedQuery === '' ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery)

    return matchesCategory && matchesSearch
  })

  return `
    <section class="back-office-menu" aria-labelledby="menu-management-title">
      <header class="back-office-dashboard__header">
        <div>
          <p class="back-office-dashboard__eyebrow">Luna catalogue</p>
          <h1 class="back-office-dashboard__title" id="menu-management-title">
            Menu & Items
          </h1>
          <p class="back-office-dashboard__subtitle">
            Manage product availability now. Product names, prices, variants, and images will be editable in the next step.
          </p>
        </div>
      </header>

      <section class="back-office-notice" role="status">
        <span class="back-office-notice__mark" aria-hidden="true">i</span>
        <p>
          Changes made here are stored locally on this device. Historical orders keep their original item and price details.
        </p>
      </section>

      <section class="menu-management-summary" aria-label="Menu summary">
        <article class="menu-management-summary__card">
          <span>Total menu items</span>
          <strong>${menuItems.length}</strong>
        </article>

        <article class="menu-management-summary__card menu-management-summary__card--available">
          <span>Available now</span>
          <strong>${availabilityTotals.available}</strong>
        </article>

        <article class="menu-management-summary__card menu-management-summary__card--sold-out">
          <span>Sold out</span>
          <strong>${availabilityTotals.soldOut}</strong>
        </article>
      </section>

      <section class="menu-management-layout">
        <aside class="menu-category-panel">
          <p class="menu-category-panel__eyebrow">Categories</p>
          <h2 class="menu-category-panel__title">Menu sections</h2>

          <div class="menu-category-list">
            <button
              class="menu-category-button ${
                selectedCategoryId === 'all'
                  ? 'menu-category-button--active'
                  : ''
              }"
              type="button"
              data-menu-category="all"
              aria-pressed="${selectedCategoryId === 'all'}"
            >
              <span>All items</span>
              <strong>${menuItems.length}</strong>
            </button>

            ${categories
              .filter((category) => category.id !== 'all')
              .map(
                (category) => `
                  <button
                    class="menu-category-button ${
                      selectedCategoryId === category.id
                        ? 'menu-category-button--active'
                        : ''
                    }"
                    type="button"
                    data-menu-category="${category.id}"
                    aria-pressed="${selectedCategoryId === category.id}"
                  >
                    <span>${escapeHtml(category.name)}</span>
                    <strong>${getMenuCategoryProductCount(
                      menuItems,
                      category.id,
                    )}</strong>
                  </button>
                `,
              )
              .join('')}
          </div>
        </aside>

        <section class="menu-items-panel" aria-labelledby="menu-items-title">
          <header class="menu-items-panel__header">
            <div>
              <p class="menu-items-panel__eyebrow">Products</p>
              <h2 class="menu-items-panel__title" id="menu-items-title">
                ${visibleItems.length} item${
                  visibleItems.length === 1 ? '' : 's'
                } shown
              </h2>
            </div>

            <label class="menu-management-search">
              <span class="menu-management-search__mark" aria-hidden="true"></span>
              <input
                type="search"
                value="${escapeHtml(searchQuery)}"
                placeholder="Search menu items"
                aria-label="Search menu items"
                data-menu-search
                autocomplete="off"
                spellcheck="false"
              />
            </label>
          </header>

          <div class="menu-items-list">
            ${
              visibleItems.length > 0
                ? visibleItems
                    .map(
                      (product) => `
                        <article class="menu-item-row ${
                          product.isAvailable
                            ? ''
                            : 'menu-item-row--sold-out'
                        }">
                          <img
                            class="menu-item-row__image"
                            src="${product.image}"
                            alt=""
                            width="640"
                            height="640"
                            loading="lazy"
                            data-fallback-image="${product.fallbackImage}"
                          />

                          <div class="menu-item-row__main">
                            <div class="menu-item-row__heading">
                              <div>
                                <h3 class="menu-item-row__name">
                                  ${escapeHtml(product.name)}
                                </h3>

                                <p class="menu-item-row__description">
                                  ${
                                    product.description
                                      ? escapeHtml(product.description)
                                      : 'No description added.'
                                  }
                                </p>
                              </div>

                              <span class="menu-item-row__price">
                                ${
                                  product.variants.length > 1
                                    ? `From ${formatShortGhs(
                                        getProductStartingPrice(product),
                                      )}`
                                    : formatShortGhs(product.variants[0].price)
                                }
                              </span>
                            </div>

                            <p class="menu-item-row__variants">
                              ${escapeHtml(renderVariantSummary(product))}
                            </p>

                            <div class="menu-item-row__meta">
                              <span>${getMenuImageStatus(product)}</span>
                              <span>${
                                product.modifierGroupIds.length > 0
                                  ? `${product.modifierGroupIds.length} modifier group${
                                      product.modifierGroupIds.length === 1
                                        ? ''
                                        : 's'
                                    }`
                                  : 'No modifiers'
                              }</span>
                            </div>
                          </div>

                          <div class="menu-item-row__availability">
                            <span
                              class="menu-availability-badge ${
                                product.isAvailable
                                  ? 'menu-availability-badge--available'
                                  : 'menu-availability-badge--sold-out'
                              }"
                            >
                              ${
                                product.isAvailable
                                  ? 'Available'
                                  : 'Sold out'
                              }
                            </span>

                            <button
                              class="menu-availability-toggle"
                              type="button"
                              data-toggle-product-availability="${product.id}"
                              aria-pressed="${product.isAvailable}"
                              ${isSaving ? 'disabled' : ''}
                            >
                              ${
                                product.isAvailable
                                  ? 'Mark sold out'
                                  : 'Make available'
                              }
                            </button>
                          </div>
                        </article>
                      `,
                    )
                    .join('')
                : `
                  <section class="menu-items-empty-state">
                    <div class="menu-items-empty-state__mark" aria-hidden="true"></div>
                    <h3>No menu items found</h3>
                    <p>Try another search word or choose a different category.</p>
                  </section>
                `
            }
          </div>
        </section>
      </section>
    </section>
  `
}