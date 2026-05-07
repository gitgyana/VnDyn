import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import {orderAPI} from '../api'

export default function SupplierPortal() {
    const {user, logout} = useAuth()
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
                orderAPI.getByStatus('rejected'),
            ])
            setPending(p)
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
            notify('Order approved and dispatched!')
            fetchOrders()
        } catch (e) {
            notify('Failed: ' + e.message)
        }
    }

    const reject = async (id) => {
        if (!window.confirm('Reject this order?')) return
        try {
            await orderAPI.updateStatus(id, 'rejected', {
                rejectedBy: user.fullName,
                rejectedAt: new Date().toISOString()
            })
            notify('Order rejected.')
            fetchOrders()
        } catch (e) {
            notify('Failed: ' + e.message)
        }
    }

    const handleLogout = () => {
        logout();
        navigate('/')
    }

    if (loading) return (
        <div id="app">
            <div className="text" style={{textAlign: 'center', padding: '2rem'}}>
                <span className="spinner"/> Loading orders...
            </div>
        </div>
    )

    return (
        <div id="app">
            <h2 className="text">Supplier Portal - {user.fullName}</h2>

            {msg && <div className="success-msg">{msg}</div>}

            <div className="tab-bar">
                <button className={'tab-btn' + (tab === 'pending' ? ' active' : '')} onClick={() => setTab('pending')}>
                    Pending Orders ({pending.length})
                </button>
                <button className={'tab-btn' + (tab === 'all' ? ' active' : '')} onClick={() => setTab('all')}>
                    All Orders
                </button>
            </div>

            {tab === 'pending' && (
                <div>
                    <h3 className="text">Orders Awaiting Approval</h3>
                    {pending.length === 0 ? (
                        <div className="text" style={{textAlign: 'center', padding: '2rem'}}>No orders awaiting
                            approval.</div>
                    ) : (
                        <div style={{display: 'grid', gap: '1rem'}}>
                            {pending.map(order => (
                                <div key={order._id} className="panel">
                                    <div style={{marginBottom: '1rem'}}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            flexWrap: 'wrap',
                                            gap: 8,
                                            marginBottom: '0.75rem'
                                        }}>
                                            <div>
                                                <h4 className="text" style={{margin: '0 0 0.25rem 0'}}>Order
                                                    #{order._id.slice(-8)}</h4>
                                                <p className="text"
                                                   style={{margin: 0, fontSize: '0.85rem', opacity: 0.6}}>
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <span className="badge badge-pending">{order.status}</span>
                                        </div>
                                        <p className="text" style={{margin: '0 0 0.3rem 0', fontSize: '0.9rem'}}>
                                            <strong>Vendor:</strong> {order.vendorName}
                                        </p>
                                        <p className="text" style={{margin: '0 0 0.75rem 0', fontSize: '0.9rem'}}>
                                            <strong>Total Amount:</strong> <span
                                            style={{color: '#4ade80', fontWeight: 700}}>Rs. {order.totalAmount}</span>
                                        </p>
                                        {order.deliveryAddress && (
                                            <p className="text"
                                               style={{margin: '0 0 0.75rem 0', fontSize: '0.85rem', opacity: 0.7}}>
                                                Deliver
                                                to: {order.deliveryAddress.street}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                                            </p>
                                        )}
                                        <div style={{
                                            background: 'rgba(0,0,0,0.2)',
                                            borderRadius: 8,
                                            padding: '10px 12px'
                                        }}>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-secondary)',
                                                marginBottom: 6,
                                                fontWeight: 600,
                                                letterSpacing: '0.04em'
                                            }}>ORDER ITEMS
                                            </div>
                                            {order.items?.map((item, i) => (
                                                <div key={i} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    fontSize: '0.85rem',
                                                    padding: '2px 0'
                                                }}>
                                                    <span style={{color: 'rgba(255,255,255,0.8)'}}>{item.name}</span>
                                                    <span style={{color: '#4ade80'}}>Rs. {item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{display: 'flex', gap: '0.75rem', justifyContent: 'flex-end'}}>
                                        <button className="btn" onClick={() => reject(order._id)} style={{
                                            maxWidth: 100,
                                            margin: 0,
                                            background: 'rgba(239,68,68,0.3)',
                                            borderColor: 'rgba(239,68,68,0.4)',
                                            color: '#ef4444'
                                        }}>Reject
                                        </button>
                                        <button className="btn" onClick={() => approve(order._id)} style={{
                                            maxWidth: 180,
                                            margin: 0,
                                            background: 'rgba(76,222,128,0.3)',
                                            borderColor: 'rgba(76,222,128,0.4)',
                                            color: '#4ade80'
                                        }}>Approve and Dispatch
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {tab === 'all' && (
                <div>
                    <h3 className="text">Order History</h3>
                    {all.length === 0 ? (
                        <p className="text">No orders found.</p>
                    ) : (
                        <div style={{display: 'grid', gap: '0.75rem'}}>
                            {all.map(order => (
                                <div key={order._id} className="panel" style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: 10
                                }}>
                                    <div>
                                        <h4 className="text" style={{margin: '0 0 0.3rem 0'}}>Order
                                            #{order._id.slice(-8)}</h4>
                                        <p className="text" style={{margin: 0, fontSize: '0.85rem', opacity: 0.7}}>
                                            {order.vendorName} -
                                            Rs. {order.totalAmount} - {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                        </p>
                                    </div>
                                    <span
                                        className={'badge badge-' + (order.status === 'approved' ? 'approved' : order.status === 'rejected' ? 'rejected' : 'pending')}>
                                        {order.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div style={{
                marginTop: '2rem',
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                <button className="switch-link" onClick={() => navigate('/payments')}
                        style={{width: 'auto', minHeight: 'auto', padding: '0.5rem 1rem'}}>Payment Processing
                </button>
                <button className="switch-link" onClick={() => navigate('/dashboard')}
                        style={{width: 'auto', minHeight: 'auto', padding: '0.5rem 1rem'}}>Back to Dashboard
                </button>
                <button className="switch-link" onClick={handleLogout}
                        style={{width: 'auto', minHeight: 'auto', padding: '0.5rem 1rem'}}>Logout
                </button>
            </div>
        </div>
    )
}
