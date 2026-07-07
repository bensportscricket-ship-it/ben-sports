import { Link } from 'react-router-dom'
import navigation from '../../data/navigation.json'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="font-display text-lg font-bold text-ink">
              BEN <span className="text-pitch-bright">SPORTS</span>
            </span>
            <p className="mt-2 max-w-xs text-sm text-ink-muted">
              India&apos;s grassroots cricket ecosystem — tournaments, teams and heroes, in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm sm:grid-cols-3">
            {navigation.primary.map((item) => (
              <Link key={item.path} to={item.path} className="text-ink-muted transition-colors hover:text-ink">
                {item.label}
              </Link>
            ))}
            <Link to="/login" className="text-ink-muted transition-colors hover:text-ink">
              Login
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} BEN SPORTS. All rights reserved.</span>
          <span>Built for the grassroots game.</span>
        </div>
      </div>
    </footer>
  )
}
