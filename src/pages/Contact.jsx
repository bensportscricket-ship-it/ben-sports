
import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Contact() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		teamName: '',
		message: ''
	});
  
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErrorMessage('');
    
		try {
			// Stream the registration request directly into your cloud Supabase 'teams' table
			const { error } = await supabase
				.from('teams')
				.insert([
					{ 
						captain_name: formData.name,
						team_name: formData.teamName || 'Independent Agent',
						contact_phone: formData.phone,
						payment_status: 'pending'
					}
				]);

			if (error) throw error;

			setSubmitted(true);
			setFormData({ name: '', email: '', phone: '', teamName: '', message: '' });
		} catch (err) {
			console.error("Database Injection Error:", err.message);
			setErrorMessage('Failed to connect to backend storage. Please verify your internet connection.');
		} finally {
			setLoading(false);
		}
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
					<div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
						✅ Success! Your league registration query has been saved directly to cloud storage.
					</div>
				)}

				{errorMessage && (
					<div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs font-bold">
						⚠️ {errorMessage}
					</div>
				)}

				<div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Your Full Name</label>
								<input
									type="text" required name="name" value={formData.name} onChange={handleChange} placeholder="Your Name"
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
								<label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Club / Team Name</label>
								<input
									type="text" required name="teamName" value={formData.teamName} onChange={handleChange} placeholder="e.g., BEN Warriors"
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
								disabled={loading}
								className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg"
							>
								{loading ? 'Saving Data...' : 'Send Message Securely'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
