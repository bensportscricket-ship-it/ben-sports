import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';

function ProductComments({ productId }) {
  const { session, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const loadComments = async () => {
    const { data, error } = await supabase
      .from('product_comments')
      .select('id, comment, created_at, author_email')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    if (!error) setComments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (open) loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const { error } = await supabase.from('product_comments').insert({
      product_id: productId,
      user_id: user.id,
      author_email: user.email,
      comment: text.trim(),
    });
    if (error) {
      alert(error.message);
      return;
    }
    setText('');
    loadComments();
  };

  return (
    <div className="mt-3 border-t border-slate-800 pt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider"
      >
        {open ? 'Hide comments' : 'View comments'}
      </button>

      {open && (
        <div className="mt-2 space-y-3">
          {loading ? (
            <p className="text-xs text-slate-500">Loading...</p>
          ) : comments.length === 0 ? (
            <p className="text-xs text-slate-500">No comments yet.</p>
          ) : (
            <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {comments.map((c) => (
                <li key={c.id} className="text-xs text-slate-300 bg-slate-950/60 rounded-lg p-2 border border-slate-800">
                  <span className="text-emerald-400 font-semibold">{c.author_email?.split('@')[0]}</span>: {c.comment}
                </li>
              ))}
            </ul>
          )}

          {session ? (
            <form onSubmit={submitComment} className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[11px] font-bold px-3 rounded-lg">
                Post
              </button>
            </form>
          ) : (
            <p className="text-[11px] text-slate-500">
              <Link to="/login" className="text-emerald-400 underline">Log in</Link> to leave a comment.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Shop() {
  const { isSuperAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shopInfo, setShopInfo] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, description, image_url, created_at')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
    supabase.from('shop_settings').select('*').eq('id', 1).single().then(({ data }) => setShopInfo(data));
  }, []);

  const whatsappLink = (product) => {
    if (!shopInfo?.whatsapp) return null;
    const message = encodeURIComponent(`Hi, I'd like to order: ${product.name} (Rs. ${product.price})`);
    return `https://wa.me/${shopInfo.whatsapp}?text=${message}`;
  };

  const callLink = () => (shopInfo?.phone ? `tel:${shopInfo.phone.replace(/\s/g, '')}` : null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-emerald-400 tracking-tight">Shop</h1>
          <p className="text-xs text-slate-400 mt-1">Cricket bats, gloves, pads and more.</p>
        </div>
        {isSuperAdmin && (
          <Link
            to="/admin"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition-all"
          >
            + Manage Products
          </Link>
        )}
      </div>

      {loading && <p className="text-sm text-slate-400">Loading products...</p>}
      {error && <p className="text-sm text-red-400">Could not load products: {error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-sm text-slate-400">No products yet. Check back soon.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col">
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-950 mb-3">
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No image</div>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-100">{p.name}</h3>
            <p className="text-emerald-400 font-black text-sm mt-1">Rs. {p.price}</p>
            {p.description && <p className="text-xs text-slate-400 mt-2">{p.description}</p>}
            <div className="flex gap-2 mt-3">
              {shopInfo?.whatsapp && (
                <a href={whatsappLink(p)} target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[11px] font-black uppercase tracking-wide px-3 py-2 rounded-lg transition-all">
                  Order on WhatsApp
                </a>
              )}
              {shopInfo?.phone && (
                <a href={callLink()}
                  className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-black uppercase tracking-wide px-3 py-2 rounded-lg transition-all">
                  Call to Order
                </a>
              )}
            </div>
            <ProductComments productId={p.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
