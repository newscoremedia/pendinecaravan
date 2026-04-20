import { getListingImages } from '../lib/listingImages'

export function Gallery(props: { className?: string }) {
  const imgs = getListingImages()

  if (imgs.length === 0) {
    return (
      <div
        className={
          props.className ??
          'rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300'
        }
      >
        Add your photos to <code className="rounded bg-white/10 px-1.5 py-0.5">src/assets/photos/</code>{' '}
        (e.g. <code className="rounded bg-white/10 px-1.5 py-0.5">01-hero.jpg</code>,{' '}
        <code className="rounded bg-white/10 px-1.5 py-0.5">02-lounge.webp</code>).
      </div>
    )
  }

  const floorplanIndex = imgs.findIndex((img) => /floor\s*plan/i.test(img.alt))

  return (
    <div className={props.className}>
      <div className="grid gap-3 sm:grid-cols-2">
        {imgs.map((img, idx) => (
          <div
            key={img.src}
            className={[
              'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5',
              idx === floorplanIndex ? 'aspect-[16/10] sm:col-span-2' : 'aspect-[4/3]',
            ].join(' ')}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <div className="text-xs font-semibold text-white/90">{img.alt}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

