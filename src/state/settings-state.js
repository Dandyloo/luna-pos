import {
  getDiscountSettingsRecord,
  getTaxSettingsRecord,
  saveDiscountSettingsRecord,
  saveTaxSettingsRecord,
} from '../services/settings-repository.js'

const defaultTaxSettings = {
  id: 'tax-settings',
  name: 'VAT',
  rate: 0.2,
  isGloballyEnabled: true,
  isEnabledByDefault: false,
  calculationType: 'exclusive',
}

const defaultDiscountSettings = {
  id: 'discount-settings',
  isPercentageEnabled: true,
  isFixedAmountEnabled: true,
  maxPercentage: 100,
  maxFixedAmount: null,
}

let taxSettings = { ...defaultTaxSettings }
let discountSettings = { ...defaultDiscountSettings }

export function getTaxSettings() {
  return { ...taxSettings }
}

export function getDiscountSettings() {
  return { ...discountSettings }
}

export async function loadTaxSettings() {
  const savedSettings = await getTaxSettingsRecord()

  taxSettings = {
    ...defaultTaxSettings,
    ...(savedSettings || {}),
    calculationType: 'exclusive',
  }

  return getTaxSettings()
}

export async function loadDiscountSettings() {
  const savedSettings = await getDiscountSettingsRecord()

  discountSettings = {
    ...defaultDiscountSettings,
    ...(savedSettings || {}),
  }

  return getDiscountSettings()
}

export async function loadAllBusinessSettings() {
  await Promise.all([loadTaxSettings(), loadDiscountSettings()])

  return {
    taxSettings: getTaxSettings(),
    discountSettings: getDiscountSettings(),
  }
}

export async function saveTaxSettings(settings) {
  const savedSettings = await saveTaxSettingsRecord({
    ...defaultTaxSettings,
    ...settings,
    calculationType: 'exclusive',
  })

  taxSettings = savedSettings

  return getTaxSettings()
}

export async function saveDiscountSettings(settings) {
  const savedSettings = await saveDiscountSettingsRecord({
    ...defaultDiscountSettings,
    ...settings,
  })

  discountSettings = savedSettings

  return getDiscountSettings()
}