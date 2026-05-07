import {useNavigate} from 'react-router-dom'
import {useAuth} from '../AuthContext'

export default function Layout({children, title, subtitle}) {
    const {user, logout} = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const roleColor = {
        'Admin': 'var(--red)',
        'Street Vendor': 'var(--accent)',
        'Retailer to Vendor': 'var(--blue)'
    }[user?.type] || 'var(--accent)'

    return (
        <div style={{minHeight: '100svh', display: 'flex', flexDirection: 'column'}}>
            {/* Top bar */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 50,
                borderBottom: '1px solid var(--border)',
                background: 'rgba(7,8,13,0.85)',
                backdropFilter: 'blur(20px)',
                padding: '0 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: 60
            }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontFamily: 'var(--font-display)', fontWeight: 800,
                        fontSize: '1.125rem', color: 'var(--text)',
                        letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8
                    }}
                >
                    <span style={{color: 'var(--accent)'}}>Vn</span>Dyn
                </button>

                {user && (
                    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                        <div style={{
                            padding: '5px 12px',
                            background: `color-mix(in srgb, ${roleColor} 12%, transparent)`,
                            border: `1px solid color-mix(in srgb, ${roleColor} 25%, transparent)`,
                            borderRadius: 100,
                            fontSize: '0.75rem', fontWeight: 600,
                            color: roleColor, letterSpacing: '0.04em'
                        }}>
                            {user.type}
                        </div>
                        <span style={{fontSize: '0.875rem', color: 'var(--text-2)'}}>{user.fullName}</span>
                        <button className="btn-ghost" onClick={handleLogout}
                                style={{padding: '7px 14px', fontSize: '0.8125rem'}}>
                            Logout
                        </button>
                    </div>
                )}
            </header>

            {/* Page content */}
            <main style={{flex: 1, padding: '40px 24px', maxWidth: 900, width: '100%', margin: '0 auto'}}>
                {(title || subtitle) && (
                    <div style={{marginBottom: 36}}>
                        {title && (
                            <h1 style={{
                                fontFamily: 'var(--font-display)', fontWeight: 800,
                                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 6
                            }}>{title}</h1>
                        )}
                        {subtitle && <p style={{color: 'var(--text-2)', fontSize: '0.9375rem'}}>{subtitle}</p>}
                    </div>
                )}
                {children}
            </main>
        </div>
    )
}
