import React, { useState } from 'react';

export default function TeamFinance() {
  // Mock Roster Data for Fee Tracking
  const [players, setPlayers] = useState([
    { id: 1, name: "Aradhya Sharma", role: "All-Rounder (Capt)", fee: 500, paid: true, date: "2026-07-05" },
    { id: 2, name: "Rahul Singh", role: "Opening Batsman", fee: 500, paid: false, date: "-" },
    { id: 3, name: "Amit Patel", role: "Wicketkeeper", fee: 500, paid: true, date: "2026-07-06" },
    { id: 4, name: "Deepak Kumar", role: "Fast Bowler", fee: 500, paid: false, date: "-" },
    { id: 5, name: "Vikram Malhotra", role: "Spinner", fee: 500, paid: false, date: "-" },
  ]);

  // QR Code State
  const [qrImage, setQrImage] = useState(null);

  // Toggle Paid/Unpaid Status
  const handleTogglePaid = (id) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player => {
        if (player.id === id) {
          const newPaidStatus = !player.paid;
          return {
            ...player,
            paid: newPaidStatus,
            date: newPaidStatus ? new Date().toISOString().split('T')[0] : "-"
          };
        }
        return player;
      })
    );
  };

  // Handle QR Code Upload
  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrImage(URL.createObjectURL(file));
    }
  };

  // Financial Summaries
  const totalCollected = players.filter(p => p.paid).reduce((sum, p) => sum + p.fee, 0);
  const totalPending = players.filter(p => !p.paid).reduce((sum, p) => sum + p.fee, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Management & QR Settings */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-emerald-400 mb-2">Team Admin Ledger</h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Upload your payment QR code. Team members can scan to pay directly into your account, and you can record payments below.
            </p>
            
            {/* QR Scanner Upload Area */}
            <div className="mt-6 border-2 border-dashed border-slate-800 hover:border-emerald-500/40 rounded-xl p-6 text-center transition-colors bg-slate-950/40 relative">
              {qrImage ? (
                <div className="flex flex-col items-center">
                  <img src={qrImage} alt="Team QR" className="w-40 h-40 object-contain rounded-lg border border-slate-800 p-2 bg-white" />
                  <button 
                    onClick={() => setQrImage(null)}
                    className="mt-3 text-xs font-bold text-red-400 hover:underline"
                  >
                    Remove QR Code
                  </button>
                </div>
              ) : (
                <div>
                  <span className="text-3xl">📸</span>
                  <p className="text-sm font-semibold mt-2 text-slate-300">Upload Team UPI QR</p>
                  <p className="text-xs text-slate-500 mt-1">GPay, PhonePe, or Paytm screenshot</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleQrUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Collection Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-emerald-400 font-medium">Collected</p>
                <p className="text-xl font-black mt-1">₹{totalCollected}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-amber-400 font-medium">Pending</p>
                <p className="text-xl font-black mt-1">₹{totalPending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Player Fee Roster Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-200">Squad Fee Roster</h3>
              <p className="text-xs text-slate-400 mt-0.5">Track tournament registration dues per player</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium text-xs uppercase tracking-wider">
                  <th className="pb-3">Player Details</th>
                  <th className="pb-3 text-center">Amount</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Cleared Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {players.map((player) => (
                  <tr key={player.id} className="hover:bg-slate-950/20 transition-colors">
                    <td className="py-4">
                      <p className="font-bold text-slate-200">{player.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{player.role}</p>
                    </td>
                    <td className="py-4 text-center font-semibold text-slate-300">
                      ₹{player.fee}
                    </td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => handleTogglePaid(player.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                          player.paid 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {player.paid ? '🟢 Paid' : '🟡 Unpaid'}
                      </button>
                    </td>
                    <td className="py-4 text-right text-xs text-slate-500 font-mono">
                      {player.date}
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
