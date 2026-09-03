export function createCartItem({ product, variant, modifiers = [] }) {
  const modifiersTotal = modifiers.reduce(
    (total, modifier) => total + modifier.price,
    0,
  )

  return {
    id: crypto.randomUUID(),
    productId: product.id,
    productName: product.name,
    image: product.image,
    fallbackImage: product.fallbackImage,
    variantId: variant.id,
    variantName: variant.name,
    unitPrice: variant.price,
    unitCost: variant.cost,
    modifiers,
    modifiersTotal,
    quantity: 1,
  }
}

export function getCartItemUnitTotal(cartItem) {
  return cartItem.unitPrice + cartItem.modifiersTotal
}

export function getCartItemLineTotal(cartItem) {
  return getCartItemUnitTotal(cartItem) * cartItem.quantity
}

export function getCartSubtotal(cartItems) {
  return cartItems.reduce(
    (total, cartItem) => total + getCartItemLineTotal(cartItem),
    0,
  )
}

export function getCartQuantity(cartItems) {
  return cartItems.reduce(
    (total, cartItem) => total + cartItem.quantity,
    0,
  )
}

export function findMatchingCartItem(cartItems, candidateItem) {
  const candidateModifierIds = candidateItem.modifiers
    .map((modifier) => modifier.id)
    .sort()
    .join('|')

  return cartItems.find((cartItem) => {
    const cartItemModifierIds = cartItem.modifiers
      .map((modifier) => modifier.id)
      .sort()
      .join('|')

    return (
      cartItem.productId === candidateItem.productId &&
      cartItem.variantId === candidateItem.variantId &&
      cartItemModifierIds === candidateModifierIds
    )
  })
}

export function addCartItem(cartItems, candidateItem) {
  const matchingItem = findMatchingCartItem(cartItems, candidateItem)

  if (matchingItem) {
    return cartItems.map((cartItem) =>
      cartItem.id === matchingItem.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem,
    )
  }

  return [...cartItems, candidateItem]
}

export function updateCartItemQuantity(cartItems, cartItemId, quantity) {
  if (quantity <= 0) {
    return cartItems.filter((cartItem) => cartItem.id !== cartItemId)
  }

  return cartItems.map((cartItem) =>
    cartItem.id === cartItemId ? { ...cartItem, quantity } : cartItem,
  )
}