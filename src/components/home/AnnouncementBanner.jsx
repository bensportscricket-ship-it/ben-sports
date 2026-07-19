import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'

export default function AnnouncementBanner() {
  const [items, setItems] = useState([])
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    supabase
      .from('announcements')
      .select('id, title, message, image_url, created_at')
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => setItems(data || []))
  }, [])

  if (items.length === 0) return null

  // Duplicate the list so the track can loop seamlessly at -50%.
  const track = [...items, ...items]

  return (
    <section className="mx-auto max-w-7xl px-6">
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="flex items-stretch overflow-hidden rounded-2xl border-2 border-bail bg-gradient-to-r from-bail-dim/30 via-bail/10 to-bail-dim/30 shadow-[0_0_28px_-6px_rgba(227,178,60,0.45)]"
      >
        <div className="flex flex-shrink-0 items-center gap-2 bg-bail px-5 py-4 text-bg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg/70"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-bg"></span>
          </span>
          <span className="font-display text-sm font-extrabold uppercase tracking-widest whitespace-nowrap">
            Announcements
          </span>
        </div>

        <div className="relative flex flex-1 items-center overflow-hidden py-4">
          <div
            className="flex animate-marquee items-center gap-16 whitespace-nowrap pr-16"
            style={{ animationPlayState: paused ? 'paused' : 'running' }}
          >
            {track.map((a, i) => (
              <div key={`${a.id}-${i}`} className="flex flex-shrink-0 items-center gap-3">
                {a.image_url && (
                  <img src={a.image_url} alt="" className="h-9 w-9 flex-shrink-0 rounded-lg object-cover border border-bail/40" />
                )}
                <p className="text-sm font-semibold text-ink">
                  {a.title && <span className="text-bail font-bold mr-1.5">{a.title} —</span>}
                  {a.message}
                </p>
                <span className="text-bail/50 text-lg leading-none">●</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
