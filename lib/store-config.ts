// ─────────────────────────────────────────────────────────────
// Single source of truth for the whole storefront.
// Swap these values to re-theme the shop for any creator in seconds.
// ─────────────────────────────────────────────────────────────

export type CustomFieldType = 'text' | 'select'

export type CustomField = {
  /** stable key used in the order summary */
  key: string
  /** label shown to the customer */
  label: string
  type: CustomFieldType
  /** placeholder for text inputs */
  placeholder?: string
  /** options for select inputs */
  options?: string[]
  /** must be filled before adding to order */
  required?: boolean
}

export type Product = {
  id: string
  title: string
  description: string
  price: number
  image: string
  badge?: string
  customFields?: CustomField[]
}

export type StoreConfig = {
  storeName: string
  ownerName: string
  tagline: string
  avatar: string
  /** WhatsApp number in international format, digits only (no +, spaces or dashes) */
  whatsappNumber: string
  currencySymbol: string
  /** flat shipping fee; set to 0 for free shipping */
  shippingFee: number
  /** orders at/above this subtotal ship free */
  freeShippingThreshold: number
  products: Product[]
}

export const storeConfig: StoreConfig = {
  storeName: 'Petal & Thread',
  ownerName: 'Ananya',
  tagline: 'Handmade resin art, crochet & jewelry — made to order with love.',
  avatar: '/owner-avatar.png',
  whatsappNumber: '919876543210',
  currencySymbol: '₹',
  shippingFee: 60,
  freeShippingThreshold: 1500,
  products: [
    {
      id: 'resin-coasters',
      title: 'Ocean Wave Resin Coasters',
      description: 'Set of 4 translucent coasters with real gold leaf. Each one is unique.',
      price: 899,
      image: '/products/resin-coasters.png',
      badge: 'Bestseller',
      customFields: [
        {
          key: 'Colour theme',
          label: 'Colour theme',
          type: 'select',
          options: ['Ocean Teal', 'Blush Pink', 'Amber Gold', 'Midnight Blue'],
          required: true,
        },
      ],
    },
    {
      id: 'crochet-bee',
      title: 'Crochet Bumblebee Plushie',
      description: 'Squishy hand-crocheted bee in soft chunky yarn. About 15cm tall.',
      price: 649,
      image: '/products/crochet-bee.png',
      customFields: [
        {
          key: 'Yarn colour',
          label: 'Yarn colour',
          type: 'select',
          options: ['Classic Yellow', 'Lavender', 'Sage Green', 'Peach'],
          required: true,
        },
      ],
    },
    {
      id: 'name-keychain',
      title: 'Personalised Resin Keychain',
      description: 'Clear resin keychain with pressed flowers and your name inside.',
      price: 299,
      image: '/products/name-keychain.png',
      badge: 'Made to order',
      customFields: [
        {
          key: 'Name on keychain',
          label: 'Name on keychain',
          type: 'text',
          placeholder: 'e.g. Ananya',
          required: true,
        },
      ],
    },
    {
      id: 'chunky-blanket',
      title: 'Hand-knit Chunky Throw',
      description: 'Cozy chunky merino throw, hand-knit to order. 100 × 130 cm.',
      price: 2499,
      image: '/products/chunky-blanket.png',
      customFields: [
        {
          key: 'Colour',
          label: 'Colour',
          type: 'select',
          options: ['Blush Pink', 'Oatmeal', 'Sage', 'Charcoal'],
          required: true,
        },
      ],
    },
    {
      id: 'charm-bracelet',
      title: 'Pearl & Initial Bracelet',
      description: 'Freshwater pearls with a tiny gold initial charm of your choice.',
      price: 549,
      image: '/products/charm-bracelet.png',
      customFields: [
        {
          key: 'Initial',
          label: 'Initial charm',
          type: 'text',
          placeholder: 'e.g. A',
          required: true,
        },
      ],
    },
    {
      id: 'flower-frame',
      title: 'Pressed Flower Name Frame',
      description: 'Real dried flowers preserved in resin with a personalised name.',
      price: 1199,
      image: '/products/flower-frame.png',
      badge: 'Gift favourite',
      customFields: [
        {
          key: 'Name for frame',
          label: 'Name for frame',
          type: 'text',
          placeholder: 'e.g. The Sharma Family',
          required: true,
        },
      ],
    },
  ],
}
