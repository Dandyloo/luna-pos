import { renderBackOfficeDashboard } from '../components/back-office-dashboard.js'
import { renderBackOfficeMenu } from '../components/back-office-menu.js'
import { renderProductEditDialog } from '../components/product-edit-dialog.js'
import { categories } from '../data/menu-data.js'
import { getAllOrders } from '../services/order-repository.js'
import {
  getEffectiveMenuItems,
  getMenuOverrides,
  loadMenuOverrides,
  saveMenuOverrideAndUpdateState,
} from '../state/menu-state.js'
import { getAppUrl } from '../modules/app-router.js'
import { handleProductImageError } from '../utils/product-utils.js'
import {
  normalizeProductDraft,
  validateProductDraft,
} from '../utils/product-validation.js'
import { getDashboardReport } from '../utils/report-utils.js'

const MAX_IMAGE_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

export const backOfficeState = {
  activeView: 'dashboard',
  orders: [],
  selectedCategoryId: 'all',
  menuSearchQuery: '',
  isLoading: false,
  isSavingMenu: false,
  error: '',
  editingProductId: null,
  productEditDraft: null,
  productEditErrors: {},
}

const backOfficeNavigation = [
  { id: 'dashboard', number: '01', label: 'Dashboard' },
  { id: 'orders', number: '02', label: 'Orders' },
  { id: 'sales', number: '03', label: 'Sales & Reports' },
  { id: 'items', number: '04', label: 'Menu & Items' },
  { id: 'settings', number: '05', label: 'Settings' },
]

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function getEditingProduct() {
  if (!backOfficeState.editingProductId) {
    return null
  }

  return getEffectiveMenuItems().find(
    (product) => product.id === backOfficeState.editingProductId,
  )
}

function createEditableProductDraft(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description || '',
    categoryId: product.categoryId,
    image: product.image || '',
    fallbackImage: product.fallbackImage,
    isAvailable: product.isAvailable,
    isPopular: product.isPopular,
    modifierGroupIds: [...product.modifierGroupIds],
    variants: product.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      price: variant.price,
      cost: variant.cost ?? null,
    })),
  }
}

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

