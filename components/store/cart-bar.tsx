'use client'

import { ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/cart'
import { storeConfig } from '@/lib/store-config'

type Props = {
  count: number
  subtotal: number
  onOpen: () => void
}

export function CartBar({ count, subtotal, onOpen }: Props) {
  if (count === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
      <div className="mx-auto max-w-md">
        <button
          type="button"
          onClick={onOpen}
          className="flex min-h-14 w-full items-center justify-between gap-3 rounded-full bg-brand px-4 py-3 text-brand-foreground shadow-lg shadow-brand/25 transition-transform active:scale-[0.99]"
        >
          <span className="flex items-center gap-3">
            <span className="relative inline-flex">
              <ShoppingBag className="h-6 w-6" aria-hidden="true" />
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-background px-1 text-xs font-bold text-brand">
                {count}
              </span>
            </span>
            <span className="text-sm font-semibold">View order</span>
          </span>
          <span className="text-base font-bold">
            {formatPrice(subtotal, storeConfig.currencySymbol)}
          </span>
        </button>
      </div>
    </div>
  )
}
