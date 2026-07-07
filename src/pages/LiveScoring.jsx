import React, { useState } from 'react';

export default function LiveScoring() {
  // Match & Team State
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [legalBalls, setLegalBalls] = useState(0);
  const [totalBallsBowled, setTotalBallsBowled] = useState(0); // Tracks current over balls (0 to 5)

  // Batter & Bowler Live States
  const [striker, setStriker] = useState("Rahul (BEN 11)");
  const [nonStriker, setNonStriker] = useState("Aradhya (BEN 11)");
  const [currentBowler, setCurrentBowler] = useState("S. Kumar (Star Strikers)");

  // Wicket & Over States
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [wicketType, setWicketType] = useState('');
  const [fielderName, setFielderName] = useState('');
  const [showOverSummary, setShowOverSummary] = useState(false);
  const [thisOverRuns, setThisOverRuns] = useState([]);

  const fieldingSquad = ["Rohan Sharma", "Amit Patel", "Deepak Singh", "Vikram Malhotra"];

  // Core Logic: Handles strike rotation
  const rotateStrike = () => {
    setStriker(prev => {
      const temp = prev;
      setStriker(nonStriker);
      setNonStriker(temp);
    });
  };

  // Processing Legal Runs
  const handleBallScored = (runAmount) => {
    setRuns(prev => prev + runAmount);
    setLegalBalls(prev => prev + 1);
    const newBallCount = totalBallsBowled + 1;
    setThisOverRuns(prev => [...prev, runAmount]);

    // Rotate strike on odd runs
    if (runAmount % 2 !== 0) {
      const temp = striker;
      setStriker(nonStriker);
      setNonStriker(temp);
    }

    if (newBallCount === 6) {
      setTotalBallsBowled(0);
      setShowOverSummary(true);
      // Over end automatically rotates strike for the next over
      const temp = striker;
      setStriker(nonStriker);
      setNonStriker(temp);
    } else {
      setTotalBallsBowled(newBallCount);
    }
  };

  // Processing Extras (Wide, No Ball, Byes)
  const handleExtraScored = (type) => {
    if (type === 'WD') {
      setRuns(prev => prev + 1);
      setThisOverRuns(prev => [...prev, 'WD']);
      // Wide doesn't add a legal ball, strike doesn't change
    } else if (type === 'NB') {
      setRuns(prev => prev + 1);
      setThisOverRuns(prev => [...prev, 'NB']);
      // No ball doesn't add a legal ball
    } else if (type === 'BYE' || type === 'LB') {
      setRuns(prev => prev + 1);
      setLegalBalls(prev => prev + 1);
      setThisOverRuns(prev => [...prev, type === 'BYE' ? 'B1' : 'LB1']);
      rotateStrike(); // Single bye/leg-bye rotates strike
      
      const newBallCount = totalBallsBowled + 1;
      if (newBallCount === 6) {
        setTotalBallsBowled(0);
        setShowOverSummary(true);
      } else {
        setTotalBallsBowled(newBallCount);
      }
    }
  };

  const handleWicketDetailsSubmit = (e) => {
    e.preventDefault();
    setWickets(prev => prev + 1);
    setLegalBalls(prev => prev + 1);
    setThisOverRuns(prev => [...prev, 'W']);
    setShowWicketModal(false);

    // Prompt for new batter name
    const nextBatter = prompt("Enter next batsman name:");
    setStriker(nextBatter || "New Batsman");

    const newBallCount = totalBallsBowled + 1;
    if (newBallCount === 6) {
      setTotalBallsBowled(0);
      setShowOverSummary(true);
    } else {
      setTotalBallsBowled(newBallCount);
    }
    setWicketType('');
    setFielderName('');
  };

  const startNextOver = () => {
    const nextBowler = prompt("Enter next Bowler name:", "New Bowler");
    if (nextBowler) setCurrentBowler(nextBowler);
    setThisOverRuns([]);
    setShowOverSummary(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
        
        {/* Top Score banner */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-black text-emerald-400">BEN 11 vs Star Strikers</h2>
            <p className="text-xs text-slate-400 mt-0.5">Bowler: <span className="text-slate-200 font-semibold">{currentBowler}</span></p>
          </div>
          <div className="bg-slate-950 px-4 py-2 rounded-xl text-center border border-slate-800">
            <h1 className="text-3xl font-black">{runs}/{wickets}</h1>
            <p className="text-xs text-slate-400 font-bold">Overs: {Math.floor(legalBalls / 6)}.{totalBallsBowled}</p>
          </div>
        </div>

        {/* Current Partnership Display Panel */}
        <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 mb-6 text-sm">
          <div className={`p-2 rounded-lg ${striker.includes('*') ? '' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
            <p className="text-xs font-bold text-emerald-400">🏏 Striker</p>
            <p className="font-bold text-slate-100 truncate mt-0.5">{striker} *</p>
          </div>
          <div className="p-2 bg-slate-900/40 rounded-lg border border-slate-800/40">
            <p className="text-xs text-slate-400 font-medium">Non-Striker</p>
            <p className="font-semibold text-slate-300 truncate mt-0.5">{nonStriker}</p>
          </div>
        </div>

        {/* This Over Live Timeline Stream */}
        <div className="mb-6 bg-slate-950/40 border border-slate-800/80 rounded-xl p-3 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 pr-2 border-r border-slate-800">This Over:</span>
          {thisOverRuns.length === 0 ? (
            <span className="text-xs text-slate-600 italic">Waiting for first ball...</span>
          ) : (
            thisOverRuns.map((ball, idx) => (
              <span key={idx} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${ball === 'W' ? 'bg-red-600 text-white' : ball === 4 || ball === 6 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                {ball}
              </span>
            ))
          )}
        </div>

        {/* Scoring Run Control Matrix */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[0, 1, 2, 3, 4, 6].map((num) => (
            <button
              key={num}
              onClick={() => handleBallScored(num)}
              className="bg-slate-800 hover:bg-slate-700 active:bg-emerald-500 active:text-slate-950 transition-all py-3.5 rounded-xl text-lg font-bold border border-slate-700/40 shadow-sm"
            >
              {num === 0 ? "🏃‍♂️ Dot" : `+${num} Run`}
            </button>
          ))}
        </div>

        {/* Extras Quick Tap Strip */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {['WD', 'NB', 'BYE', 'LB'].map((ext) => (
            <button
              key={ext}
              onClick={() => handleExtraScored(ext)}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 text-xs font-extrabold py-2.5 rounded-lg tracking-wider"
            >
              +{ext}
            </button>
          ))}
        </div>

        {/* Dismissal Trigger Bar */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={() => rotateStrike()}
            className="bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold py-3 rounded-xl text-sm border border-slate-800"
          >
            🔄 Swap Strike
          </button>
          <button
            onClick={() => setShowWicketModal(true)}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold py-3 rounded-xl text-sm transition-colors"
          >
            🛑 OUT / WICKET
          </button>
        </div>

        {/* Over Completion Intercept Panel */}
        {showOverSummary && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-2xl z-40 text-center">
            <span className="text-4xl">🎉</span>
            <h2 className="text-2xl font-black text-emerald-400 mt-2">Over Completed!</h2>
            <p className="text-slate-400 text-sm mt-1">Ready to transition to the next bowler.</p>
            <button
              onClick={startNextOver}
              className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              Start Next Over 🏏
            </button>
          </div>
        )}

        {/* Dismissal Mapping Modal */}
        {showWicketModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <h3 className="text-xl font-extrabold text-red-400 mb-4">Map Dismissal Details</h3>
              <form onSubmit={handleWicketDetailsSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dismissal Type</label>
                  <select 
                    required value={wicketType} onChange={(e) => setWicketType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-red-500 focus:outline-none text-slate-200"
                  >
                    <option value="">Select dismissal type...</option>
                    <option value="Bowled">Bowled</option>
                    <option value="Caught">Caught</option>
                    <option value="Stumped">Stumped</option>
                    <option value="Run Out">Run Out</option>
                    <option value="LBW">LBW</option>
                  </select>
                </div>

                {['Caught', 'Stumped', 'Run Out'].includes(wicketType) && (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Involved Fielder</label>
                    <select
                      required value={fielderName} onChange={(e) => setFielderName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-red-500 focus:outline-none text-slate-200"
                    >
                      <option value="">Select team fielder...</option>
                      {fieldingSquad.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-slate-800">
                  <button type="button" onClick={() => setShowWicketModal(false)} className="w-1/2 bg-slate-800 py-2.5 rounded-lg text-sm text-slate-300">Cancel</button>
                  <button type="submit" className="w-1/2 bg-red-500 hover:bg-red-600 py-2.5 rounded-lg text-sm font-bold text-white shadow-md shadow-red-500/20">Confirm Out</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
