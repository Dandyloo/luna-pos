import { menuItems as defaultMenuItems } from '../data/menu-data.js'
import {
  getAllMenuOverrides,
  saveMenuOverride,
} from '../services/menu-repository.js'
import { createEffectiveMenu } from '../utils/menu-utils.js'

const menuState = {
  overrides: [],
}

export function getEffectiveMenuItems() {
  return createEffectiveMenu(defaultMenuItems, menuState.overrides)
}

export function getMenuOverrides() {
  return menuState.overrides
}

export async function loadMenuOverrides() {
  menuState.overrides = await getAllMenuOverrides()
  return menuState.overrides
}

export async function saveMenuOverrideAndUpdateState(override) {
  const savedOverride = await saveMenuOverride(override)

  const existingOverrideIndex = menuState.overrides.findIndex(
    (item) => item.id === savedOverride.id,
  )

  if (existingOverrideIndex >= 0) {
    menuState.overrides = menuState.overrides.map((item) =>
      item.id === savedOverride.id ? savedOverride : item,
    )
  } else {
    menuState.overrides = [...menuState.overrides, savedOverride]
  }

  return savedOverride
}