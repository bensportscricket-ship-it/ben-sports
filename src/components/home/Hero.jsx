import Button from '../ui/Button'
import SectionEyebrow from '../ui/SectionEyebrow'

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 pb-16 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-20 lg:pt-20">
      <div>
        <SectionEyebrow>Season 3 · Registrations Live</SectionEyebrow>
        <h1 className="mt-5 text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
          Grassroots cricket,
          <br />
          run like the <span className="text-pitch-bright">pros</span>.
        </h1>
        <p className="mt-6 max-w-lg text-base text-ink-muted sm:text-lg">
          BEN SPORTS brings tournaments, teams, players and fans onto one field —
          fixtures, scorecards and hall-of-fame stats, updated in real time.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button to="/tournaments" variant="primary">
            View Tournaments
          </Button>
          <Button to="/teams" variant="secondary">
            Explore Teams
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="rounded-2xl border border-line bg-bg-elevated p-6 shadow-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">Live Scoreboard</span>
            <span className="flex items-center gap-1.5 text-xs text-pitch-bright">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pitch-bright" />
              LIVE
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-muted">BEN Warriors</p>
              <p className="scoreboard-digit text-3xl">184/6</p>
            </div>
            <span className="text-xs text-ink-faint">18.4 OV</span>
            <div className="text-right">
              <p className="text-sm text-ink-muted">Delhi Strikers</p>
              <p className="scoreboard-digit text-3xl">—</p>
            </div>
          </div>

          <div className="mt-5 border-t border-line pt-4 text-sm text-ink-muted">
            Warriors need <span className="text-bail">32</span> off <span className="text-bail">8</span> balls.
          </div>
        </div>
      </div>
    </section>
  )
}
