export const categories = [
  {
    id: 'all',
    name: 'All Items',
    icon: '🍽️',
  },
  {
    id: 'boba',
    name: 'Boba',
    icon: '🧋',
  },
  {
    id: 'coffee',
    name: 'Coffee',
    icon: '☕',
  },
  {
    id: 'pizza',
    name: 'Pizza',
    icon: '🍕',
  },
  {
    id: 'snacks',
    name: 'Snacks',
    icon: '🍟',
  },
  {
    id: 'meals',
    name: 'Meals',
    icon: '🍛',
  },
  {
    id: 'desserts',
    name: 'Desserts',
    icon: '🍰',
  },
]

export const menuItems = [
  {
    id: 'boba-classic-milk-tea',
    categoryId: 'boba',
    name: 'Classic Milk Tea',
    description: 'Creamy milk tea with tapioca pearls.',
    image: '/images/LUNA-BRAND-GUILD.jpg',
    isPopular: true,
    isAvailable: true,
    variants: [
      {
        id: 'small',
        name: 'Small',
        price: 28,
        cost: 10,
      },
      {
        id: 'large',
        name: 'Large',
        price: 36,
        cost: 13,
      },
    ],
    modifierGroupIds: ['sugar-level', 'ice-level', 'boba-toppings'],
  },
  {
    id: 'boba-brown-sugar',
    categoryId: 'boba',
    name: 'Brown Sugar Boba',
    description: 'Brown sugar syrup, milk, and chewy boba pearls.',
    image: '/images/LUNA-BRAND-GUILD.jpg',
    isPopular: true,
    isAvailable: true,
    variants: [
      {
        id: 'small',
        name: 'Small',
        price: 32,
        cost: 12,
      },
      {
        id: 'large',
        name: 'Large',
        price: 40,
        cost: 15,
      },
    ],
    modifierGroupIds: ['ice-level', 'boba-toppings'],
  },
  {
    id: 'coffee-cappuccino',
    categoryId: 'coffee',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and soft foam.',
    image: '/images/LUNA-BRAND-GUILD.jpg',
    isPopular: false,
    isAvailable: true,
    variants: [
      {
        id: 'regular',
        name: 'Regular',
        price: 25,
        cost: 9,
      },
      {
        id: 'large',
        name: 'Large',
        price: 32,
        cost: 12,
      },
    ],
    modifierGroupIds: ['coffee-milk', 'coffee-extras'],
  },
  {
    id: 'coffee-iced-latte',
    categoryId: 'coffee',
    name: 'Iced Latte',
    description: 'Chilled espresso, milk, and ice.',
    image: '/images/LUNA-BRAND-GUILD.jpg',
    isPopular: true,
    isAvailable: true,
    variants: [
      {
        id: 'regular',
        name: 'Regular',
        price: 28,
        cost: 10,
      },
      {
        id: 'large',
        name: 'Large',
        price: 35,
        cost: 13,
      },
    ],
    modifierGroupIds: ['ice-level', 'coffee-milk', 'coffee-extras'],
  },
  {
    id: 'pizza-margherita',
    categoryId: 'pizza',
    name: 'Margherita Pizza',
    description: 'Tomato sauce, mozzarella, and herbs.',
    image: '/images/LUNA-BRAND-GUILD.jpg',
    isPopular: true,
    isAvailable: true,
    variants: [
      {
        id: 'personal',
        name: 'Personal',
        price: 55,
        cost: 23,
      },
      {
        id: 'large',
        name: 'Large',
        price: 95,
        cost: 42,
      },
    ],
    modifierGroupIds: ['pizza-extras'],
  },
  {
    id: 'pizza-chicken-supreme',
    categoryId: 'pizza',
    name: 'Chicken Supreme Pizza',
    description: 'Chicken, vegetables, cheese, and Luna sauce.',
    image: '/images/LUNA-BRAND-GUILD.jpg',
    isPopular: false,
    isAvailable: true,
    variants: [
      {
        id: 'personal',
        name: 'Personal',
        price: 68,
        cost: 31,
      },
      {
        id: 'large',
        name: 'Large',
        price: 115,
        cost: 54,
      },
    ],
    modifierGroupIds: ['pizza-extras'],
  },
  {
    id: 'snack-loaded-fries',
    categoryId: 'snacks',
    name: 'Loaded Fries',
    description: 'Crispy fries with Luna sauce and toppings.',
    image: '/images/LUNA-BRAND-GUILD.jpg',
    isPopular: true,
    isAvailable: true,
    variants: [
      {
        id: 'regular',
        name: 'Regular',
        price: 35,
        cost: 15,
      },
      {
        id: 'large',
        name: 'Large',
        price: 48,
        cost: 21,
      },
    ],
    modifierGroupIds: ['fries-extras'],
  },
  {
    id: 'snack-chicken-wings',
    categoryId: 'snacks',
    name: 'Chicken Wings',
    description: 'Seasoned wings served with Luna dip.',
    image: '/images/LUNA-BRAND-GUILD.jpg',
    isPopular: false,
    isAvailable: true,
    variants: [
      {
        id: 'six-pieces',
        name: '6 Pieces',
        price: 45,
        cost: 22,
      },
      {
        id: 'twelve-pieces',
        name: '12 Pieces',
        price: 82,
        cost: 41,
      },
    ],
    modifierGroupIds: ['wing-sauce'],
  },
  {
    id: 'meal-jollof-chicken',
    categoryId: 'meals',
    name: 'Jollof Rice & Chicken',
    description: 'Jollof rice, grilled chicken, salad, and sauce.',
    image: '/images/LUNA-BRAND-GUILD.jpg',
    isPopular: true,
    isAvailable: true,
    variants: [
      {
        id: 'standard',
        name: 'Standard',
        price: 60,
        cost: 31,
      },
    ],
    modifierGroupIds: ['meal-extras'],
  },
  {
    id: 'dessert-chocolate-cake',
    categoryId: 'desserts',
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake slice.',
    image: '/images/LUNA-BRAND-GUILD.jpg',
    isPopular: false,
    isAvailable: true,
    variants: [
      {
        id: 'slice',
        name: 'Slice',
        price: 25,
        cost: 10,
      },
    ],
    modifierGroupIds: ['dessert-extras'],
  },
]

