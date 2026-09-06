export function createEffectiveMenu(defaultMenuItems, menuOverrides) {
  const defaultProductIds = new Set(
    defaultMenuItems.map((product) => product.id),
  )

  const overridesByProductId = new Map(
    menuOverrides
      .filter((override) => defaultProductIds.has(override.id))
      .map((override) => [override.id, override]),
  )

  const updatedDefaultProducts = defaultMenuItems.map((product) => {
    const override = overridesByProductId.get(product.id)

    if (!override) {
      return {
        ...product,
        isArchived: false,
      }
    }

    return {
      ...product,
      ...override,
      variants: override.variants || product.variants,
      isArchived: Boolean(override.isArchived),
    }
  })

  const locallyCreatedProducts = menuOverrides
    .filter((override) => override.isCustomProduct === true)
    .map((product) => ({
      ...product,
      isArchived: Boolean(product.isArchived),
    }))

  return [...updatedDefaultProducts, ...locallyCreatedProducts]
}

export function getMenuCategoryProductCount(
  menuItems,
  categoryId,
  { includeArchived = false } = {},
) {
  return menuItems.filter(
    (item) =>
      item.categoryId === categoryId &&
      (includeArchived || !item.isArchived),
  ).length
}

export function getMenuAvailabilityTotals(
  menuItems,
  { includeArchived = false } = {},
) {
  return menuItems.reduce(
    (totals, item) => {
      if (item.isArchived && !includeArchived) {
        return totals
      }

      if (item.isArchived) {
        totals.archived += 1
      } else if (item.isAvailable) {
        totals.available += 1
      } else {
        totals.soldOut += 1
      }

      return totals
    },
    { available: 0, soldOut: 0, archived: 0 },
  )
}

export function getMenuImageStatus(product) {
  if (!product.image) {
    return 'No image path'
  }

  if (product.image.startsWith('data:image/')) {
    return 'Local image saved'
  }

  if (product.image.includes('LUNA-BRAND-GUILD')) {
    return 'Brand fallback'
  }

  return 'Product image path set'
}