import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import FileUpload from '../components/ui/FileUpload';
import { useAuth } from '../context/AuthContext';

async function uploadHeroImage(file) {
  const ext = file.name.split('.').pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from('hero-images').upload(path, file);
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from('hero-images').getPublicUrl(path);
  return data.publicUrl;
}

const CATEGORY_PRESETS = [
  'Player of the Tournament',
  'Best Batsman',
  'Best Bowler',
  'Best Fielder',
  'Emerging Player',
];

const emptyForm = { category: CATEGORY_PRESETS[0], name: '', team: '', stats: '', file: null };

export default function Heroes() {
  const { isSuperAdmin: isAdmin } = useAuth();
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadHeroes();
  }, []);

  const loadHeroes = async () => {
    setLoading(true);
    const { data } = await supabase.from('heroes').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true });
    setHeroes(data || []);
    setLoading(false);
  };

  const startAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const startEdit = (hero) => {
    setEditingId(hero.id);
    setForm({ category: hero.category, name: hero.name, team: hero.team || '', stats: hero.stats || '', file: null });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return alert('Player name is required');
    setSaving(true);
    try {
      let image_url;
      if (form.file) image_url = await uploadHeroImage(form.file);

      if (editingId) {
        const patch = { category: form.category, name: form.name, team: form.team, stats: form.stats };
        if (image_url) patch.image_url = image_url;
        const { error } = await supabase.from('heroes').update(patch).eq('id', editingId);
        if (error) throw error;
      } else {
        const sort_order = heroes.length ? Math.max(...heroes.map((h) => h.sort_order || 0)) + 1 : 0;
        const { error } = await supabase.from('heroes').insert({
          category: form.category, name: form.name, team: form.team, stats: form.stats,
          image_url: image_url || null, sort_order,
        });
        if (error) throw error;
      }
      cancelForm();
      loadHeroes();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this hero card?')) return;
    const { error } = await supabase.from('heroes').delete().eq('id', id);
    if (error) alert(error.message);
    else loadHeroes();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-400">BEN SPORTS Heroes</h1>
            <p className="text-slate-400 text-sm mt-1">The Hall of Fame — Tracking top individual performances.</p>
          </div>
          {isAdmin && !showForm && (
            <button
              onClick={startAdd}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
            >
              + Add Hero
            </button>
          )}
        </div>

        {isAdmin && showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-w-xl">
            <h2 className="text-sm font-black text-emerald-400 uppercase tracking-wider">
              {editingId ? 'Edit Hero' : 'New Hero'}
            </h2>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category / Title</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                {CATEGORY_PRESETS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Player Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Aradhya Sharma"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Team</label>
              <input
                value={form.team}
                onChange={(e) => setForm({ ...form, team: e.target.value })}
                placeholder="BEN 11"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stats (Runs, Wickets, Catches, etc.)</label>
              <input
                value={form.stats}
                onChange={(e) => setForm({ ...form, stats: e.target.value })}
                placeholder="340 Runs & 12 Wickets"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Player Photo</label>
              <FileUpload label="Upload player photo" onUploadSuccess={({ file }) => setForm((f) => ({ ...f, file }))} />
              {editingId && !form.file && (
                <p className="text-[11px] text-slate-500 mt-1">Leave empty to keep the current photo.</p>
              )}
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all">
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Publish Hero'}
              </button>
              <button type="button" onClick={cancelForm}
                className="px-5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all">
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-sm text-slate-400">Loading heroes...</p>
        ) : heroes.length === 0 ? (
          <p className="text-sm text-slate-400">No heroes added yet.{isAdmin && ' Click "Add Hero" to publish the first one.'}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {heroes.map((h) => (
              <div key={h.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative group">
                <div className="w-full aspect-square bg-slate-950">
                  {h.image_url ? (
                    <img src={h.image_url} alt={h.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700 text-4xl font-black">
                      {h.name?.[0] || '?'}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">{h.category}</span>
                  <h2 className="text-xl font-black">{h.name}</h2>
                  {h.team && <p className="text-xs text-slate-400 font-medium">{h.team}</p>}
                  {h.stats && <p className="text-emerald-400 text-sm font-bold font-mono mt-4">{h.stats}</p>}
                </div>
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(h)}
                      className="text-[10px] font-bold bg-slate-950/80 backdrop-blur text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(h.id)}
                      className="text-[10px] font-bold bg-red-500/80 backdrop-blur text-white px-2.5 py-1.5 rounded-lg border border-red-400">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
