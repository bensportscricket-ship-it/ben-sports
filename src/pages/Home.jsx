import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 w-full flex-1">
        
        {/* Left Hook Text Branding */}
        <div className="space-y-6">
          <span className="text-[10px] font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            ⚡ Season 3 - Registrations Live
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-slate-100">
            Grassroots cricket, <br />
            <span className="text-emerald-400">run like the pros.</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md">
            BEN SPORTS brings tournaments, teams, players and fans onto one unified field — fixtures, live scorecards, and hall-of-fame stats, updated in real time.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <Link 
              to="/tournaments" 
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10"
            >
              View Tournaments
            </Link>
            <Link 
              to="/contact" 
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border border-slate-800 transition-all"
            >
              Register Team
            </Link>
          </div>
        </div>

        {/* Right Frame Live Score Match Card Widget */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 tracking-wide uppercase border-b border-slate-800 pb-4">
            <span>Live Scoreframe</span>
            <span className="flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Live
            </span>
          </div>

          <div className="py-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-slate-300">BEN Warriors</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">184/6</span>
            </div>
            <div className="flex justify-between items-center opacity-40 text-sm font-semibold">
              <span>Delhi Strikers</span>
              <span className="font-mono">Yet to bat</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/60 p-3 rounded-xl text-xs flex justify-between items-center font-medium">
            <span className="text-slate-400">Warriors need <strong className="text-emerald-400 font-mono font-bold">32 runs</strong> off <strong className="text-slate-200 font-mono font-bold">18 balls</strong>.</span>
            <span className="text-slate-500 font-mono text-[11px]">CRR: 10.2</span>
          </div>
        </div>

      </div>

    </div>
  );
}
