import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import {userAPI} from '../api'

export default function Login() {
    const navigate = useNavigate()
    const {login} = useAuth()
    const [loginValue, setLoginValue] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const value = loginValue.trim()
        if (!value || !password) {
            setError('Fill all fields!');
            return
        }
        setLoading(true);
        setError('')
        try {
            const result = await userAPI.login(value, password)
            if (result.success) {
                login(result.data);
                navigate('/dashboard')
            }
        } catch (err) {
            setError(err.message || 'Invalid credentials!')
        } finally {
            setLoading(false)
        }
    }

    const fillDemo = (email, pass) => {
        setLoginValue(email);
        setPassword(pass);
        setError('')
    }

    return (
        <div id="app">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Email or Phone"
                    value={loginValue}
                    onChange={e => {
                        setLoginValue(e.target.value);
                        setError('')
                    }}
                    required
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => {
                        setPassword(e.target.value);
                        setError('')
                    }}
                    required
                    disabled={loading}
                />
                <button className="btn" type="submit" disabled={loading}>
                    {loading ? <><span className="spinner"/>Logging in...</> : 'Login'}
                </button>
            </form>

            {error && <div className="error-msg">{error}</div>}

            <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem'
            }}>
                <div style={{
                    color: 'var(--text-secondary)',
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                    letterSpacing: '0.03em'
                }}>
                    DEMO ACCOUNTS
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
                        marginBottom: '0.4rem'
                    }}>
                        <span style={{color: '#fff'}}>{d.label}</span>
                        <button
                            type="button"
                            onClick={() => fillDemo(d.email, d.pass)}
                            style={{
                                background: 'rgba(0,229,160,0.15)',
                                border: '1px solid rgba(0,229,160,0.3)',
                                borderRadius: '6px',
                                padding: '3px 12px',
                                fontSize: '0.75rem',
                                color: '#4ade80',
                                cursor: 'pointer'
                            }}
                        >
                            Use
                        </button>
                    </div>
                ))}
            </div>

            <button type="button" className="switch-link" onClick={() => navigate('/signup')}>
                Don't have an account? Sign up
            </button>
            <button type="button" className="switch-link" onClick={() => navigate('/')}>
                Back to Home
            </button>
        </div>
    )
}
