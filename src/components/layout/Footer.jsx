import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import navigation from '../../data/navigation.json'
import { supabase } from '../../utils/supabaseClient'

export default function Footer() {
  const [shopInfo, setShopInfo] = useState(null)

  useEffect(() => {
    supabase.from('shop_settings').select('*').eq('id', 1).single().then(({ data }) => setShopInfo(data))
  }, [])

  const hasContactInfo = shopInfo && (shopInfo.address || shopInfo.phone || shopInfo.hours)

  const socialLinks = shopInfo
    ? [
        { url: shopInfo.facebook_url, label: 'Facebook', icon: FacebookIcon },
        { url: shopInfo.instagram_url, label: 'Instagram', icon: InstagramIcon },
        { url: shopInfo.youtube_url, label: 'YouTube', icon: YoutubeIcon },
        { url: shopInfo.x_url, label: 'X', icon: XIcon },
      ].filter((s) => s.url)
    : []

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
            {socialLinks.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                {socialLinks.map(({ url, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:border-pitch-bright hover:text-pitch-bright"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
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

          {hasContactInfo && (
            <div className="text-sm text-ink-muted space-y-1.5 max-w-xs">
              <p className="font-semibold text-ink text-xs uppercase tracking-wide">Visit Us</p>
              {shopInfo.address && <p>{shopInfo.address}</p>}
              {shopInfo.phone && <p>{shopInfo.phone}</p>}
              {shopInfo.hours && <p>{shopInfo.hours}</p>}
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} BEN SPORTS. All rights reserved.</span>
          <span>Built for the grassroots game.</span>
        </div>
      </div>
    </footer>
  )
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.58v1.9h2.77l-.44 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  )
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.6 7.2s-.21-1.49-.86-2.15c-.82-.87-1.74-.87-2.16-.92C15.6 4 12 4 12 4h-.01s-3.6 0-6.58.13c-.42.05-1.34.05-2.16.92-.65.66-.86 2.15-.86 2.15S2.18 8.94 2.18 10.68v1.63c0 1.74.21 3.48.21 3.48s.21 1.49.85 2.15c.82.87 1.9.84 2.38.94 1.73.17 7.38.22 7.38.22s3.6-.01 6.59-.14c.42-.05 1.34-.05 2.16-.92.65-.66.86-2.15.86-2.15s.21-1.74.21-3.48v-1.63c0-1.74-.21-3.48-.21-3.48ZM9.96 14.62V8.72l5.6 2.96-5.6 2.94Z" />
    </svg>
  )
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.24 3H21l-6.5 7.43L22.2 21h-6.03l-4.72-6.17L5.98 21H3.2l7-8.01L2.4 3h6.18l4.27 5.65L18.24 3Zm-1.06 16.17h1.67L7.9 4.73H6.1l11.08 14.44Z" />
    </svg>
  )
}
