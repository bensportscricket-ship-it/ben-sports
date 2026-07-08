import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Heroes() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [honors, setHonors] = useState({
    mvp_name: 'Aradhya Sharma', mvp_team: 'BEN 11', mvp_stats: '340 Runs & 12 Wickets',
    filder_name: 'Rohan Sharma', filder_team: 'Star Strikers', filder_stats: '9 Catches & 2 Run-outs',
    emerging_name: 'Amit Patel', emerging_team: 'BEN 11', emerging_stats: '185 Runs (SR 145.2)'
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('role').eq('uuid', user.id).single();
      if (data?.role === 'super_admin') setIsAdmin(true);
    }
    // Fetch live honors values if table exists
    const { data: liveHonors } = await supabase.from('tournament_honors').select('*').single();
    if (liveHonors) setHonors(liveHonors);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('tournament_honors').upsert([honors]);
      if (error) throw error;
      alert('Tournament Honors updated live!');
      setEditing(false);
    } catch (err) {
      // If table doesn't exist yet, we update local state
      alert('Local updates saved! Create tournament_honors table in Supabase for full persistence.');
      setEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-400">BEN SPORTS Heroes</h1>
            <p className="text-slate-400 text-sm mt-1">The Hall of Fame — Tracking top individual performances.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setEditing(!editing)}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
            >
              {editing ? 'Cancel Editing' : 'Edit Honors From UI'}
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Player of the Tournament */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">Player of the Tournament</span>
            {editing ? (
              <div className="space-y-2">
                <input className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs" value={honors.mvp_name} onChange={e => setHonors({...honors, mvp_name: e.target.value})} />
                <input className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-400" value={honors.mvp_team} onChange={e => setHonors({...honors, mvp_team: e.target.value})} />
                <input className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-emerald-400" value={honors.mvp_stats} onChange={e => setHonors({...honors, mvp_stats: e.target.value})} />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black">{honors.mvp_name}</h2>
                <p className="text-xs text-slate-400 font-medium">{honors.mvp_team}</p>
                <p className="text-emerald-400 text-sm font-bold font-mono mt-4">{honors.mvp_stats}</p>
              </>
            )}
          </div>

          {/* Card 2: Best Fielder */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2">Best Fielder</span>
            {editing ? (
              <div className="space-y-2">
                <input className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs" value={honors.filder_name} onChange={e => setHonors({...honors, filder_name: e.target.value})} />
                <input className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-400" value={honors.filder_team} onChange={e => setHonors({...honors, filder_team: e.target.value})} />
                <input className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-amber-400" value={honors.filder_stats} onChange={e => setHonors({...honors, filder_stats: e.target.value})} />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black">{honors.filder_name}</h2>
                <p className="text-xs text-slate-400 font-medium">{honors.filder_team}</p>
                <p className="text-amber-400 text-sm font-bold font-mono mt-4">{honors.filder_stats}</p>
              </>
            )}
          </div>

          {/* Card 3: Emerging Player */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-2">Emerging Player</span>
            {editing ? (
              <div className="space-y-2">
                <input className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs" value={honors.emerging_name} onChange={e => setHonors({...honors, emerging_name: e.target.value})} />
                <input className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-400" value={honors.emerging_team} onChange={e => setHonors({...honors, emerging_team: e.target.value})} />
                <input className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-sky-400" value={honors.emerging_stats} onChange={e => setHonors({...honors, emerging_stats: e.target.value})} />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black">{honors.emerging_name}</h2>
                <p className="text-xs text-slate-400 font-medium">{honors.emerging_team}</p>
                <p className="text-sky-400 text-sm font-bold font-mono mt-4">{honors.emerging_stats}</p>
              </>
            )}
          </div>

          {editing && (
            <div className="col-span-1 md:col-span-3 flex justify-end">
              <button type="submit" className="bg-emerald-500 text-slate-950 font-bold px-6 py-2 rounded-xl text-xs uppercase tracking-wider">
                Save Honors Layout
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
