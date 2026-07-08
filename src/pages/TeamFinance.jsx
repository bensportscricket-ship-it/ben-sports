import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function TeamFinance() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Ledger modification inputs
  const [collected, setCollected] = useState('');
  const [pending, setPending] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchRegisteredTeams();
  }, []);

  const fetchRegisteredTeams = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('team_name', { ascending: true });

      if (error) throw error;
      setTeams(data || []);
    } catch (err) {
      console.error('Error fetching league teams registry:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setCollected(team.fees_collected || '0');
    setPending(team.fees_pending || '0');
    setQrUrl(team.upi_qr_url || '');
  };

  const handleUpdateFinance = async (e) => {
    e.preventDefault();
    if (!selectedTeam) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('teams')
        .update({
          fees_collected: parseFloat(collected) || 0,
          fees_pending: parseFloat(pending) || 0,
          upi_qr_url: qrUrl
        })
        .eq('id', selectedTeam.id);

      if (error) throw error;

      // Update local state copy instantly
      setTeams(teams.map(t => 
        t.id === selectedTeam.id 
          ? { ...t, fees_collected: parseFloat(collected) || 0, fees_pending: parseFloat(pending) || 0, upi_qr_url: qrUrl } 
          : t
      ));

      alert('Team ledger metrics and payment configurations broadcasted successfully!');
    } catch (err) {
      console.error('Ledger write error:', err.message);
      alert('Failed to update cloud financial systems.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">Team Management & Ledgers</h1>
          <p className="text-slate-400 text-sm mt-1">Configure individual club fee sheets, monitor collection goals, and provide active payment routers for players.</p>
        </div>

        {loading ? (
          <div className="text-slate-500 italic text-xs">Accessing central financial vaults...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Team Selection Menu */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Registered Clubs</h2>
              {teams.length === 0 ? (
                <div className="text-xs text-slate-600 border border-slate-900 rounded-xl p-4">No clubs registered in tournament schema.</div>
              ) : (
                teams.map((club) => (
                  <button
                    key={club.id}
                    onClick={() => handleSelectTeam(club)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-1.5 ${
                      selectedTeam?.id === club.id 
                        ? 'bg-emerald-950/40 border-emerald-500 text-white' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-sm tracking-tight">{club.team_name}</div>
                    <div className="flex gap-4 text-[10px] text-slate-400 font-mono mt-0.5">
                      <div>Paid: <span className="text-emerald-400 font-bold">₹{club.fees_collected}</span></div>
                      <div>Due: <span className="text-amber-400 font-bold">₹{club.fees_pending}</span></div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Right Column: Financial Modification Toolkit */}
            <div className="lg:col-span-2">
              {selectedTeam ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                  <div>
                    <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 block mb-1">Administrative Financial Module</span>
                    <h2 className="text-xl font-black text-slate-100">{selectedTeam.team_name} Dashboard</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Manage player transaction records and upload payment gateways below.</p>
                  </div>

                  <form onSubmit={handleUpdateFinance} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Collected Tournament Fees (INR)</label>
                        <input
                          type="number" required value={collected} onChange={(e) => setCollected(e.target.value)} placeholder="0"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono font-bold text-emerald-400 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pending Balance Due (INR)</label>
                        <input
                          type="number" required value={pending} onChange={(e) => setPending(e.target.value)} placeholder="0"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono font-bold text-amber-400 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">UPI Payment Gateway / QR Code Image Link</label>
                      <input
                        type="url" value={qrUrl} onChange={(e) => setQrUrl(e.target.value)} placeholder="https://example-storage.com/your-upi-qr.jpg"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">Paste a web URL pointing to your club's registration payment barcode sticker.</p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/60 flex justify-end">
                      <button
                        type="submit" disabled={updating}
                        className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg"
                      >
                        {updating ? 'Saving Changes...' : 'Save Roster Balance Sheet'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm h-full flex flex-col justify-center items-center">
                  Select an active club from the registry directory row block to view and modify its financial profile.
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}