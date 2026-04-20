type GalleryImage = {
  src: string
  alt: string
}

// Vite bundles any images placed in ../assets/photos/
const modules = import.meta.glob('../assets/photos/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  as: 'url',
})

export function getListingImages(): GalleryImage[] {
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, src]) => {
      const filename = path.split('/').pop() ?? 'Photo'
      const label = filename
        .replace(/\.[^.]+$/, '')
        .replaceAll('-', ' ')
        .replaceAll('_', ' ')
      return { src: String(src), alt: label }
    })
}

