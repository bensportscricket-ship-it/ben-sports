import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Public sign up. Every new account is created as a plain "member".
        // There is intentionally no way to request team_admin / super_admin
        // from this form — those roles can only be granted by an existing
        // super admin, directly in the database. See supabase/schema.sql.
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Account created! Check your email inbox for a verification link.');
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile?.role === 'super_admin') {
          navigate('/admin');
        } else if (profile?.role === 'team_admin') {
          navigate('/score');
        } else {
          navigate('/');
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
            {isSignUp ? 'Create your account' : 'Secure Gateway Portal'}
          </p>
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
              minLength={6}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-lg"
          >
            {loading ? 'Processing...' : isSignUp ? 'Register New Account' : 'Sign In'}
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
