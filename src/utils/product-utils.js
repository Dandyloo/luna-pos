import { categories } from '../data/menu-data.js'

export function getProductStartingPrice(product) {
  return Math.min(...product.variants.map((variant) => variant.price))
}

export function getCategoryById(categoryId) {
  return categories.find((category) => category.id === categoryId)
}

export function getProductImageSource(product) {
  return product.image || product.fallbackImage
}

export function handleProductImageError(imageElement, fallbackImage) {
  imageElement.src = fallbackImage
  imageElement.onerror = null
}