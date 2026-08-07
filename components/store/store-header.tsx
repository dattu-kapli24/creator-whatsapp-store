'use client'

import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { storeConfig } from '@/lib/store-config'

export function StoreHeader() {
  const contactHref = `https://wa.me/${storeConfig.whatsappNumber}`

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-brand/25">
          <Image
            src={storeConfig.avatar || '/placeholder.svg'}
            alt={`${storeConfig.ownerName}, owner of ${storeConfig.storeName}`}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate font-serif text-lg leading-tight font-semibold text-foreground">
            {storeConfig.storeName}
          </h1>
          <p className="truncate text-xs text-muted-foreground">by {storeConfig.ownerName}</p>
        </div>

        <a
          href={contactHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand/15 active:scale-[0.98]"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Contact
        </a>
      </div>
    </header>
  )
}
