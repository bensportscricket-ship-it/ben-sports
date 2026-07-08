import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Tournaments() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pool Configuration State
  const [groupType, setGroupType] = useState('single'); // 'single' or 'multiple'
  const [generating, setGenerating] = useState(false);

  // Inline editing state to track which match is being updated manually
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [manualTime, setManualTime] = useState('');
  const [manualVenue, setManualVenue] = useState('');
  const [savingMatch, setSavingMatch] = useState(false);

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('uuid', user.id).single();
        if (profile?.role === 'super_admin') setIsAdmin(true);
      }

      const { data: teamData } = await supabase.from('teams').select('*');
      setTeams(teamData || []);

      const { data: matchData } = await supabase.from('fixtures').select('*').order('id', { ascending: true });
      setMatches(matchData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ GENERATE POOLS AUTOMATICALLY
  const handleGeneratePools = async () => {
    if (teams.length < 2) {
      alert('You need at least 2 registered teams to create pools!');
      return;
    }

    setGenerating(true);
    try {
      // Clear out old fixtures
      await supabase.from('fixtures').delete().neq('id', 0);

      let newMatches = [];

      if (groupType === 'single') {
        for (let i = 0; i < teams.length; i++) {
          for (let j = i + 1; j < teams.length; j++) {
            newMatches.push({
              team_a: teams[i].team_name,
              team_b: teams[j].team_name,
              venue: 'Ground Not Assigned', // 🕒 Left placeholder for manual assignment
              match_time: 'Time Not Set',   // 🕒 Left placeholder for manual assignment
              group_pool: 'Group Stage',
              status: 'scheduled'
            });
          }
        }
      } else {
        const poolA = teams.slice(0, Math.ceil(teams.length / 2));
        const poolB = teams.slice(Math.ceil(teams.length / 2));

        for (let i = 0; i < poolA.length; i++) {
          for (let j = i + 1; j < poolA.length; j++) {
            newMatches.push({ team_a: poolA[i].team_name, team_b: poolA[j].team_name, venue: 'Ground Not Assigned', match_time: 'Time Not Set', group_pool: 'Pool A', status: 'scheduled' });
          }
        }
        for (let i = 0; i < poolB.length; i++) {
          for (let j = i + 1; j < poolB.length; j++) {
            newMatches.push({ team_a: poolB[i].team_name, team_b: poolB[j].team_name, venue: 'Ground Not Assigned', match_time: 'Time Not Set', group_pool: 'Pool B', status: 'scheduled' });
          }
        }
      }

      const { data, error } = await supabase.from('fixtures').insert(newMatches).select();
      if (error) throw error;

      setMatches(data || []);
      alert('Pools generated successfully! You can now assign times and grounds manually below.');
    } catch (err) {
      alert(`Generation failed: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  // ✍️ MANUALLY SAVE TIME & GROUND FOR A MATCH FROM THE WEBSITE UI
  const startEditing = (match) => {
    setEditingMatchId(match.id);
    setManualTime(match.match_time === 'Time Not Set' ? '' : match.match_time);
    setManualVenue(match.match_type === 'Ground Not Assigned' ? '' : match.venue);
  };

  const handleSaveManualSchedule = async (matchId) => {
    setSavingMatch(true);
    try {
      const { error } = await supabase
        .from('fixtures')
        .update({
          match_time: manualTime || 'Time Not Set',
          venue: manualVenue || 'Ground Not Assigned'
        })
        .eq('id', matchId);

      if (error) throw error;

      setMatches(matches.map(m => m.id === matchId ? { ...m, match_time: manualTime || 'Time Not Set', venue: manualVenue || 'Ground Not Assigned' } : m));
      setEditingMatchId(null);
    } catch (err) {
      alert('Failed to save schedule changes.');
    } finally {
      setSavingMatch(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-400">Tournament Brackets & Scheduling</h1>
          <p className="text-slate-400 text-sm mt-1">Generate groups automatically, then assign matching times and grounds manually right from the tool layout.</p>
        </div>

        {/* Pool Sorter Setup Form */}
        {isAdmin && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-end shadow-xl">
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Pool Structure Format</label>
              <select 
                value={groupType} onChange={(e) => setGroupType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="single">Single Group (All Teams in 1 Bracket)</option>
                <option value="multiple">Multiple Groups (Split into Pool A & Pool B)</option>
              </select>
            </div>
            <button
              onClick={handleGeneratePools} disabled={generating}
              className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl transition-all shadow-lg whitespace-nowrap"
            >
              {generating ? 'Sorting...' : '⚡ Step 1: Auto-Generate Pools'}
            </button>
          </div>
        )}

        {/* Generated Fixtures List with Inline Tools */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Matches & Fixtures Directory ({matches.length})</h2>
          {matches.length === 0 ? (
            <div className="text-center border border-slate-900 rounded-2xl p-12 text-slate-500 text-sm">
              No pools generated yet. Choose a format type above and click generate.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((match) => (
                <div key={match.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] px-2 py-0.5 bg-slate-950 rounded border border-slate-800 text-emerald-400 font-bold tracking-wide uppercase">{match.group_pool}</span>
                    {isAdmin && editingMatchId !== match.id && (
                      <button 
                        onClick={() => startEditing(match)}
                        className="text-[10px] text-emerald-400 font-bold hover:underline"
                      >
                        ✏️ Assign Schedule
                      </button>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-200">{match.team_a}</span>
                    <span className="text-xs text-slate-600 font-normal">VS</span>
                    <span className="text-slate-200">{match.team_b}</span>
                  </div>

                  {/* Manual Assignment Form Controls */}
                  <div className="border-t border-slate-800/60 pt-3">
                    {editingMatchId === match.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" value={manualTime} onChange={(e) => setManualTime(e.target.value)} placeholder="Time (e.g. 9 AM, Sun)"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                          />
                          <input 
                            type="text" value={manualVenue} onChange={(e) => setManualVenue(e.target.value)} placeholder="Ground Name"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingMatchId(null)} className="text-[10px] uppercase text-slate-400 px-2 py-1">Cancel</button>
                          <button 
                            onClick={() => handleSaveManualSchedule(match.id)} disabled={savingMatch}
                            className="bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg"
                          >
                            {savingMatch ? 'Saving...' : 'Save Configuration'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between text-[10px] font-medium text-slate-400 font-mono">
                        <div className={match.match_time === 'Time Not Set' ? 'text-amber-500/70 font-sans italic' : ''}>🕒 {match.match_time}</div>
                        <div className={match.venue === 'Ground Not Assigned' ? 'text-amber-500/70 font-sans italic' : ''}>📍 {match.venue}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
