import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Placeholder from './pages/Placeholder'
import TournamentHub from './pages/TournamentHub'
import LiveScoring from './pages/LiveScoring'
import TeamFinance from './pages/TeamFinance'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Landing View */}
          <Route path="/" element={<Home />} />
          
          {/* Active & Automated Tournament Pools */}
          <Route path="/tournaments" element={<TournamentHub />} />

          {/* Interactive Tap-to-Score Application Panel */}
          <Route path="/score" element={<LiveScoring />} />

          {/* Team Management & Admin Ledger Dashboard */}
          <Route path="/teams" element={<TeamFinance />} />
          
          {/* The Cric-Logic Hall of Fame Dashboard */}
          <Route
            path="/heroes"
            element={
              <Placeholder
                title="Heroes Leaderboard"
                description="The ultimate leaderboard. Automatic stat trackers for most runs, wickets, and catches mixed with Super Admin curated honors."
              />
            }
          />
          
          {/* Public Match & Event Galleries */}
          <Route
            path="/gallery"
            element={<Placeholder title="Gallery" description="Photos from every match, every ground." />}
          />
          
          {/* Super Admin Managed E-Commerce storefront with Reviews */}
          <Route
            path="/shop"
            element={<Placeholder title="BEN SPORTS Shop" description="Official jerseys, gear, and merchandise with real-time community reviews." />}
          />
          
          {/* Support and Organizing Committee Point of Contact */}
          <Route
            path="/contact"
            element={<Placeholder title="Contact Committee" description="Reach the BEN SPORTS organizing committee or register your own external league." />}
          />
          
          {/* Unified Role-Based Access Control Login */}
          <Route
            path="/login"
            element={<Placeholder title="Secure Portal Gateway" description="Unified login portal for Super Admins, Team Admins, and Players." />}
          />
          
          {/* Catch-All Route */}
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
