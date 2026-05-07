import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import {orderAPI} from '../api'
import Layout from './Layout'

export default function SupplierPortal() {
    const {user} = useAuth()
    const navigate = useNavigate()
    const [pending, setPending] = useState([])
    const [all, setAll] = useState([])
    const [tab, setTab] = useState('pending')
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const [p, a, r] = await Promise.all([
                orderAPI.getByStatus('pending'),
                orderAPI.getByStatus('approved'),
                orderAPI.getByStatus('rejected')
            ])
            setPending(p);
            setAll([...p, ...a, ...r].sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt)))
        } catch (e) {
            setMsg('Failed to load orders')
        } finally {
            setLoading(false)
        }
    }

    const notify = (m) => {
        setMsg(m);
        setTimeout(() => setMsg(''), 3000)
    }

    const approve = async (id) => {
        try {
            await orderAPI.updateStatus(id, 'approved', {
                approvedBy: user.fullName,
                approvedAt: new Date().toISOString()
            })
            notify('Order approved and dispatched!');
            fetchOrders()
        } catch (e) {
            notify('Failed: ' + e.message)
        }
    }

    const reject = async (id) => {
        if (!confirm('Reject this order?')) return
        try {
            await orderAPI.updateStatus(id, 'rejected', {
                rejectedBy: user.fullName,
                rejectedAt: new Date().toISOString()
            })
            notify('Order rejected.');
            fetchOrders()
        } catch (e) {
            notify('Failed: ' + e.message)
        }
    }

    const STATUS_BADGE = {pending: 'badge-pending', approved: 'badge-settled', rejected: 'badge-rejected'}

    if (loading) return <Layout title="Supplier Portal">
        <div style={{textAlign: 'center', padding: 60}}><span className="spinner"/></div>
    </Layout>

    return (
        <Layout title="Supplier Portal" subtitle={`Manage incoming vendor orders · ${user.fullName}`}>
            {msg && <div className="alert alert-success">{msg}</div>}

            <div className="tab-bar">
                <button className={`tab ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>
                    Pending {pending.length > 0 && <span style={{
                    background: 'var(--amber)',
                    color: '#000',
                    borderRadius: 100,
                    padding: '1px 7px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    marginLeft: 4
                }}>{pending.length}</span>}
                </button>
                <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All Orders
                </button>
            </div>

            {tab === 'pending' && (
                <div>
                    {pending.length === 0 ? (
                        <div style={{textAlign: 'center', padding: 48, color: 'var(--text-3)'}}>No pending orders.
                            🎉</div>
                    ) : (
                        <div style={{display: 'grid', gap: 16}}>
                            {pending.map(order => (
                                <div key={order._id} className="card" style={{padding: '22px 24px'}}>
                                    <div style={{marginBottom: 16}}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            flexWrap: 'wrap',
                                            gap: 8,
                                            marginBottom: 14
                                        }}>
                                            <div>
                                                <div style={{
                                                    fontFamily: 'var(--font-display)',
                                                    fontWeight: 700,
                                                    fontSize: '1rem',
                                                    marginBottom: 4
                                                }}>
                                                    Order #{order._id.slice(-8)}
                                                </div>
                                                <div style={{fontSize: '0.8125rem', color: 'var(--text-3)'}}>
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                            <span className="badge badge-pending">{order.status}</span>
                                        </div>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '6px',
                                            fontSize: '0.875rem',
                                            marginBottom: 12
                                        }}>
                                            <div><span style={{color: 'var(--text-3)'}}>Vendor: </span><span
                                                style={{color: 'var(--text)'}}>{order.vendorName}</span></div>
                                            <div><span style={{color: 'var(--text-3)'}}>Total: </span><span style={{
                                                color: 'var(--accent)',
                                                fontWeight: 700
                                            }}>₹{order.totalAmount}</span></div>
                                        </div>
                                        {order.deliveryAddress && (
                                            <div style={{
                                                padding: '10px 12px',
                                                background: 'rgba(0,0,0,0.2)',
                                                borderRadius: 8,
                                                fontSize: '0.8125rem',
                                                color: 'var(--text-3)',
                                                marginBottom: 12
                                            }}>
                                                📍 {order.deliveryAddress.street}, {order.deliveryAddress.city} — {order.deliveryAddress.pincode}
                                            </div>
                                        )}
                                        <div style={{
                                            padding: '10px 12px',
                                            background: 'rgba(0,0,0,0.15)',
                                            borderRadius: 8,
                                            marginBottom: 4
                                        }}>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-3)',
                                                marginBottom: 6,
                                                fontWeight: 600,
                                                letterSpacing: '0.04em'
                                            }}>ORDER ITEMS
                                            </div>
                                            {order.items?.map((item, i) => (
                                                <div key={i} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    fontSize: '0.8125rem',
                                                    padding: '3px 0'
                                                }}>
                                                    <span style={{color: 'var(--text-2)'}}>{item.name}</span>
                                                    <span style={{color: 'var(--accent)'}}>₹{item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{display: 'flex', gap: 10, justifyContent: 'flex-end'}}>
                                        <button className="btn-danger" onClick={() => reject(order._id)}>Reject</button>
                                        <button className="btn-success" onClick={() => approve(order._id)}>✓ Approve &
                                            Dispatch
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {tab === 'all' && (
                <div style={{display: 'grid', gap: 10}}>
                    {all.length === 0 ? (
                        <div style={{textAlign: 'center', padding: 48, color: 'var(--text-3)'}}>No orders found.</div>
                    ) : all.map(order => (
                        <div key={order._id} className="card" style={{
                            padding: '16px 20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 10
                        }}>
                            <div>
                                <div style={{fontWeight: 600, marginBottom: 4}}>Order #{order._id.slice(-8)}</div>
                                <div style={{fontSize: '0.8125rem', color: 'var(--text-3)'}}>
                                    {order.vendorName} ·
                                    ₹{order.totalAmount} · {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                </div>
                            </div>
                            <span
                                className={`badge ${STATUS_BADGE[order.status] || 'badge-pending'}`}>{order.status}</span>
                        </div>
                    ))}
                </div>
            )}

            <div style={{marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                <button className="btn-ghost" onClick={() => navigate('/payments')} style={{fontSize: '0.875rem'}}>💳
                    Payments
                </button>
                <button className="btn-ghost" onClick={() => navigate('/dashboard')} style={{fontSize: '0.875rem'}}>←
                    Dashboard
                </button>
            </div>
        </Layout>
    )
}
