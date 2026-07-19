import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import StadiumBackground from './components/layout/StadiumBackground'
import Home from './pages/Home'
import Placeholder from './pages/Placeholder'
import TournamentHub from './pages/TournamentHub'
import LiveScoring from './pages/LiveScoring'
import Heroes from './pages/Heroes'
import Login from './pages/Login'
import ProtectedRoute from './pages/ProtectedRoute'
import Shop from './pages/Shop'
import Admin from './pages/Admin'
import RegisterTeam from './pages/RegisterTeam'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
    <div className="flex min-h-screen flex-col text-slate-100 antialiased relative">
      <StadiumBackground />
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Open Views */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/heroes" element={<Heroes />} />
          <Route path="/tournaments" element={<TournamentHub />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/register-team" element={<RegisterTeam />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Live Scoring Panel - Strictly for Scorer / Team / Super Admins */}
          <Route 
            path="/score" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'team_admin']}>
                <LiveScoring />
              </ProtectedRoute>
            } 
          />

          {/* Super Admin only - manage shop products & tournament announcements */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <Admin />
              </ProtectedRoute>
            }
          />
          
          {/* Static Layout General Placeholders */}
          <Route
            path="/gallery"
            element={<Gallery />}
          />
          <Route
            path="/*"
            element={<Placeholder title="Page not found" description="This part of the ground isn't built yet." />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
    </AuthProvider>
  )
}
