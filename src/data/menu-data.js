const PRODUCT_IMAGE_BASE_PATH = '/images/products'

export const categories = [
  {
    id: 'all',
    name: 'All Items',
    icon: '🍽️',
    imageFallback: '/images/LUNA-BRAND-GUILD.jpg',
  },
  {
    id: 'breakfast',
    name: 'Breakfast',
    icon: '🍳',
    imageFallback: '/images/LUNA-BRAND-GUILD.jpg',
  },
  {
    id: 'pastries',
    name: 'Quick Bites',
    icon: '🥐',
    imageFallback: '/images/LUNA-BRAND-GUILD.jpg',
  },
  {
    id: 'shawarma',
    name: 'Shawarma',
    icon: '🌯',
    imageFallback: '/images/LUNA-BRAND-GUILD.jpg',
  },
  {
    id: 'pizza',
    name: 'Pizza',
    icon: '🍕',
    imageFallback: '/images/LUNA-BRAND-GUILD.jpg',
  },
  {
    id: 'salads',
    name: 'Salads',
    icon: '🥗',
    imageFallback: '/images/LUNA-BRAND-GUILD.jpg',
  },
  {
    id: 'coffee',
    name: 'Hot Drinks',
    icon: '☕',
    imageFallback: '/images/LUNA-BRAND-GUILD.jpg',
  },
  {
    id: 'iced-coffee',
    name: 'Iced Coffee',
    icon: '🧊',
    imageFallback: '/images/LUNA-BRAND-GUILD.jpg',
  },
  {
    id: 'boba-milk-tea',
    name: 'Milk Tea',
    icon: '🧋',
    group: 'Luna Boba',
    imageFallback: '/images/LUNA-BRAND-GUILD.jpg',
  },
  {
    id: 'boba-fruit-tea',
    name: 'Fruit Tea',
    icon: '🍓',
    group: 'Luna Boba',
    imageFallback: '/images/LUNA-BRAND-GUILD.jpg',
  },
  {
    id: 'boba-signature',
    name: 'Signature Boba',
    icon: '✨',
    group: 'Luna Boba',
    imageFallback: '/images/LUNA-BRAND-GUILD.jpg',
  },
  {
    id: 'boba-matcha',
    name: 'Matcha',
    icon: '🍵',
    group: 'Luna Boba',
    imageFallback: '/images/LUNA-BRAND-GUILD.jpg',
  },
  {
    id: 'soft-drinks',
    name: 'Soft Drinks',
    icon: '🥤',
    imageFallback: '/images/LUNA-BRAND-GUILD.jpg',
  },
]

function createFixedProduct({
  id,
  categoryId,
  name,
  price,
  description = '',
  imageFolder,
  isPopular = false,
}) {
  return {
    id,
    categoryId,
    name,
    description,
    image: `${PRODUCT_IMAGE_BASE_PATH}/${imageFolder}/${id}.jpg`,
    fallbackImage: '/images/LUNA-BRAND-GUILD.jpg',
    isPopular,
    isAvailable: true,
    variants: [
      {
        id: 'standard',
        name: 'Standard',
        price,
        cost: null,
      },
    ],
    modifierGroupIds: [],
  }
}

function createBobaProduct({
  id,
  categoryId,
  name,
  price500ml = null,
  price700ml = null,
  isPopular = false,
}) {
  const variants = []

  if (price500ml !== null) {
    variants.push({
      id: '500ml',
      name: '500ML',
      price: price500ml,
      cost: null,
    })
  }

  if (price700ml !== null) {
    variants.push({
      id: '700ml',
      name: '700ML',
      price: price700ml,
      cost: null,
    })
  }

  return {
    id,
    categoryId,
    name,
    description: 'Luna Boba drink.',
    image: `${PRODUCT_IMAGE_BASE_PATH}/boba/${id}.jpg`,
    fallbackImage: '/images/LUNA-BRAND-GUILD.jpg',
    isPopular,
    isAvailable: true,
    variants,
    modifierGroupIds: ['boba-extras'],
  }
}

