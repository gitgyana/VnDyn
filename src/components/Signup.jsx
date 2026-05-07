import {useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import {userAPI} from '../api'

const USER_TYPES = [
    {value: 'Street Vendor', label: 'Street Vendor', desc: 'Buy resources for your food business'},
    {value: 'Retailer to Vendor', label: 'Supplier / Retailer', desc: 'Sell resources to vendors'},
    {value: 'Admin', label: 'Administrator', desc: 'Manage platform operations'},
]

export default function Signup() {
    const {type: typeParam} = useParams()
    const navigate = useNavigate()
    const {login} = useAuth()

    const [step, setStep] = useState(1)
    const [userType, setUserType] = useState(typeParam || 'Street Vendor')
    const [form, setForm] = useState({fullName: '', phone: '', email: '', password: '', confirmPassword: ''})
    const [address, setAddress] = useState({street: '', city: '', state: '', pincode: '', landmark: ''})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const validateStep1 = () => {
        const {fullName, phone, email, password, confirmPassword} = form
        if (!fullName || !phone || !email || !password || !confirmPassword) {
            setError('Please fill all fields');
            return false
        }
        if (!/^\d{10,}$/.test(phone)) {
            setError('Invalid phone (min 10 digits)');
            return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Invalid email');
            return false
        }
        if (password.length < 4) {
            setError('Password min 4 characters');
            return false
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!address.street || !address.city || !address.state || !address.pincode) {
            setError('Fill all required address fields');
            return
        }
        if (!/^\d{6}$/.test(address.pincode)) {
            setError('Pincode must be 6 digits');
            return
        }
        setLoading(true);
        setError('')
        try {
            const result = await userAPI.register({
                fullName: form.fullName, phone: form.phone, email: form.email,
                password: form.password, type: userType, address
            })
            if (result.success) {
                login(result.data);
                navigate('/dashboard')
            }
        } catch (err) {
            setError(err.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div id="app">
            <h2>Create Account</h2>

            {/* Step indicator */}
            <div style={{display: 'flex', gap: '8px', marginBottom: '20px'}}>
                {['Account Info', 'Address'].map((s, i) => (
                    <div key={i} style={{
                        flex: 1, height: 4, borderRadius: 2,
                        background: step > i ? '#4ade80' : step === i + 1 ? '#4ade80' : 'rgba(255,255,255,0.15)'
                    }}/>
                ))}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.8rem'}}>
                <span style={{color: step === 1 ? '#4ade80' : 'var(--text-secondary)'}}>Step 1: Account Info</span>
                <span style={{color: step === 2 ? '#4ade80' : 'var(--text-secondary)'}}>Step 2: Address</span>
            </div>

            {error && <div className="error-msg">{error}</div>}

            {step === 1 && (
                <div>
                    <div style={{marginBottom: '1.25rem'}}>
                        <label className="text"
                               style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem'}}>
                            Account Type
                        </label>
                        {USER_TYPES.map(t => (
                            <div
                                key={t.value}
                                onClick={() => setUserType(t.value)}
                                style={{
                                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                                    padding: '12px 16px', borderRadius: 'var(--radius-md)',
                                    border: `1px solid ${userType === t.value ? 'rgba(0,229,160,0.5)' : 'rgba(255,255,255,0.1)'}`,
                                    background: userType === t.value ? 'rgba(0,229,160,0.1)' : 'transparent',
                                    cursor: 'pointer', transition: 'all 0.2s', marginBottom: '8px'
                                }}
                            >
                                <div style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    border: `2px solid ${userType === t.value ? '#4ade80' : 'rgba(255,255,255,0.3)'}`,
                                    background: userType === t.value ? '#4ade80' : 'transparent',
                                    flexShrink: 0,
                                    marginTop: 2
                                }}/>
                                <div>
                                    <div style={{
                                        fontWeight: 600,
                                        color: userType === t.value ? '#4ade80' : '#fff',
                                        fontSize: '0.9rem'
                                    }}>{t.label}</div>
                                    <div style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--text-secondary)',
                                        marginTop: 2
                                    }}>{t.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {[
                        {id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Your full name'},
                        {id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '10+ digit number'},
                        {id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com'},
                        {id: 'password', label: 'Password', type: 'password', placeholder: 'Min 4 characters'},
                        {
                            id: 'confirmPassword',
                            label: 'Confirm Password',
                            type: 'password',
                            placeholder: 'Repeat password'
                        },
                    ].map(f => (
                        <div key={f.id}>
                            <label className="text" style={{
                                display: 'block',
                                marginBottom: '4px',
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)'
                            }}>{f.label}</label>
                            <input
                                type={f.type}
                                placeholder={f.placeholder}
                                value={form[f.id]}
                                onChange={e => {
                                    setForm(p => ({...p, [f.id]: e.target.value}));
                                    setError('')
                                }}
                            />
                        </div>
                    ))}

                    <button className="btn" type="button" onClick={() => {
                        if (validateStep1()) {
                            setStep(2);
                            setError('')
                        }
                    }}>
                        Continue
                    </button>
                </div>
            )}

            {step === 2 && (
                <form onSubmit={handleSubmit}>
                    <div style={{
                        padding: '10px 14px',
                        background: 'rgba(0,229,160,0.08)',
                        border: '1px solid rgba(0,229,160,0.2)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.25rem',
                        fontSize: '0.85rem',
                        color: '#4ade80'
                    }}>
                        {userType} - {form.email}
                    </div>

                    {[
                        {name: 'street', label: 'Street Address', placeholder: 'House/flat, road name'},
                        {name: 'city', label: 'City', placeholder: 'City'},
                        {name: 'state', label: 'State', placeholder: 'State'},
                        {name: 'pincode', label: 'Pincode', placeholder: '6-digit pincode'},
                        {name: 'landmark', label: 'Landmark (Optional)', placeholder: 'Near market, etc.'},
                    ].map(f => (
                        <div key={f.name}>
                            <label className="text" style={{
                                display: 'block',
                                marginBottom: '4px',
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)'
                            }}>{f.label}</label>
                            <input
                                type="text"
                                placeholder={f.placeholder}
                                value={address[f.name]}
                                onChange={e => {
                                    setAddress(p => ({...p, [f.name]: e.target.value}));
                                    setError('')
                                }}
                            />
                        </div>
                    ))}

                    <div style={{display: 'flex', gap: '12px'}}>
                        <button type="button" className="btn" onClick={() => {
                            setStep(1);
                            setError('')
                        }} style={{flex: 1}}>Back
                        </button>
                        <button type="submit" className="btn primary-btn" disabled={loading}
                                style={{flex: 2, width: 'auto'}}>
                            {loading ? <><span className="spinner"/>Creating...</> : 'Create Account'}
                        </button>
                    </div>
                </form>
            )}

            <button type="button" className="switch-link" onClick={() => navigate('/login')}>
                Already have an account? Login
            </button>
            <button type="button" className="switch-link" onClick={() => navigate('/')}>
                Back to Home
            </button>
        </div>
    )
}
