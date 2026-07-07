import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('member'); // default role

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // Simulating secure token generation and saving to localStorage
    const mockUserData = {
      email,
      role: selectedRole,
      token: `sec_token_${selectedRole}_${Date.now()}`
    };
    
    localStorage.setItem('ben_sports_user', JSON.stringify(mockUserData));

    // Role-Based Smart Redirects
    if (selectedRole === 'super_admin') {
      navigate('/tournaments'); // Super admins go right into tournament controls
    } else if (selectedRole === 'team_admin') {
      navigate('/teams'); // Team admins go straight to their roster financial sheets
    } else {
      navigate('/heroes'); // Standard members land on the stats leaderboards
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-emerald-400 tracking-tight">BEN SPORTS</h1>
          <p className="text-slate-400 text-xs mt-1">Unified Secure Gateway Portal</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {/* Role selection segment */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Access Privilege Tier</label>
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {['member', 'team_admin', 'super_admin'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    selectedRole === role 
                      ? 'bg-emerald-500 text-slate-950 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {role.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Email input field */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 rounded-lg text-sm transition-colors shadow-lg shadow-emerald-500/10 mt-2"
          >
            Authenticate Securely
          </button>
        </form>
      </div>
    </div>
  );
}