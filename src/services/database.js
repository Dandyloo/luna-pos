import Dexie from 'dexie'

export const db = new Dexie('luna-pos-db')

db.version(1).stores({
  orders: 'id, orderNumber, status, paymentStatus, fulfilmentStatus, createdAt, updatedAt',
})