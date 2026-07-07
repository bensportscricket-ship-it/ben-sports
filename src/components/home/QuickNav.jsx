import { Link } from 'react-router-dom'
import navigation from '../../data/navigation.json'
import Card from '../ui/Card'
import SectionEyebrow from '../ui/SectionEyebrow'

export default function QuickNav() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <SectionEyebrow>Where to next</SectionEyebrow>
      <h2 className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">Every part of the game, one tap away.</h2>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {navigation.quickNav.map((item) => (
          <Card as={Link} key={item.id} className="group block p-6 transition-colors hover:border-pitch/60">
            <h3 className="text-lg font-semibold text-ink transition-colors group-hover:text-pitch-bright">
              {item.label}
            </h3>
            <p className="mt-2 text-sm text-ink-muted">{item.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-bail opacity-0 transition-opacity group-hover:opacity-100">
              Explore →
            </span>
          </Card>
        ))}
      </div>
    </section>
  )
}
