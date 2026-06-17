import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

export default function FamilyMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('name, photo_url, role, connection')
        .eq('status', 'Approved')
        .order('name', { ascending: true })

      if (!error && data) setMembers(data)
      setLoading(false)
    }
    fetchMembers()
  }, [])

  return (
    <div className="card">
      <h2 className="section-title">👨‍👩‍👧 Family Members</h2>

      {loading && <p className="loading-text">Loading family...</p>}

      {!loading && members.length === 0 && (
        <div className="empty-state">
          <span className="emoji-big">🌱</span>
          <p>No family members yet. Be the first to join!</p>
        </div>
      )}

      {!loading && members.length > 0 && (
        <div className="member-grid">
          {members.map((m, i) => (
            <div className="member-card" key={i}>
              {m.photo_url ? (
                <img src={m.photo_url} alt={m.name} />
              ) : (
                <div style={{ fontSize: '2.2rem' }}>🙂</div>
              )}
              <div className="member-name">{m.name}</div>
              <div className="member-role">{m.role || '—'}</div>
              <div className="member-connection">{m.connection || ''}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
