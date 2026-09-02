const validApps = ['launcher', 'pos', 'customer-display', 'back-office']

export function getCurrentApp() {
  const params = new URLSearchParams(window.location.search)
  const requestedApp = params.get('app') || 'launcher'

  return validApps.includes(requestedApp) ? requestedApp : 'launcher'
}

export function getAppUrl(appName) {
  return appName === 'launcher' ? '/' : `/?app=${appName}`
}