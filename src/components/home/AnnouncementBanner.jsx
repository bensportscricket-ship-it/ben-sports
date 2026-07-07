import announcements from '../../data/announcements.json'

export default function AnnouncementBanner() {
  const latest = announcements[0]
  if (!latest) return null

  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="flex items-start gap-3 rounded-xl border border-bail-dim/60 bg-bail-dim/10 px-5 py-3.5">
        <span className="mt-0.5 font-mono text-xs uppercase tracking-widest text-bail">Announcement</span>
        <p className="text-sm text-ink">{latest.message}</p>
      </div>
    </section>
  )
}
