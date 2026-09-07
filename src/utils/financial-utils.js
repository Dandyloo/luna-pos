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
  discountSettings,
}) {
  if (!isDiscountEnabled || subtotal <= 0 || !discountSettings) {
    return 0
  }

  const numericValue = Number(discountValue)

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return 0
  }

  if (discountType === 'percentage') {
    if (!discountSettings.isPercentageEnabled) {
      return 0
    }

    const maximumPercentage = clampNumber(
      discountSettings.maxPercentage,
      0,
      100,
    )

    const percentage = clampNumber(numericValue, 0, maximumPercentage)

    return Number(((subtotal * percentage) / 100).toFixed(2))
  }

  if (discountType === 'fixed') {
    if (!discountSettings.isFixedAmountEnabled) {
      return 0
    }

    const configuredMaximum =
      discountSettings.maxFixedAmount === null ||
      discountSettings.maxFixedAmount === ''
        ? subtotal
        : clampNumber(discountSettings.maxFixedAmount, 0, subtotal)

    return Number(Math.min(numericValue, configuredMaximum).toFixed(2))
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
  discountSettings,
  isTaxEnabled,
  taxRate,
}) {
  const normalizedSubtotal = Number(Number(subtotal || 0).toFixed(2))

  const discountAmount = calculateDiscountAmount({
    subtotal: normalizedSubtotal,
    isDiscountEnabled,
    discountType,
    discountValue,
    discountSettings,
  })

  const taxableAmount = Number(
    Math.max(normalizedSubtotal - discountAmount, 0).toFixed(2),
  )

  const taxAmount = calculateTaxAmount({
    taxableAmount,
    isTaxEnabled,
    taxRate,
  })

  const total = Number((taxableAmount + taxAmount).toFixed(2))

  return {
    subtotal: normalizedSubtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    total,
  }
}