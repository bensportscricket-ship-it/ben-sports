import React from 'react';

export default function TournamentHub() {
  const matches = [
    { id: 1, teams: "BEN 11 vs Star Strikers", status: "Live", score: "142/3 (14.2 Ov)", venue: "Green Park Ground" },
    { id: 2, teams: "Royal Challengers vs Super Kings", status: "Upcoming", score: "Starts at 04:00 PM", venue: "BEN Sports Arena" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">Tournament Hub</h1>
          <p className="text-slate-400 text-sm mt-1">Live match fixtures, pooling setups, and league tracking metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map(match => (
            <div key={match.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <span className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full ${match.status === 'Live' ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                {match.status}
              </span>
              <h3 className="text-lg font-bold text-slate-200 pr-16">{match.teams}</h3>
              <p className="text-xs text-slate-500 mt-1">📍 {match.venue}</p>
              <p className="text-xl font-black text-emerald-400 mt-4">{match.score}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
