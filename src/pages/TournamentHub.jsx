import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export default function TournamentHub() {
  const [tournaments, setTournaments] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [pools, setPools] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('tournaments').select('*').order('created_at', { ascending: false }),
      supabase.from('team_registrations').select('*').eq('status', 'approved'),
      supabase.from('tournament_pools').select('*').order('name', { ascending: true }),
      supabase.from('matches').select('*').order('created_at', { ascending: false }),
    ]).then(([t, r, p, m]) => {
      setTournaments(t.data || []);
      setRegistrations(r.data || []);
      setPools(p.data || []);
      setMatches(m.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-emerald-400 tracking-tight">Tournaments</h1>
          <p className="text-xs text-slate-400 mt-1">See which teams are in, and how the pools are shaping up.</p>
        </div>
        <Link
          to="/register-team"
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition-all"
        >
          Register Team
        </Link>
      </div>

      {loading && <p className="text-sm text-slate-400">Loading tournaments...</p>}
      {!loading && tournaments.length === 0 && <p className="text-sm text-slate-400">No tournaments announced yet. Check back soon.</p>}

      <div className="space-y-6">
        {tournaments.map((t) => {
          const teams = registrations.filter((r) => r.tournament_id === t.id);
          const tPools = pools.filter((p) => p.tournament_id === t.id);
          const tMatches = matches.filter((mt) => mt.tournament_id === t.id);

          return (
            <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-100">{t.name}</h2>
                  {t.description && <p className="text-xs text-slate-400 mt-1">{t.description}</p>}
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md h-fit ${
                  t.status === 'locked' ? 'bg-amber-500/10 text-amber-400' :
                  t.status === 'completed' ? 'bg-slate-700 text-slate-300' : 'bg-emerald-500/10 text-emerald-400'
                }`}>{t.status}</span>
              </div>

              <p className="text-xs font-mono text-slate-400 mt-3">
                <span className="text-emerald-400">{teams.length}</span> / {t.team_limit} teams registered
              </p>

              {tPools.length === 0 ? (
                teams.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {teams.map((team) => (
                      <span key={team.id} className="text-[11px] bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300">
                        {team.team_name}
                      </span>
                    ))}
                  </div>
                )
              ) : (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tPools.map((pool) => (
                    <div key={pool.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                      <p className="text-xs font-bold text-emerald-400 mb-2">{pool.name}</p>
                      <ul className="space-y-1">
                        {teams.filter((team) => team.pool_id === pool.id).map((team) => (
                          <li key={team.id} className="text-[11px] text-slate-300">{team.team_name}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {tMatches.length > 0 && (
                <div className="mt-4 border-t border-slate-800 pt-4 space-y-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Matches</p>
                  {tMatches.map((m) => (
                    <div key={m.id} className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
                      <span className="text-xs text-slate-300">{m.team_a} vs {m.team_b}</span>
                      {m.status === 'live' ? (
                        <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md">LIVE</span>
                      ) : m.status === 'completed' ? (
                        <span className="text-[10px] text-slate-500">{m.result || 'Completed'}</span>
                      ) : (
                        <span className="text-[10px] text-amber-400">Upcoming</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
