import React, { useState } from 'react';

export default function Heroes() {
  const [statTab, setStatTab] = useState('runs');

  // Mock Data: Super Admin Hand-Picked Accolades
  const specialHonors = [
    { title: "Player of the Tournament", name: "Aradhya Sharma", team: "BEN 11", stat: "340 Runs & 12 Wickets", icon: "🏆" },
    { title: "Best Fielder", name: "Rohan Sharma", team: "Star Strikers", stat: "9 Catches & 2 Run-outs", icon: "⚡" },
    { title: "Emerging Player", name: "Amit Patel", team: "BEN 11", stat: "185 Runs (SR 145.2)", icon: "🌟" }
  ];

  // Mock Data: Automatically Aggregated Statistics Leaderboard
  const leaderboards = {
    runs: [
      { rank: 1, name: "Aradhya Sharma", team: "BEN 11", matches: 6, value: 340, avg: 68.0, sr: 138.2 },
      { rank: 2, name: "Vikram Malhotra", team: "Star Strikers", matches: 6, value: 295, avg: 49.1, sr: 124.5 },
      { rank: 3, name: "Rahul Singh", team: "BEN 11", matches: 5, value: 210, avg: 42.0, sr: 118.0 }
    ],
    wickets: [
      { rank: 1, name: "Deepak Kumar", team: "BEN 11", matches: 6, value: 14, avg: 12.3, econ: 6.2 },
      { rank: 2, name: "S. Kumar", team: "Star Strikers", matches: 6, value: 11, avg: 15.4, econ: 6.8 },
      { rank: 3, name: "Aradhya Sharma", team: "BEN 11", matches: 6, value: 12, avg: 14.1, econ: 5.9 }
    ],
    catches: [
      { rank: 1, name: "Rohan Sharma", team: "Star Strikers", matches: 6, value: 9, dismissals: "9 Catches", ro: 2 },
      { rank: 2, name: "Amit Patel", team: "BEN 11", matches: 6, value: 7, dismissals: "5 Catches, 2 Stumpings", ro: 0 },
      { rank: 3, name: "Deepak Singh", team: "Star Strikers", matches: 6, value: 5, dismissals: "5 Catches", ro: 1 }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">BEN SPORTS Heroes</h1>
          <p className="text-slate-400 text-sm mt-1">The Hall of Fame — Tracking the top individual performances across the entire tournament universe.</p>
        </div>

        {/* Section 1: Super Admin Special Honors */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Tournament Special Honors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialHonors.map((honor, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl hover:border-emerald-500/30 transition-all">
                <div className="absolute -right-4 -bottom-4 text-7xl opacity-10 pointer-events-none">
                  {honor.icon}
                </div>
                <span className="text-2xl">{honor.icon}</span>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide mt-3">{honor.title}</p>
                <h3 className="text-xl font-black text-slate-100 mt-1">{honor.name}</h3>
                <p className="text-xs text-slate-400 font-medium">{honor.team}</p>
                <p className="text-sm text-slate-300 font-semibold mt-4 border-t border-slate-800/80 pt-3">{honor.stat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Automated Statistics Leaderboard */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-200">Statistical Leaders</h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time aggregated player metrics mapped directly from match cards</p>
            </div>
            
            {/* Filter Navigation Tabs */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-center">
              <button 
                onClick={() => setStatTab('runs')}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${statTab === 'runs' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Batting (Runs)
              </button>
              <button 
                onClick={() => setStatTab('wickets')}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${statTab === 'wickets' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Bowling (Wickets)
              </button>
              <button 
                onClick={() => setStatTab('catches')}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${statTab === 'catches' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Fielding (Catches)
              </button>
            </div>
          </div>

          {/* Dynamic Leaderboard Table Rendering */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium text-xs uppercase tracking-wider">
                  <th className="pb-3 w-16 text-center">Rank</th>
                  <th className="pb-3">Player</th>
                  <th className="pb-3 text-center">Matches</th>
                  <th className="pb-3 text-center font-bold text-emerald-400">
                    {statTab === 'runs' ? 'Total Runs' : statTab === 'wickets' ? 'Wickets' : 'Dismissals'}
                  </th>
                  <th className="pb-3 text-right">
                    {statTab === 'runs' ? 'Strike Rate' : statTab === 'wickets' ? 'Economy' : 'Run Outs'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leaderboards[statTab].map((player) => (
                  <tr key={player.rank} className="hover:bg-slate-950/20 transition-colors">
                    <td className="py-4 text-center font-bold font-mono text-slate-400">
                      {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
                    </td>
                    <td className="py-4">
                      <p className="font-bold text-slate-200">{player.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{player.team}</p>
                    </td>
                    <td className="py-4 text-center font-semibold text-slate-300 font-mono">
                      {player.matches}
                    </td>
                    <td className="py-4 text-center font-black text-base text-slate-100 font-mono">
                      {statTab === 'catches' ? player.dismissals : player.value}
                    </td>
                    <td className="py-4 text-right text-xs font-mono font-bold text-slate-400">
                      {statTab === 'runs' ? `SR ${player.sr}` : statTab === 'wickets' ? `Econ ${player.econ}` : `RO ${player.ro}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
