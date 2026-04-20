import { Link } from 'react-router-dom'
import { LISTING } from '../lib/siteConfig'

export function RunningCostsPage() {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <Link
              to="/"
              className="truncate text-sm font-semibold tracking-wide hover:text-indigo-600"
              aria-label="Return to home page"
            >
              {LISTING.title}
            </Link>
            <div className="truncate text-xs text-slate-600">Running costs</div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              to="/"
            >
              Back to listing
            </Link>
            <a
              className="rounded-full bg-indigo-500 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-400"
              href="/#enquire"
            >
              Enquire
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Running costs (guide)
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
            Ongoing costs are a normal part of lodge ownership. We’re sharing real figures we’ve paid where
            known, plus a few examples that can vary over time. Buyers should always confirm current
            charges directly with Parkdean and relevant providers.
          </p>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <span className="font-semibold">Finance:</span> we do not provide finance. If you’d like to explore
            lenders/brokers, you can start with this search:{' '}
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

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: 'Annual pitch / site fees (2026)',
                value: '£7,031.18',
                note: 'Early payment/payment plan may reduce the amount—confirm current discount options with Parkdean.',
              },
              {
                title: 'Rates (July 2025 → July 2026)',
                value: '£617.59',
                note: 'Billed annually.',
              },
              {
                title: 'Insurance (5 Oct 2025 → 4 Oct 2026)',
                value: '£321.24',
                note: 'Policy cost can vary by provider/cover.',
              },
              {
                title: 'Alarm monitoring (Ramtech)',
                value: '£121',
                note: 'Optional monitoring service (not required).',
              },
              {
                title: 'Gas safety test (this year)',
                value: '£110',
                note: 'Completed via Parkdean.',
              },
              {
                title: 'Electrical test',
                value: 'Mar 2024 → Mar 2027',
                note: 'Example cost previously £120 via Parkdean (can vary).',
              },
              {
                title: 'Utilities',
                value: 'Metered',
                note: 'Provided by Parkdean; costs depend on usage and unit rates at the time.',
              },
              {
                title: 'Servicing & repairs',
                value: 'Via Parkdean',
                note: 'We’ve used Parkdean for servicing/repairs and annual safety checks.',
              },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">{c.title}</div>
                <div className="mt-2 text-xl font-semibold tracking-tight text-slate-900">{c.value}</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">{c.note}</div>
              </div>
            ))}
          </div>

          <details className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">
              Licence agreement & park closure dates
            </summary>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
              <p>
                Each lodge has a licence agreement with Parkdean; ownership of the lodge is separate from the
                pitch it stands on. The annual pitch/site fee relates to the pitch/licence and site ground
                maintenance.
              </p>
              <p>
                The site typically closes around <span className="font-semibold">3rd January</span> and reopens on{' '}
                <span className="font-semibold">1st March</span>. Visits are possible, but overnight stays are not
                permitted during the closed period (per the licence terms).
              </p>
            </div>
          </details>

          <div className="mt-6 text-xs text-slate-600">
            Note: all figures are provided as a guide and may change over time.
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600">
          <Link className="font-semibold text-indigo-600 hover:text-indigo-500" to="/">
            ← Back to the listing
          </Link>
        </div>
      </footer>
    </div>
  )
}

