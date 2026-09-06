function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function getPreviewImageSource(formData) {
  return formData.image || formData.fallbackImage || ''
}

function renderVariantEditor(variant, index, canRemove) {
  return `
    <section class="product-edit-variant" data-variant-index="${index}">
      <div class="product-edit-variant__header">
        <p class="product-edit-variant__label">Variant ${index + 1}</p>

        ${
          canRemove
            ? `
              <button
                class="product-edit-variant__remove"
                type="button"
                data-remove-variant="${index}"
              >
                Remove
              </button>
            `
            : ''
        }
      </div>

      <div class="product-edit-variant__fields">
        <label class="product-edit-field">
          <span>Name</span>
          <input
            type="text"
            value="${escapeHtml(variant.name)}"
            data-variant-name="${index}"
            maxlength="40"
            required
          />
        </label>

        <label class="product-edit-field">
          <span>Price (GH₵)</span>
          <input
            type="number"
            value="${variant.price}"
            data-variant-price="${index}"
            min="0"
            step="0.01"
            inputmode="decimal"
            required
          />
        </label>
      </div>
    </section>
  `
}

export function renderProductEditDialog({
  product,
  categories,
  draft,
  errors,
  mode = 'edit',
}) {
  const formData = draft || product
  const variants = formData.variants || []
  const errorMessage = errors?.form || ''
  const imagePreviewSource = getPreviewImageSource(formData)
  const isCreateMode = mode === 'create'

  return `
    <dialog class="product-edit-dialog" aria-labelledby="product-edit-title">
      <form class="product-edit-dialog__form" novalidate>
        <header class="product-edit-dialog__header">
          <div>
            <p class="product-edit-dialog__eyebrow">
              ${isCreateMode ? 'New menu item' : 'Menu item editor'}
            </p>

            <h2 class="product-edit-dialog__title" id="product-edit-title">
              ${
                isCreateMode
                  ? 'Add menu item'
                  : `Edit ${escapeHtml(product.name)}`
              }
            </h2>
          </div>

          <button
            class="icon-button"
            type="button"
            data-close-product-editor
            aria-label="Close product editor"
          >
            ×
          </button>
        </header>

        <div class="product-edit-dialog__body">
          ${
            errorMessage
              ? `
                <p class="product-edit-dialog__error" role="alert">
                  ${escapeHtml(errorMessage)}
                </p>
              `
              : ''
          }

          <div class="product-edit-grid">
            <label class="product-edit-field product-edit-field--full">
              <span>Product name</span>
              <input
                type="text"
                value="${escapeHtml(formData.name)}"
                data-product-field="name"
                maxlength="80"
                placeholder="Example: Luna Strawberry Waffle"
                required
              />
              ${
                errors?.name
                  ? `<small class="product-edit-field__error">${escapeHtml(
                      errors.name,
                    )}</small>`
                  : ''
              }
            </label>

            <label class="product-edit-field">
              <span>Category</span>
              <select data-product-field="categoryId" required>
                ${categories
                  .filter((category) => category.id !== 'all')
                  .map(
                    (category) => `
                      <option
                        value="${category.id}"
                        ${
                          formData.categoryId === category.id
                            ? 'selected'
                            : ''
                        }
                      >
                        ${escapeHtml(category.name)}
                      </option>
                    `,
                  )
                  .join('')}
              </select>
              ${
                errors?.categoryId
                  ? `<small class="product-edit-field__error">${escapeHtml(
                      errors.categoryId,
                    )}</small>`
                  : ''
              }
            </label>

            <label class="product-edit-field">
              <span>Availability</span>
              <select data-product-field="isAvailable">
                <option value="true" ${
                  formData.isAvailable ? 'selected' : ''
                }>
                  Available
                </option>
                <option value="false" ${
                  !formData.isAvailable ? 'selected' : ''
                }>
                  Sold out
                </option>
              </select>
            </label>

            <section class="product-image-editor product-edit-field--full">
              <div class="product-image-editor__header">
                <div>
                  <p class="product-image-editor__label">Product image</p>
                  <p class="product-image-editor__hint">
                    Use a square 640 × 640 image. JPG, PNG, and WebP are accepted.
                  </p>
                </div>

                <span class="product-image-editor__size-note">
                  Maximum 2 MB
                </span>
              </div>

              <div class="product-image-editor__content">
                <div class="product-image-editor__preview-wrap">
                  ${
                    imagePreviewSource
                      ? `
                        <img
                          class="product-image-editor__preview"
                          src="${escapeHtml(imagePreviewSource)}"
                          alt="Product image preview"
                          width="640"
                          height="640"
                          data-image-preview
                        />
                      `
                      : `
                        <div
                          class="product-image-editor__placeholder"
                          data-image-preview-placeholder
                          aria-hidden="true"
                        >
                          No image
                        </div>
                      `
                  }
                </div>

                <div class="product-image-editor__controls">
                  <label class="button button--secondary product-image-editor__upload-button">
                    Choose image
                    <input
                      class="product-image-editor__file-input"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      data-product-image-file
                    />
                  </label>

                  <button
                    class="product-image-editor__remove-button"
                    type="button"
                    data-remove-product-image
                    ${formData.image ? '' : 'disabled'}
                  >
                    Remove selected image
                  </button>

                  <p class="product-image-editor__status" data-image-upload-status>
                    ${
                      formData.image?.startsWith('data:image/')
                        ? 'A local image is selected and will save with this product.'
                        : formData.image
                          ? 'This product uses an image path.'
                          : 'No custom image selected.'
                    }
                  </p>
                </div>
              </div>

              ${
                errors?.imageUpload
                  ? `<small class="product-edit-field__error">${escapeHtml(
                      errors.imageUpload,
                    )}</small>`
                  : ''
              }
            </section>

            <label class="product-edit-field product-edit-field--full">
              <span>Image path</span>
              <input
                type="text"
                value="${escapeHtml(
                  formData.image?.startsWith('data:image/')
                    ? ''
                    : formData.image || '',
                )}"
                data-product-field="image"
                placeholder="/images/products/category/product-name.jpg"
                maxlength="200"
              />
              <small class="product-edit-field__hint">
                Optional for images placed in public/images. Choosing an image file above takes priority.
              </small>
              ${
                errors?.image
                  ? `<small class="product-edit-field__error">${escapeHtml(
                      errors.image,
                    )}</small>`
                  : ''
              }
            </label>

            <label class="product-edit-field product-edit-field--full">
              <span>Description</span>
              <textarea
                rows="3"
                data-product-field="description"
                maxlength="250"
                placeholder="Optional short description"
              >${escapeHtml(formData.description || '')}</textarea>
              ${
                errors?.description
                  ? `<small class="product-edit-field__error">${escapeHtml(
                      errors.description,
                    )}</small>`
                  : ''
              }
            </label>
          </div>

          <section class="product-edit-variants">
            <header class="product-edit-variants__header">
              <div>
                <h3>Variants and prices</h3>
                <p>
                  Use one Standard variant for fixed-price items. Add more for
                  sizes such as 500ML and 700ML.
                </p>
              </div>

              <button
                class="button button--secondary product-edit-variants__add"
                type="button"
                data-add-variant
              >
                Add variant
              </button>
            </header>

            <div class="product-edit-variants__list">
              ${variants
                .map((variant, index) =>
                  renderVariantEditor(variant, index, variants.length > 1),
                )
                .join('')}
            </div>

            ${
              errors?.variants
                ? `<p class="product-edit-dialog__error" role="alert">${escapeHtml(
                    errors.variants,
                  )}</p>`
                : ''
            }
          </section>
        </div>

        <footer class="product-edit-dialog__footer">
          <button
            class="button button--secondary"
            type="button"
            data-close-product-editor
          >
            Cancel
          </button>

          <button
            class="button button--primary"
            type="submit"
            data-save-product
          >
            ${isCreateMode ? 'Create item' : 'Save changes'}
          </button>
        </footer>
      </form>
    </dialog>
  `
}