export const menuItems = [
  createFixedProduct({
    id: 'club-sandwich',
    categoryId: 'breakfast',
    name: 'Club Sandwich',
    price: 35,
    imageFolder: 'breakfast',
    isPopular: true,
  }),
  createFixedProduct({
    id: 'tuna-sandwich',
    categoryId: 'breakfast',
    name: 'Tuna Sandwich',
    price: 40,
    imageFolder: 'breakfast',
  }),
  createFixedProduct({
    id: 'luna-chicken-roll',
    categoryId: 'breakfast',
    name: 'Luna Chicken Roll',
    price: 50,
    imageFolder: 'breakfast',
  }),
  createFixedProduct({
    id: 'luna-special-breakfast',
    categoryId: 'breakfast',
    name: 'Luna Special Breakfast',
    description:
      'Bread, egg, sausage, baked beans, sautéed vegetables and mushroom.',
    price: 60,
    imageFolder: 'breakfast',
    isPopular: true,
  }),

  createFixedProduct({
    id: 'pie',
    categoryId: 'pastries',
    name: 'Pie',
    price: 20,
    imageFolder: 'pastries',
  }),
  createFixedProduct({
    id: 'sausage-roll',
    categoryId: 'pastries',
    name: 'Sausage Roll',
    price: 20,
    imageFolder: 'pastries',
    isPopular: true,
  }),
  createFixedProduct({
    id: 'rockie',
    categoryId: 'pastries',
    name: 'Rockie',
    price: 20,
    imageFolder: 'pastries',
  }),
  createFixedProduct({
    id: 'fish-pie',
    categoryId: 'pastries',
    name: 'Fish Pie',
    price: 20,
    imageFolder: 'pastries',
  }),

  createFixedProduct({
    id: 'shawarma',
    categoryId: 'shawarma',
    name: 'Shawarma',
    price: 60,
    imageFolder: 'shawarma',
    isPopular: true,
  }),

  createFixedProduct({
    id: 'tuna-pizza',
    categoryId: 'pizza',
    name: 'Tuna Pizza',
    price: 80,
    imageFolder: 'pizza',
  }),
  createFixedProduct({
    id: 'sausage-pizza',
    categoryId: 'pizza',
    name: 'Sausage Pizza',
    price: 80,
    imageFolder: 'pizza',
  }),
  createFixedProduct({
    id: 'margarita-pizza',
    categoryId: 'pizza',
    name: 'Margarita Pizza',
    price: 80,
    imageFolder: 'pizza',
    isPopular: true,
  }),
  createFixedProduct({
    id: 'chicken-pizza',
    categoryId: 'pizza',
    name: 'Chicken Pizza',
    price: 120,
    imageFolder: 'pizza',
  }),
  createFixedProduct({
    id: 'beef-pizza',
    categoryId: 'pizza',
    name: 'Beef Pizza',
    price: 120,
    imageFolder: 'pizza',
  }),
  createFixedProduct({
    id: 'luna-special-pizza',
    categoryId: 'pizza',
    name: 'Luna Special Pizza',
    price: 140,
    imageFolder: 'pizza',
    isPopular: true,
  }),

  createFixedProduct({
    id: 'simple-vegetable-salad',
    categoryId: 'salads',
    name: 'Simple Vegetable Salad',
    price: 45,
    imageFolder: 'salads',
  }),
  createFixedProduct({
    id: 'tuna-salad',
    categoryId: 'salads',
    name: 'Tuna Salad',
    price: 45,
    imageFolder: 'salads',
  }),
  createFixedProduct({
    id: 'chicken-salad',
    categoryId: 'salads',
    name: 'Chicken Salad',
    price: 50,
    imageFolder: 'salads',
    isPopular: true,
  }),

  createFixedProduct({
    id: 'tea',
    categoryId: 'coffee',
    name: 'Tea',
    price: 20,
    imageFolder: 'coffee',
  }),
  createFixedProduct({
    id: 'hot-chocolate',
    categoryId: 'coffee',
    name: 'Hot Chocolate',
    price: 20,
    imageFolder: 'coffee',
  }),
  createFixedProduct({
    id: 'espresso',
    categoryId: 'coffee',
    name: 'Espresso',
    price: 30,
    imageFolder: 'coffee',
  }),
  createFixedProduct({
    id: 'cappuccino',
    categoryId: 'coffee',
    name: 'Cappuccino',
    price: 40,
    imageFolder: 'coffee',
    isPopular: true,
  }),
  createFixedProduct({
    id: 'coffee-latte',
    categoryId: 'coffee',
    name: 'Coffee Latte',
    price: 40,
    imageFolder: 'coffee',
  }),

  createFixedProduct({
    id: 'iced-coffee',
    categoryId: 'iced-coffee',
    name: 'Iced Coffee',
    price: 40,
    imageFolder: 'iced-coffee',
  }),
  createFixedProduct({
    id: 'luna-iced-latte',
    categoryId: 'iced-coffee',
    name: 'Luna Iced Latte',
    price: 40,
    imageFolder: 'iced-coffee',
    isPopular: true,
  }),

  createBobaProduct({
    id: 'brown-sugar-milk-tea',
    categoryId: 'boba-milk-tea',
    name: 'Brown Sugar Milk Tea',
    price500ml: 40,
    price700ml: 60,
    isPopular: true,
  }),
  createBobaProduct({
    id: 'brown-sugar-fresh-milk',
    categoryId: 'boba-milk-tea',
    name: 'Brown Sugar Fresh Milk',
    price500ml: 40,
    price700ml: 50,
  }),
  createBobaProduct({
    id: 'coconut-milk-tea',
    categoryId: 'boba-milk-tea',
    name: 'Coconut Milk Tea',
    price500ml: 40,
    price700ml: 60,
  }),
  createBobaProduct({
    id: 'caramel-milk-tea',
    categoryId: 'boba-milk-tea',
    name: 'Caramel Milk Tea',
    price500ml: 40,
    price700ml: 60,
  }),
  createBobaProduct({
    id: 'taro-milk-tea',
    categoryId: 'boba-milk-tea',
    name: 'Taro Milk Tea',
    price500ml: 40,
    price700ml: 60,
  }),
  createBobaProduct({
    id: 'blueberry-milk-tea',
    categoryId: 'boba-milk-tea',
    name: 'Blueberry Milk Tea',
    price500ml: 40,
    price700ml: 60,
  }),
  createBobaProduct({
    id: 'chocolate-milk-tea',
    categoryId: 'boba-milk-tea',
    name: 'Chocolate Milk Tea',
    price500ml: 40,
    price700ml: 60,
  }),
  createBobaProduct({
    id: 'tiramisu-milk-tea',
    categoryId: 'boba-milk-tea',
    name: 'Tiramisu Milk Tea',
    price500ml: 40,
    price700ml: 60,
  }),
  createBobaProduct({
    id: 'strawberry-milk-tea',
    categoryId: 'boba-milk-tea',
    name: 'Strawberry Milk Tea',
    price500ml: 40,
    price700ml: 60,
  }),
  createBobaProduct({
    id: 'lilac-milk-tea',
    categoryId: 'boba-milk-tea',
    name: 'Lilac Milk Tea',
    price500ml: 40,
    price700ml: 60,
  }),
  createBobaProduct({
    id: 'vanilla-milk-tea',
    categoryId: 'boba-milk-tea',
    name: 'Vanilla Milk Tea',
    price500ml: 40,
    price700ml: 60,
  }),
  createBobaProduct({
    id: 'mango-milk-tea',
    categoryId: 'boba-milk-tea',
    name: 'Mango Milk Tea',
    price500ml: 40,
    price700ml: 60,
  }),
  createBobaProduct({
    id: 'banana-milk-tea',
    categoryId: 'boba-milk-tea',
    name: 'Banana Milk Tea',
    price500ml: 40,
    price700ml: 60,
  }),

  createBobaProduct({
    id: 'iced-tea',
    categoryId: 'boba-fruit-tea',
    name: 'Iced Tea',
    price500ml: 40,
    price700ml: 50,
  }),
  createBobaProduct({
    id: 'strawberry-fruit-tea',
    categoryId: 'boba-fruit-tea',
    name: 'Strawberry Fruit Tea',
    price500ml: 40,
    price700ml: 50,
  }),
  createBobaProduct({
    id: 'peach-tea',
    categoryId: 'boba-fruit-tea',
    name: 'Peach Tea',
    price500ml: 40,
    price700ml: 50,
  }),
  createBobaProduct({
    id: 'passion-tea',
    categoryId: 'boba-fruit-tea',
    name: 'Passion Tea',
    price500ml: 40,
    price700ml: 50,
  }),
  createBobaProduct({
    id: 'mango-tea',
    categoryId: 'boba-fruit-tea',
    name: 'Mango Tea',
    price500ml: 40,
    price700ml: 50,
  }),

  createBobaProduct({
    id: 'luna-blue',
    categoryId: 'boba-signature',
    name: 'Luna Blue',
    price500ml: 80,
    price700ml: 95,
    isPopular: true,
  }),
  createBobaProduct({
    id: 'caramel-lotus',
    categoryId: 'boba-signature',
    name: 'Caramel Lotus',
    price700ml: 60,
  }),
  createBobaProduct({
    id: 'oreo-cookie-crush',
    categoryId: 'boba-signature',
    name: 'Oreo Cookie Crush',
    price700ml: 60,
  }),
  createBobaProduct({
    id: 'vanilla-biscoff-latte',
    categoryId: 'boba-signature',
    name: 'Vanilla Biscoff Latte',
    price700ml: 70,
  }),
  createBobaProduct({
    id: 'dulce-de-leche',
    categoryId: 'boba-signature',
    name: 'Dulce de Leche',
    price700ml: 60,
  }),
  createBobaProduct({
    id: 'crunchy-pistachio',
    categoryId: 'boba-signature',
    name: 'Crunchy Pistachio',
    price700ml: 85,
  }),
  createBobaProduct({
    id: 'marshmallow-boba',
    categoryId: 'boba-signature',
    name: 'Marshmallow Boba',
    price500ml: 85,
    price700ml: 100,
  }),
  createBobaProduct({
    id: 'snicker-boba',
    categoryId: 'boba-signature',
    name: 'Snicker Boba',
    price700ml: 80,
  }),
  createBobaProduct({
    id: 'kit-kat-boba',
    categoryId: 'boba-signature',
    name: 'Kit Kat Boba',
    price700ml: 80,
  }),

  createBobaProduct({
    id: 'mango-matcha',
    categoryId: 'boba-matcha',
    name: 'Mango Matcha',
    price500ml: 50,
    price700ml: 70,
  }),
  createBobaProduct({
    id: 'oreo-matcha',
    categoryId: 'boba-matcha',
    name: 'Oreo Matcha',
    price500ml: 50,
    price700ml: 70,
  }),
  createBobaProduct({
    id: 'strawberry-matcha',
    categoryId: 'boba-matcha',
    name: 'Strawberry Matcha',
    price500ml: 50,
    price700ml: 70,
  }),
  createBobaProduct({
    id: 'matcha-milk-tea',
    categoryId: 'boba-matcha',
    name: 'Matcha Milk Tea',
    price700ml: 60,
  }),

  createFixedProduct({
    id: 'welch',
    categoryId: 'soft-drinks',
    name: 'Welch',
    price: 60,
    imageFolder: 'soft-drinks',
  }),
  createFixedProduct({
    id: 'soda',
    categoryId: 'soft-drinks',
    name: 'Soda (Coke / Fanta)',
    price: 12,
    imageFolder: 'soft-drinks',
    isPopular: true,
  }),
  createFixedProduct({
    id: 'bb-cocktail',
    categoryId: 'soft-drinks',
    name: 'BB Cocktail',
    price: 16,
    imageFolder: 'soft-drinks',
  }),
]

export const modifierGroups = [
  {
    id: 'boba-extras',
    name: 'Boba Extras',
    selectionType: 'multiple',
    isRequired: false,
    options: [
      {
        id: 'extra-boba-or-popping',
        name: 'Extra Boba / Extra Popping',
        price: 10,
        cost: null,
      },
      {
        id: 'extra-cheese-foam',
        name: 'Extra Cheese Foam',
        price: 15,
        cost: null,
      },
    ],
  },
]

export const taxRules = [
  {
    id: 'default-tax',
    name: 'Tax',
    rate: 0,
    isEnabledByDefault: false,
    calculationType: 'exclusive',
  },
]

export const discountTypes = [
  {
    id: 'percentage',
    name: 'Percentage Discount',
    valueType: 'percentage',
  },
  {
    id: 'fixed',
    name: 'Fixed Amount Discount',
    valueType: 'fixed',
  },
]