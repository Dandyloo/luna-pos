import Dexie from 'dexie'

export const db = new Dexie('luna-pos-db')

db.version(1).stores({
  orders:
    'id, orderNumber, status, paymentStatus, fulfilmentStatus, createdAt, updatedAt',
})

db.version(2).stores({
  orders:
    'id, orderNumber, status, paymentStatus, fulfilmentStatus, createdAt, updatedAt',
  menuOverrides: 'id, updatedAt',
})

db.version(3).stores({
  orders:
    'id, orderNumber, status, paymentStatus, fulfilmentStatus, createdAt, updatedAt',
  menuOverrides: 'id, updatedAt',
  settings: 'id, updatedAt',
})

db.on('versionchange', () => {
  db.close()

  window.alert(
    'Luna POS has been updated in another tab. This tab will reload so local data remains available.',
  )

  window.location.reload()
})

db.on('blocked', () => {
  window.alert(
    'Luna POS needs to update its local database. Please close every other Luna POS tab/window, then reload this page.',
  )
})