export const modifierGroups = [
  {
    id: 'sugar-level',
    name: 'Sugar Level',
    selectionType: 'single',
    isRequired: false,
    options: [
      { id: 'no-sugar', name: 'No Sugar', price: 0, cost: 0 },
      { id: 'half-sugar', name: 'Half Sugar', price: 0, cost: 0 },
      { id: 'regular-sugar', name: 'Regular Sugar', price: 0, cost: 0 },
    ],
  },
  {
    id: 'ice-level',
    name: 'Ice Level',
    selectionType: 'single',
    isRequired: false,
    options: [
      { id: 'no-ice', name: 'No Ice', price: 0, cost: 0 },
      { id: 'less-ice', name: 'Less Ice', price: 0, cost: 0 },
      { id: 'regular-ice', name: 'Regular Ice', price: 0, cost: 0 },
    ],
  },
  {
    id: 'boba-toppings',
    name: 'Boba Toppings',
    selectionType: 'multiple',
    isRequired: false,
    options: [
      { id: 'extra-boba', name: 'Extra Boba', price: 6, cost: 2.5 },
      { id: 'popping-boba', name: 'Popping Boba', price: 7, cost: 3 },
      { id: 'cheese-foam', name: 'Cheese Foam', price: 8, cost: 3.5 },
    ],
  },
  {
    id: 'coffee-milk',
    name: 'Milk Choice',
    selectionType: 'single',
    isRequired: false,
    options: [
      { id: 'regular-milk', name: 'Regular Milk', price: 0, cost: 0 },
      { id: 'extra-milk', name: 'Extra Milk', price: 3, cost: 1 },
    ],
  },
  {
    id: 'coffee-extras',
    name: 'Coffee Extras',
    selectionType: 'multiple',
    isRequired: false,
    options: [
      { id: 'extra-shot', name: 'Extra Espresso Shot', price: 6, cost: 2 },
      { id: 'vanilla-syrup', name: 'Vanilla Syrup', price: 3, cost: 1 },
      { id: 'caramel-syrup', name: 'Caramel Syrup', price: 3, cost: 1 },
    ],
  },
  {
    id: 'pizza-extras',
    name: 'Pizza Extras',
    selectionType: 'multiple',
    isRequired: false,
    options: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 10, cost: 5 },
      { id: 'extra-chicken', name: 'Extra Chicken', price: 12, cost: 6 },
      { id: 'extra-vegetables', name: 'Extra Vegetables', price: 7, cost: 3 },
    ],
  },
  {
    id: 'fries-extras',
    name: 'Fries Extras',
    selectionType: 'multiple',
    isRequired: false,
    options: [
      { id: 'extra-sauce', name: 'Extra Sauce', price: 3, cost: 1 },
      { id: 'add-sausage', name: 'Add Sausage', price: 8, cost: 4 },
      { id: 'add-chicken', name: 'Add Chicken', price: 12, cost: 6 },
    ],
  },
  {
    id: 'wing-sauce',
    name: 'Wing Sauce',
    selectionType: 'single',
    isRequired: false,
    options: [
      { id: 'bbq', name: 'BBQ', price: 0, cost: 0 },
      { id: 'spicy', name: 'Spicy', price: 0, cost: 0 },
      { id: 'honey-garlic', name: 'Honey Garlic', price: 0, cost: 0 },
    ],
  },
  {
    id: 'meal-extras',
    name: 'Meal Extras',
    selectionType: 'multiple',
    isRequired: false,
    options: [
      { id: 'extra-chicken-piece', name: 'Extra Chicken', price: 20, cost: 11 },
      { id: 'fried-plantain', name: 'Fried Plantain', price: 8, cost: 3 },
      { id: 'extra-salad', name: 'Extra Salad', price: 6, cost: 2.5 },
    ],
  },
  {
    id: 'dessert-extras',
    name: 'Dessert Extras',
    selectionType: 'multiple',
    isRequired: false,
    options: [
      { id: 'ice-cream-scoop', name: 'Ice Cream Scoop', price: 8, cost: 3 },
      { id: 'chocolate-sauce', name: 'Chocolate Sauce', price: 3, cost: 1 },
    ],
  },
]

export const taxRules = [
  {
    id: 'standard-tax',
    name: 'Standard Tax',
    rate: 0.15,
    isEnabledByDefault: true,
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
  {
    id: 'item',
    name: 'Item Discount',
    valueType: 'item',
  },
]