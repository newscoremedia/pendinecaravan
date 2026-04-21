import { useMemo, useState, type FormEvent } from 'react'
import { Navigate, Route, Routes, Link } from 'react-router-dom'
import { Carousel } from './components/Carousel'
import { getListingImages } from './lib/listingImages'
import { CONTACT, LISTING, YOUTUBE } from './lib/siteConfig'
import { RunningCostsPage } from './pages/RunningCostsPage'

function formatGbp(value: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value)
}

function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ')
}

type FormState = {
  name: string
  email: string
  phone: string
  message: string
}

const initialForm: FormState = { name: '', email: '', phone: '', message: '' }

function YouTubeEmbed(props: { id: string; title: string }) {
  const id = props.id.trim()
  if (!id) return null

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-video bg-slate-100">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(
            id
          )}?rel=0`}
          title={props.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  )
}

function HomePage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const price = useMemo(() => `${formatGbp(LISTING.priceGbp)} O.N.O.`, [])
  const images = useMemo(() => getListingImages(), [])
  const heroImage = images[0]
  const floorplanImage = images.find((img) => /floor\s*plan/i.test(img.alt))
  const carouselImages = images.filter(
    (img) => img.src !== heroImage?.src && img.src !== floorplanImage?.src
  )

  const formEndpoint = (import.meta.env.VITE_FORM_ENDPOINT as string | undefined) || undefined

  const whatsappHref = useMemo(() => {
    const digits = CONTACT.whatsapp.replaceAll(/[^0-9]/g, '')
    const text = [
      `Enquiry: ${LISTING.subtitle}`,
      `Price: ${price}`,
      `Name: ${form.name || '-'}`,
      `Email: ${form.email || '-'}`,
      `Phone: ${form.phone || '-'}`,
      '',
      form.message || '(No message)',
    ].join('\n')
    const qs = new URLSearchParams({ text })
    return `https://wa.me/${digits}?${qs.toString()}`
  }, [form, price])

  const messengerHref = useMemo(() => {
    const url = CONTACT.messengerUrl || 'https://m.me/'
    return url
  }, [])

  const mailtoHref = useMemo(() => {
    const subject = `Enquiry: ${LISTING.title}`
    const bodyLines = [
      `Name: ${form.name || '-'}`,
      `Email: ${form.email || '-'}`,
      `Phone: ${form.phone || '-'}`,
      '',
      form.message || '(No message)',
    ]
    const params = new URLSearchParams({
      subject,
      body: bodyLines.join('\n'),
    })
    return `mailto:${CONTACT.email}?${params.toString()}`
  }, [form])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setSubmitted(false)
    setSubmitError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)

    if (!formEndpoint) {
      window.location.href = whatsappHref
      return
    }

    try {
      const res = await fetch(formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing: LISTING.title,
          subtitle: LISTING.subtitle,
          price,
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      })

      if (!res.ok) {
        throw new Error(`Bad response: ${res.status}`)
      }

      setSubmitted(true)
      setForm(initialForm)
    } catch {
      setSubmitError(
        'Could not send the form right now. Please use WhatsApp, Messenger, or email.'
      )
    }
  }

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <div className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <Link
              to="/"
              className="truncate text-sm font-semibold tracking-wide hover:text-indigo-600"
              aria-label="Return to home page"
            >
              {LISTING.title}
            </Link>
            <div className="truncate text-xs text-slate-600">{LISTING.location}</div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              className="hidden rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm hover:bg-slate-50 sm:inline-flex"
              to="/running-costs"
            >
              Running costs
            </Link>
            <a
              className="rounded-full bg-indigo-500 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-400"
              href="#enquire"
            >
              Enquire now
            </a>
          </div>
        </div>
      </div>

      <main>
        <section className="relative overflow-hidden border-b border-slate-200">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_0%,rgba(99,102,241,0.18),rgba(248,250,252,0))]" />
          <div className="relative">
            {heroImage ? (
              <>
                {/* Mobile panoramic: swipe/scroll horizontally to see full image */}
                <div className="relative h-[44vh] min-h-[300px] w-full overflow-x-auto sm:hidden">
                  <img
                    src={heroImage.src}
                    alt="Holiday lodge hero photo"
                    className="h-full w-auto max-w-none select-none"
                    decoding="async"
                    loading="eager"
                    draggable={false}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />
                </div>

                {/* Desktop/tablet: cover hero */}
                <div className="relative hidden h-[52vh] min-h-[340px] w-full sm:block">
                  <img
                    src={heroImage.src}
                    alt="Holiday lodge hero photo"
                    className="absolute inset-0 h-full w-full object-cover [object-position:50%_40%]"
                    decoding="async"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />
                </div>
              </>
            ) : (
              <div className="h-[40vh] min-h-[260px] w-full bg-slate-100" />
            )}

            <div className="mx-auto -mt-28 max-w-6xl px-4 pb-10 sm:-mt-32">
              <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Available now • Quick response
                </div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
                  Private sale • For sale by owner (not the holiday park)
                </div>

                <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                  {LISTING.subtitle}
                </h1>

                <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-slate-700">
                  Located in <span className="font-semibold">Castle View</span>, the most sought‑after spot at
                  Pendine Sands Holiday Park, with sweeping views over the park and out to sea.
                  This lodge has <span className="font-semibold">never been let</span>—it’s been enjoyed only
                  by our own family.
                </p>

                <details className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">
                    Read more about Castle View & the lifestyle
                  </summary>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                    <p>
                      Located in Castle View, the most sought-after spot in Pendine Sands Holiday Park, this
                      lodge offers something truly special: views that take your breath away every single day.
                      From your deck, gaze out over miles of golden sand and the shimmering waters of
                      Carmarthen Bay. Enjoy your morning coffee with the sunrise over the sea, or unwind in
                      the evening as the sun sets in spectacular fashion.
                    </p>
                    <p>
                      Beyond the views, the location comes with wonderful lifestyle benefits. Pendine Sands is
                      famous for its seven-mile beach—a paradise for beach walks, sunbathing, sandcastle
                      building and more. As an owner here, you’re not just buying a home, you’re inheriting a
                      lifestyle: morning strolls on the beach, afternoons exploring the Welsh coastline, and
                      evenings watching the stars while listening to the waves.
                    </p>
                    <p>
                      The park amenities (swimming pool, restaurants, owner’s lounge, and more) are at your
                      disposal when you feel like socialising or indulging in leisure activities. In short, Castle
                      View offers a peaceful, private retreat within a vibrant holiday community—the best of
                      both worlds.
                    </p>
                  </div>
                </details>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="text-xs font-semibold text-slate-600">Price</div>
                    <div className="text-2xl font-semibold tracking-tight text-slate-900">
                      {price}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="text-xs font-semibold text-slate-600">Location</div>
                    <div className="text-sm font-semibold text-slate-900">
                      {LISTING.location}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="text-xs font-semibold text-slate-600">Holiday park</div>
                    <div className="text-sm font-semibold text-slate-900">
                      Parkdean Resorts • Pendine Sands
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="text-xs font-semibold text-slate-600">Licence</div>
                    <div className="text-sm font-semibold text-slate-900">
                      34 years remaining (40‑year)
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
                    href="#enquire"
                  >
                    Make enquiry
                  </a>
                  <a
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-400"
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp enquiry
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-2">
              <div className="text-sm font-semibold text-slate-900">Photos</div>
              <div className="mt-3">
                <Carousel images={carouselImages} />
              </div>

              <div className="mt-8">
                <div className="text-sm font-semibold text-slate-900">Video walkthrough</div>
                <div className="mt-3">
                  <YouTubeEmbed id={YOUTUBE.id} title="Willerby Pinehurst Lodge video" />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">What you get</div>
              <ul className="mt-3 grid gap-2 text-sm text-slate-300">
                {[
                  'Willerby Pinehurst Lodge (2020)',
                  '3 bedrooms • bathroom • master en‑suite',
                  'Master walk‑in wardrobe',
                  'Castle View pitch with sea views',
                  'Never been let (family use only)',
                  'TVs in every room',
                  'Wired for Sky + extra TV aerial',
                  '34 years remaining on a 40‑year licence',
                  'Brand new fridge freezer',
                  'Dishwasher + washer drier',
                  'Move‑in ready contents included',
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                    <span className="text-slate-700">{x}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-xs text-slate-600">
                Included (if you’d like): crockery, cutlery, kettle, and coffee machine.
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
              <div className="lg:col-span-1">
                <div className="text-sm font-semibold text-slate-900">
                  Park & location highlights
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  Located on <span className="font-semibold">Parkdean Resorts’ Pendine Sands Holiday Park</span>,
                  just a <span className="font-semibold">5‑minute walk to the beach</span>.
                  Pendine’s famous beach stretches for around <span className="font-semibold">seven miles</span>,
                  with plenty of activities happening along the sands.
                </p>
              </div>

              <div className="lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      title: 'Food & drink',
                      items: ['Restaurants / dining on site', 'Members’ bar'],
                    },
                    {
                      title: 'Leisure',
                      items: ['Swimming pool', 'Gym (on site)'],
                    },
                    {
                      title: 'Entertainment',
                      items: ['Nightclub & entertainment', 'Family-friendly events'],
                    },
                    {
                      title: 'Beach lifestyle',
                      items: ['5‑minute walk to beach', '9‑mile sands + activities'],
                    },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="text-sm font-semibold text-slate-900">
                        {card.title}
                      </div>
                      <ul className="mt-2 grid gap-2 text-sm text-slate-700">
                        {card.items.map((x) => (
                          <li key={x} className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500/70" />
                            <span>{x}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Running costs</div>
                  <div className="mt-1 text-sm text-slate-700">
                    Pitch/site fees, rates, insurance, utilities and other ongoing costs — all in one place.
                  </div>
                </div>
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                  to="/running-costs"
                >
                  View running costs
                </Link>
              </div>
            </div>
          </div>
        </section>

        {floorplanImage ? (
          <section className="border-b border-slate-200">
            <div className="mx-auto max-w-6xl px-4 py-12">
              <div className="text-sm font-semibold text-slate-900">Floorplan</div>
              <div className="mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <img
                  src={floorplanImage.src}
                  alt={floorplanImage.alt}
                  className="max-h-[80vh] w-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        ) : null}

        <section id="enquire" className="border-t border-slate-200">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Enquire about this lodge
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                The fastest way to reach us is WhatsApp or Messenger. You can also use the
                form below.
              </p>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Contact</div>
                <div className="mt-2 space-y-1 text-sm text-slate-700">
                  <div>
                    <span className="text-slate-500">Name:</span> {CONTACT.name}
                  </div>
                  <div>
                    <span className="text-slate-500">Email:</span> {CONTACT.email}
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <a
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-white hover:bg-emerald-400"
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                  <a
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                    href={messengerHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Messenger
                  </a>
                  <a
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                    href={mailtoHref}
                  >
                    Email
                  </a>
                </div>
                {!formEndpoint ? (
                  <div className="mt-3 text-xs text-slate-500">
                    The “Send enquiry” button will open WhatsApp.
                  </div>
                ) : null}

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                  <span className="font-semibold">Finance:</span> this is a private sale and we do not provide finance.
                  If you want to explore lenders/brokers, you can start with this search:{' '}
                  <a
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                    href="https://www.google.com/search?q=caravan+lodge+finance&oq=caravan+lodge+finance&sourceid=chrome&ie=UTF-8"
                    target="_blank"
                    rel="noreferrer"
                  >
                    caravan lodge finance
                  </a>
                  .
                </div>
              </div>
            </div>

            <form
              onSubmit={submit}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-xs font-semibold text-slate-700">Name</span>
                  <input
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-indigo-500/30 placeholder:text-slate-400 focus:ring-2"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-semibold text-slate-700">Email</span>
                  <input
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-indigo-500/30 placeholder:text-slate-400 focus:ring-2"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@email.com"
                    autoComplete="email"
                    type="email"
                    required
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-xs font-semibold text-slate-700">Phone (optional)</span>
                  <input
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-indigo-500/30 placeholder:text-slate-400 focus:ring-2"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="Your phone number"
                    autoComplete="tel"
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-xs font-semibold text-slate-700">Message</span>
                  <textarea
                    className="min-h-28 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none ring-indigo-500/30 placeholder:text-slate-400 focus:ring-2"
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="Viewing times, questions, part‑exchange, etc."
                  />
                </label>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white hover:bg-indigo-400"
                >
                  Send enquiry
                </button>
                <a
                  href={mailtoHref}
                  className={classNames(
                    'inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50',
                    submitted && 'border-emerald-500/60'
                  )}
                >
                  Or open email draft
                </a>
              </div>

              {submitError ? (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  {submitError}
                </div>
              ) : null}

              {submitted && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                  Thanks — your enquiry has been sent. We’ll get back to you shortly.
                </div>
              )}
            </form>
          </div>
        </section>

        <footer className="border-t border-slate-200">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <div>
              © {new Date().getFullYear()} {LISTING.title}. Price shown: {price}.
            </div>
            <div className="flex gap-4">
              <a className="hover:text-slate-900" href="#enquire">
                Enquire
              </a>
              <a className="hover:text-slate-900" href={mailtoHref}>
                Email
              </a>
            </div>
          </div>
          <div className="mx-auto max-w-6xl px-4 pb-10 text-xs text-slate-500">
            This website advertises a <span className="font-semibold">private sale</span> (for sale by owner).
            It is <span className="font-semibold">not</span> an official listing for Parkdean Resorts or the holiday park.
          </div>
        </footer>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/running-costs" element={<RunningCostsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
