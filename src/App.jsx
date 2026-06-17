import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import JoinFamily from './pages/JoinFamily.jsx'
import CheckStatus from './pages/CheckStatus.jsx'
import FamilyMembers from './pages/FamilyMembers.jsx'
import FamilyTree from './pages/FamilyTree.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <nav className="top-nav">
          <Link to="/">🏠 Home</Link>
          <Link to="/join">💌 Join</Link>
          <Link to="/status">🔍 Status</Link>
          <Link to="/members">👨‍👩‍👧 Members</Link>
          <Link to="/tree">🌳 Tree</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<JoinFamily />} />
          <Route path="/status" element={<CheckStatus />} />
          <Route path="/members" element={<FamilyMembers />} />
          <Route path="/tree" element={<FamilyTree />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        <p className="footer-note">🌷 Bhavithra Family Portal</p>
      </div>
    </HashRouter>
  )
}
