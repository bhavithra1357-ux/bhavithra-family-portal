import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <span className="emoji-big">🌷</span>
      <h1 className="hero-title">Bhavithra Family Portal</h1>
      <p className="hero-sub">Welcome to the family registration system</p>

      <div className="card">
        <Link to="/join" className="btn btn-primary">💌 Join Family</Link>
        <Link to="/status" className="btn btn-secondary">🔍 Check Status</Link>
        <Link to="/members" className="btn btn-purple">👨‍👩‍👧 View Family Members</Link>
      </div>
    </div>
  )
}
