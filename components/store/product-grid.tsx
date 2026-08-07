'use client'

import { ProductCard } from '@/components/store/product-card'
import { storeConfig, type Product } from '@/lib/store-config'

type Props = {
  onAdd: (product: Product, customizations: Record<string, string>, quantity: number) => void
}

export function ProductGrid({ onAdd }: Props) {
  return (
    <section aria-label="Products" className="mx-auto max-w-2xl px-4 pb-24 pt-2">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {storeConfig.products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
    </section>
  )
}
