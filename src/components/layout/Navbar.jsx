import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import navigation from '../../data/navigation.json'
import Button from '../ui/Button'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            BEN <span className="text-pitch-bright">SPORTS</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navigation.primary.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors ${
                  isActive ? 'text-pitch-bright' : 'text-ink-muted hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:block">
          <Button to="/login" variant="secondary">
            Login
          </Button>
        </div>

        <button
          className="flex flex-col gap-1.5 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-0.5 w-6 bg-ink transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-6 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-ink transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-bg lg:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {navigation.primary.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-sm font-medium ${
                    isActive ? 'bg-bg-elevated text-pitch-bright' : 'text-ink-muted hover:bg-bg-elevated hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Button to="/login" variant="secondary" className="mt-2 w-full" onClick={() => setOpen(false)}>
              Login
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
