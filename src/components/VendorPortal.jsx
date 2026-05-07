import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import {resourceAPI, orderAPI, generateObjectId} from '../api'
import Layout from './Layout'
import PaymentModal from './PaymentModal'

export default function VendorPortal() {
    const {user} = useAuth()
    const navigate = useNavigate()
    const [resources, setResources] = useState([])
    const [cart, setCart] = useState([])
    const [orders, setOrders] = useState([])
    const [tab, setTab] = useState('browse')
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(true)
    const [showPayment, setShowPayment] = useState(false)
    const [currentOrder, setCurrentOrder] = useState(null)

    useEffect(() => {
        fetchResources();
        fetchOrders()
    }, [])

    const fetchResources = async () => {
        try {
            setResources(await resourceAPI.getAll())
        } catch (e) {
            setMsg('Failed to load resources')
        } finally {
            setLoading(false)
        }
    }
    const fetchOrders = async () => {
        try {
            setOrders(await orderAPI.getByVendor(user.email))
        } catch (e) {
        }
    }

    const notify = (m) => {
        setMsg(m);
        setTimeout(() => setMsg(''), 3000)
    }

    const addToCart = (item) => {
        if (cart.find(c => c._id === item._id)) {
            notify(`${item.name} already in cart`);
            return
        }
        setCart(p => [...p, item]);
        notify(`Added ${item.name}`)
    }
    const removeFromCart = (id) => {
        setCart(p => p.filter(i => i._id !== id));
        notify('Removed from cart')
    }
    const total = cart.reduce((s, i) => s + (i.price || 0), 0)

    const placeOrder = async () => {
        if (!cart.length) {
            notify('Cart is empty');
            return
        }
        try {
            const orderData = {
                _id: generateObjectId(),
                vendorId: user.email, vendorName: user.fullName,
                items: cart.map(i => ({id: i._id, name: i.name, price: i.price || 0})),
                totalAmount: total, status: 'pending',
                deliveryAddress: user.address || {street: 'N/A', city: '', state: '', pincode: ''}
            }
            const result = await orderAPI.create(orderData)
            setCurrentOrder(result.data);
            setCart([]);
            fetchOrders()
            notify('Order placed! Proceed to payment.')
            setTimeout(() => setShowPayment(true), 800)
        } catch (e) {
            notify('Failed to place order: ' + e.message)
        }
    }

    const STATUS_BADGE = {pending: 'badge-pending', approved: 'badge-settled', rejected: 'badge-rejected'}

    if (loading) return <Layout title="Vendor Portal">
        <div style={{textAlign: 'center', padding: 60, color: 'var(--text-3)'}}><span className="spinner"/></div>
    </Layout>

    return (
        <Layout title="Vendor Portal" subtitle={`Browse resources and manage your orders · ${user.fullName}`}>
            {user.address && (
                <div style={{
                    padding: '10px 16px',
                    background: 'var(--accent-dim)',
                    border: '1px solid rgba(0,229,160,0.2)',
                    borderRadius: 'var(--radius)',
                    marginBottom: 24,
                    fontSize: '0.8125rem',
                    color: 'var(--accent)'
                }}>
                    📍 Delivering to: {user.address.street}, {user.address.city} — {user.address.pincode}
                </div>
            )}

            {msg && <div className="alert alert-success">{msg}</div>}

            <div className="tab-bar">
                <button className={`tab ${tab === 'browse' ? 'active' : ''}`} onClick={() => setTab('browse')}>Browse
                    Resources
                </button>
                <button className={`tab ${tab === 'cart' ? 'active' : ''}`} onClick={() => setTab('cart')}>
                    Cart {cart.length > 0 && <span style={{
                    background: 'var(--accent)',
                    color: '#000',
                    borderRadius: '100px',
                    padding: '1px 7px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    marginLeft: 4
                }}>{cart.length}</span>}
                </button>
                <button className={`tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>My
                    Orders
                </button>
            </div>

            {tab === 'browse' && (
                <div>
                    {resources.length === 0 ? (
                        <div style={{textAlign: 'center', padding: 48, color: 'var(--text-3)'}}>No resources
                            available</div>
                    ) : (
                        <div style={{display: 'grid', gap: 12}}>
                            {resources.map(r => (
                                <div key={r._id} className="card" style={{
                                    padding: '18px 22px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 16
                                }}>
                                    <div style={{flex: 1}}>
                                        <div style={{
                                            fontFamily: 'var(--font-display)',
                                            fontWeight: 700,
                                            marginBottom: 4
                                        }}>{r.name}</div>
                                        <div style={{
                                            fontSize: '0.8125rem',
                                            color: 'var(--text-3)',
                                            marginBottom: 6
                                        }}>{r.description}</div>
                                        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                                            <span style={{
                                                fontWeight: 700,
                                                color: 'var(--accent)',
                                                fontSize: '1.1rem'
                                            }}>₹{r.price}</span>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-3)',
                                                padding: '2px 8px',
                                                background: 'rgba(255,255,255,0.05)',
                                                borderRadius: 4
                                            }}>{r.category}</span>
                                        </div>
                                    </div>
                                    <button className="btn-ghost" onClick={() => addToCart(r)}
                                            style={{padding: '9px 18px', fontSize: '0.8125rem', whiteSpace: 'nowrap'}}
                                            disabled={!!cart.find(c => c._id === r._id)}>
                                        {cart.find(c => c._id === r._id) ? '✓ Added' : '+ Add'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {tab === 'cart' && (
                <div>
                    {cart.length === 0 ? (
                        <div style={{textAlign: 'center', padding: 48, color: 'var(--text-3)'}}>
                            Your cart is empty. Browse items to add them.
                        </div>
                    ) : (
                        <>
                            <div style={{display: 'grid', gap: 10, marginBottom: 24}}>
                                {cart.map(item => (
                                    <div key={item._id} className="card" style={{
                                        padding: '14px 18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <div style={{fontWeight: 600, marginBottom: 2}}>{item.name}</div>
                                            <div style={{color: 'var(--accent)', fontWeight: 700}}>₹{item.price}</div>
                                        </div>
                                        <button onClick={() => removeFromCart(item._id)} style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--red)',
                                            cursor: 'pointer',
                                            fontSize: '0.8125rem',
                                            fontWeight: 600
                                        }}>Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="card" style={{padding: '24px', textAlign: 'center'}}>
                                {user?.address && (
                                    <p style={{fontSize: '0.8125rem', color: 'var(--text-3)', marginBottom: 12}}>
                                        📍 {user.address.street}, {user.address.city}
                                    </p>
                                )}
                                <div style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    marginBottom: 20
                                }}>
                                    Total: <span style={{color: 'var(--accent)'}}>₹{total}</span>
                                </div>
                                <button className="btn-primary" onClick={placeOrder} style={{minWidth: 200}}>
                                    Place Order & Pay
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {tab === 'orders' && (
                <div>
                    {orders.length === 0 ? (
                        <div style={{textAlign: 'center', padding: 48, color: 'var(--text-3)'}}>No orders yet.</div>
                    ) : (
                        <div style={{display: 'grid', gap: 12}}>
                            {orders.map(order => (
                                <div key={order._id} className="card" style={{padding: '18px 22px'}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        flexWrap: 'wrap',
                                        gap: 10
                                    }}>
                                        <div>
                                            <div style={{
                                                fontFamily: 'var(--font-display)',
                                                fontWeight: 700,
                                                marginBottom: 6
                                            }}>
                                                Order #{order._id.slice(-8)}
                                            </div>
                                            <div style={{
                                                fontSize: '0.8125rem',
                                                color: 'var(--text-3)',
                                                marginBottom: 4
                                            }}>
                                                {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} ·
                                                ₹{order.totalAmount}
                                            </div>
                                            <div style={{fontSize: '0.8125rem', color: 'var(--text-3)'}}>
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <span className={`badge ${STATUS_BADGE[order.status] || 'badge-pending'}`}>
                      {order.status}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div style={{marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                <button className="btn-ghost" onClick={() => navigate('/complaints')} style={{fontSize: '0.875rem'}}>📋
                    File Complaint
                </button>
                <button className="btn-ghost" onClick={() => navigate('/dashboard')} style={{fontSize: '0.875rem'}}>←
                    Dashboard
                </button>
            </div>

            {showPayment && currentOrder && (
                <PaymentModal
                    payment={{amount: currentOrder.totalAmount, _id: 'new', orderId: currentOrder._id}}
                    onClose={() => {
                        setShowPayment(false);
                        setCurrentOrder(null)
                    }}
                    onSuccess={() => {
                        setShowPayment(false);
                        setCurrentOrder(null);
                        notify('Payment successful! Order confirmed.');
                        fetchOrders()
                    }}
                />
            )}
        </Layout>
    )
}
