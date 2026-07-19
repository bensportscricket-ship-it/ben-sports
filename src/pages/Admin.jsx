import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import FileUpload from '../components/ui/FileUpload';

async function uploadImage(bucket, file) {
  const ext = file.name.split('.').pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file);
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) return alert('Name and price are required');
    setSaving(true);
    try {
      let image_url = null;
      if (file) image_url = await uploadImage('product-images', file);

      const { error } = await supabase.from('products').insert({ name, price, description, image_url });
      if (error) throw error;

      setName(''); setPrice(''); setDescription(''); setFile(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert(error.message);
    else load();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 h-fit">
        <h2 className="text-sm font-black text-emerald-400 uppercase tracking-wider">Add Product</h2>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Cricket bat, gloves, or pads"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Price (Rs.)</label>
          <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description / Comments</label>
          <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Size variations, weight, shipping details..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Product Image</label>
          <FileUpload label="Upload product image" onUploadSuccess={({ file }) => setFile(file)} />
        </div>
        <button type="submit" disabled={saving}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all">
          {saving ? 'Saving...' : 'Publish Product'}
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-sm font-black text-slate-300 uppercase tracking-wider">Current Products ({products.length})</h2>
        {products.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-slate-950" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{p.name}</p>
              <p className="text-[11px] text-emerald-400">Rs. {p.price}</p>
            </div>
            <button onClick={() => handleDelete(p.id)}
              className="text-[11px] text-red-400 hover:text-red-300 font-bold px-2">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnnouncementsTab() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    setItems(data || []);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return alert('Message is required');
    setSaving(true);
    try {
      let image_url = null;
      if (file) image_url = await uploadImage('announcement-images', file);

      const { error } = await supabase.from('announcements').insert({ title, message, image_url });
      if (error) throw error;

      setTitle(''); setMessage(''); setFile(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) alert(error.message);
    else load();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 h-fit">
        <h2 className="text-sm font-black text-emerald-400 uppercase tracking-wider">New Announcement</h2>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Title (optional)</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Season 3 fixtures live"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Message</label>
          <textarea rows="3" value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder="Toss for the opening match is Saturday, 9:00 AM..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tournament Image</label>
          <FileUpload label="Upload announcement image" onUploadSuccess={({ file }) => setFile(file)} />
        </div>
        <button type="submit" disabled={saving}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all">
          {saving ? 'Publishing...' : 'Publish Announcement'}
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-sm font-black text-slate-300 uppercase tracking-wider">Current Announcements ({items.length})</h2>
        {items.map((a) => (
          <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            {a.image_url ? (
              <img src={a.image_url} alt={a.title || 'announcement'} className="w-12 h-12 rounded-lg object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-slate-950" />
            )}
            <div className="flex-1 min-w-0">
              {a.title && <p className="text-xs font-bold text-slate-200 truncate">{a.title}</p>}
              <p className="text-[11px] text-slate-400 truncate">{a.message}</p>
            </div>
            <button onClick={() => handleDelete(a.id)}
              className="text-[11px] text-red-400 hover:text-red-300 font-bold px-2">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegistrationsTab() {
  const [regs, setRegs] = useState([]);
  const [filter, setFilter] = useState('pending');

  const load = async () => {
    const { data } = await supabase.from('team_registrations').select('*, tournaments(name)').order('created_at', { ascending: false });
    setRegs(data || []);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    const { error } = await supabase.from('team_registrations').update({ status }).eq('id', id);
    if (error) alert(error.message);
    else load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this registration?')) return;
    const { error } = await supabase.from('team_registrations').delete().eq('id', id);
    if (error) alert(error.message);
    else load();
  };

  const visible = regs.filter((r) => filter === 'all' || r.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {['pending', 'approved', 'rejected', 'all'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider ${filter === f ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
            {f} {f !== 'all' && `(${regs.filter((r) => r.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {visible.length === 0 && <p className="text-sm text-slate-400">No registrations here.</p>}
        {visible.map((r) => (
          <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-slate-100">{r.team_name}</p>
                <p className="text-xs text-slate-400">Captain: {r.captain_name} • {r.contact_email} {r.contact_phone && `• ${r.contact_phone}`}</p>
                <p className="text-[11px] text-emerald-400 mt-0.5">{r.tournaments?.name || 'No tournament linked'}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                r.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                r.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
              }`}>{r.status}</span>
            </div>

            {r.players?.length > 0 && (
              <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-1 text-[11px] text-slate-400">
                {r.players.map((p, i) => (
                  <li key={i} className="bg-slate-950/60 rounded-md px-2 py-1 border border-slate-800">
                    {p.name}{p.age ? `, ${p.age}` : ''}{p.role ? ` — ${p.role}` : ''}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-2 mt-3">
              <button onClick={() => setStatus(r.id, 'approved')} className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg">Approve</button>
              <button onClick={() => setStatus(r.id, 'rejected')} className="text-[11px] font-bold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg">Reject</button>
              <button onClick={() => remove(r.id)} className="text-[11px] font-bold text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTab() {
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false });
    setImages(data || []);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Choose a photo to upload');
    setSaving(true);
    try {
      const image_url = await uploadImage('gallery-images', file);
      const { error } = await supabase.from('gallery_images').insert({ caption, image_url });
      if (error) throw error;
      setCaption(''); setFile(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this photo?')) return;
    const { error } = await supabase.from('gallery_images').delete().eq('id', id);
    if (error) alert(error.message);
    else load();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 h-fit">
        <h2 className="text-sm font-black text-emerald-400 uppercase tracking-wider">Add Photo</h2>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Caption (optional)</label>
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Final over, Season 2"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Photo</label>
          <FileUpload label="Upload photo" onUploadSuccess={({ file }) => setFile(file)} />
        </div>
        <button type="submit" disabled={saving}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all">
          {saving ? 'Uploading...' : 'Add to Gallery'}
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-sm font-black text-slate-300 uppercase tracking-wider">Current Photos ({images.length})</h2>
        {images.map((img) => (
          <div key={img.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <img src={img.image_url} alt={img.caption || ''} className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-300 truncate">{img.caption || 'No caption'}</p>
            </div>
            <button onClick={() => handleDelete(img.id)}
              className="text-[11px] text-red-400 hover:text-red-300 font-bold px-2">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TournamentsTab() {
  const [tournaments, setTournaments] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [pools, setPools] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [teamLimit, setTeamLimit] = useState(16);
  const [saving, setSaving] = useState(false);
  const [poolCounts, setPoolCounts] = useState({}); // tournamentId -> number of pools chosen

  const load = async () => {
    const [{ data: t }, { data: r }, { data: p }] = await Promise.all([
      supabase.from('tournaments').select('*').order('created_at', { ascending: false }),
      supabase.from('team_registrations').select('*'),
      supabase.from('tournament_pools').select('*').order('name', { ascending: true }),
    ]);
    setTournaments(t || []);
    setRegistrations(r || []);
    setPools(p || []);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return alert('Tournament name is required');
    setSaving(true);
    try {
      const { error } = await supabase.from('tournaments').insert({
        name, description, team_limit: Number(teamLimit) || 16,
      });
      if (error) throw error;
      setName(''); setDescription(''); setTeamLimit(16);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const approvedFor = (tournamentId) =>
    registrations.filter((r) => r.tournament_id === tournamentId && r.status === 'approved');

  const setTournamentStatus = async (id, status) => {
    const { error } = await supabase.from('tournaments').update({ status }).eq('id', id);
    if (error) alert(error.message);
    else load();
  };

  const deleteTournament = async (id) => {
    if (!confirm('Delete this tournament? This will also remove its pools.')) return;
    const { error } = await supabase.from('tournaments').delete().eq('id', id);
    if (error) alert(error.message);
    else load();
  };

  const generatePools = async (tournamentId, numPools) => {
    const teams = approvedFor(tournamentId);
    if (teams.length === 0) return alert('No approved teams to pool yet.');
    numPools = Math.max(1, Number(numPools) || 1);

    try {
      // Wipe existing pools for this tournament first (keeps it simple to regenerate)
      const existingPoolIds = pools.filter((p) => p.tournament_id === tournamentId).map((p) => p.id);
      if (existingPoolIds.length > 0) {
        await supabase.from('tournament_pools').delete().in('id', existingPoolIds);
      }

      const poolNames = Array.from({ length: numPools }, (_, i) => `Pool ${String.fromCharCode(65 + i)}`);
      const { data: newPools, error } = await supabase
        .from('tournament_pools')
        .insert(poolNames.map((n) => ({ tournament_id: tournamentId, name: n })))
        .select();
      if (error) throw error;

      // Round-robin assign approved teams to the new pools
      const shuffled = [...teams].sort(() => Math.random() - 0.5);
      await Promise.all(
        shuffled.map((team, i) =>
          supabase.from('team_registrations').update({ pool_id: newPools[i % newPools.length].id }).eq('id', team.id)
        )
      );

      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const reassignPool = async (registrationId, poolId) => {
    const { error } = await supabase.from('team_registrations').update({ pool_id: poolId || null }).eq('id', registrationId);
    if (error) alert(error.message);
    else load();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-w-xl">
        <h2 className="text-sm font-black text-emerald-400 uppercase tracking-wider">New Tournament</h2>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="BEN Sports Premier League - Season 3"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
          <textarea rows="2" value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Team Limit</label>
          <input type="number" min="2" value={teamLimit} onChange={(e) => setTeamLimit(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
        </div>
        <button type="submit" disabled={saving}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all">
          {saving ? 'Creating...' : 'Create Tournament'}
        </button>
      </form>

      <div className="space-y-6">
        {tournaments.map((t) => {
          const approved = approvedFor(t.id);
          const pending = registrations.filter((r) => r.tournament_id === t.id && r.status === 'pending');
          const tournamentPools = pools.filter((p) => p.tournament_id === t.id);
          const full = approved.length >= t.team_limit;

          return (
            <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{t.name}</h3>
                  {t.description && <p className="text-xs text-slate-400 mt-0.5">{t.description}</p>}
                  <p className="text-[11px] mt-1.5 font-mono">
                    <span className={full ? 'text-amber-400' : 'text-emerald-400'}>{approved.length}</span>
                    <span className="text-slate-500"> / {t.team_limit} teams approved</span>
                    {pending.length > 0 && <span className="text-slate-500"> · {pending.length} pending</span>}
                  </p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md h-fit ${
                  t.status === 'locked' ? 'bg-amber-500/10 text-amber-400' :
                  t.status === 'completed' ? 'bg-slate-700 text-slate-300' : 'bg-emerald-500/10 text-emerald-400'
                }`}>{t.status}</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {t.status === 'open' && (
                  <button onClick={() => setTournamentStatus(t.id, 'locked')}
                    className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg">
                    Lock Registration
                  </button>
                )}
                {t.status === 'locked' && (
                  <button onClick={() => setTournamentStatus(t.id, 'open')}
                    className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                    Reopen Registration
                  </button>
                )}
                <button onClick={() => deleteTournament(t.id)}
                  className="text-[11px] font-bold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg">
                  Delete Tournament
                </button>
              </div>

              {t.status !== 'open' && (
                <div className="mt-4 border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <button onClick={() => generatePools(t.id, 1)}
                      className="text-[11px] font-bold text-slate-200 bg-slate-800 px-3 py-1.5 rounded-lg">
                      Single Pool
                    </button>
                    <input
                      type="number" min="2" placeholder="# pools"
                      value={poolCounts[t.id] || ''}
                      onChange={(e) => setPoolCounts((prev) => ({ ...prev, [t.id]: e.target.value }))}
                      className="w-20 bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                    />
                    <button onClick={() => generatePools(t.id, poolCounts[t.id])}
                      className="text-[11px] font-bold text-slate-200 bg-slate-800 px-3 py-1.5 rounded-lg">
                      Multi Pool
                    </button>
                    <span className="text-[11px] text-slate-500">(regenerating replaces existing pools)</span>
                  </div>

                  {tournamentPools.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tournamentPools.map((pool) => (
                        <div key={pool.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                          <p className="text-xs font-bold text-emerald-400 mb-2">{pool.name}</p>
                          <ul className="space-y-1">
                            {approved.filter((r) => r.pool_id === pool.id).map((r) => (
                              <li key={r.id} className="flex items-center justify-between text-[11px] text-slate-300">
                                <span>{r.team_name}</span>
                                <select
                                  value={r.pool_id || ''}
                                  onChange={(e) => reassignPool(r.id, e.target.value)}
                                  className="bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-400 px-1 py-0.5"
                                >
                                  {tournamentPools.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                  ))}
                                </select>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShopInfoTab() {
  const [form, setForm] = useState({ shop_name: '', address: '', phone: '', whatsapp: '', hours: '', background_image_url: '', facebook_url: '', instagram_url: '', youtube_url: '', x_url: '' });
  const [bgFile, setBgFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('shop_settings').select('*').eq('id', 1).single();
    if (data) setForm(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let background_image_url = form.background_image_url;
      if (bgFile) background_image_url = await uploadImage('site-images', bgFile);

      const { error } = await supabase.from('shop_settings').update({
        shop_name: form.shop_name,
        address: form.address,
        phone: form.phone,
        whatsapp: form.whatsapp,
        hours: form.hours,
        background_image_url,
        facebook_url: form.facebook_url,
        instagram_url: form.instagram_url,
        youtube_url: form.youtube_url,
        x_url: form.x_url,
      }).eq('id', 1);
      if (error) throw error;
      setBgFile(null);
      setForm((prev) => ({ ...prev, background_image_url }));
      alert('Shop info updated.');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-400">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-w-xl">
      <h2 className="text-sm font-black text-emerald-400 uppercase tracking-wider">Shop Info</h2>
      <p className="text-[11px] text-slate-500">
        This shows in the site footer, and the phone/WhatsApp numbers power the "Order" buttons on every product.
      </p>
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Shop Name</label>
        <input value={form.shop_name || ''} onChange={handleChange('shop_name')}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Address</label>
        <textarea rows="2" value={form.address || ''} onChange={handleChange('address')} placeholder="Shop No. 4, Main Market, Delhi"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number (for Call button)</label>
        <input value={form.phone || ''} onChange={handleChange('phone')} placeholder="+91 98765 43210"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">WhatsApp Number (with country code, digits only)</label>
        <input value={form.whatsapp || ''} onChange={handleChange('whatsapp')} placeholder="919876543210"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
        <p className="text-[10px] text-slate-500 mt-1">No spaces, no +, no dashes — e.g. 919876543210</p>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Shop Hours</label>
        <input value={form.hours || ''} onChange={handleChange('hours')} placeholder="Mon–Sat, 10am – 8pm"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
      </div>
      <div className="border-t border-slate-800 pt-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Social Media Links</p>
        <p className="text-[11px] text-slate-500 mb-3">Shows as icons in the site footer. Leave any blank to hide that icon.</p>
        <div className="space-y-3">
          <input value={form.facebook_url || ''} onChange={handleChange('facebook_url')} placeholder="https://facebook.com/yourpage"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
          <input value={form.instagram_url || ''} onChange={handleChange('instagram_url')} placeholder="https://instagram.com/yourhandle"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
          <input value={form.youtube_url || ''} onChange={handleChange('youtube_url')} placeholder="https://youtube.com/@yourchannel"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
          <input value={form.x_url || ''} onChange={handleChange('x_url')} placeholder="https://x.com/yourhandle"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Site Background Photo</label>
        <p className="text-[10px] text-slate-500 mb-2">Upload a stadium/ground photo to use as the background across the whole site. Leave empty to keep the default design.</p>
        {form.background_image_url && !bgFile && (
          <div className="flex items-center gap-2 mb-2">
            <img src={form.background_image_url} alt="Current background" className="w-16 h-16 rounded-lg object-cover border border-slate-800" />
            <button type="button" onClick={() => setForm((prev) => ({ ...prev, background_image_url: '' }))}
              className="text-[11px] text-red-400 font-bold">Remove (use default design)</button>
          </div>
        )}
        <FileUpload label="Upload background photo" onUploadSuccess={({ file }) => setBgFile(file)} />
      </div>
      <button type="submit" disabled={saving}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all">
        {saving ? 'Saving...' : 'Save Shop Info'}
      </button>
    </form>
  );
}

function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('new');

  const load = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setMessages(data || []);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    const { error } = await supabase.from('contact_messages').update({ status: 'read' }).eq('id', id);
    if (error) alert(error.message);
    else load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this message?')) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) alert(error.message);
    else load();
  };

  const visible = messages.filter((m) => filter === 'all' || m.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {['new', 'read', 'all'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider ${filter === f ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
            {f} {f !== 'all' && `(${messages.filter((m) => m.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-w-2xl">
        {visible.length === 0 && <p className="text-sm text-slate-400">No messages here.</p>}
        {visible.map((m) => (
          <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-100">{m.name}</p>
                <p className="text-xs text-slate-400">
                  {m.email}{m.phone && ` • ${m.phone}`}{m.team_name && ` • ${m.team_name}`}
                </p>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md flex-shrink-0 ${
                m.status === 'new' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'
              }`}>{m.status}</span>
            </div>
            <p className="text-xs text-slate-300 mt-3 whitespace-pre-wrap">{m.message}</p>
            <p className="text-[10px] text-slate-500 mt-2">{new Date(m.created_at).toLocaleString()}</p>
            <div className="flex gap-2 mt-3">
              {m.status === 'new' && (
                <button onClick={() => markRead(m.id)} className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg">Mark Read</button>
              )}
              <button onClick={() => remove(m.id)} className="text-[11px] font-bold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const [tab, setTab] = useState('tournaments');

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-black text-emerald-400 tracking-tight mb-6">Super Admin</h1>

      <div className="flex gap-2 mb-8 bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit flex-wrap">
        {['tournaments', 'products', 'announcements', 'registrations', 'messages', 'gallery', 'shop-info'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${tab === t ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'tournaments' && <TournamentsTab />}
      {tab === 'products' && <ProductsTab />}
      {tab === 'announcements' && <AnnouncementsTab />}
      {tab === 'registrations' && <RegistrationsTab />}
      {tab === 'messages' && <MessagesTab />}
      {tab === 'gallery' && <GalleryTab />}
      {tab === 'shop-info' && <ShopInfoTab />}
    </div>
  );
}
