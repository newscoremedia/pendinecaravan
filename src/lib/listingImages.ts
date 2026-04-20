type GalleryImage = {
  src: string
  alt: string
}

// Vite bundles any images placed in ../assets/photos/
// Include uppercase extensions too (Linux builds are case-sensitive).
const modules = import.meta.glob(
  '../assets/photos/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP,avif,AVIF}',
  {
  eager: true,
  query: '?url',
  import: 'default',
  }
)

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

