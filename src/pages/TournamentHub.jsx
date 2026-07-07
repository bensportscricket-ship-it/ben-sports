import React, { useState } from 'react';

export default function TournamentHub() {
  // Mock registration tracking pool
  const [registeredTeams, setRegisteredTeams] = useState([
    "BEN 11", "Star Strikers", "Royal Challengers", "Super Kings", 
    "Titan Giants", "Matrix Masters", "Delta Warriors", "Apex Legends"
  ]);

  // Automated algorithmic pooling allocation states
  const [pools, setPools] = useState({ poolA: [], poolB: [] });
  const [fixtures, setFixtures] = useState([]);
  const [isGenerated, setIsGenerated] = useState(false);

  // Core Pooling Generator Algorithm
  const handleGeneratePoolsAndFixtures = () => {
    // 1. Shuffle teams randomly for unbiased allocation
    const shuffled = [...registeredTeams].sort(() => 0.5 - Math.random());
    
    // 2. Split into two balanced groups (Pool A & Pool B)
    const midIdx = Math.ceil(shuffled.length / 2);
    const poolA = shuffled.slice(0, midIdx);
    const poolB = shuffled.slice(midIdx);

    setPools({ poolA, poolB });

    // 3. Generate initial Opening Round-Robin Fixture Slots automatically
    const generatedFixtures = [
      { id: 101, round: "Opening Round (Pool A)", matchup: `${poolA[0]} vs ${poolA[1] || 'TBD'}`, venue: "Green Park Ground", time: "09:30 AM" },
      { id: 102, round: "Opening Round (Pool A)", matchup: `${poolA[2] || 'TBD'} vs ${poolA[3] || 'TBD'}`, venue: "BEN Sports Arena", time: "11:45 AM" },
      { id: 103, round: "Opening Round (Pool B)", matchup: `${poolB[0]} vs ${poolB[1] || 'TBD'}`, venue: "Green Park Ground", time: "02:00 PM" },
      { id: 104, round: "Opening Round (Pool B)", matchup: `${poolB[2] || 'TBD'} vs ${poolB[3] || 'TBD'}`, venue: "BEN Sports Arena", time: "04:15 PM" }
    ];

    setFixtures(generatedFixtures);
    setIsGenerated(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Dashboard section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">Tournament Pool Hub</h1>
            <p className="text-slate-400 text-sm mt-1">Algorithmic group generation, round-robin setups, and match card draws.</p>
          </div>
          <button
            onClick={handleGeneratePoolsAndFixtures}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10 uppercase tracking-wider self-start sm:self-center"
          >
            🔄 Auto-Generate Pools & Matches
          </button>
        </div>

        {/* Dynamic Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Registered Pool Track */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              📋 Registered Teams ({registeredTeams.length})
            </h2>
            <div className="space-y-2">
              {registeredTeams.map((team, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-800/50 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300">
                  {team}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 & 3: Dynamic Grouping Output */}
          <div className="lg:col-span-2 space-y-8">
            {!isGenerated ? (
              <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                <p className="text-sm italic">Click the "Auto-Generate" trigger to run round-robin sorting algorithms.</p>
              </div>
            ) : (
              <>
                {/* Generated Pools Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pool A Display Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-lg">
                    <span className="text-[10px] font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">Pool A</span>
                    <div className="mt-4 space-y-2.5">
                      {pools.poolA.map((t, i) => (
                        <p key={i} className="text-sm font-bold text-slate-200 font-mono">⚡ {t}</p>
                      ))}
                    </div>
                  </div>

                  {/* Pool B Display Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-lg">
                    <span className="text-[10px] font-black tracking-widest uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full">Pool B</span>
                    <div className="mt-4 space-y-2.5">
                      {pools.poolB.map((t, i) => (
                        <p key={i} className="text-sm font-bold text-slate-200 font-mono">⚡ {t}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Generated Fixture Slots List Layout */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider">🗓️ Generated Schedule Cards</h3>
                  <div className="divide-y divide-slate-800/60">
                    {fixtures.map((match) => (
                      <div key={match.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{match.round}</span>
                          <h4 className="text-md font-black text-slate-100 mt-0.5">{match.matchup}</h4>
                          <p className="text-xs text-slate-400 mt-1">📍 {match.venue}</p>
                        </div>
                        <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-right self-start sm:self-center">
                          <p className="text-xs font-black text-emerald-400 font-mono">{match.time}</p>
                          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mt-0.5">Confirmed Match Slot</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}