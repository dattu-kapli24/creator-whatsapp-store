'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Check, ChevronDown, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/cart'
import { storeConfig, type Product } from '@/lib/store-config'

type Props = {
  product: Product
  onAdd: (product: Product, customizations: Record<string, string>, quantity: number) => void
}

function buildInitialValues(product: Product): Record<string, string> {
  const initial: Record<string, string> = {}
  product.customFields?.forEach((f) => {
    initial[f.key] = f.type === 'select' ? (f.options?.[0] ?? '') : ''
  })
  return initial
}

export function ProductCard({ product, onAdd }: Props) {
  const hasOptions = (product.customFields?.length ?? 0) > 0

  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<Record<string, string>>(() => buildInitialValues(product))
  const [added, setAdded] = useState(false)
  const [error, setError] = useState(false)

  const missingRequired = (product.customFields ?? []).some(
    (f) => f.required && !values[f.key]?.trim(),
  )

  // Lock body scroll while the options sheet is open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  function flashAdded() {
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  function handleCardCta() {
    if (hasOptions) {
      setValues(buildInitialValues(product))
      setError(false)
      setOpen(true)
      return
    }
    onAdd(product, {}, 1)
    flashAdded()
  }

  function handleConfirm() {
    if (missingRequired) {
      setError(true)
      return
    }
    onAdd(product, values, 1)
    setOpen(false)
    flashAdded()
  }

  return (
    <>
      <article className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="relative aspect-square w-full bg-muted">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="h-full w-full object-cover"
          />
          {product.badge ? (
            <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold text-brand shadow-sm backdrop-blur">
              {product.badge}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3">
          <h3 className="font-serif text-sm leading-snug font-semibold text-balance text-foreground">
            {product.title}
          </h3>
          <span className="text-sm font-bold text-foreground">
            {formatPrice(product.price, storeConfig.currencySymbol)}
          </span>

          <button
            type="button"
            onClick={handleCardCta}
            aria-label={
              hasOptions ? `Customise ${product.title}` : `Add ${product.title} to order`
            }
            className={cn(
              'mt-auto inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all active:scale-[0.98]',
              added
                ? 'bg-whatsapp text-whatsapp-foreground'
                : 'bg-brand text-brand-foreground hover:opacity-90',
            )}
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                {hasOptions ? 'Customise' : 'Add'}
              </>
            )}
          </button>
        </div>
      </article>

      {/* Options bottom sheet */}
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={`Customise ${product.title}`}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />

          <div className="animate-in slide-in-from-bottom-4 relative z-10 max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-border/70 bg-card pb-6 shadow-2xl duration-200">
            <div className="flex justify-center pb-1 pt-3">
              <span className="h-1 w-10 rounded-full bg-border" aria-hidden="true" />
            </div>

            <div className="flex items-start gap-3 border-b border-border/70 px-5 pb-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={product.image || '/placeholder.svg'}
                  alt=""
                  fill
                  sizes="64px"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg leading-snug font-semibold text-foreground">
                  {product.title}
                </h3>
                <span className="text-sm font-bold text-foreground">
                  {formatPrice(product.price, storeConfig.currencySymbol)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col gap-4 px-5 pt-4">
              {product.customFields?.map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={`${product.id}-${field.key}`}
                    className="text-sm font-semibold text-foreground/80"
                  >
                    {field.label}
                    {field.required ? <span className="text-brand"> *</span> : null}
                  </label>

                  {field.type === 'select' ? (
                    <div className="relative">
                      <select
                        id={`${product.id}-${field.key}`}
                        value={values[field.key] ?? ''}
                        onChange={(e) => {
                          setValues((v) => ({ ...v, [field.key]: e.target.value }))
                          setError(false)
                        }}
                        className="min-h-11 w-full appearance-none rounded-xl border border-input bg-background px-3.5 py-2.5 pr-9 text-base text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25"
                      >
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                  ) : (
                    <input
                      id={`${product.id}-${field.key}`}
                      type="text"
                      value={values[field.key] ?? ''}
                      placeholder={field.placeholder}
                      onChange={(e) => {
                        setValues((v) => ({ ...v, [field.key]: e.target.value }))
                        setError(false)
                      }}
                      className={cn(
                        'min-h-11 w-full rounded-xl border bg-background px-3.5 py-2.5 text-base text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-brand/25',
                        error && field.required && !values[field.key]?.trim()
                          ? 'border-destructive'
                          : 'border-input focus:border-brand',
                      )}
                    />
                  )}
                </div>
              ))}

              {error && missingRequired ? (
                <p className="text-xs font-medium text-destructive">
                  Please fill in the required option above.
                </p>
              ) : null}

              <button
                type="button"
                onClick={handleConfirm}
                className="mt-1 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground transition-all hover:opacity-90 active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add to Order
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
