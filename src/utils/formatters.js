export function formatGhs(amount) {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatShortGhs(amount) {
  return `GH₵ ${Number(amount).toFixed(2)}`
}

export function formatDateTime(date = new Date()) {
  return new Intl.DateTimeFormat('en-GH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}