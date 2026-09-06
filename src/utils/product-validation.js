function normalizeText(value) {
  return String(value || '').trim()
}

function createVariantId(name, index) {
  const normalizedName = normalizeText(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalizedName || `variant-${index + 1}`
}

export function validateProductDraft(draft, categories) {
  const errors = {}
  const validCategoryIds = categories
    .filter((category) => category.id !== 'all')
    .map((category) => category.id)

  const name = normalizeText(draft.name)
  const description = normalizeText(draft.description)
  const image = normalizeText(draft.image)

  if (name.length < 2 || name.length > 80) {
    errors.name = 'Product name must be between 2 and 80 characters.'
  }

  if (!validCategoryIds.includes(draft.categoryId)) {
    errors.categoryId = 'Choose a valid Luna menu category.'
  }

  if (description.length > 250) {
    errors.description = 'Description cannot be more than 250 characters.'
  }

  if (image && !image.startsWith('/images/')) {
    errors.image = 'Image path must begin with /images/.'
  }

  if (!Array.isArray(draft.variants) || draft.variants.length === 0) {
    errors.variants = 'At least one variant is required.'
  } else {
    const variantNames = new Set()

    draft.variants.forEach((variant, index) => {
      const variantName = normalizeText(variant.name)
      const numericPrice = Number(variant.price)
      const normalizedVariantName = variantName.toLowerCase()

      if (variantName.length < 2 || variantName.length > 40) {
        errors.variants = `Variant ${index + 1} needs a name between 2 and 40 characters.`
      }

      if (variantNames.has(normalizedVariantName)) {
        errors.variants = 'Variant names must be unique for this product.'
      }

      variantNames.add(normalizedVariantName)

      if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        errors.variants = `Variant ${index + 1} must have a valid price of GH₵0 or more.`
      }
    })
  }

  return errors
}

export function normalizeProductDraft(draft) {
  return {
    ...draft,
    name: normalizeText(draft.name),
    description: normalizeText(draft.description),
    image: normalizeText(draft.image),
    isAvailable: Boolean(draft.isAvailable),
    variants: draft.variants.map((variant, index) => ({
      ...variant,
      id: variant.id || createVariantId(variant.name, index),
      name: normalizeText(variant.name),
      price: Number(Number(variant.price).toFixed(2)),
      cost: variant.cost ?? null,
    })),
  }
}