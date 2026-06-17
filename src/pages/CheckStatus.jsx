import { useState } from 'react'
import { supabase } from '../supabaseClient.js'

export default function CheckStatus() {
  const [appId, setAppId] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCheck = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

    const cleanId = appId.trim().toUpperCase()
    if (!cleanId) {
      setError('Please enter your Application ID')
      return
    }

    setLoading(true)
    try {
      // Only ever fetches the single matching row for this exact ID.
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select('name, status, role, connection')
        .eq('application_id', cleanId)
        .maybeSingle()

      if (fetchError) throw fetchError

      if (!data) {
        setError('No application found with that ID 🌧️ Please check and try again.')
      } else {
        setResult(data)
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const statusClass = result?.status === 'Approved' ? 'badge-approved' : result?.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'

  return (
    <div className="card">
      <h2 className="section-title">🔍 Check Your Status</h2>
      <form onSubmit={handleCheck}>
        <label>Application ID</label>
        <input
          type="text"
          value={appId}
          onChange={(e) => setAppId(e.target.value)}
          placeholder="e.g. BVP12345"
        />
        <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }} disabled={loading}>
          {loading ? 'Checking...' : 'Check Status'}
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}

      {result && (
        <div className="card" style={{ marginTop: 18, boxShadow: 'none', border: '2px solid #ffe5ec' }}>
          <p><strong>Name:</strong> {result.name}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`badge ${statusClass}`}>{result.status}</span>
          </p>

          {result.status === 'Approved' && (
            <>
              <p style={{ marginTop: 14 }}>
                <strong>🌷 Your Family Role:</strong> {result.role || 'Not yet assigned'}
              </p>
              <p>
                <strong>💞 Your Connection With Bhavithra:</strong> {result.connection || 'Not yet assigned'}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
