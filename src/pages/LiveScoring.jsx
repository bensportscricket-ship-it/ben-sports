import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Tournaments() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🎛️ NEW CONFIGURATION STATES FOR THE UI
  const [venue, setVenue] = useState('Main Cricket Ground, Delhi');
  const [matchTime, setMatchTime] = useState('10:00 AM');
  const [groupType, setGroupType] = useState('single'); // 'single' (All in one) or 'multiple' (Pool A, Pool B)
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    try {
      setLoading(true);
      // Check if logged in user is admin
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('uuid', user.id).single();
        if (profile?.role === 'super_admin') setIsAdmin(true);
      }

      // Fetch teams to generate matches from
      const { data: teamData } = await supabase.from('teams').select('*');
      setTeams(teamData || []);

      // Fetch existing matches
      const { data: matchData } = await supabase.from('fixtures').select('*').order('id', { ascending: true });
      setMatches(matchData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ GENERATE TOURNAMENT FIXTURES WITH YOUR CUSTOM INPUTS
  const handleGenerateFixtures = async () => {
    if (teams.length < 2) {
      alert('You need at least 2 registered teams to generate a tournament schedule!');
      return;
    }

    setGenerating(true);
    try {
      // 🗑️ Clear out any old matches first
      await supabase.from('fixtures').delete().neq('id', 0);

      let newMatches = [];

      if (groupType === 'single') {
        // Round Robin: Everyone plays everyone once in a single group
        for (let i = 0; i < teams.length; i++) {
          for (let j = i + 1; j < teams.length; j++) {
            newMatches.push({
              team_a: teams[i].team_name,
              team_b: teams[j].team_name,
              venue: venue,
              match_time: matchTime,
              group_pool: 'Group Stage',
              status: 'scheduled'
            });
          }
        }
      } else {
        // Multiple Groups: Split teams into Pool A and Pool B evenly
        const poolA = teams.slice(0, Math.ceil(teams.length / 2));
        const poolB = teams.slice(Math.ceil(teams.length / 2));

        // Pool A Matches
        for (let i = 0; i < poolA.length; i++) {
          for (let j = i + 1; j < poolA.length; j++) {
            newMatches.push({ team_a: poolA[i].team_name, team_b: poolA[j].team_name, venue, match_time: matchTime, group_pool: 'Pool A', status: 'scheduled' });
          }
        }
        // Pool B Matches
        for (let i = 0; i < poolB.length; i++) {
          for (let j = i + 1; j < poolB.length; j++) {
            newMatches.push({ team_a: poolB[i].team_name, team_b: poolB[j].team_name, venue, match_time: matchTime, group_pool: 'Pool B', status: 'scheduled' });
          }
        }
      }

      // Bulk save new matches to Supabase
      const { data, error } = await supabase.from('fixtures').insert(newMatches).select();
      if (error) throw error;

      setMatches(data || []);
      alert(`Successfully generated ${data.length} matches across your configured framework!`);
    } catch (err) {
      alert(`Generation failed: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-400">Tournament Scheduler</h1>
          <p className="text-slate-400 text-sm mt-1">Generate schedules, group tiers, and track matchups from the UI.</p>
        </div>

        {/* 🛡️ ADMIN SETUP WIDGET ON SITE */}
        {isAdmin && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <h2 className="text-sm font-bold uppercase text-emerald-400 tracking-wider">Tournament Settings Configurator</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Group Structure Select */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Group Format Type</label>
                <select 
                  value={groupType} onChange={(e) => setGroupType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="single">Single Group (All Teams Mix)</option>
                  <option value="multiple">Multiple Groups (Split to Pool A & B)</option>
                </select>
              </div>

              {/* Match Time Input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Default Match Time / Date</label>
                <input 
                  type="text" value={matchTime} onChange={(e) => setMatchTime(e.target.value)} placeholder="e.g. 10:00 AM / Every Sat"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Venue Input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Default Venue Location</label>
                <input 
                  type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Stadium Address..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateFixtures} disabled={generating}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-lg"
            >
              {generating ? 'Processing Brackets...' : '⚡ Auto-Generate Pools & Matches'}
            </button>
          </div>
        )}

        {/* FIXTURES DISPLAY LIST */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Generated Matches Schedule ({matches.length})</h2>
          {matches.length === 0 ? (
            <div className="text-center border border-slate-900 rounded-2xl p-12 text-slate-500 text-sm">
              No matches generated yet. Fill out the configuration form above and click generate.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((match) => (
                <div key={match.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] px-2 py-0.5 bg-slate-950 rounded border border-slate-800 text-emerald-400 font-mono font-bold uppercase">{match.group_pool}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{match.status}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 text-sm font-bold">
                    <span className="text-slate-200">{match.team_a}</span>
                    <span className="text-xs text-slate-600 font-light px-2">VS</span>
                    <span className="text-slate-200">{match.team_b}</span>
                  </div>
                  <div className="border-t border-slate-800/40 pt-2 flex justify-between text-[10px] text-slate-400 font-medium">
                    <div>🕒 {match.match_time}</div>
                    <div>📍 {match.venue}</div>
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
