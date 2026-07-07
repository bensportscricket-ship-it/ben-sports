import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Placeholder from './pages/Placeholder'
import TournamentHub from './pages/TournamentHub'
import LiveScoring from './pages/LiveScoring'
import TeamFinance from './pages/TeamFinance'
import Heroes from './pages/Heroes'
import Login from './pages/Login'
import ProtectedRoute from './pages/ProtectedRoute'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 antialiased">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Open Views */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/heroes" element={<Heroes />} />
          <Route path="/tournaments" element={<TournamentHub />} />
          
          {/* Live Scoring Panel - Strictly for Scorer / Team / Super Admins */}
          <Route 
            path="/score" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'team_admin']}>
                <LiveScoring />
              </ProtectedRoute>
            } 
          />

          {/* Team Admin Financial Ledger & QR Setup - Restricted */}
          <Route 
            path="/teams" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'team_admin']}>
                <TeamFinance />
              </ProtectedRoute>
            } 
          />
          
          {/* Static Layout General Placeholders */}
          <Route
            path="/gallery"
            element={<Placeholder title="Gallery" description="Photos from every match, every ground." />}
          />
          <Route
            path="/shop"
            element={<Placeholder title="BEN SPORTS Shop" description="Official jerseys, gear, and merchandise with real-time community reviews." />}
          />
          <Route
            path="/contact"
            element={<Placeholder title="Contact Committee" description="Reach the BEN SPORTS organizing committee or register your own external league." />}
          />
          <Route
            path="/*"
            element={<Placeholder title="Page not found" description="This part of the ground isn't built yet." />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
