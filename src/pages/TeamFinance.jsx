import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function TeamFinance() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // New Team Creation Input
  const [newTeamName, setNewTeamName] = useState('');
  const [creatingTeam, setCreatingTeam] = useState(false);

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
      console.error('Error fetching league teams:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    setCreatingTeam(true);
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{ 
          team_name: newTeamName.trim(),
          fees_collected: 0,
          fees_pending: 0,
          upi_qr_url: ''
        }])
        .select();

      if (error) throw error;

      alert(`"${newTeamName}" has been successfully registered to the live tournament!`);
      setTeams([...teams, data[0]].sort((a, b) => a.team_name.localeCompare(b.team_name)));
      setNewTeamName('');
    } catch (err) {
      alert(`Failed to create team: ${err.message}`);
    } finally {
      setCreatingTeam(false);
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

      setTeams(teams.map(t => 
        t.id === selectedTeam.id 
          ? { ...t, fees_collected: parseFloat(collected) || 0, fees_pending: parseFloat(pending) || 0, upi_qr_url: qrUrl } 
          : t
      ));

      alert('Team adjustments saved successfully!');
    } catch (err) {
      alert('Failed to update ledger.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!selectedTeam) return;
    const confirmDelete = window.confirm(`Remove "${selectedTeam.team_name}" from the database completely?`);
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', selectedTeam.id);

      if (error) throw error;

      setTeams(teams.filter(t => t.id !== selectedTeam.id));
      setSelectedTeam(null);
      alert('Team deleted from live site.');
    } catch (err) {
      alert('Failed to delete team.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">Master Admin Control Panel</h1>
          <p className="text-slate-400 text-sm mt-1">Add teams, manage registration fee ledgers, and handle tournament infrastructure live from this page.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
              <h3 className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Quick Add New Team</h3>
              <form onSubmit={handleCreateTeam} className="flex gap-2">
                <input
                  type="text" required value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="Enter Team Name..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="submit" disabled={creatingTeam}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-bold text-xs px-4 rounded-xl transition-all"
                >
                  {creatingTeam ? '...' : 'Add'}
                </button>
              </form>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active Registered Clubs ({teams.length})</h2>
              {loading ? (
                <div className="text-slate-500 italic text-xs">Syncing club vaults...</div>
              ) : teams.length === 0 ? (
                <div className="text-xs text-slate-600 border border-slate-900 rounded-xl p-4">No clubs active. Use the form above to add one.</div>
              ) : (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  {teams.map((club) => (
                    <button
                      key={club.id} onClick={() => handleSelectTeam(club)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 ${
                        selectedTeam?.id === club.id 
                          ? 'bg-emerald-950/40 border-emerald-500 text-white' 
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}>
                      <div className="font-bold text-sm tracking-tight">{club.team_name}</div>
                      <div className="flex gap-4 text-[10px] text-slate-400 font-mono">
                        <div>Paid: <span className="text-emerald-400 font-bold">₹{club.fees_collected}</span></div>
                        <div>Due: <span className="text-amber-400 font-bold">₹{club.fees_pending}</span></div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedTeam ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex justify-between items-start border-b border-slate-800/60 pb-4">
                  <div>
                    <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 block mb-1">Live Controller Node</span>
                    <h2 className="text-xl font-black text-slate-100">{selectedTeam.team_name}</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Edit credentials or wipe this record from the system completely.</p>
                  </div>
                  
                  <button
                    type="button" onClick={handleDeleteTeam}
                    className="bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 transition-all text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-xl"
                  >
                    Delete Team from Site
                  </button>
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
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">UPI Payment Gateway / QR Code URL Link</label>
                    <input
                      type="url" value={qrUrl} onChange={(e) => setQrUrl(e.target.value)} placeholder="https://example.com/your-upi-qr.jpg"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit" disabled={updating}
                      className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg"
                    >
                      {updating ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm h-full flex flex-col justify-center items-center min-h-[300px]">
                Select an active club from the side directory block to edit its financial profile or delete it entirely.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
