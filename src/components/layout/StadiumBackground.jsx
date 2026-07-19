import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

// Fixed, full-viewport stadium backdrop — rendered once in App.jsx so it
// shows behind every page automatically. Nothing needs to be added to
// individual pages. Uses an admin-uploaded photo if one exists, otherwise
// falls back to the CSS-only floodlight/pitch design.
export default function StadiumBackground() {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    supabase
      .from('shop_settings')
      .select('background_image_url')
      .eq('id', 1)
      .single()
      .then(({ data }) => setImageUrl(data?.background_image_url || null));
  }, []);

  if (imageUrl) {
    return (
      <div className="pointer-events-none fixed inset-0 -z-10">
        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        {/* Dark overlay so text stays readable on top of any photo */}
        <div className="absolute inset-0 bg-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      {/* Night-sky base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050b08] via-[#0a140f] to-slate-950" />

      {/* Floodlight beams from top corners */}
      <div
        className="absolute -top-20 -left-32 w-[700px] h-[900px] opacity-30"
        style={{
          background: "conic-gradient(from 200deg at 50% 0%, transparent 0deg, rgba(255,255,255,0.25) 8deg, transparent 22deg)",
          filter: "blur(6px)",
        }}
      />
      <div
        className="absolute -top-20 -right-32 w-[700px] h-[900px] opacity-30"
        style={{
          background: "conic-gradient(from 340deg at 50% 0%, transparent 0deg, rgba(255,255,255,0.25) 8deg, transparent 22deg)",
          filter: "blur(6px)",
        }}
      />

      {/* Green floodlight glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />

      {/* Grass / pitch texture stripes rising from the bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-[45%] opacity-[0.35]"
        style={{
          background:
            "repeating-linear-gradient(100deg, rgba(34,197,94,0.08) 0 60px, rgba(16,185,129,0.03) 60px 120px)",
          maskImage: "linear-gradient(to top, black, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black, transparent)",
        }}
      />

      {/* Scoreboard dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Boundary rope line across the top */}
      <div
        className="absolute inset-x-0 top-0 h-[3px] opacity-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 18px, rgba(52,211,153,0.6) 18px 20px)",
        }}
      />
    </div>
  );
}
