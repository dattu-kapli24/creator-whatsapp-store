'use client'

import { useCallback, useMemo, useState } from 'react'
import type { Product } from '@/lib/store-config'
import { type CartItem, makeLineId } from '@/lib/cart'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback(
    (product: Product, customizations: Record<string, string>, quantity = 1) => {
      const lineId = makeLineId(product.id, customizations)
      setItems((prev) => {
        const existing = prev.find((i) => i.lineId === lineId)
        if (existing) {
          return prev.map((i) =>
            i.lineId === lineId ? { ...i, quantity: i.quantity + quantity } : i,
          )
        }
        return [...prev, { lineId, product, customizations, quantity }]
      })
    },
    [],
  )

  const updateQuantity = useCallback((lineId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.lineId === lineId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0),
    )
  }, [])

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const count = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items])

  return { items, addItem, updateQuantity, removeItem, clearCart, count }
}
