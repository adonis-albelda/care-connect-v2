'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface CarouselProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  ariaLabel: string
}

export default function Carousel<T extends { id?: number | string }>({
  items,
  renderItem,
  ariaLabel,
}: CarouselProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const node = trackRef.current
    if (!node) return
    const child = node.children[index]
    child?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }, [index])

  if (!items.length) return null

  return (
    <div role="region" aria-label={ariaLabel} className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <div key={item.id ?? i} className="snap-start shrink-0 basis-full sm:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)]">
            {renderItem(item, i)}
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.id ?? i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span
                className={`h-3 w-3 rounded-full transition-colors duration-250 ${
                  i === index ? 'bg-connect-blue' : 'bg-border hover:bg-mist'
                }`}
              />
            </button>

          ))}
        </div>
      )}
    </div>
  )
}
