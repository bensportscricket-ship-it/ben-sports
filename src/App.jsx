import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/tournaments"
            element={
              <Placeholder
                title="Tournament Hub"
                description="Overview, rules, fixtures, groups, points table, teams, players, gallery, results, statistics and announcements — for every BEN SPORTS tournament."
              />
            }
          />
          <Route
            path="/teams"
            element={
              <Placeholder
                title="Teams"
                description="Squads, captains, match history and statistics for every registered team."
              />
            }
          />
          <Route
            path="/heroes"
            element={
              <Placeholder
                title="Heroes"
                description="The BEN SPORTS Hall of Fame — most runs, wickets, catches, stumpings, strike rate, economy and sixes."
              />
            }
          />
          <Route
            path="/gallery"
            element={<Placeholder title="Gallery" description="Photos from every match, every ground." />}
          />
          <Route
            path="/shop"
            element={<Placeholder title="Shop" description="Official jerseys, caps and accessories." />}
          />
          <Route
            path="/contact"
            element={<Placeholder title="Contact" description="Reach the BEN SPORTS organizing committee." />}
          />
          <Route
            path="/login"
            element={<Placeholder title="Login" description="One login, role-based dashboards for every part of the platform." />}
          />
          <Route
            path="*"
            element={<Placeholder title="Page not found" description="This part of the ground isn't built yet." />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
