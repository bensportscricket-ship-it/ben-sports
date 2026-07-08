import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function LiveScoring() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live Score Tracking States
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [overs, setOvers] = useState('0.0');
  const [target, setTarget] = useState('');
  const [currentInnings, setCurrentInnings] = useState('Team A'); // or Team B
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    checkAdminAndFetchMatches();
  }, []);

  const checkAdminAndFetchMatches = async () => {
    try {
      setLoading(true);
      // Verify admin status
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('uuid', user.id).single();
        if (profile?.role === 'super_admin') setIsAdmin(true);
      }

      // Fetch scheduled or active matches from the database
      const { data: matchData } = await supabase
        .from('fixtures')
        .select('*')
        .or('status.eq.scheduled,status.eq.live')
        .order('id', { ascending: true });
        
      setMatches(matchData || []);
    } catch (err) {
      console.error('Error syncing match data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    // Initialize scoring view state based on existing database values or defaults
    setRuns(match.live_runs || 0);
    setWickets(match.live_wickets || 0);
    setOvers(match.live_overs || '0.0');
    setTarget(match.live_target || '');
    setCurrentInnings(match.current_batting_team || match.team_a);
  };

  // ⚡ PUSH REAL-TIME MATCH UPDATES TO THE DATABASE
  const handleUpdateScore = async (statusUpdate = 'live') => {
    if (!selectedMatch) return;
    setUpdating(true);

    try {
      const { error } = await supabase
        .from('fixtures')
        .update({
          status: statusUpdate,
          live_runs: parseInt(runs) || 0,
          live_wickets: parseInt(wickets) || 0,
          live_overs: overs,
          live_target: parseInt(target) || null,
          current_batting_team: currentInnings
        })
        .eq('id', selectedMatch.id);

      if (error) throw error;

      // Update local state grid array instantly
      setMatches(matches.map(m => m.id === selectedMatch.id ? { 
        ...m, 
        status: statusUpdate,
        live_runs: parseInt(runs) || 0, 
        live_wickets: parseInt(wickets) || 0, 
        live_overs: overs,
        live_target: parseInt(target) || null,
        current_batting_team: currentInnings
      } : m));

      alert(`Match dashboard updated successfully to: ${statusUpdate.toUpperCase()}!`);
    } catch (err) {
      alert(`Scoring save failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Quick Scoring Helpers
  const adjustRuns = (amount) => setRuns(prev => Math.max(0, prev + amount));
  const adjustWickets = (amount) => setWickets(prev => Math.min(10, Math.max(0, prev + amount)));

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">Live Scoring Controller</h1>
          <p className="text-slate-400 text-sm mt-1">Select an active fixture to input ball-by-ball updates directly to the tournament stream feed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side: Match Fixture Selector */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Scheduled Matches</h2>
            {loading ? (
              <div className="text-slate-500 text-xs italic">Syncing active match hubs...</div>
            ) : matches.length === 0 ? (
              <div className="text-xs text-slate-600 border border-slate-900 rounded-xl p-4">
                No active or scheduled matches found. Generate pools under the Tournaments section first!
              </div>
            ) : (
              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                {matches.map((match) => (
                  <button
                    key={match.id} onClick={() => handleSelectMatch(match)}
                    className={`w-full text-left p-4 rounded-xl border transition-all space-y-2 flex flex-col ${
                      selectedMatch?.id === match.id 
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex justify-between w-full text-[9px] font-mono font-bold uppercase">
                      <span className="text-slate-500">📍 {match.venue || 'No Ground Assigned'}</span>
                      <span className={match.status === 'live' ? 'text-red-400 animate-pulse' : 'text-emerald-400'}>
                        {match.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold tracking-tight">
                      {match.team_a} <span className="text-xs text-slate-500 font-normal px-1">vs</span> {match.team_b}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">🕒 {match.match_time || 'Time Not Scheduled'}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Master Scoring Interface Console */}
          <div className="lg:col-span-2">
            {selectedMatch ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                
                {/* Active Match Matchup Display Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Live Feed Interface</span>
                    <h2 className="text-xl font-black text-slate-100">{selectedMatch.team_a} vs {selectedMatch.team_b}</h2>
                    <p className="text-xs text-slate-500 font-medium font-mono mt-0.5">Ground: {selectedMatch.venue} | Time: {selectedMatch.match_time}</p>
                  </div>
                  
                  {/* Status Action Overrides */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateScore('completed')}
                      className="bg-slate-950 border border-slate-800 hover:border-red-500/40 hover:text-red-400 text-slate-400 text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-xl transition-all"
                    >
                      End Match
                    </button>
                  </div>
                </div>

                {/* Score Editing Board (Only accessible by Admins) */}
                {isAdmin ? (
                  <div className="space-y-6">
                    {/* Current Innings Settings Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Batting Team</label>
                        <select 
                          value={currentInnings} onChange={(e) => setCurrentInnings(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-100"
                        >
                          <option value={selectedMatch.team_a}>{selectedMatch.team_a}</option>
                          <option value={selectedMatch.team_b}>{selectedMatch.team_b}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target to Win (Optional)</label>
                        <input 
                          type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="No Target Assigned"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500 text-slate-200"
                        />
                      </div>
                    </div>

                    {/* Master Counter Buttons Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Runs Interface Panel */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4 flex flex-col justify-between">
                        <div className="text-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Runs</span>
                          <div className="text-5xl font-black text-emerald-400 font-mono mt-1">{runs}</div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <button onClick={() => adjustRuns(1)} className="bg-slate-900 hover:bg-slate-800 p-2 text-xs font-bold font-mono rounded-lg border border-slate-800">+1</button>
                          <button onClick={() => adjustRuns(4)} className="bg-slate-900 hover:bg-slate-800 p-2 text-xs font-bold font-mono rounded-lg border border-slate-800 text-emerald-400">+4</button>
                          <button onClick={() => adjustRuns(6)} className="bg-slate-900 hover:bg-slate-800 p-2 text-xs font-bold font-mono rounded-lg border border-slate-800 text-amber-400">+6</button>
                          <button onClick={() => adjustRuns(-1)} className="bg-slate-900 hover:bg-slate-800 p-2 text-xs font-bold font-mono rounded-lg border border-slate-800 text-red-400/70">-1</button>
                        </div>
                      </div>

                      {/* Wickets & Overs Input Panel */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4 flex flex-col justify-between">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Wickets Down</span>
                            <div className="text-3xl font-black text-red-400 font-mono mt-1">{wickets}/10</div>
                            <div className="flex justify-center gap-2 mt-2">
                              <button onClick={() => adjustWickets(-1)} className="bg-slate-900 p-1 px-2 text-[10px] font-bold rounded-md border border-slate-800">-</button>
                              <button onClick={() => adjustWickets(1)} className="bg-slate-900 p-1 px-2 text-[10px] font-bold rounded-md border border-slate-800 text-red-400">+</button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Overs Bowled</label>
                            <input 
                              type="text" value={overs} onChange={(e) => setOvers(e.target.value)} placeholder="e.g. 14.2"
                              className="w-full text-center bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-lg font-mono font-bold focus:outline-none focus:border-emerald-500 text-slate-200"
                            />
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Master Action Trigger Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleUpdateScore('live')} disabled={updating}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-lg"
                      >
                        {updating ? 'Transmitting Data...' : 'Broadcast Score Updates Live'}
                      </button>
                    </div>

                  </div>
                ) : (
                  // Viewer Mode for General Registered Members
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center space-y-4">
                    <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Current Live Standing</div>
                    <div className="text-3xl font-black text-slate-200">{currentInnings} Innings</div>
                    <div className="text-5xl font-black text-emerald-400 font-mono tracking-tight">{runs} / {wickets}</div>
                    <div className="text-sm text-slate-400 font-mono">Overs: <span className="text-slate-200 font-bold">{overs}</span></div>
                    {target && <div className="text-xs text-amber-400 font-bold">Target Needed to Win: {target} runs</div>}
                  </div>
                )}

              </div>
            ) : (
              <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm h-full flex flex-col justify-center items-center min-h-[350px]">
                Select an active matchup card from the sidebar block to update statistics or monitor public stream outputs.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
