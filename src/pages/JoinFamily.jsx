import { useState } from 'react'
import { supabase } from '../supabaseClient.js'

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

function generateApplicationId() {
  const num = Math.floor(10000 + Math.random() * 90000)
  return `BVP${num}`
}

export default function JoinFamily() {
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    age: '',
    birthday: '',
    howKnow: '',
    relationshipPref: '',
    whyAccept: '',
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [resultId, setResultId] = useState(null)

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.age || !form.birthday || !form.howKnow || !form.relationshipPref || !form.whyAccept) {
      setError('Please fill in all fields 🌸')
      return
    }
    if (!photoFile) {
      setError('Photo upload is compulsory 📸')
      return
    }

    setSubmitting(true)
    try {
      const applicationId = generateApplicationId()

      // Upload photo to Supabase storage
      const fileExt = photoFile.name.split('.').pop()
      const filePath = `${applicationId}-${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, photoFile)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath)

      const photoUrl = publicUrlData.publicUrl

      const { error: insertError } = await supabase.from('applications').insert({
        application_id: applicationId,
        name: form.name,
        nickname: form.nickname,
        age: form.age,
        birthday: form.birthday,
        photo_url: photoUrl,
        how_know: form.howKnow,
        relationship_pref: form.relationshipPref,
        why_accept: form.whyAccept,
        status: 'Pending',
      })

      if (insertError) throw insertError

      setResultId(applicationId)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again 🌧️')
    } finally {
      setSubmitting(false)
    }
  }

  if (resultId) {
    return (
      <div className="card center-text">
        <span className="emoji-big">🎉</span>
        <h2>Application Submitted!</h2>
        <p className="hero-sub">Save this Application ID to check your status later</p>
        <div className="app-id-display">{resultId}</div>
        <p className="helper-text">Applications are reviewed by Bhavithra 🌷</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="section-title">💌 Join Family Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" />

        <label>Nickname</label>
        <input type="text" value={form.nickname} onChange={(e) => update('nickname', e.target.value)} placeholder="What do friends call you?" />

        <label>Age</label>
        <input type="number" value={form.age} onChange={(e) => update('age', e.target.value)} placeholder="Your age" min="1" />

        <label>Birthday</label>
        <input type="date" value={form.birthday} onChange={(e) => update('birthday', e.target.value)} />

        <label>Photo Upload (compulsory) 📸</label>
        <div className="file-drop" onClick={() => document.getElementById('photoInput').click()}>
          {photoPreview ? (
            <img src={photoPreview} alt="preview" />
          ) : (
            <span>Tap to upload your photo</span>
          )}
          <input id="photoInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
        </div>

        <label>How do you know Bhavithra?</label>
        <textarea value={form.howKnow} onChange={(e) => update('howKnow', e.target.value)} placeholder="School, college, online..." />

        <label>Relationship Preference</label>
        <div className="radio-group">
          {RELATIONSHIP_OPTIONS.map((opt) => (
            <div
              key={opt}
              className={`radio-option ${form.relationshipPref === opt ? 'selected' : ''}`}
              onClick={() => update('relationshipPref', opt)}
            >
              {opt}
            </div>
          ))}
        </div>

        <label>Why should you be accepted?</label>
        <textarea value={form.whyAccept} onChange={(e) => update('whyAccept', e.target.value)} placeholder="Convince Bhavithra! 😄" />

        <p className="helper-text" style={{ marginTop: 16, textAlign: 'center' }}>
          Applications are reviewed by Bhavithra 🌷
        </p>

        {error && <div className="error-box">{error}</div>}

        <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Application 💕'}
        </button>
      </form>
    </div>
  )
}
