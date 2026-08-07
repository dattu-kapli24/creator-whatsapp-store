import type { Product, StoreConfig } from '@/lib/store-config'

export type CartItem = {
  /** unique per product + customization combination */
  lineId: string
  product: Product
  customizations: Record<string, string>
  quantity: number
}

export function formatPrice(amount: number, symbol: string) {
  return `${symbol}${amount.toLocaleString('en-IN')}`
}

export function makeLineId(productId: string, customizations: Record<string, string>) {
  const suffix = Object.entries(customizations)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|')
  return suffix ? `${productId}__${suffix}` : productId
}

export function getSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
}

export function getShipping(subtotal: number, config: StoreConfig) {
  if (subtotal <= 0) return 0
  if (config.freeShippingThreshold > 0 && subtotal >= config.freeShippingThreshold) return 0
  return config.shippingFee
}

export type CustomerDetails = {
  name: string
  address: string
  instructions: string
}

export function buildWhatsAppMessage(
  items: CartItem[],
  customer: CustomerDetails,
  config: StoreConfig,
) {
  const symbol = config.currencySymbol
  const subtotal = getSubtotal(items)
  const shipping = getShipping(subtotal, config)
  const total = subtotal + shipping

  const lines: string[] = []
  lines.push(`Hi ${config.ownerName}! I'd like to place an order from ${config.storeName} 🌸`)
  lines.push('')
  lines.push('*My Order*')

  items.forEach((item, i) => {
    lines.push(
      `${i + 1}. ${item.product.title} × ${item.quantity} — ${formatPrice(
        item.product.price * item.quantity,
        symbol,
      )}`,
    )
    Object.entries(item.customizations).forEach(([key, value]) => {
      if (value) lines.push(`   • ${key}: ${value}`)
    })
  })

  lines.push('')
  lines.push(`Subtotal: ${formatPrice(subtotal, symbol)}`)
  lines.push(`Shipping: ${shipping === 0 ? 'Free' : formatPrice(shipping, symbol)}`)
  lines.push(`*Total: ${formatPrice(total, symbol)}*`)
  lines.push('')
  lines.push('*Delivery Details*')
  lines.push(`Name: ${customer.name || '—'}`)
  lines.push(`Address: ${customer.address || '—'}`)
  if (customer.instructions.trim()) {
    lines.push(`Notes: ${customer.instructions.trim()}`)
  }

  return lines.join('\n')
}

export function buildWhatsAppUrl(
  items: CartItem[],
  customer: CustomerDetails,
  config: StoreConfig,
) {
  const text = encodeURIComponent(buildWhatsAppMessage(items, customer, config))
  return `https://wa.me/${config.whatsappNumber}?text=${text}`
}
