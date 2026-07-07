import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Shop() {
  // Production global state managers
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Creation forms states for authenticated Super Admins
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock checking auth user role tier (This securely maps to user session context later)
  const [userRole, setUserRole] = useState('super_admin'); 

  // Pull active cloud products inventory from database hook on component load
  useEffect(() => {
    fetchLiveInventory();
  }, []);

  const fetchLiveInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Inventory Fetch Error:', err.message);
      setErrorMsg('Could not fetch active products collection.');
    } finally {
      setLoading(false);
    }
  };

  // Safe Insertion Handler for Super Admins
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: newTitle,
            price: parseFloat(newPrice),
            description: newDesc
          }
        ])
        .select();

      if (error) throw error;

      // Update state locally so UI updates immediately without manual reload
      if (data) setProducts([data[0], ...products]);
      
      // Clear administration inputs
      setNewTitle('');
      setNewPrice('');
      setNewDesc('');
    } catch (err) {
      console.error('Inventory Write Error:', err.message);
      alert('Security violation: Failed to publish new catalog item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Upper Heading Context */}
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">Official Gear Shop</h1>
          <p className="text-slate-400 text-sm mt-1">Order authentic BEN SPORTS kits, premium willow bats, and protective tournament gear.</p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form panel visible strictly to authenticated Super Admins */}
        {userRole === 'super_admin' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">🛡️ Admin Inventory Controls</h2>
            <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Item Title / Model Name</label>
                <input 
                  type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., BEN Players Edition Bat"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Retail Price (INR)</label>
                <input 
                  type="number" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g., 2499"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-lg transition-all"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Item Live'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Live Inventory Grid Display Rendering */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 italic text-xs">Connecting to central storage vault...</div>
        ) : products.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm">
            No active gear listings published in this collection catalog yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-md group">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-md font-bold text-slate-100 tracking-tight group-hover:text-emerald-400 transition-colors">{item.name}</h3>
                    <span className="text-emerald-400 font-mono font-black text-sm">₹{item.price}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.description || 'No additional catalog details provided for this batch gear unit.'}</p>
                </div>
                
                <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between gap-2">
                  <span className="text-[9px] text-slate-500 font-mono">SKU-ID: #{item.id}</span>
                  <button className="bg-slate-950 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 font-bold text-[10px] uppercase tracking-wide px-3 py-1.5 rounded-lg border border-slate-800 hover:border-emerald-500 transition-all">
                    Order Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
