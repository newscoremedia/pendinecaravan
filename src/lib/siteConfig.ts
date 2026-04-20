export const LISTING = {
  title: 'Pendine Caravan',
  subtitle: 'Willerby Pinehurst Lodge (2020) • 3-bed holiday lodge for sale',
  priceGbp: 84995,
  location: 'Pendine Sands, Carmarthenshire, Wales',
} as const

export const CONTACT = {
  name: 'Sam',
  email: 'info@pendinecaravan.com',
  // Set WhatsApp number in international format (digits only recommended), e.g. 4479...
  whatsapp: '447XXXXXXXXX',
  // Set this to your Messenger profile/page link if desired, e.g. https://m.me/<your_page>
  messengerUrl: 'https://m.me/',
} as const

export const YOUTUBE = {
  // Paste the YouTube video ID here (the bit after v= in the URL),
  // or set VITE_YOUTUBE_ID when deploying.
  id: (import.meta.env.VITE_YOUTUBE_ID as string | undefined) || '3BdicN22AXs',
} as const

