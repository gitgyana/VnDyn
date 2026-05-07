import {useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'

const WORDS = ['Street Vendors', 'Resource Retailers', 'Food Entrepreneurs', 'Supply Networks']

export default function Home() {
    const navigate = useNavigate()
    const [wordIdx, setWordIdx] = useState(0)
    const [displayed, setDisplayed] = useState('')
    const [typing, setTyping] = useState(true)
    const timeoutRef = useRef(null)

    // Typewriter effect
    useEffect(() => {
        const current = WORDS[wordIdx]
        if (typing) {
            if (displayed.length < current.length) {
                timeoutRef.current = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60)
            } else {
                timeoutRef.current = setTimeout(() => setTyping(false), 2200)
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
        <div style={{
            position: 'relative',
            minHeight: '100svh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>

            {/* Gradient mesh background */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 0,
                background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,229,160,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 80% 80%, rgba(59,142,245,0.06) 0%, transparent 60%), var(--bg)'
            }}/>

            {/* Grid overlay */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 0,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
            }}/>

            {/* Decorative orb */}
            <div style={{
                position: 'fixed', top: '15%', right: '10%', zIndex: 0,
                width: 400, height: 400,
                background: 'radial-gradient(circle, rgba(0,229,160,0.06) 0%, transparent 70%)',
                borderRadius: '50%', filter: 'blur(40px)'
            }}/>

            {/* Nav */}
            <nav style={{
                position: 'relative', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 48px'
            }}>
                <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800,
                    fontSize: '1.25rem', color: 'var(--text)', letterSpacing: '-0.01em'
                }}>
                    <span style={{color: 'var(--accent)'}}>Vn</span>Dyn
                </div>
                <div style={{display: 'flex', gap: 12}}>
                    <button className="btn-ghost" onClick={() => navigate('/login')} style={{fontSize: '0.875rem'}}>
                        Sign in
                    </button>
                    <button className="btn-primary" onClick={() => navigate('/signup')}
                            style={{fontSize: '0.875rem', padding: '11px 22px'}}>
                        Get started
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <div style={{
                position: 'relative', zIndex: 10, flex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '60px 24px'
            }}>
                {/* Tag */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '6px 14px',
                    background: 'var(--accent-dim)', border: '1px solid rgba(0,229,160,0.22)',
                    borderRadius: 100, marginBottom: 32,
                    fontSize: '0.8125rem', fontWeight: 500, color: 'var(--accent)',
                    letterSpacing: '0.04em'
                }}>
                    <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        display: 'inline-block'
                    }}/>
                    Enterprise Platform
                </div>

                <h1 style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800,
                    fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: 1.08,
                    color: 'var(--text)', letterSpacing: '-0.03em',
                    maxWidth: 800, marginBottom: 12
                }}>
                    The Digital Hub for
                </h1>
                <h1 style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800,
                    fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: 1.08,
                    letterSpacing: '-0.03em', maxWidth: 800, marginBottom: 32,
                    minHeight: 'clamp(3rem, 8vw, 5.5rem)',
                    background: 'linear-gradient(135deg, var(--accent) 0%, #00aaff 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    {displayed}<span style={{opacity: 0.6, WebkitTextFillColor: 'var(--accent)'}}>|</span>
                </h1>

                <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-2)',
                    maxWidth: 540, lineHeight: 1.7, marginBottom: 48, fontWeight: 300
                }}>
                    Connect vendors, suppliers and resources in one seamless platform. Manage orders, track payments,
                    and grow your street food business.
                </p>

                <div style={{display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center'}}>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/signup/Street Vendor')}
                        style={{padding: '16px 36px', fontSize: '1rem', borderRadius: 14}}
                    >
                        Join as Vendor
                    </button>
                    <button
                        className="btn-ghost"
                        onClick={() => navigate('/signup/Retailer to Vendor')}
                        style={{padding: '16px 36px', fontSize: '1rem', borderRadius: 14}}
                    >
                        Join as Retailer
                    </button>
                </div>
            </div>

            {/* Stats row */}
            <div style={{
                position: 'relative', zIndex: 10,
                display: 'flex', justifyContent: 'center', gap: 0,
                borderTop: '1px solid var(--border)',
                background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)'
            }}>
                {[
                    {val: '500+', label: 'Vendors'},
                    {val: '120+', label: 'Suppliers'},
                    {val: '₹2M+', label: 'Transactions'},
                    {val: '98%', label: 'Uptime'}
                ].map((s, i) => (
                    <div key={i} style={{
                        flex: 1, maxWidth: 200, textAlign: 'center', padding: '28px 20px',
                        borderRight: i < 3 ? '1px solid var(--border)' : 'none'
                    }}>
                        <div style={{
                            fontFamily: 'var(--font-display)', fontWeight: 800,
                            fontSize: '1.75rem', color: 'var(--text)', letterSpacing: '-0.02em'
                        }}>{s.val}</div>
                        <div style={{fontSize: '0.8125rem', color: 'var(--text-3)', marginTop: 4}}>{s.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
