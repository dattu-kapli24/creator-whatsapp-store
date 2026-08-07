'use client'

import { useState } from 'react'
import { StoreHeader } from '@/components/store/store-header'
import { ProductGrid } from '@/components/store/product-grid'
import { CartBar } from '@/components/store/cart-bar'
import { CartDrawer } from '@/components/store/cart-drawer'
import { useCart } from '@/hooks/use-cart'
import { getSubtotal } from '@/lib/cart'
import { storeConfig } from '@/lib/store-config'

export default function Page() {
  const { items, addItem, updateQuantity, removeItem, clearCart, count } = useCart()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const subtotal = getSubtotal(items)

  return (
    <main className="min-h-dvh bg-background">
      <StoreHeader />

      <section className="mx-auto max-w-md px-4 pt-5">
        <h2 className="font-serif text-2xl leading-tight font-semibold text-balance text-foreground">
          {storeConfig.tagline}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Pick your favourites, customise them, and check out over WhatsApp.
        </p>
      </section>

      <ProductGrid onAdd={addItem} />

      <CartBar count={count} subtotal={subtotal} onOpen={() => setDrawerOpen(true)} />

      <CartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={items}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        onOrderPlaced={() => {
          clearCart()
          setDrawerOpen(false)
        }}
      />
    </main>
  )
}
