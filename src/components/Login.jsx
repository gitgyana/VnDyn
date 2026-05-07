import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import {userAPI} from '../api'

export default function Login() {
    const navigate = useNavigate()
    const {login} = useAuth()
    const [form, setForm] = useState({loginValue: '', password: ''})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const {loginValue, password} = form
        if (!loginValue.trim() || !password) {
            setError('Please fill all fields');
            return
        }
        setLoading(true);
        setError('')
        try {
            const result = await userAPI.login(loginValue.trim(), password)
            if (result.success) {
                login(result.data)
                navigate('/dashboard')
            }
        } catch (err) {
            setError(err.message || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
            background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,229,160,0.06) 0%, transparent 60%), var(--bg)'
        }}>
            <div style={{width: '100%', maxWidth: 420}}>
                {/* Logo */}
                <div style={{textAlign: 'center', marginBottom: 40}}>
                    <Link to="/" style={{
                        fontFamily: 'var(--font-display)', fontWeight: 800,
                        fontSize: '1.75rem', textDecoration: 'none', letterSpacing: '-0.02em'
                    }}>
                        <span style={{color: 'var(--accent)'}}>Vn</span><span style={{color: 'var(--text)'}}>Dyn</span>
                    </Link>
                    <p style={{color: 'var(--text-2)', marginTop: 8, fontSize: '0.9375rem'}}>
                        Sign in to your account
                    </p>
                </div>

                <div className="card" style={{padding: '36px 32px'}}>
                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                        <div className="field">
                            <label className="label">Email or Phone</label>
                            <input
                                className="input"
                                type="text"
                                placeholder="you@example.com"
                                value={form.loginValue}
                                onChange={e => {
                                    setForm(f => ({...f, loginValue: e.target.value}));
                                    setError('')
                                }}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="field">
                            <label className="label">Password</label>
                            <input
                                className="input"
                                type="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={e => {
                                    setForm(f => ({...f, password: e.target.value}));
                                    setError('')
                                }}
                                disabled={loading}
                                required
                            />
                        </div>
                        <button className="btn-primary" type="submit" disabled={loading}
                                style={{marginTop: 8, width: '100%', padding: '14px'}}>
                            {loading ? <><span className="spinner" style={{width: 16, height: 16}}/> Signing
                                in...</> : 'Sign in'}
                        </button>
                    </form>

                    <div style={{marginTop: 24, textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-3)'}}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{color: 'var(--accent)', textDecoration: 'none', fontWeight: 500}}>
                            Create account
                        </Link>
                    </div>

                    {/* Demo credentials */}
                    <div style={{
                        marginTop: 24, padding: '14px 16px',
                        background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)', fontSize: '0.8rem'
                    }}>
                        <div style={{
                            color: 'var(--text-3)',
                            marginBottom: 8,
                            fontWeight: 500,
                            letterSpacing: '0.03em'
                        }}>DEMO ACCOUNTS
                        </div>
                        {[
                            {label: 'Admin', email: 'admin@vndyn.com', pass: 'admin123'},
                            {label: 'Vendor', email: 'vendor@test.com', pass: 'vendor123'},
                            {label: 'Supplier', email: 'supplier@test.com', pass: 'supplier123'},
                        ].map(d => (
                            <div key={d.label} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 6
                            }}>
                                <span style={{color: 'var(--text-2)'}}>{d.label}</span>
                                <button
                                    type="button"
                                    onClick={() => setForm({loginValue: d.email, password: d.pass})}
                                    style={{
                                        background: 'var(--surface-hover)', border: '1px solid var(--border)',
                                        borderRadius: 6, padding: '3px 10px', fontSize: '0.75rem',
                                        color: 'var(--accent)', cursor: 'pointer'
                                    }}
                                >
                                    Use
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{textAlign: 'center', marginTop: 24}}>
                    <Link to="/" style={{color: 'var(--text-3)', fontSize: '0.875rem', textDecoration: 'none'}}>
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    )
}
