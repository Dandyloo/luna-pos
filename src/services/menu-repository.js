import { db } from './database.js'

export async function getAllMenuOverrides() {
  return db.menuOverrides.toArray()
}

export async function getMenuOverride(productId) {
  return db.menuOverrides.get(productId)
}

export async function saveMenuOverride(override) {
  await db.menuOverrides.put(override)
  return override
}