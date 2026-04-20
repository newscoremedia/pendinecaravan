import { useMemo, useState } from 'react'

type CarouselImage = {
  src: string
  alt: string
}

export function Carousel(props: { images: CarouselImage[]; className?: string }) {
  const images = props.images
  const [idx, setIdx] = useState(0)

  const canUse = images.length > 0

  const dots = useMemo(() => images.map((_, i) => i), [images])
  const safeIdx = canUse ? ((idx % images.length) + images.length) % images.length : 0
  const current = images[safeIdx]

  function prev() {
    setIdx((i) => (i - 1 + images.length) % images.length)
  }

  function next() {
    setIdx((i) => (i + 1) % images.length)
  }

  if (!canUse || !current) {
    return (
      <div
        className={
          props.className ??
          'rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm'
        }
      >
        Add photos to <code className="rounded bg-white/10 px-1.5 py-0.5">src/assets/photos/</code>{' '}
        to see the carousel.
      </div>
    )
  }

  return (
    <div className={props.className}>
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="aspect-[16/10] bg-slate-100">
          <img src={current.src} alt={current.alt} className="h-full w-full object-cover" />
        </div>

        <button
          type="button"
          onClick={prev}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white/85 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur hover:bg-white"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white/85 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur hover:bg-white"
        >
          ›
        </button>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4">
          <div className="text-sm font-semibold text-white/95">{current.alt}</div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {dots.map((i) => (
              <button
                key={i}
                type="button"
                aria-label={`View photo ${i + 1}`}
                onClick={() => setIdx(i)}
                className={[
                  'h-2.5 w-2.5 rounded-full border border-white/30',
                  i === safeIdx ? 'bg-white' : 'bg-white/25 hover:bg-white/40',
                ].join(' ')}
              />
            ))}
            <div className="ml-auto text-xs text-white/80">
              {safeIdx + 1} / {images.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

