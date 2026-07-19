import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function Gallery() {
  const { isSuperAdmin } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    supabase
      .from('gallery_images')
      .select('id, caption, image_url, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setImages(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-emerald-400 tracking-tight">Gallery</h1>
          <p className="text-xs text-slate-400 mt-1">Photos from every match, every ground.</p>
        </div>
        {isSuperAdmin && (
          <Link
            to="/admin"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition-all"
          >
            + Manage Gallery
          </Link>
        )}
      </div>

      {loading && <p className="text-sm text-slate-400">Loading photos...</p>}
      {error && <p className="text-sm text-red-400">Could not load gallery: {error}</p>}
      {!loading && !error && images.length === 0 && (
        <p className="text-sm text-slate-400">No photos yet. Check back soon.</p>
      )}

      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => setLightbox(img)}
            className="block w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900 break-inside-avoid"
          >
            <img src={img.image_url} alt={img.caption || 'Gallery photo'} className="w-full h-auto object-cover hover:scale-[1.02] transition-transform" />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <div className="max-w-3xl w-full">
            <img src={lightbox.image_url} alt={lightbox.caption || ''} className="w-full h-auto rounded-xl" />
            {lightbox.caption && <p className="text-center text-sm text-slate-300 mt-3">{lightbox.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
