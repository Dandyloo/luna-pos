import {
  getTaxSettingsRecord,
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

let taxSettings = { ...defaultTaxSettings }

export function getTaxSettings() {
  return taxSettings
}

export async function loadTaxSettings() {
  const savedSettings = await getTaxSettingsRecord()

  taxSettings = {
    ...defaultTaxSettings,
    ...(savedSettings || {}),
    calculationType: 'exclusive',
  }

  return taxSettings
}

export async function saveTaxSettings(settings) {
  const savedSettings = await saveTaxSettingsRecord({
    ...defaultTaxSettings,
    ...settings,
    calculationType: 'exclusive',
  })

  taxSettings = savedSettings

  return taxSettings
}