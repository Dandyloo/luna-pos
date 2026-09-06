import { formatDateTime, formatShortGhs } from '../utils/formatters.js'

function getPaymentLabel(order) {
  return order.paymentStatus === 'PAID' ? 'Paid' : 'Pending'
}

function getFulfilmentLabel(order) {
  const labels = {
    PLACED: 'Placed',
    PREPARING: 'Preparing',
    READY: 'Ready',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  }

  return labels[order.fulfilmentStatus] || order.fulfilmentStatus
}

function getStatusClass(order) {
  if (order.fulfilmentStatus === 'COMPLETED') {
    return 'back-office-status--success'
  }

  if (order.fulfilmentStatus === 'READY') {
    return 'back-office-status--ready'
  }

  if (order.paymentStatus === 'UNPAID') {
    return 'back-office-status--warning'
  }

  return 'back-office-status--info'
}

export function renderBackOfficeDashboard(report) {
  return `
    <section class="back-office-dashboard" aria-labelledby="dashboard-title">
      <header class="back-office-dashboard__header">
        <div>
          <p class="back-office-dashboard__eyebrow">Luna management overview</p>
          <h1 class="back-office-dashboard__title" id="dashboard-title">
            Dashboard
          </h1>
          <p class="back-office-dashboard__subtitle">
            Today’s local-device sales and operations summary.
          </p>
        </div>

        <button class="back-office-refresh" type="button" data-refresh-back-office>
          Refresh data
        </button>
      </header>

      <section class="back-office-notice" role="status">
        <span class="back-office-notice__mark" aria-hidden="true">i</span>
        <p>
          This dashboard currently shows orders stored on this device only.
          Cross-device reporting will be added with cloud synchronization.
        </p>
      </section>

      <section class="back-office-summary-grid" aria-label="Today summary">
        <article class="back-office-stat-card back-office-stat-card--primary">
          <p class="back-office-stat-card__label">Paid sales today</p>
          <strong class="back-office-stat-card__value">
            ${formatShortGhs(report.paidSales)}
          </strong>
          <span class="back-office-stat-card__meta">
            ${report.paidTodayOrders.length} paid order${
              report.paidTodayOrders.length === 1 ? '' : 's'
            }
          </span>
        </article>

        <article class="back-office-stat-card">
          <p class="back-office-stat-card__label">Orders today</p>
          <strong class="back-office-stat-card__value">
            ${report.todayOrders.length}
          </strong>
          <span class="back-office-stat-card__meta">
            Submitted customer orders
          </span>
        </article>

        <article class="back-office-stat-card">
          <p class="back-office-stat-card__label">Payment pending</p>
          <strong class="back-office-stat-card__value">
            ${formatShortGhs(report.pendingValue)}
          </strong>
          <span class="back-office-stat-card__meta">
            ${report.unpaidTodayOrders.length} unpaid active order${
              report.unpaidTodayOrders.length === 1 ? '' : 's'
            }
          </span>
        </article>

        <article class="back-office-stat-card">
          <p class="back-office-stat-card__label">Average paid order</p>
          <strong class="back-office-stat-card__value">
            ${formatShortGhs(report.averagePaidOrderValue)}
          </strong>
          <span class="back-office-stat-card__meta">
            Based on paid orders today
          </span>
        </article>
      </section>

      <section class="back-office-section-grid">
        <article class="back-office-panel">
          <header class="back-office-panel__header">
            <div>
              <p class="back-office-panel__eyebrow">Payments</p>
              <h2 class="back-office-panel__title">Payment methods</h2>
            </div>
          </header>

          <div class="payment-breakdown">
            <div class="payment-breakdown__row">
              <span>Cash</span>
              <strong>${formatShortGhs(report.paymentMethods.cash)}</strong>
            </div>

            <div class="payment-breakdown__row">
              <span>Mobile Money</span>
              <strong>${formatShortGhs(report.paymentMethods.momo)}</strong>
            </div>

            <div class="payment-breakdown__row">
              <span>Card</span>
              <strong>${formatShortGhs(report.paymentMethods.card)}</strong>
            </div>
          </div>
        </article>

        <article class="back-office-panel">
          <header class="back-office-panel__header">
            <div>
              <p class="back-office-panel__eyebrow">Operations</p>
              <h2 class="back-office-panel__title">Active orders</h2>
            </div>
          </header>

          <div class="active-order-breakdown">
            <div class="active-order-breakdown__item">
              <span>Preparing</span>
              <strong>
                ${
                  report.activeTodayOrders.filter(
                    (order) => order.fulfilmentStatus === 'PREPARING',
                  ).length
                }
              </strong>
            </div>

            <div class="active-order-breakdown__item">
              <span>Ready</span>
              <strong>
                ${
                  report.activeTodayOrders.filter(
                    (order) => order.fulfilmentStatus === 'READY',
                  ).length
                }
              </strong>
            </div>

            <div class="active-order-breakdown__item">
              <span>Active total</span>
              <strong>${report.activeTodayOrders.length}</strong>
            </div>
          </div>
        </article>
      </section>

      <section class="back-office-section-grid">
        <article class="back-office-panel">
          <header class="back-office-panel__header">
            <div>
              <p class="back-office-panel__eyebrow">Paid sales</p>
              <h2 class="back-office-panel__title">Top items today</h2>
            </div>
          </header>

          ${
            report.topItems.length > 0
              ? `
                <div class="top-items-list">
                  ${report.topItems
                    .map(
                      (item, index) => `
                        <div class="top-items-list__item">
                          <span class="top-items-list__rank">${String(
                            index + 1,
                          ).padStart(2, '0')}</span>

                          <div class="top-items-list__main">
                            <strong>${item.name}</strong>
                            <span>${item.quantity} sold</span>
                          </div>

                          <strong class="top-items-list__revenue">
                            ${formatShortGhs(item.revenue)}
                          </strong>
                        </div>
                      `,
                    )
                    .join('')}
                </div>
              `
              : `
                <p class="back-office-panel__empty">
                  No paid item sales recorded today yet.
                </p>
              `
          }
        </article>

        <article class="back-office-panel">
          <header class="back-office-panel__header">
            <div>
              <p class="back-office-panel__eyebrow">Profit</p>
              <h2 class="back-office-panel__title">Profit status</h2>
            </div>
          </header>

          <div class="profit-notice">
            <p class="profit-notice__title">Cost data required</p>
            <p class="profit-notice__copy">
              Luna’s menu selling prices are available, but product costs and
              daily expenses have not been configured. Profit is intentionally
              not estimated until those values are supplied.
            </p>
          </div>
        </article>
      </section>

      <section class="back-office-panel">
        <header class="back-office-panel__header">
          <div>
            <p class="back-office-panel__eyebrow">Live activity</p>
            <h2 class="back-office-panel__title">Recent orders</h2>
          </div>
        </header>

        ${
          report.recentOrders.length > 0
            ? `
              <div class="recent-orders-table-wrap">
                <table class="recent-orders-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Time</th>
                      <th>Type</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    ${report.recentOrders
                      .map(
                        (order) => `
                          <tr>
                            <td>
                              <strong>${order.orderNumber}</strong>
                            </td>
                            <td>${formatDateTime(new Date(order.createdAt))}</td>
                            <td>${
                              order.orderType === 'dine-in'
                                ? 'Dine-in'
                                : 'Takeaway'
                            }</td>
                            <td>${getPaymentLabel(order)}</td>
                            <td>
                              <span class="back-office-status ${getStatusClass(
                                order,
                              )}">
                                ${getFulfilmentLabel(order)}
                              </span>
                            </td>
                            <td>
                              <strong>${formatShortGhs(order.total)}</strong>
                            </td>
                          </tr>
                        `,
                      )
                      .join('')}
                  </tbody>
                </table>
              </div>
            `
            : `
              <p class="back-office-panel__empty">
                No orders have been recorded on this device today.
              </p>
            `
        }
      </section>
    </section>
  `
}