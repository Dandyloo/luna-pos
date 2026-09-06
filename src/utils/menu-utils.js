export function createEffectiveMenu(defaultMenuItems, menuOverrides) {
  const overridesByProductId = new Map(
    menuOverrides.map((override) => [override.id, override]),
  )

  return defaultMenuItems.map((product) => {
    const override = overridesByProductId.get(product.id)

    if (!override) {
      return product
    }

    return {
      ...product,
      ...override,
      variants: override.variants || product.variants,
    }
  })
}

export function getMenuCategoryProductCount(menuItems, categoryId) {
  return menuItems.filter((item) => item.categoryId === categoryId).length
}

export function getMenuAvailabilityTotals(menuItems) {
  return menuItems.reduce(
    (totals, item) => {
      if (item.isAvailable) {
        totals.available += 1
      } else {
        totals.soldOut += 1
      }

      return totals
    },
    { available: 0, soldOut: 0 },
  )
}

export function getMenuImageStatus(product) {
  if (!product.image) {
    return 'No image path'
  }

  if (product.image.includes('LUNA-BRAND-GUILD')) {
    return 'Brand fallback'
  }

  return 'Product image path set'
}