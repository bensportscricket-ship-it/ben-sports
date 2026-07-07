import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    teamName: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API registration storage endpoint handling
    console.log("New Registration Logged: ", formData);
    setSubmitted(true);
    
    // Clear the form fields
    setFormData({ name: '', email: '', phone: '', teamName: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">Contact Committee</h1>
          <p className="text-slate-400 text-sm mt-1">
            Reach the BEN SPORTS organizing committee or register your own external league.
          </p>
        </div>

        {submitted && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs font-bold animate-fade-in flex items-center gap-2">
            ✅ Thank you! Your league registration query has been received securely. The committee will respond back shortly.
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Your Full Name</label>
                <input
                  type="text" required name="name" value={formData.name} onChange={handleChange} placeholder="Aradhya Sharma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email" required name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contact Phone Number</label>
                <input
                  type="tel" required name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Club / Team Name (Optional)</label>
                <input
                  type="text" name="teamName" value={formData.teamName} onChange={handleChange} placeholder="e.g., BEN Warriors"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Registration Brief & Message Details</label>
              <textarea
                required rows="4" name="message" value={formData.message} onChange={handleChange} placeholder="Outline your team roster size, ground allocation queries, or external league rules..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10"
              >
                Send Message Securely
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}