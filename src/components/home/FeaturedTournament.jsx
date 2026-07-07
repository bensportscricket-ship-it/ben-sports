import tournaments from '../../data/tournaments.json'
import Card from '../ui/Card'
import Button from '../ui/Button'
import SectionEyebrow from '../ui/SectionEyebrow'

export default function FeaturedTournament() {
  const tournament = tournaments.find((t) => t.featured) ?? tournaments[0]
  if (!tournament) return null

  const startLabel = new Date(tournament.startDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <SectionEyebrow>Featured Tournament</SectionEyebrow>
      <Card className="mt-5 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col justify-center bg-gradient-to-br from-pitch-dim/40 via-bg-elevated to-bg-elevated p-8">
            <span className="font-mono text-xs uppercase tracking-widest text-pitch-bright">
              Starts {startLabel}
            </span>
            <h3 className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">{tournament.name}</h3>
            <p className="mt-2 text-ink-muted">{tournament.tagline}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 p-8 sm:grid-cols-3">
            <Stat label="Teams" value={tournament.teamCount} />
            <Stat label="Matches" value={tournament.matchCount} />
            <Stat label="Venue" value={tournament.venue} isText />
            <div className="col-span-2 flex items-end sm:col-span-3">
              <Button to={`/tournaments/${tournament.id}`} variant="primary">
                Open Tournament Hub
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}

function Stat({ label, value, isText = false }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-ink-faint">{label}</p>
      <p className={isText ? 'mt-1 text-sm text-ink' : 'scoreboard-digit mt-1 text-2xl'}>{value}</p>
    </div>
  )
}
