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
  const [drafts, setDrafts] = useState({})

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
      setAuthError(
        `Incorrect password 🌧️ (debug: expecting ${ADMIN_PASSWORD.length} characters, you typed ${passwordInput.length})`
      )
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
