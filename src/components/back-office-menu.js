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
  showArchived,
}) {
  const availabilityTotals = getMenuAvailabilityTotals(menuItems, {
    includeArchived: true,
  })

  const visibleItems = menuItems.filter((item) => {
    const matchesArchiveState = showArchived
      ? item.isArchived
      : !item.isArchived

    const matchesCategory =
      selectedCategoryId === 'all' || item.categoryId === selectedCategoryId

    const normalizedQuery = searchQuery.trim().toLowerCase()

    const matchesSearch =
      normalizedQuery === '' ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery)

    return matchesArchiveState && matchesCategory && matchesSearch
  })

  const categoryItemCount = (categoryId) =>
    menuItems.filter((item) => {
      const matchesCategory =
        categoryId === 'all' || item.categoryId === categoryId

      return matchesCategory && (showArchived ? item.isArchived : !item.isArchived)
    }).length

  return `
    <section class="back-office-menu" aria-labelledby="menu-management-title">
      <header class="back-office-dashboard__header">
        <div>
          <p class="back-office-dashboard__eyebrow">Luna catalogue</p>
          <h1 class="back-office-dashboard__title" id="menu-management-title">
            Menu & Items
          </h1>
          <p class="back-office-dashboard__subtitle">
            Create, edit, archive, restore, and manage items used by the Staff POS.
          </p>
        </div>

        <button
          class="back-office-refresh"
          type="button"
          data-create-product
          ${isSaving ? 'disabled' : ''}
        >
          Add new item
        </button>
      </header>

      <section class="back-office-notice" role="status">
        <span class="back-office-notice__mark" aria-hidden="true">i</span>
        <p>
          Changes are stored locally on this device. Archiving hides an item from
          future POS orders but never changes completed historical orders or receipts.
        </p>
      </section>

      <section class="menu-management-summary" aria-label="Menu summary">
        <article class="menu-management-summary__card">
          <span>Active menu items</span>
          <strong>${availabilityTotals.available + availabilityTotals.soldOut}</strong>
        </article>

        <article class="menu-management-summary__card menu-management-summary__card--available">
          <span>Available now</span>
          <strong>${availabilityTotals.available}</strong>
        </article>

        <article class="menu-management-summary__card menu-management-summary__card--sold-out">
          <span>Sold out</span>
          <strong>${availabilityTotals.soldOut}</strong>
        </article>

        <article class="menu-management-summary__card menu-management-summary__card--archived">
          <span>Archived items</span>
          <strong>${availabilityTotals.archived}</strong>
        </article>
      </section>

      <section class="menu-management-layout">
        <aside class="menu-category-panel">
          <p class="menu-category-panel__eyebrow">
            ${showArchived ? 'Archived categories' : 'Active categories'}
          </p>

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
              <strong>${categoryItemCount('all')}</strong>
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
                    <strong>${categoryItemCount(category.id)}</strong>
                  </button>
                `,
              )
              .join('')}
          </div>
        </aside>

        <section class="menu-items-panel" aria-labelledby="menu-items-title">
          <header class="menu-items-panel__header">
            <div>
              <p class="menu-items-panel__eyebrow">
                ${showArchived ? 'Archived products' : 'Active products'}
              </p>

              <h2 class="menu-items-panel__title" id="menu-items-title">
                ${visibleItems.length} item${
                  visibleItems.length === 1 ? '' : 's'
                } shown
              </h2>
            </div>

            <div class="menu-items-panel__actions">
              <button
                class="menu-archive-filter ${
                  showArchived ? 'menu-archive-filter--active' : ''
                }"
                type="button"
                data-toggle-archived
                aria-pressed="${showArchived}"
              >
                ${showArchived ? 'Show active' : 'Show archived'}
              </button>

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
            </div>
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
                        } ${
                          product.isArchived
                            ? 'menu-item-row--archived'
                            : ''
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
                              ${
                                product.isCustomProduct
                                  ? '<span>Locally created</span>'
                                  : ''
                              }
                            </div>
                          </div>

                          <div class="menu-item-row__availability">
                            ${
                              product.isArchived
                                ? `
                                  <span class="menu-availability-badge menu-availability-badge--archived">
                                    Archived
                                  </span>

                                  <button
                                    class="menu-availability-toggle"
                                    type="button"
                                    data-restore-product="${product.id}"
                                    ${isSaving ? 'disabled' : ''}
                                  >
                                    Restore item
                                  </button>
                                `
                                : `
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
                                `
                            }

                            <button
                              class="menu-item-row__edit"
                              type="button"
                              data-edit-product="${product.id}"
                              ${isSaving ? 'disabled' : ''}
                            >
                              Edit item
                            </button>

                            ${
                              !product.isArchived
                                ? `
                                  <button
                                    class="menu-item-row__archive"
                                    type="button"
                                    data-archive-product="${product.id}"
                                    ${isSaving ? 'disabled' : ''}
                                  >
                                    Archive item
                                  </button>
                                `
                                : ''
                            }
                          </div>
                        </article>
                      `,
                    )
                    .join('')
                : `
                  <section class="menu-items-empty-state">
                    <div class="menu-items-empty-state__mark" aria-hidden="true"></div>
                    <h3>
                      ${
                        showArchived
                          ? 'No archived items found'
                          : 'No menu items found'
                      }
                    </h3>
                    <p>
                      ${
                        showArchived
                          ? 'Archived products will appear here.'
                          : 'Try another search word or choose a different category.'
                      }
                    </p>
                  </section>
                `
            }
          </div>
        </section>
      </section>
    </section>
  `
}