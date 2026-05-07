import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import {complaintAPI} from '../api'

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
            setError('Please enter complaint details');
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
            setError('Could not submit complaint. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (success) return (
        <div id="app" style={{textAlign: 'center'}}>
            <h2 className="text">Complaint Submitted</h2>
            <div className="success-msg">Complaint submitted successfully! Redirecting to dashboard...</div>
        </div>
    )

    return (
        <div id="app">
            <h2 className="text">Lodge a Complaint</h2>

            <div className="panel">
                <div style={{
                    marginBottom: '1.25rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        marginBottom: 4,
                        fontWeight: 600,
                        letterSpacing: '0.04em'
                    }}>FILING AS
                    </div>
                    <div style={{fontWeight: 600, color: '#fff', marginBottom: 2}}>{user?.fullName}</div>
                    <div
                        style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>{user?.type} - {user?.email}</div>
                </div>

                <form onSubmit={handleSubmit} style={{display: 'grid', gap: '0.5rem'}}>
                    <label className="text"
                           style={{display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem'}}>Complaint
                        Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} disabled={loading}
                            style={{margin: '0 0 1rem 0'}}>
                        {CATEGORIES.map(c => <option key={c}
                                                     value={c}>{c === 'Other' ? 'Other' : c + ' Issue'}</option>)}
                    </select>

                    <label className="text"
                           style={{display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9rem'}}>Describe
                        your issue</label>
                    <textarea
                        rows={6}
                        placeholder="Please provide detailed information about your complaint, including any relevant order IDs, dates, or other context..."
                        value={message}
                        onChange={e => {
                            setMessage(e.target.value);
                            setError('')
                        }}
                        disabled={loading}
                        required
                        style={{margin: '0 0 0.5rem 0'}}
                    />
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '0.75rem'
                    }}>{message.length}/500 characters
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <div style={{display: 'flex', gap: '0.75rem'}}>
                        <button type="button" className="btn" onClick={() => navigate(-1)} disabled={loading}
                                style={{flex: 1}}>Cancel
                        </button>
                        <button type="submit" className="btn primary-btn" disabled={loading || !message.trim()}
                                style={{flex: 2, width: 'auto', opacity: loading || !message.trim() ? 0.5 : 1}}>
                            {loading ? <><span className="spinner"/>Submitting...</> : 'Submit Complaint'}
                        </button>
                    </div>
                </form>
            </div>

            <div style={{
                marginTop: '1.5rem',
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                <button className="switch-link" onClick={() => navigate('/dashboard')}
                        style={{width: 'auto', minHeight: 'auto', padding: '0.5rem 1rem'}}>Back to Dashboard
                </button>
            </div>
        </div>
    )
}
