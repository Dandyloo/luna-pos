import { formatShortGhs } from '../utils/formatters.js'

export function renderItemCustomizationDialog(product, modifierGroups) {
  const hasMultipleVariants = product.variants.length > 1

  const variantOptions = product.variants
    .map(
      (variant, index) => `
        <label class="customization-option">
          <input
            type="radio"
            name="variant"
            value="${variant.id}"
            ${index === 0 ? 'checked' : ''}
          />
          <span class="customization-option__content">
            <span class="customization-option__name">${variant.name}</span>
            <span class="customization-option__price">
              ${formatShortGhs(variant.price)}
            </span>
          </span>
        </label>
      `,
    )
    .join('')

  const modifierSections = modifierGroups
    .map(
      (group) => `
        <fieldset class="customization-group">
          <legend class="customization-group__title">${group.name}</legend>

          <div class="customization-group__options">
            ${group.options
              .map(
                (option) => `
                  <label class="customization-option">
                    <input
                      type="${
                        group.selectionType === 'single' ? 'radio' : 'checkbox'
                      }"
                      name="modifier-${group.id}"
                      value="${option.id}"
                    />
                    <span class="customization-option__content">
                      <span class="customization-option__name">${option.name}</span>
                      <span class="customization-option__price">
                        ${
                          option.price === 0
                            ? 'Free'
                            : `+ ${formatShortGhs(option.price)}`
                        }
                      </span>
                    </span>
                  </label>
                `,
              )
              .join('')}
          </div>
        </fieldset>
      `,
    )
    .join('')

  return `
    <dialog class="customization-dialog" aria-labelledby="customization-title">
      <form class="customization-dialog__form" method="dialog">
        <header class="customization-dialog__header">
          <div>
            <p class="customization-dialog__eyebrow">Customize item</p>
            <h2 class="customization-dialog__title" id="customization-title">
              ${product.name}
            </h2>
          </div>

          <button
            class="icon-button"
            type="button"
            data-close-customization
            aria-label="Close item customization"
          >
            ×
          </button>
        </header>

        <div class="customization-dialog__body">
          ${
            hasMultipleVariants
              ? `
                <fieldset class="customization-group">
                  <legend class="customization-group__title">Choose size</legend>

                  <div class="customization-group__options">
                    ${variantOptions}
                  </div>
                </fieldset>
              `
              : ''
          }

          ${modifierSections}
        </div>

        <footer class="customization-dialog__footer">
          <button
            class="button button--secondary"
            type="button"
            data-close-customization
          >
            Cancel
          </button>

          <button
            class="button button--primary"
            type="submit"
            data-add-customized-item
          >
            Add to order
          </button>
        </footer>
      </form>
    </dialog>
  `
}