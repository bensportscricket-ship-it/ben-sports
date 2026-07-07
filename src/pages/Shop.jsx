import React, { useState } from 'react';

export default function Shop() {
  // Grab the logged-in session data to verify if user is Super Admin
  const userSession = JSON.parse(localStorage.getItem('ben_sports_user'));
  const isSuperAdmin = userSession && userSession.role === 'super_admin';

  // State for products list
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "BEN SPORTS Premium Match Jersey",
      price: 799,
      description: "Breathable, high-grade anti-sweat athletic fabric worn by pro division players.",
      reviews: [
        { user: "Rohan S.", rating: 5, comment: "Top tier material! Fits perfectly for long day matches." },
        { user: "Amit P.", rating: 4, comment: "Very comfortable, color stays vibrant after multiple washes." }
      ]
    },
    {
      id: 2,
      name: "Pro-Grade English Willow Cricket Bat",
      price: 5499,
      description: "Perfect sweet-spot alignment with dynamic lightweight pick up for big hitters.",
      reviews: [
        { user: "Vikram M.", rating: 5, comment: "Insane stroke punch. Absolutely loving it in my league games." }
      ]
    }
  ]);

  // Form states for creating a new product (Super Admin only)
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Form states for adding a user review
  const [activeProductId, setActiveProductId] = useState(null);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Admin function to handle creating products
  const handleCreateProduct = (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      name: newTitle,
      price: Number(newPrice),
      description: newDesc,
      reviews: []
    };
    setProducts([newItem, ...products]);
    setNewTitle('');
    setNewPrice('');
    setNewDesc('');
  };

  // User function to post product reviews
  const handleAddReview = (e, productId) => {
    e.preventDefault();
    setProducts(prevProducts =>
      prevProducts.map(prod => {
        if (prod.id === productId) {
          return {
            ...prod,
            reviews: [...prod.reviews, { user: reviewerName || "Anonymous Member", rating: Number(reviewRating), comment: reviewComment }]
          };
        }
        return prod;
      })
    );
    // Reset review input blocks
    setReviewerName('');
    setReviewComment('');
    setActiveProductId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">BEN SPORTS Store</h1>
            <p className="text-slate-400 text-sm mt-1">Official gear, customized kits, and high-performance premium accessories.</p>
          </div>
          {isSuperAdmin && (
            <span className="text-xs bg-emerald-500 text-slate-950 font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/10">
              🛡️ Super Admin Mode Active
            </span>
          )}
        </div>

        {/* Super Admin Creator Control Dashboard Panel */}
        {isSuperAdmin && (
          <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-md font-bold text-slate-200 mb-4 flex items-center gap-2">
              ➕ Add New Storefront Inventory Item
            </h2>
            <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Product Title</label>
                <input 
                  type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., Premium Bat"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Price (INR)</label>
                <input 
                  type="number" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g., 1200"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description Brief</label>
                <input 
                  type="text" required value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Product technical highlights..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-3 text-right">
                <button 
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs px-5 py-2.5 rounded-lg transition-all shadow-md"
                >
                  Publish Item Live
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Live Marketplace Items Grid Grid Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              
              {/* Product Info Block */}
              <div>
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-lg font-bold text-slate-100">{item.name}</h3>
                  <span className="text-xl font-black text-emerald-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 font-mono">
                    ₹{item.price}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mt-2">{item.description}</p>
              </div>

              {/* Comments & Community Reviews Stream Section */}
              <div className="mt-6 border-t border-slate-800/80 pt-4 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Reviews & Ratings ({item.reviews.length})</h4>
                
                {item.reviews.length === 0 ? (
                  <p className="text-xs text-slate-600 italic">No community feedback compiled for this piece yet.</p>
                ) : (
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {item.reviews.map((rev, index) => (
                      <div key={index} className="bg-slate-950/40 border border-slate-800/40 p-3 rounded-xl text-xs">
                        <div className="flex justify-between items-center text-slate-400 font-medium">
                          <span className="text-slate-300 font-bold">{rev.user}</span>
                          <span className="text-amber-400 font-mono">{"★".repeat(rev.rating)}</span>
                        </div>
                        <p className="text-slate-400 mt-1 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Review Action Control Toggle Button */}
                {activeProductId !== item.id ? (
                  <button
                    onClick={() => setActiveProductId(item.id)}
                    className="text-xs text-emerald-400 hover:underline font-bold"
                  >
                    + Write an Official Review
                  </button>
                ) : (
                  <form onSubmit={(e) => handleAddReview(e, item.id)} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 mt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} placeholder="Your Name"
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                      <select 
                        value={reviewRating} onChange={(e) => setReviewRating(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-amber-400 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5 Star)</option>
                        <option value="4">⭐⭐⭐⭐ (4 Star)</option>
                        <option value="3">⭐⭐⭐ (3 Star)</option>
                        <option value="2">⭐⭐ (2 Star)</option>
                        <option value="1">⭐ (1 Star)</option>
                      </select>
                    </div>
                    <textarea 
                      required rows="2" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Share your experience review details with other players..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                    <div className="flex justify-end gap-2 text-[10px]">
                      <button type="button" onClick={() => setActiveProductId(null)} className="bg-slate-800 px-3 py-1.5 rounded-md text-slate-300 font-bold">Cancel</button>
                      <button type="submit" className="bg-emerald-500 text-slate-950 font-black px-3 py-1.5 rounded-md shadow-md">Post Review</button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}