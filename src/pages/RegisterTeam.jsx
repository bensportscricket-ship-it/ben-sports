import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';

const emptyPlayer = { name: '', age: '', role: '' };

export default function RegisterTeam() {
  const { session, user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [tournamentId, setTournamentId] = useState('');
  const [approvedCounts, setApprovedCounts] = useState({});
  const [teamName, setTeamName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState('');
  const [players, setPlayers] = useState([{ ...emptyPlayer }]);
  const [saving, setSaving] = useState(false);
  const [myRegistrations, setMyRegistrations] = useState([]);

  const loadTournaments = async () => {
    const { data: t } = await supabase.from('tournaments').select('*').eq('status', 'open').order('created_at', { ascending: false });
    setTournaments(t || []);

    const { data: allRegs } = await supabase.from('team_registrations').select('tournament_id, status');
    const counts = {};
    (allRegs || []).forEach((r) => {
      if (r.status === 'approved' && r.tournament_id) counts[r.tournament_id] = (counts[r.tournament_id] || 0) + 1;
    });
    setApprovedCounts(counts);
  };

  const loadMine = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('team_registrations')
      .select('*, tournaments(name), tournament_pools(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setMyRegistrations(data || []);
  };

  useEffect(() => { loadTournaments(); loadMine(); }, [user]);

  const updatePlayer = (i, field, value) => {
    setPlayers((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  };

  const addPlayer = () => setPlayers((prev) => [...prev, { ...emptyPlayer }]);
  const removePlayer = (i) => setPlayers((prev) => prev.filter((_, idx) => idx !== i));

  const selectedTournament = tournaments.find((t) => t.id === tournamentId);
  const selectedFull = selectedTournament && (approvedCounts[selectedTournament.id] || 0) >= selectedTournament.team_limit;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tournamentId) return alert('Please choose a tournament');
    if (!teamName || !captainName || !contactEmail) return alert('Team name, captain, and contact email are required');
    setSaving(true);
    try {
      const cleanPlayers = players
        .filter((p) => p.name.trim())
        .map((p) => ({ name: p.name.trim(), age: p.age ? Number(p.age) : null, role: p.role.trim() }));

      const { error } = await supabase.from('team_registrations').insert({
        user_id: user.id,
        tournament_id: tournamentId,
        team_name: teamName,
        captain_name: captainName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        players: cleanPlayers,
      });
      if (error) throw error;

      setTeamName(''); setCaptainName(''); setContactPhone(''); setPlayers([{ ...emptyPlayer }]); setTournamentId('');
      loadMine();
      alert('Registration submitted! A super admin will review it.');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!session) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="text-xl font-black text-emerald-400 mb-3">Register Your Team</h1>
        <p className="text-sm text-slate-400 mb-6">You need an account to register a team for tournaments.</p>
        <Link to="/login" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl">
          Log in / Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-black text-emerald-400 tracking-tight mb-2">Register Your Team</h1>
      <p className="text-xs text-slate-400 mb-8">Pick a tournament, add your squad. A super admin reviews every registration.</p>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tournament</label>
          <select
            value={tournamentId}
            onChange={(e) => setTournamentId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="">Select a tournament...</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({approvedCounts[t.id] || 0} / {t.team_limit} teams)
              </option>
            ))}
          </select>
          {tournaments.length === 0 && <p className="text-[11px] text-slate-500 mt-1">No tournaments open for registration right now.</p>}
          {selectedFull && <p className="text-[11px] text-amber-400 mt-1">This tournament has reached its team limit — you can still apply, but it may already be full.</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Team Name</label>
            <input value={teamName} onChange={(e) => setTeamName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Captain Name</label>
            <input value={captainName} onChange={(e) => setCaptainName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Email</label>
            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Phone</label>
            <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Players</label>
            <button type="button" onClick={addPlayer} className="text-[11px] text-emerald-400 font-bold">+ Add player</button>
          </div>
          <div className="space-y-2">
            {players.map((p, i) => (
              <div key={i} className="grid grid-cols-[1fr_70px_90px_auto] gap-2 items-center">
                <input placeholder="Player name" value={p.name} onChange={(e) => updatePlayer(i, 'name', e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
                <input placeholder="Age" type="number" value={p.age} onChange={(e) => updatePlayer(i, 'age', e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
                <input placeholder="Role" value={p.role} onChange={(e) => updatePlayer(i, 'role', e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
                {players.length > 1 && (
                  <button type="button" onClick={() => removePlayer(i)} className="text-red-400 text-[11px] font-bold">✕</button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all">
          {saving ? 'Submitting...' : 'Submit Registration'}
        </button>
      </form>

      {myRegistrations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-black text-slate-300 uppercase tracking-wider mb-3">Your Registrations</h2>
          <div className="space-y-2">
            {myRegistrations.map((r) => (
              <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-200">{r.team_name}</p>
                  <p className="text-[11px] text-slate-500">
                    {r.tournaments?.name || 'Tournament'} • {r.players.length} player(s)
                    {r.tournament_pools?.name && ` • ${r.tournament_pools.name}`}
                  </p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                  r.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                  r.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
