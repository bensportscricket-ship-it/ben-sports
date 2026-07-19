import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function LiveScoring() {
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [tournamentId, setTournamentId] = useState('');
  const [creating, setCreating] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const load = async () => {
    const { data: m } = await supabase.from('matches').select('*').order('created_at', { ascending: false });
    setMatches(m || []);
    const { data: t } = await supabase.from('tournaments').select('id, name').order('created_at', { ascending: false });
    setTournaments(t || []);
  };

  useEffect(() => { load(); }, []);

  const createMatch = async (e) => {
    e.preventDefault();
    if (!teamA || !teamB) return alert('Both team names are required');
    setCreating(true);
    try {
      const { error } = await supabase.from('matches').insert({
        team_a: teamA, team_b: teamB, tournament_id: tournamentId || null,
      });
      if (error) throw error;
      setTeamA(''); setTeamB(''); setTournamentId('');
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const updateMatch = async (id, patch) => {
    const { error } = await supabase.from('matches').update(patch).eq('id', id);
    if (error) alert(error.message);
    else load();
  };

  const deleteMatch = async (id) => {
    if (!confirm('Delete this match?')) return;
    const { error } = await supabase.from('matches').delete().eq('id', id);
    if (error) alert(error.message);
    else { load(); if (activeId === id) setActiveId(null); }
  };

  const addRuns = (match, runs) => {
    const side = match.current_innings;
    updateMatch(match.id, { [`${side}_score`]: match[`${side}_score`] + runs });
  };

  const addWicket = (match) => {
    const side = match.current_innings;
    updateMatch(match.id, { [`${side}_wickets`]: Math.min(10, match[`${side}_wickets`] + 1) });
  };

  const addBall = (match) => {
    const side = match.current_innings;
    const oversKey = `${side}_overs`;
    let overs = Number(match[oversKey]);
    let whole = Math.floor(overs);
    let balls = Math.round((overs - whole) * 10);
    balls += 1;
    if (balls === 6) { whole += 1; balls = 0; }
    updateMatch(match.id, { [oversKey]: Number(`${whole}.${balls}`) });
  };

  const swapInnings = (match) => {
    const newInnings = match.current_innings === 'team_a' ? 'team_b' : 'team_a';
    const patch = { current_innings: newInnings };
    if (match.current_innings === 'team_a') {
      patch.target = match.team_a_score + 1;
    }
    updateMatch(match.id, patch);
  };

  const setStatus = (match, status) => {
    if (status === 'completed') {
      const result = prompt('Result summary (e.g. "BEN Warriors won by 5 wickets")', match.result || '');
      if (result === null) return;
      updateMatch(match.id, { status, result });
    } else {
      updateMatch(match.id, { status });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-black text-emerald-400 tracking-tight mb-6">Live Scoring</h1>

      <form onSubmit={createMatch} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-w-xl mb-8">
        <h2 className="text-sm font-black text-emerald-400 uppercase tracking-wider">New Match</h2>
        <div className="grid grid-cols-2 gap-3">
          <input value={teamA} onChange={(e) => setTeamA(e.target.value)} placeholder="Team A"
            className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
          <input value={teamB} onChange={(e) => setTeamB(e.target.value)} placeholder="Team B"
            className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
        </div>
        <select value={tournamentId} onChange={(e) => setTournamentId(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none">
          <option value="">No tournament (friendly match)</option>
          {tournaments.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <button type="submit" disabled={creating}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all">
          {creating ? 'Creating...' : 'Create Match'}
        </button>
      </form>

      <div className="space-y-4">
        {matches.map((m) => {
          const isOpen = activeId === m.id;
          return (
            <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm font-bold text-slate-100">{m.team_a} vs {m.team_b}</p>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    {m.team_a}: {m.team_a_score}/{m.team_a_wickets} ({m.team_a_overs}) &nbsp;·&nbsp;
                    {m.team_b}: {m.team_b_score}/{m.team_b_wickets} ({m.team_b_overs})
                  </p>
                  {m.result && <p className="text-[11px] text-emerald-400 mt-1">{m.result}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                    m.status === 'live' ? 'bg-red-500/10 text-red-400' :
                    m.status === 'completed' ? 'bg-slate-700 text-slate-300' : 'bg-amber-500/10 text-amber-400'
                  }`}>{m.status}</span>
                  <button onClick={() => setActiveId(isOpen ? null : m.id)}
                    className="text-[11px] font-bold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg">
                    {isOpen ? 'Close' : 'Score This'}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="mt-4 border-t border-slate-800 pt-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {m.status === 'upcoming' && (
                      <button onClick={() => setStatus(m, 'live')} className="text-[11px] font-bold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg">Start Match (Go Live)</button>
                    )}
                    {m.status === 'live' && (
                      <button onClick={() => setStatus(m, 'completed')} className="text-[11px] font-bold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg">End Match</button>
                    )}
                    <button onClick={() => deleteMatch(m.id)} className="text-[11px] font-bold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg">Delete Match</button>
                  </div>

                  {m.status === 'live' && (
                    <>
                      <p className="text-xs text-slate-400">
                        Currently batting: <span className="text-emerald-400 font-bold">{m.current_innings === 'team_a' ? m.team_a : m.team_b}</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 6].map((r) => (
                          <button key={r} onClick={() => addRuns(m, r)}
                            className="w-10 h-10 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm">
                            +{r}
                          </button>
                        ))}
                        <button onClick={() => addWicket(m)} className="px-3 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white font-black text-xs">WICKET</button>
                        <button onClick={() => addBall(m)} className="px-3 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs">+1 Ball</button>
                        <button onClick={() => swapInnings(m)} className="px-3 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs">Switch Innings</button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {matches.length === 0 && <p className="text-sm text-slate-400">No matches yet. Create one above.</p>}
      </div>
    </div>
  );
}
