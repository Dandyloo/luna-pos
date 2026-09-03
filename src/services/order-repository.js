import { db } from './database.js'

export async function saveOrder(order) {
  await db.orders.put(order)
  return order
}

export async function getAllOrders() {
  return db.orders.orderBy('createdAt').reverse().toArray()
}

export async function getOrderCount() {
  return db.orders.count()
}

export async function getOrderById(orderId) {
  return db.orders.get(orderId)
}