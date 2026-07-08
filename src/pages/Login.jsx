import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [roleSelection, setRoleSelection] = useState('member'); // member, team_admin, super_admin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // 🆕 PUBLIC SIGN UP FROM WEBSITE
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              initial_role: roleSelection, // Passes their requested tier down
            }
          }
        });
        if (error) throw error;
        alert('Account registration initiated! Check your email inbox for a secure verification link.');
      } else {
        // 🔑 LIVE LOGIN FROM WEBSITE
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Fetch profile tier to route them correctly
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('uuid', data.user.id)
          .single();

        if (profile?.role === 'super_admin') {
          navigate('/score'); // Send master admin straight to scoring controllers
        } else if (profile?.role === 'team_admin') {
          navigate('/teams'); // Send captains straight to finance ledgers
        } else {
          navigate('/'); // Send standard players to landing hub
        }
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 w-full max-w-md space-y-6 shadow-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tight text-emerald-400">BEN SPORTS</h1>
          <p className="text-xs text-slate-400 mt-1">
            {isSignUp ? 'Create your platform account instantly' : 'Unified Secure Gateway Portal'}
          </p>
        </div>

        {/* Dynamic Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-bold uppercase tracking-wider">
          {['member', 'team_admin', 'super_admin'].map((tier) => (
            <button
              key={tier} type="button" onClick={() => setRoleSelection(tier)}
              className={`py-2 rounded-lg text-center transition-all ${roleSelection === tier ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {tier.replace('_', ' ')}
            </button>
          ))}
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-lg"
          >
            {loading ? 'Processing...' : isSignUp ? 'Register New Account' : 'Authenticate Securely'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button" onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium underline underline-offset-4"
          >
            {isSignUp ? 'Already registered? Sign In instead' : "Don't have an account yet? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
}
