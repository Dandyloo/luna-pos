export function clampNumber(value, minimum, maximum) {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return minimum
  }

  return Math.min(Math.max(numericValue, minimum), maximum)
}

export function calculateDiscountAmount({
  subtotal,
  isDiscountEnabled,
  discountType,
  discountValue,
}) {
  if (!isDiscountEnabled || subtotal <= 0) {
    return 0
  }

  const numericValue = Number(discountValue)

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return 0
  }

  if (discountType === 'percentage') {
    const percentage = clampNumber(numericValue, 0, 100)
    return Number(((subtotal * percentage) / 100).toFixed(2))
  }

  if (discountType === 'fixed') {
    return Number(Math.min(numericValue, subtotal).toFixed(2))
  }

  return 0
}

export function calculateTaxAmount({
  taxableAmount,
  isTaxEnabled,
  taxRate,
}) {
  if (!isTaxEnabled || taxableAmount <= 0) {
    return 0
  }

  const numericRate = Number(taxRate)

  if (!Number.isFinite(numericRate) || numericRate <= 0) {
    return 0
  }

  return Number((taxableAmount * numericRate).toFixed(2))
}

export function calculateOrderTotals({
  subtotal,
  isDiscountEnabled,
  discountType,
  discountValue,
  isTaxEnabled,
  taxRate,
}) {
  const discountAmount = calculateDiscountAmount({
    subtotal,
    isDiscountEnabled,
    discountType,
    discountValue,
  })

  const taxableAmount = Number(Math.max(subtotal - discountAmount, 0).toFixed(2))

  const taxAmount = calculateTaxAmount({
    taxableAmount,
    isTaxEnabled,
    taxRate,
  })

  const total = Number((taxableAmount + taxAmount).toFixed(2))

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount,
    taxableAmount,
    taxAmount,
    total,
  }
}