function renderActiveProductEditor() {
  const product = getEditingProduct()

  if (!product || !backOfficeState.productEditDraft) {
    return ''
  }

  return renderProductEditDialog({
    product,
    categories,
    draft: backOfficeState.productEditDraft,
    errors: backOfficeState.productEditErrors,
  })
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

    ${renderActiveProductEditor()}
  `

  attachBackOfficeEventListeners(appElement)

  if (backOfficeState.editingProductId) {
    const dialog = document.querySelector('.product-edit-dialog')

    if (dialog && !dialog.open) {
      dialog.showModal()
    }
  }
}

function collectProductDraftFromDialog() {
  const dialog = document.querySelector('.product-edit-dialog')

  if (!dialog || !backOfficeState.productEditDraft) {
    return null
  }

  const getFieldValue = (fieldName) =>
    dialog.querySelector(`[data-product-field="${fieldName}"]`)?.value || ''

  const variantSections = [
    ...dialog.querySelectorAll('[data-variant-index]'),
  ]

  const typedImagePath = getFieldValue('image').trim()
  const selectedImage =
    backOfficeState.productEditDraft.image?.startsWith('data:image/')
      ? backOfficeState.productEditDraft.image
      : typedImagePath

  return {
    ...backOfficeState.productEditDraft,
    name: getFieldValue('name'),
    description: getFieldValue('description'),
    categoryId: getFieldValue('categoryId'),
    image: selectedImage,
    isAvailable: getFieldValue('isAvailable') === 'true',
    variants: variantSections.map((section, index) => ({
      id:
        backOfficeState.productEditDraft.variants[index]?.id ||
        `new-variant-${index + 1}`,
      name: section.querySelector(`[data-variant-name="${index}"]`)?.value || '',
      price:
        section.querySelector(`[data-variant-price="${index}"]`)?.value || '',
      cost: backOfficeState.productEditDraft.variants[index]?.cost ?? null,
    })),
  }
}

function updateProductEditDraftFromDialog() {
  const currentDraft = collectProductDraftFromDialog()

  if (currentDraft) {
    backOfficeState.productEditDraft = currentDraft
  }
}

function openProductEditor(appElement, productId) {
  const product = getEffectiveMenuItems().find(
    (item) => item.id === productId,
  )

  if (!product || backOfficeState.isSavingMenu) {
    return
  }

  backOfficeState.editingProductId = product.id
  backOfficeState.productEditDraft = createEditableProductDraft(product)
  backOfficeState.productEditErrors = {}
  renderBackOffice(appElement)
}

function closeProductEditor(appElement) {
  backOfficeState.editingProductId = null
  backOfficeState.productEditDraft = null
  backOfficeState.productEditErrors = {}
  renderBackOffice(appElement)
}

function addVariantToDraft(appElement) {
  updateProductEditDraftFromDialog()

  if (!backOfficeState.productEditDraft) {
    return
  }

  backOfficeState.productEditDraft.variants = [
    ...backOfficeState.productEditDraft.variants,
    {
      id: '',
      name: '',
      price: 0,
      cost: null,
    },
  ]

  renderBackOffice(appElement)
}

function removeVariantFromDraft(appElement, variantIndex) {
  updateProductEditDraftFromDialog()

  if (
    !backOfficeState.productEditDraft ||
    backOfficeState.productEditDraft.variants.length <= 1
  ) {
    return
  }

  backOfficeState.productEditDraft.variants =
    backOfficeState.productEditDraft.variants.filter(
      (_, index) => index !== Number(variantIndex),
    )

  renderBackOffice(appElement)
}

function validateImageFile(file) {
  if (!file) {
    return 'Choose an image file first.'
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return 'Use a JPG, PNG, or WebP image file.'
  }

  if (file.size > MAX_IMAGE_FILE_SIZE) {
    return 'Image must be 2 MB or smaller. Resize or compress it and try again.'
  }

  return ''
}

function readImageFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Image data could not be read.'))
    })

    reader.addEventListener('error', () => {
      reject(new Error('Image file could not be read.'))
    })

    reader.readAsDataURL(file)
  })
}

async function handleProductImageSelection(appElement, file) {
  const imageError = validateImageFile(file)

  if (imageError) {
    backOfficeState.productEditErrors = {
      ...backOfficeState.productEditErrors,
      imageUpload: imageError,
    }
    renderBackOffice(appElement)
    return
  }

  if (!backOfficeState.productEditDraft) {
    return
  }

  try {
    const imageDataUrl = await readImageFileAsDataUrl(file)

    backOfficeState.productEditDraft = {
      ...backOfficeState.productEditDraft,
      image: imageDataUrl,
    }

    backOfficeState.productEditErrors = {
      ...backOfficeState.productEditErrors,
      imageUpload: '',
      image: '',
    }

    renderBackOffice(appElement)
  } catch (error) {
    console.error('Failed to read selected image:', error)
    backOfficeState.productEditErrors = {
      ...backOfficeState.productEditErrors,
      imageUpload: 'Image could not be read. Please choose another file.',
    }
    renderBackOffice(appElement)
  }
}

function removeSelectedProductImage(appElement) {
  updateProductEditDraftFromDialog()

  if (!backOfficeState.productEditDraft) {
    return
  }

  const effectiveProduct = getEffectiveMenuItems().find(
    (product) => product.id === backOfficeState.productEditDraft.id,
  )

  backOfficeState.productEditDraft = {
    ...backOfficeState.productEditDraft,
    image: effectiveProduct?.fallbackImage || '',
  }

  backOfficeState.productEditErrors = {
    ...backOfficeState.productEditErrors,
    imageUpload: '',
    image: '',
  }

  renderBackOffice(appElement)
}

async function saveProductEdits(appElement) {
  const rawDraft = collectProductDraftFromDialog()

  if (!rawDraft || backOfficeState.isSavingMenu) {
    return
  }

  const normalizedDraft = normalizeProductDraft(rawDraft)
  const errors = validateProductDraft(normalizedDraft, categories)

  if (Object.keys(errors).length > 0) {
    backOfficeState.productEditDraft = rawDraft
    backOfficeState.productEditErrors = errors
    renderBackOffice(appElement)
    return
  }

  backOfficeState.isSavingMenu = true
  backOfficeState.error = ''
  backOfficeState.productEditErrors = {}
  renderBackOffice(appElement)

  try {
    const existingOverride =
      getMenuOverrides().find(
        (override) => override.id === normalizedDraft.id,
      ) || {}

    const updatedOverride = {
      ...existingOverride,
      ...normalizedDraft,
      id: normalizedDraft.id,
      updatedAt: new Date().toISOString(),
    }

    await saveMenuOverrideAndUpdateState(updatedOverride)

    backOfficeState.editingProductId = null
    backOfficeState.productEditDraft = null
    backOfficeState.productEditErrors = {}
  } catch (error) {
    console.error('Failed to save product edits:', error)
    backOfficeState.productEditErrors = {
      form: 'Product changes could not be saved. Please try again.',
    }
  } finally {
    backOfficeState.isSavingMenu = false
    renderBackOffice(appElement)
  }
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
        toggleProductAvailability(
          appElement,
          button.dataset.toggleProductAvailability,
        )
      })
    })

  appElement.querySelectorAll('[data-edit-product]').forEach((button) => {
    button.addEventListener('click', () => {
      openProductEditor(appElement, button.dataset.editProduct)
    })
  })

  document.querySelectorAll('[data-close-product-editor]').forEach((button) => {
    button.addEventListener('click', () => {
      closeProductEditor(appElement)
    })
  })

  document.querySelector('[data-add-variant]')?.addEventListener('click', () => {
    addVariantToDraft(appElement)
  })

  document.querySelectorAll('[data-remove-variant]').forEach((button) => {
    button.addEventListener('click', () => {
      removeVariantFromDraft(appElement, button.dataset.removeVariant)
    })
  })

  document
    .querySelector('[data-product-image-file]')
    ?.addEventListener('change', (event) => {
      handleProductImageSelection(appElement, event.target.files?.[0])
    })

  document
    .querySelector('[data-remove-product-image]')
    ?.addEventListener('click', () => {
      removeSelectedProductImage(appElement)
    })

  document
    .querySelector('[data-save-product]')
    ?.addEventListener('click', (event) => {
      event.preventDefault()
      saveProductEdits(appElement)
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
      getMenuOverrides().find((override) => override.id === productId) || {}

    const updatedOverride = {
      ...previousOverride,
      id: product.id,
      isAvailable: !product.isAvailable,
      updatedAt: new Date().toISOString(),
    }

    await saveMenuOverrideAndUpdateState(updatedOverride)
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
    const [orders] = await Promise.all([
      getAllOrders(),
      loadMenuOverrides(),
    ])

    backOfficeState.orders = orders
  } catch (error) {
    console.error('Failed to load Back Office data:', error)
    backOfficeState.error =
      'Back Office data could not be loaded from this device. Please refresh and try again.'
  } finally {
    backOfficeState.isLoading = false
    renderBackOffice(appElement)
  }
}