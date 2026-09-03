import { formatShortGhs } from '../utils/formatters.js'
import { getProductStartingPrice } from '../utils/product-utils.js'

export function renderProductCard(product) {
  const startingPrice = getProductStartingPrice(product)
  const hasMultipleVariants = product.variants.length > 1

  const priceLabel = hasMultipleVariants
    ? `From ${formatShortGhs(startingPrice)}`
    : formatShortGhs(startingPrice)

  const availabilityLabel = product.isAvailable ? 'Available' : 'Sold out'

  return `
    <button
      class="product-card ${product.isAvailable ? '' : 'product-card--sold-out'}"
      type="button"
      data-product-id="${product.id}"
      ${product.isAvailable ? '' : 'disabled'}
      aria-label="Add ${product.name} to the current order"
    >
      <span class="product-card__image-wrap">
        <img
          class="product-card__image"
          src="${product.image}"
          alt="${product.name}"
          data-fallback-image="${product.fallbackImage}"
        />

        ${
          product.isPopular
            ? '<span class="product-card__popular">Popular</span>'
            : ''
        }

        ${
          !product.isAvailable
            ? '<span class="product-card__availability">Sold out</span>'
            : ''
        }
      </span>

      <span class="product-card__content">
        <span class="product-card__name">${product.name}</span>

        <span class="product-card__details">
          ${
            hasMultipleVariants
              ? `${product.variants.length} sizes available`
              : product.variants[0].name
          }
        </span>

        <span class="product-card__footer">
          <span class="product-card__price">${priceLabel}</span>
          <span class="product-card__add-icon" aria-hidden="true">+</span>
        </span>
      </span>
    </button>
  `
}

export function renderNoProductsState() {
  return `
    <section class="no-products-state" aria-live="polite">
      <div class="no-products-state__icon" aria-hidden="true">⌕</div>
      <h3 class="no-products-state__title">No menu items found</h3>
      <p class="no-products-state__copy">
        Try another search word or choose a different category.
      </p>
    </section>
  `
}