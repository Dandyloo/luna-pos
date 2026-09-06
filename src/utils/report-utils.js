function isSameLocalDay(dateValue, comparisonDate = new Date()) {
  const date = new Date(dateValue)

  return (
    date.getFullYear() === comparisonDate.getFullYear() &&
    date.getMonth() === comparisonDate.getMonth() &&
    date.getDate() === comparisonDate.getDate()
  )
}

function sumOrderTotals(orders) {
  return orders.reduce((total, order) => total + order.total, 0)
}

export function getTodayOrders(orders) {
  return orders.filter((order) => isSameLocalDay(order.createdAt))
}

export function getPaidOrders(orders) {
  return orders.filter((order) => order.paymentStatus === 'PAID')
}

export function getUnpaidOrders(orders) {
  return orders.filter((order) => order.paymentStatus === 'UNPAID')
}

export function getActiveOrders(orders) {
  return orders.filter((order) =>
    ['PREPARING', 'READY'].includes(order.fulfilmentStatus),
  )
}

export function getPaymentMethodTotals(paidOrders) {
  return paidOrders.reduce(
    (totals, order) => {
      const payment = order.payments?.[0]

      if (!payment) {
        return totals
      }

      if (payment.method === 'cash') {
        totals.cash += payment.amount
      }

      if (payment.method === 'momo') {
        totals.momo += payment.amount
      }

      if (payment.method === 'card') {
        totals.card += payment.amount
      }

      return totals
    },
    {
      cash: 0,
      momo: 0,
      card: 0,
    },
  )
}

export function getTopItems(orders, limit = 5) {
  const itemsByProduct = new Map()

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const currentItem = itemsByProduct.get(item.productName) || {
        name: item.productName,
        quantity: 0,
        revenue: 0,
      }

      currentItem.quantity += item.quantity
      currentItem.revenue += item.quantity * (item.unitPrice + item.modifiersTotal)

      itemsByProduct.set(item.productName, currentItem)
    })
  })

  return [...itemsByProduct.values()]
    .sort((firstItem, secondItem) => {
      if (secondItem.quantity !== firstItem.quantity) {
        return secondItem.quantity - firstItem.quantity
      }

      return secondItem.revenue - firstItem.revenue
    })
    .slice(0, limit)
}

export function getDashboardReport(orders) {
  const todayOrders = getTodayOrders(orders)
  const paidTodayOrders = getPaidOrders(todayOrders)
  const unpaidTodayOrders = getUnpaidOrders(todayOrders)
  const activeTodayOrders = getActiveOrders(todayOrders)
  const paidSales = sumOrderTotals(paidTodayOrders)
  const pendingValue = sumOrderTotals(unpaidTodayOrders)
  const averagePaidOrderValue =
    paidTodayOrders.length > 0 ? paidSales / paidTodayOrders.length : 0

  return {
    todayOrders,
    paidTodayOrders,
    unpaidTodayOrders,
    activeTodayOrders,
    paidSales,
    pendingValue,
    averagePaidOrderValue,
    paymentMethods: getPaymentMethodTotals(paidTodayOrders),
    topItems: getTopItems(paidTodayOrders),
    recentOrders: [...todayOrders].slice(0, 8),
  }
}