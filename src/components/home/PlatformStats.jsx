import stats from '../../data/stats.json'

export default function PlatformStats() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="rounded-2xl border border-line bg-bg-elevated/60 px-6 py-8">
        <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <p className="scoreboard-digit text-3xl sm:text-4xl">
                {stat.value.toLocaleString('en-IN')}
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-ink-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
