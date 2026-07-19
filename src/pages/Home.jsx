import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnnouncementBanner from '../components/home/AnnouncementBanner';
import { supabase } from '../utils/supabaseClient';

function LiveScoreCard() {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('matches')
      .select('*')
      .eq('status', 'live')
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        setMatch(data?.[0] || null);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  if (!match) {
    return (
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-center">
        <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">No match live right now</p>
        <Link to="/tournaments" className="text-emerald-400 text-xs font-bold mt-2 inline-block">View Tournaments →</Link>
      </div>
    );
  }

  const batting = match.current_innings === 'team_a' ? match.team_a : match.team_b;
  const bowling = match.current_innings === 'team_a' ? match.team_b : match.team_a;
  const battingScore = match.current_innings === 'team_a'
    ? `${match.team_a_score}/${match.team_a_wickets}`
    : `${match.team_b_score}/${match.team_b_wickets}`;
  const battingOvers = match.current_innings === 'team_a' ? match.team_a_overs : match.team_b_overs;

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex justify-between items-center text-xs font-bold text-slate-500 tracking-wide uppercase border-b border-slate-800 pb-4">
        <span>Live Scoreframe</span>
        <span className="flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Live
        </span>
      </div>

      <div className="py-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-slate-300">{batting}</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{battingScore}</span>
        </div>
        <div className="flex justify-between items-center opacity-40 text-sm font-semibold">
          <span>{bowling}</span>
          <span className="font-mono">{match.current_innings === 'team_a' ? 'Yet to bat' : ''}</span>
        </div>
      </div>

      <div className="bg-slate-950/80 border border-slate-800/60 p-3 rounded-xl text-xs flex justify-between items-center font-medium">
        <span className="text-slate-400">
          {match.target
            ? <>Needs <strong className="text-emerald-400 font-mono font-bold">{Math.max(0, match.target - (match.current_innings === 'team_a' ? match.team_a_score : match.team_b_score))} runs</strong></>
            : 'First innings in progress'}
        </span>
        <span className="text-slate-500 font-mono text-[11px]">Overs: {battingOvers}</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen text-white flex flex-col justify-between">

      <div className="pt-6">
        <AnnouncementBanner />
      </div>

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
              to="/register-team"
              className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border border-slate-800 backdrop-blur-sm transition-all"
            >
              Register Team
            </Link>
          </div>
        </div>

        <LiveScoreCard />

      </div>

    </div>
  );
}
