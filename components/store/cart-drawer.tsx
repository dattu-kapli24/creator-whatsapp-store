'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  buildWhatsAppUrl,
  formatPrice,
  getShipping,
  getSubtotal,
  type CartItem,
  type CustomerDetails,
} from '@/lib/cart'
import { storeConfig } from '@/lib/store-config'

type Props = {
  open: boolean
  onClose: () => void
  items: CartItem[]
  updateQuantity: (lineId: string, delta: number) => void
  removeItem: (lineId: string) => void
  onOrderPlaced: () => void
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

export function CartDrawer({
  open,
  onClose,
  items,
  updateQuantity,
  removeItem,
  onOrderPlaced,
}: Props) {
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    address: '',
    instructions: '',
  })
  const [attempted, setAttempted] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const subtotal = getSubtotal(items)
  const shipping = getShipping(subtotal, storeConfig)
  const total = subtotal + shipping
  const symbol = storeConfig.currencySymbol

  const detailsMissing = !customer.name.trim() || !customer.address.trim()

  function handleCheckout() {
    if (items.length === 0) return
    if (detailsMissing) {
      setAttempted(true)
      return
    }
    const url = buildWhatsAppUrl(items, customer, storeConfig)
    // In an embedded iframe (e.g. v0 preview) open a new tab; otherwise navigate directly.
    if (typeof window !== 'undefined' && window.self !== window.top) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = url
    }
    onOrderPlaced()
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transition-opacity duration-300',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close order summary"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className={cn(
          'absolute inset-x-0 bottom-0 mx-auto flex max-h-[92vh] max-w-md flex-col rounded-t-3xl border-t border-border bg-background shadow-2xl transition-transform duration-300 ease-out',
          open ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        {/* Grab handle */}
        <div className="flex justify-center pb-1 pt-3">
          <span className="h-1 w-10 rounded-full bg-border" aria-hidden="true" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 px-5 pb-3">
          <h2 className="font-serif text-xl font-semibold text-foreground">Your order</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scroll area */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ShoppingBag className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="text-sm text-muted-foreground">Your order is empty.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4 py-4">
              {items.map((item) => (
                <li key={item.lineId} className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
                    <Image
                      src={item.product.image || '/placeholder.svg'}
                      alt={item.product.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold leading-snug text-foreground">
                        {item.product.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item.lineId)}
                        aria-label={`Remove ${item.product.title}`}
                        className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    {Object.entries(item.customizations).map(([key, value]) =>
                      value ? (
                        <p key={key} className="text-xs text-muted-foreground">
                          {key}: <span className="text-foreground/80">{value}</span>
                        </p>
                      ) : null,
                    )}

                    <div className="mt-1 flex items-center justify-between">
                      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.lineId, -1)}
                          aria-label="Decrease quantity"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.lineId, 1)}
                          aria-label="Increase quantity"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        {formatPrice(item.product.price * item.quantity, symbol)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 ? (
            <div className="flex flex-col gap-4 border-t border-border/70 py-4">
              {/* Customer details */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-foreground">Delivery details</h3>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cust-name" className="text-xs font-semibold text-foreground/80">
                    Your name <span className="text-brand">*</span>
                  </label>
                  <input
                    id="cust-name"
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                    placeholder="Full name"
                    className={cn(
                      'min-h-11 w-full rounded-xl border bg-card px-3.5 py-2.5 text-base text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-brand/25',
                      attempted && !customer.name.trim()
                        ? 'border-destructive'
                        : 'border-input focus:border-brand',
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cust-addr" className="text-xs font-semibold text-foreground/80">
                    Delivery address <span className="text-brand">*</span>
                  </label>
                  <textarea
                    id="cust-addr"
                    value={customer.address}
                    onChange={(e) => setCustomer((c) => ({ ...c, address: e.target.value }))}
                    placeholder="House / flat, street, city, pincode"
                    rows={3}
                    className={cn(
                      'w-full resize-none rounded-xl border bg-card px-3.5 py-2.5 text-base text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-brand/25',
                      attempted && !customer.address.trim()
                        ? 'border-destructive'
                        : 'border-input focus:border-brand',
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cust-note" className="text-xs font-semibold text-foreground/80">
                    Special instructions
                  </label>
                  <input
                    id="cust-note"
                    type="text"
                    value={customer.instructions}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, instructions: e.target.value }))
                    }
                    placeholder="Gift wrap, delivery date, etc. (optional)"
                    className="min-h-11 w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-base text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-brand focus:ring-2 focus:ring-brand/25"
                  />
                </div>
              </div>

              {/* Price breakdown */}
              <div className="flex flex-col gap-2 rounded-2xl bg-muted/60 p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal, symbol)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? 'Free' : formatPrice(shipping, symbol)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between border-t border-border/70 pt-2 text-base font-bold text-foreground">
                  <span>Total</span>
                  <span>{formatPrice(total, symbol)}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Sticky checkout footer */}
        {items.length > 0 ? (
          <div className="border-t border-border/70 bg-background px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
            {attempted && detailsMissing ? (
              <p className="mb-2 text-center text-xs font-medium text-destructive">
                Please add your name and delivery address.
              </p>
            ) : null}
            <button
              type="button"
              onClick={handleCheckout}
              className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-5 py-3.5 text-base font-bold text-whatsapp-foreground shadow-lg shadow-whatsapp/25 transition-transform active:scale-[0.99]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Place Order via WhatsApp
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Opens WhatsApp with your order ready to send.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
