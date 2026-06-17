import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

export default function FamilyTree() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('name, photo_url, connection')
        .eq('status', 'Approved')
        .order('name', { ascending: true })

      if (!error && data) setMembers(data)
      setLoading(false)
    }
    fetchMembers()
  }, [])

  return (
    <div className="card">
      <h2 className="section-title">🌳 Family Tree</h2>

      {loading && <p className="loading-text">Growing the tree...</p>}

      {!loading && (
        <div className="tree-wrap">
          <div className="tree-center">🌷 Bhavithra</div>
          <div className="tree-branch-line" />

          {members.length === 0 ? (
            <div className="empty-state">
              <p>No approved members yet 🌱</p>
            </div>
          ) : (
            <div className="tree-members">
              {members.map((m, i) => (
                <div className="tree-node" key={i}>
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={m.name} />
                  ) : (
                    <div style={{ fontSize: '1.8rem' }}>🙂</div>
                  )}
                  <div className="tree-node-name">{m.name}</div>
                  <div className="tree-node-rel">{m.connection || ''}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
