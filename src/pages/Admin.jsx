import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'changeme123'

const RELATIONSHIP_OPTIONS = [
  'Friend',
  'Best Friend',
  'Brother',
  'Sister',
  'Cousin',
  'Quadruple',
  'Boyfriend/Girlfriend',
  'Other',
]

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [authError, setAuthError] = useState('')

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [drafts, setDrafts] = useState({}) // { [application_id]: { role, connection } }

  const fetchApplications = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setApplications(data)
    setLoading(false)
  }

  useEffect(() => {
    if (authed) fetchApplications()
  }, [authed])

  const handleLogin = (e) => {
    e.preventDefault()
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthed(true)
      setAuthError('')
    } else {
      setAuthError('Incorrect password 🌧️')
    }
  }

  const updateDraft = (id, field, value) => {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], [field]: value } }))
  }

  const handleStatusChange = async (application_id, status) => {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('application_id', application_id)

    if (!error) fetchApplications()
  }

  const handleSaveRole = async (application_id) => {
    const draft = drafts[application_id] || {}
    const { error } = await supabase
      .from('applications')
      .update({
        role: draft.role ?? undefined,
        connection: draft.connection ?? undefined,
      })
      .eq('application_id', application_id)

    if (!error) fetchApplications()
  }

  if (!authed) {
    return (
      <div className="card">
        <h2 className="section-title">🔐 Admin Login</h2>
        <form onSubmit={handleLogin}>
          <label>Password</label>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Enter admin password"
          />
          {authError && <div className="error-box">{authError}</div>}
          <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }}>
            Login
          </button>
        </form>
      </div>
    )
  }

  const filtered = filter === 'All' ? applications : applications.filter((a) => a.status === filter)

  return (
    <div className="card">
      <h2 className="section-title">🛠️ Admin — All Applications</h2>

      <div style={{ marginBottom: 16 }}>
        {['All', 'Pending', 'Approved', 'Rejected'].map((f) => (
          <button
            key={f}
            className={`btn btn-small ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <p className="loading-text">Loading applications...</p>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <p>No applications here yet.</p>
        </div>
      )}

      {!loading &&
        filtered.map((a) => {
          const draft = drafts[a.application_id] || {}
          const statusClass =
            a.status === 'Approved' ? 'badge-approved' : a.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'

          return (
            <div className="admin-row" key={a.application_id}>
              <div className="admin-row-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {a.photo_url && (
                    <img
                      src={a.photo_url}
                      alt={a.name}
                      style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <strong>{a.name}</strong> <span style={{ color: '#8a7a7a', fontSize: '0.85rem' }}>({a.application_id})</span>
                    <div style={{ fontSize: '0.8rem', color: '#8a7a7a' }}>Nickname: {a.nickname || '—'} · Age: {a.age}</div>
                  </div>
                </div>
                <span className={`badge ${statusClass}`}>{a.status}</span>
              </div>

              <p style={{ fontSize: '0.85rem', marginTop: 8 }}>
                <strong>How they know Bhavithra:</strong> {a.how_know}
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                <strong>Preference:</strong> {a.relationship_pref}
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                <strong>Why accept:</strong> {a.why_accept}
              </p>

              <div style={{ marginTop: 10 }}>
                <button className="btn btn-small btn-primary" onClick={() => handleStatusChange(a.application_id, 'Approved')}>
                  ✅ Approve
                </button>
                <button className="btn btn-small btn-secondary" onClick={() => handleStatusChange(a.application_id, 'Rejected')}>
                  ❌ Reject
                </button>
                <button className="btn btn-small btn-secondary" onClick={() => handleStatusChange(a.application_id, 'Pending')}>
                  ⏳ Mark Pending
                </button>
              </div>

              <div style={{ marginTop: 12 }}>
                <label>Assign Family Role</label>
                <input
                  type="text"
                  placeholder="e.g. Sister, Guardian, Bestie"
                  defaultValue={a.role || ''}
                  onChange={(e) => updateDraft(a.application_id, 'role', e.target.value)}
                />

                <label>Connection With Bhavithra</label>
                <select
                  defaultValue={a.connection || ''}
                  onChange={(e) => updateDraft(a.application_id, 'connection', e.target.value)}
                >
                  <option value="">Select connection</option>
                  {RELATIONSHIP_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt} of Bhavithra</option>
                  ))}
                </select>

                <button
                  className="btn btn-small btn-purple"
                  style={{ marginTop: 10 }}
                  onClick={() => handleSaveRole(a.application_id)}
                >
                  💾 Save Role & Connection
                </button>
              </div>
            </div>
          )
        })}
    </div>
  )
}
