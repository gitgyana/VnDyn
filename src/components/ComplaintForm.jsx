import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import {complaintAPI} from '../api'
import Layout from './Layout'

export default function ComplaintForm() {
    const {user} = useAuth()
    const navigate = useNavigate()
    const [category, setCategory] = useState('Order')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const CATEGORIES = ['Order', 'Payment', 'Delivery', 'Product Quality', 'Service', 'Other']

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!message.trim()) {
            setError('Please describe your issue');
            return
        }
        setLoading(true);
        setError('')
        try {
            await complaintAPI.submit({
                partyId: user.email,
                partyName: user.fullName,
                category,
                message: message.trim()
            })
            setSuccess(true)
            setTimeout(() => navigate('/dashboard'), 2000)
        } catch (err) {
            setError('Could not submit. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <Layout title="Complaint Filed">
                <div style={{maxWidth: 480, margin: '40px auto', textAlign: 'center'}}>
                    <div style={{fontSize: '3rem', marginBottom: 20}}>✅</div>
                    <h2 style={{fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12}}>Complaint
                        Submitted</h2>
                    <p style={{color: 'var(--text-2)'}}>Our team will review your complaint shortly. Redirecting to
                        dashboard...</p>
                </div>
            </Layout>
        )
    }

    return (
        <Layout title="Lodge a Complaint" subtitle="Submit your issue and our team will get back to you">
            <div style={{maxWidth: 560}}>
                <div className="card" style={{padding: '32px 28px'}}>
                    {error && <div className="alert alert-error">{error}</div>}

                    {/* Filed by */}
                    <div style={{
                        padding: '14px 16px',
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        marginBottom: 24
                    }}>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-3)',
                            marginBottom: 6,
                            fontWeight: 600,
                            letterSpacing: '0.04em'
                        }}>FILING AS
                        </div>
                        <div style={{fontWeight: 600, color: 'var(--text)', marginBottom: 2}}>{user?.fullName}</div>
                        <div style={{fontSize: '0.8125rem', color: 'var(--text-3)'}}>{user?.type} · {user?.email}</div>
                    </div>

                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 20}}>
                        <div className="field" style={{marginBottom: 0}}>
                            <label className="label">Complaint Category</label>
                            <select className="input" value={category} onChange={e => setCategory(e.target.value)}
                                    disabled={loading}>
                                {CATEGORIES.map(c => <option key={c}
                                                             value={c}>{c === 'Other' ? 'Other' : c + ' Issue'}</option>)}
                            </select>
                        </div>

                        <div className="field" style={{marginBottom: 0}}>
                            <label className="label">Describe your issue</label>
                            <textarea
                                className="input"
                                rows={6}
                                placeholder="Please provide detailed information about your complaint, including any relevant order IDs, dates, or other context..."
                                value={message}
                                onChange={e => {
                                    setMessage(e.target.value);
                                    setError('')
                                }}
                                disabled={loading}
                                required
                                style={{minHeight: 140}}
                            />
                            <div style={{fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 6}}>
                                {message.length}/500 characters
                            </div>
                        </div>

                        <div style={{display: 'flex', gap: 12}}>
                            <button type="button" className="btn-ghost" onClick={() => navigate(-1)} disabled={loading}
                                    style={{flex: 1}}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary" disabled={loading || !message.trim()}
                                    style={{flex: 2, padding: '14px'}}>
                                {loading ? <><span className="spinner" style={{
                                    width: 16,
                                    height: 16
                                }}/> Submitting...</> : 'Submit Complaint'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}
