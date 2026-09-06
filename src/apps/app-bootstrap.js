import { getCurrentApp } from '../modules/app-router.js'

export async function startApplication({
  renderLauncher,
  startPos,
  startCustomerDisplay,
  startBackOffice,
  renderNotFound,
}) {
  const currentApp = getCurrentApp()

  if (currentApp === 'launcher') {
    renderLauncher()
    return
  }

  if (currentApp === 'pos') {
    await startPos()
    return
  }

  if (currentApp === 'customer-display') {
    await startCustomerDisplay()
    return
  }

  if (currentApp === 'back-office') {
    await startBackOffice()
    return
  }

  renderNotFound()
}