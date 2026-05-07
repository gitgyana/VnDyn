import {useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'

const WORDS = ['Street Vendors', 'Resource Retailers', 'Food Entrepreneurs', 'Supply Networks']

export default function Home() {
    const navigate = useNavigate()
    const [wordIdx, setWordIdx] = useState(0)
    const [displayed, setDisplayed] = useState('')
    const [typing, setTyping] = useState(true)
    const timeoutRef = useRef(null)

    useEffect(() => {
        const current = WORDS[wordIdx]
        if (typing) {
            if (displayed.length < current.length) {
                timeoutRef.current = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60)
            } else {
                timeoutRef.current = setTimeout(() => setTyping(false), 2000)
            }
        } else {
            if (displayed.length > 0) {
                timeoutRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35)
            } else {
                setWordIdx((i) => (i + 1) % WORDS.length)
                setTyping(true)
            }
        }
        return () => clearTimeout(timeoutRef.current)
    }, [displayed, typing, wordIdx])

    return (
        <div className="landing-container">
            <div className="background-overlay"/>

            <div className="content-overlay">
                <nav className="top-nav">
                    <div className="logo"><span>Vn</span>Dyn</div>
                    <div>
                        <button className="nav-btn" onClick={() => navigate('/signup')}>Sign Up</button>
                        <button className="nav-btn" onClick={() => navigate('/login')}>Login</button>
                    </div>
                </nav>

                <div className="hero-section">
                    <h1 className={displayed.length > 0 ? 'fade-in' : ''}>
                        VnDyn
                    </h1>
                    <h1 style={{
                        background: 'linear-gradient(135deg, #4ade80 0%, #00aaff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        minHeight: 'clamp(2.5rem, 6vw, 5rem)',
                    }}>
                        {displayed}<span style={{opacity: 0.6, WebkitTextFillColor: '#4ade80'}}>|</span>
                    </h1>

                    <p className="subtitle">
                        Digital hub for street food vendors and resource retailers. Manage orders, track payments and
                        grow your business.
                    </p>

                    <div className="button-group">
                        <button
                            className="btn primary-btn"
                            onClick={() => navigate('/signup/Street Vendor')}
                        >
                            Join as Vendor
                        </button>
                        <button
                            className="btn secondary-btn"
                            onClick={() => navigate('/signup/Retailer to Vendor')}
                        >
                            Join as Retailer
                        </button>
                    </div>
                </div>

                <div className="stats-row">
                    {[
                        {val: '500+', label: 'Vendors'},
                        {val: '120+', label: 'Suppliers'},
                        {val: '2M+', label: 'Transactions'},
                        {val: '98%', label: 'Uptime'},
                    ].map((s, i) => (
                        <div key={i} className="stat-item">
                            <div className="stat-value">{s.val}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
