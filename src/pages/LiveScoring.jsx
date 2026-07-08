import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function LiveScoring() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [runs, setRuns] = useState('');
  const [wickets, setWickets] = useState('');
  const [overs, setOvers] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchActiveFixtures();
  }, []);

  const fetchActiveFixtures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setFixtures(data || []);
    } catch (err) {
      console.error('Error getting match lists:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    const scoreRegex = /(\d+)\/(\d+)\s+\(([\d.]+)\s+Ov\)/;
    const matchData = match.current_score.match(scoreRegex);
    if (matchData) {
      setRuns(matchData[1]);
      setWickets(matchData[2]);
      setOvers(matchData[3]);
    } else {
      setRuns('0');
      setWickets('0');
      setOvers('0.0');
    }
  };

  const handleUpdateScore = async (e) => {
    e.preventDefault();
    if (!selectedMatch) return;

    setUpdating(true);
    const newScoreString = `${runs}/${wickets} (${overs} Ov)`;

    try {
      const { error } = await supabase
        .from('fixtures')
        .update({ 
          current_score: newScoreString,
          status: 'Live'
        })
        .eq('id', selectedMatch.id);

      if (error) throw error;

      setFixtures(fixtures.map(f => 
        f.id === selectedMatch.id 
          ? { ...f, current_score: newScoreString, status: 'Live' } 
          : f
      ));
      
      alert('Scorecard updated and broadcasted live successfully!');
    } catch (err) {
      console.error('Database score broadcast error:', err.message);
      alert('Failed to push score to cloud storage.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">Scorer Control Panel</h1>
          <p className="text-slate-400 text-sm mt-1">Select an active fixture to broadcast ball-by-ball scoreboard changes live to your custom domain.</p>
        </div>

        {loading ? (
          <div className="text-slate-500 italic text-xs">Loading active league schedule...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Select Match</h2>
              {fixtures.length === 0 ? (
                <div className="text-xs text-slate-600 border border-slate-900 rounded-xl p-4">No fixtures inserted in database.</div>
              ) : (
                fixtures.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => handleSelectMatch(match)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-2 ${
                      selectedMatch?.id === match.id 
                        ? 'bg-emerald-950/40 border-emerald-500 text-white' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded text-slate-400">{match.pool_group}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${match.status === 'Live' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-950 text-slate-500'}`}>{match.status}</span>
                    </div>
                    <div className="font-bold text-sm tracking-tight">{match.matchup}</div>
                    <div className="text-xs text-emerald-400 font-mono font-bold">{match.current_score}</div>
                  </button>
                ))
              )}
            </div>

            <div className="lg:col-span-2">
              {selectedMatch ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                  <div>
                    <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 block mb-1">Active Scorer Controller</span>
                    <h2 className="text-xl font-black text-slate-100">{selectedMatch.matchup}</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Venue: {selectedMatch.venue} | Time: {selectedMatch.match_time}</p>
                  </div>

                  <form onSubmit={handleUpdateScore} className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Total Runs</label>
                        <input
                          type="number" required value={runs} onChange={(e) => setRuns(e.target.value)} placeholder="0"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-center text-lg font-mono font-bold text-emerald-400 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Wickets Fallen</label>
                        <input
                          type="number" required max="10" value={wickets} onChange={(e) => setWickets(e.target.value)} placeholder="0"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-center text-lg font-mono font-bold text-red-400 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Overs Bowled</label>
                        <input
                          type="text" required value={overs} onChange={(e) => setOvers(e.target.value)} placeholder="0.0"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-center text-lg font-mono font-bold text-slate-100 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
                      <div className="text-xs text-slate-500 font-medium">
                        Preview: <strong className="text-slate-300 font-mono font-bold">{runs}/{wickets} ({overs} Ov)</strong>
                      </div>
                      <button
                        type="submit" disabled={updating}
                        className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/5"
                      >
                        {updating ? 'Pushing Data...' : 'Broadcast Score Live'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm h-full flex flex-col justify-center items-center">
                  Select an upcoming match fixture from the left side panel to load the dynamic score modifier toolkit.
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
