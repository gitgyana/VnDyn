import {useNavigate} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import Layout from './Layout'

const ROLE_CONFIG = {
    'Admin': {
        color: 'var(--red)',
        icon: '👑',
        route: '/admin',
        portalLabel: 'Admin Dashboard',
        description: 'Manage complaints, resources & users'
    },
    'Street Vendor': {
        color: 'var(--accent)',
        icon: '🍜',
        route: '/vendor',
        portalLabel: 'Vendor Portal',
        description: 'Browse resources and place orders'
    },
    'Retailer to Vendor': {
        color: 'var(--blue)',
        icon: '📦',
        route: '/supplier',
        portalLabel: 'Supplier Portal',
        description: 'Manage incoming orders from vendors'
    }
}

export default function Dashboard() {
    const {user} = useAuth()
    const navigate = useNavigate()
    const role = ROLE_CONFIG[user?.type] || ROLE_CONFIG['Street Vendor']

    const quickActions = [
        {label: role.portalLabel, icon: role.icon, desc: role.description, route: role.route, primary: true},
        ...([user?.type === 'Admin' || user?.type === 'Retailer to Vendor'] ? [{
            label: 'Payments',
            icon: '💳',
            desc: 'Process and track payments',
            route: '/payments'
        }] : []),
        {label: 'File Complaint', icon: '📋', desc: 'Submit a support complaint', route: '/complaints'},
        ...(user?.type === 'Admin' ? [{
            label: 'Manage Resources',
            icon: '⚙️',
            desc: 'Add or edit resources',
            route: '/admin'
        }] : [])
    ].filter(Boolean)

    return (
        <Layout title={`Welcome back, ${user?.fullName?.split(' ')[0]}`} subtitle="Here's your platform overview">
            <div style={{display: 'grid', gap: 24}}>

                {/* Profile card */}
                <div className="card" style={{
                    padding: '28px 32px',
                    display: 'flex',
                    gap: 24,
                    alignItems: 'flex-start',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: 16, flexShrink: 0,
                        background: `color-mix(in srgb, ${role.color} 15%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${role.color} 25%, transparent)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem'
                    }}>
                        {role.icon}
                    </div>
                    <div style={{flex: 1, minWidth: 200}}>
                        <div
                            style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap'}}>
                            <h2 style={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 700,
                                fontSize: '1.25rem',
                                color: 'var(--text)'
                            }}>
                                {user?.fullName}
                            </h2>
                            <span
                                className={`badge badge-${user?.type === 'Admin' ? 'rejected' : user?.type === 'Street Vendor' ? 'settled' : 'pending'}`}
                                style={{
                                    background: `color-mix(in srgb, ${role.color} 12%, transparent)`,
                                    color: role.color,
                                    borderColor: `color-mix(in srgb, ${role.color} 22%, transparent)`
                                }}>
                {user?.type}
              </span>
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '6px 24px'
                        }}>
                            {[
                                {label: 'Email', value: user?.email},
                                {label: 'Phone', value: user?.phone},
                                ...(user?.address ? [{label: 'City', value: user.address.city}] : [])
                            ].map(item => (
                                <div key={item.label} style={{fontSize: '0.875rem'}}>
                                    <span style={{color: 'var(--text-3)'}}>{item.label}: </span>
                                    <span style={{color: 'var(--text-2)'}}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                        {user?.address && (
                            <div style={{
                                marginTop: 12,
                                padding: '8px 12px',
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: 8,
                                fontSize: '0.8125rem',
                                color: 'var(--text-3)'
                            }}>
                                📍 {user.address.street}, {user.address.city}, {user.address.state} — {user.address.pincode}
                                {user.address.landmark && ` · ${user.address.landmark}`}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick actions */}
                <div>
                    <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: 'var(--text-2)',
                        marginBottom: 16,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem'
                    }}>
                        Quick Actions
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: 16
                    }}>
                        {quickActions.map((action, i) => (
                            <button key={i} onClick={() => navigate(action.route)} style={{
                                padding: '22px 24px', textAlign: 'left',
                                background: action.primary ? `color-mix(in srgb, ${role.color} 8%, var(--surface))` : 'var(--surface)',
                                border: `1px solid ${action.primary ? `color-mix(in srgb, ${role.color} 25%, transparent)` : 'var(--border)'}`,
                                borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all 0.2s',
                                display: 'flex', flexDirection: 'column', gap: 10
                            }} onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.borderColor = action.primary ? `color-mix(in srgb, ${role.color} 45%, transparent)` : 'var(--border-strong)'
                            }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = '';
                                        e.currentTarget.style.borderColor = ''
                                    }}>
                                <span style={{fontSize: '1.5rem'}}>{action.icon}</span>
                                <div>
                                    <div style={{
                                        fontFamily: 'var(--font-display)',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        color: action.primary ? role.color : 'var(--text)',
                                        marginBottom: 4
                                    }}>
                                        {action.label}
                                    </div>
                                    <div style={{
                                        fontSize: '0.8125rem',
                                        color: 'var(--text-3)',
                                        lineHeight: 1.5
                                    }}>{action.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}
