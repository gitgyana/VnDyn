import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import {resourceAPI, orderAPI, generateObjectId} from '../api'
import PaymentModal from './PaymentModal'

export default function VendorPortal() {
    const {user, logout} = useAuth()
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
            notify(item.name + ' is already in cart!');
            return
        }
        setCart(p => [...p, item]);
        notify('Added ' + item.name + ' to cart!')
    }

    const removeFromCart = (id) => {
        setCart(p => p.filter(i => i._id !== id));
        notify('Item removed from cart')
    }

    const total = cart.reduce((s, i) => s + (i.price || 0), 0)

    const placeOrder = async () => {
        if (!cart.length) {
            notify('Cart is empty!');
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
            setCurrentOrder(result.data)
            setCart([])
            fetchOrders()
            notify('Order placed! Proceed to payment.')
            setTimeout(() => setShowPayment(true), 800)
        } catch (e) {
            notify('Failed to place order: ' + e.message)
        }
    }

    const handleLogout = () => {
        logout();
        navigate('/')
    }

    if (loading) return (
        <div id="app">
            <div className="text" style={{textAlign: 'center', padding: '2rem'}}>
                <span className="spinner"/> Loading resources...
            </div>
        </div>
    )

    return (
        <div id="app">
            <h2 className="text">Vendor Portal - {user.fullName}</h2>

            {msg && <div className="success-msg">{msg}</div>}

            <div className="tab-bar">
                <button className={'tab-btn' + (tab === 'browse' ? ' active' : '')}
                        onClick={() => setTab('browse')}>Browse Items
                </button>
                <button className={'tab-btn' + (tab === 'cart' ? ' active' : '')} onClick={() => setTab('cart')}>Cart
                    ({cart.length})
                </button>
                <button className={'tab-btn' + (tab === 'orders' ? ' active' : '')} onClick={() => setTab('orders')}>My
                    Orders
                </button>
            </div>

            {tab === 'browse' && (
                <div>
                    <h3 className="text">Available Resources</h3>
                    {resources.length === 0 ? (
                        <div className="text" style={{textAlign: 'center', padding: '2rem'}}>No resources
                            available.</div>
                    ) : (
                        <div style={{display: 'grid', gap: '1rem'}}>
                            {resources.map(r => (
                                <div key={r._id} className="panel"
                                     style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div style={{flex: 1}}>
                                        <h4 className="text" style={{margin: '0 0 0.4rem 0'}}>{r.name}</h4>
                                        <p className="text" style={{
                                            margin: '0 0 0.4rem 0',
                                            fontSize: '0.9rem',
                                            opacity: 0.75
                                        }}>{r.description}</p>
                                        <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
                                            <span style={{fontWeight: 700, color: '#4ade80'}}>Rs. {r.price}</span>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-secondary)',
                                                padding: '2px 8px',
                                                background: 'rgba(255,255,255,0.07)',
                                                borderRadius: 4
                                            }}>{r.category}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="btn"
                                        onClick={() => addToCart(r)}
                                        disabled={!!cart.find(c => c._id === r._id)}
                                        style={{
                                            maxWidth: 100,
                                            margin: 0,
                                            fontSize: '0.85rem',
                                            opacity: cart.find(c => c._id === r._id) ? 0.5 : 1
                                        }}
                                    >
                                        {cart.find(c => c._id === r._id) ? 'Added' : 'Add'}
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
                        <div className="text" style={{textAlign: 'center', padding: '2rem'}}>Your cart is empty. Browse
                            items to add them.</div>
                    ) : (
                        <>
                            <h3 className="text">Shopping Cart</h3>
                            <div style={{display: 'grid', gap: '0.75rem', marginBottom: '1.5rem'}}>
                                {cart.map(item => (
                                    <div key={item._id} className="panel" style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <h4 className="text" style={{margin: '0 0 0.25rem 0'}}>{item.name}</h4>
                                            <p style={{
                                                margin: 0,
                                                fontWeight: 700,
                                                color: '#4ade80'
                                            }}>Rs. {item.price}</p>
                                        </div>
                                        <button onClick={() => removeFromCart(item._id)} style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ef4444',
                                            cursor: 'pointer',
                                            fontWeight: 600
                                        }}>Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="panel" style={{textAlign: 'center'}}>
                                {user?.address && (
                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: 'var(--text-secondary)',
                                        marginBottom: '0.75rem'
                                    }}>
                                        Delivering to: {user.address.street}, {user.address.city}
                                    </p>
                                )}
                                <h3 className="text" style={{marginBottom: '1rem'}}>Total: Rs. {total}</h3>
                                <button className="btn primary-btn" onClick={placeOrder} style={{maxWidth: 240}}>Place
                                    Order and Pay
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {tab === 'orders' && (
                <div>
                    <h3 className="text">My Orders</h3>
                    {orders.length === 0 ? (
                        <p className="text">No orders found.</p>
                    ) : (
                        <div style={{display: 'grid', gap: '0.75rem'}}>
                            {orders.map(order => (
                                <div key={order._id} className="panel" style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: 10
                                }}>
                                    <div>
                                        <h4 className="text" style={{margin: '0 0 0.4rem 0'}}>Order
                                            #{order._id.slice(-8)}</h4>
                                        <p className="text"
                                           style={{margin: '0 0 0.25rem 0', fontSize: '0.9rem', opacity: 0.75}}>
                                            {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} -
                                            Rs. {order.totalAmount}
                                        </p>
                                        <p className="text" style={{margin: 0, fontSize: '0.85rem', opacity: 0.6}}>
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
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
                <button className="switch-link" onClick={() => navigate('/complaints')}
                        style={{width: 'auto', minHeight: 'auto', padding: '0.5rem 1rem'}}>File Complaint
                </button>
                <button className="switch-link" onClick={() => navigate('/dashboard')}
                        style={{width: 'auto', minHeight: 'auto', padding: '0.5rem 1rem'}}>Back to Dashboard
                </button>
                <button className="switch-link" onClick={handleLogout}
                        style={{width: 'auto', minHeight: 'auto', padding: '0.5rem 1rem'}}>Logout
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
                        setCurrentOrder(null)
                        notify('Payment successful! Order confirmed.')
                        fetchOrders()
                    }}
                />
            )}
        </div>
    )
}
