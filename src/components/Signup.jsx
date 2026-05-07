import {useState} from 'react'
import {useNavigate, useParams, Link} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import {userAPI} from '../api'

const USER_TYPES = [
    {value: 'Street Vendor', label: 'Street Vendor', icon: '🍜', desc: 'Buy resources for your food business'},
    {value: 'Retailer to Vendor', label: 'Supplier / Retailer', icon: '📦', desc: 'Sell resources to vendors'},
    {value: 'Admin', label: 'Administrator', icon: '⚙️', desc: 'Manage platform operations'}
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
        <div style={{
            minHeight: '100svh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '40px 24px',
            background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,229,160,0.06) 0%, transparent 60%), var(--bg)'
        }}>
            <div style={{width: '100%', maxWidth: 520}}>
                <div style={{textAlign: 'center', marginBottom: 36}}>
                    <Link to="/" style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: '1.75rem',
                        textDecoration: 'none',
                        letterSpacing: '-0.02em'
                    }}>
                        <span style={{color: 'var(--accent)'}}>Vn</span><span style={{color: 'var(--text)'}}>Dyn</span>
                    </Link>
                    <p style={{color: 'var(--text-2)', marginTop: 8}}>Create your account</p>
                </div>

                {/* Steps */}
                <div style={{display: 'flex', gap: 8, marginBottom: 28}}>
                    {['Account Info', 'Address'].map((s, i) => (
                        <div key={i} style={{
                            flex: 1, height: 3, borderRadius: 2,
                            background: step > i ? 'var(--accent)' : step === i + 1 ? 'var(--accent)' : 'var(--border)'
                        }}/>
                    ))}
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 24}}>
                    <span style={{
                        fontSize: '0.8125rem',
                        color: step === 1 ? 'var(--accent)' : 'var(--text-3)',
                        fontWeight: 500
                    }}>Step 1: Account Info</span>
                    <span style={{
                        fontSize: '0.8125rem',
                        color: step === 2 ? 'var(--accent)' : 'var(--text-3)',
                        fontWeight: 500
                    }}>Step 2: Address</span>
                </div>

                <div className="card" style={{padding: '32px 28px'}}>
                    {error && <div className="alert alert-error">{error}</div>}

                    {step === 1 && (
                        <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
                            {/* Type selection */}
                            <div>
                                <label className="label" style={{marginBottom: 12}}>Account Type</label>
                                <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                                    {USER_TYPES.map(t => (
                                        <div key={t.value} onClick={() => setUserType(t.value)} style={{
                                            display: 'flex', alignItems: 'center', gap: 14,
                                            padding: '12px 16px', borderRadius: 'var(--radius)',
                                            border: `1px solid ${userType === t.value ? 'rgba(0,229,160,0.4)' : 'var(--border)'}`,
                                            background: userType === t.value ? 'var(--accent-dim)' : 'transparent',
                                            cursor: 'pointer', transition: 'all 0.2s'
                                        }}>
                                            <span style={{fontSize: '1.25rem'}}>{t.icon}</span>
                                            <div>
                                                <div style={{
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem',
                                                    color: userType === t.value ? 'var(--accent)' : 'var(--text)'
                                                }}>{t.label}</div>
                                                <div style={{
                                                    fontSize: '0.8rem',
                                                    color: 'var(--text-3)',
                                                    marginTop: 2
                                                }}>{t.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                                }
                            ].map(f => (
                                <div className="field" key={f.id} style={{marginBottom: 0}}>
                                    <label className="label">{f.label}</label>
                                    <input className="input" type={f.type} placeholder={f.placeholder}
                                           value={form[f.id]} onChange={e => {
                                        setForm(p => ({...p, [f.id]: e.target.value}));
                                        setError('')
                                    }}/>
                                </div>
                            ))}

                            <button className="btn-primary" type="button" onClick={() => {
                                if (validateStep1()) {
                                    setStep(2);
                                    setError('')
                                }
                            }}
                                    style={{width: '100%', padding: '14px'}}>
                                Continue →
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                            <div style={{
                                padding: '12px 14px',
                                background: 'var(--accent-dim)',
                                border: '1px solid rgba(0,229,160,0.2)',
                                borderRadius: 'var(--radius)',
                                marginBottom: 4
                            }}>
                                <span style={{
                                    fontSize: '0.8125rem',
                                    color: 'var(--accent)',
                                    fontWeight: 500
                                }}>{userType} · {form.email}</span>
                            </div>

                            {[
                                {name: 'street', label: 'Street Address', placeholder: 'House/flat, road name'},
                                {name: 'city', label: 'City', placeholder: 'City'},
                                {name: 'state', label: 'State', placeholder: 'State'},
                                {name: 'pincode', label: 'Pincode', placeholder: '6-digit pincode'},
                                {name: 'landmark', label: 'Landmark (Optional)', placeholder: 'Near market, etc.'}
                            ].map(f => (
                                <div className="field" key={f.name} style={{marginBottom: 0}}>
                                    <label className="label">{f.label}</label>
                                    <input className="input" type="text" name={f.name} placeholder={f.placeholder}
                                           value={address[f.name]} onChange={e => {
                                        setAddress(p => ({...p, [f.name]: e.target.value}));
                                        setError('')
                                    }}/>
                                </div>
                            ))}

                            <div style={{display: 'flex', gap: 12, marginTop: 8}}>
                                <button type="button" className="btn-ghost" onClick={() => {
                                    setStep(1);
                                    setError('')
                                }} style={{flex: 1}}>
                                    ← Back
                                </button>
                                <button type="submit" className="btn-primary" disabled={loading}
                                        style={{flex: 2, padding: '14px'}}>
                                    {loading ? <><span className="spinner" style={{
                                        width: 16,
                                        height: 16
                                    }}/> Creating...</> : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div style={{textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-3)'}}>
                    Already have an account?{' '}
                    <Link to="/login" style={{color: 'var(--accent)', textDecoration: 'none', fontWeight: 500}}>Sign
                        in</Link>
                </div>
            </div>
        </div>
    )
}
