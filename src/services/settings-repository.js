import { db } from './database.js'

const TAX_SETTINGS_ID = 'tax-settings'
const DISCOUNT_SETTINGS_ID = 'discount-settings'

export async function getTaxSettingsRecord() {
  return db.settings.get(TAX_SETTINGS_ID)
}

export async function saveTaxSettingsRecord(settings) {
  const record = {
    ...settings,
    id: TAX_SETTINGS_ID,
    updatedAt: new Date().toISOString(),
  }

  await db.settings.put(record)

  return record
}

export async function getDiscountSettingsRecord() {
  return db.settings.get(DISCOUNT_SETTINGS_ID)
}

export async function saveDiscountSettingsRecord(settings) {
  const record = {
    ...settings,
    id: DISCOUNT_SETTINGS_ID,
    updatedAt: new Date().toISOString(),
  }

  await db.settings.put(record)

  return record
}