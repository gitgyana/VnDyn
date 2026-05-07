import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import {paymentAPI} from '../api'
import PaymentModal from './PaymentModal'

export default function PaymentProcessing() {
    const {user, logout} = useAuth()
    const navigate = useNavigate()
    const [payments, setPayments] = useState([])
    const [filter, setFilter] = useState('pending')
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)

    useEffect(() => {
        fetchPayments()
    }, [filter])

    const fetchPayments = async () => {
        setLoading(true)
        try {
            setPayments(await paymentAPI.getByStatus(filter))
        } catch (e) {
            setMsg('Failed to load')
        } finally {
            setLoading(false)
        }
    }

    const notify = (m) => {
        setMsg(m);
        setTimeout(() => setMsg(''), 3000)
    }

    const handleSuccess = async (details) => {
        try {
            await paymentAPI.processPayment(selected._id, details.paymentMethod, {
                lastFour: details.lastFour,
                holderName: details.holderName
            })
            notify('Payment settled successfully!')
            setSelected(null)
            fetchPayments()
        } catch (e) {
            notify('Failed: ' + e.message)
        }
    }

    const reject = async (id) => {
        if (!window.confirm('Reject this payment?')) return
        try {
            await paymentAPI.updateStatus(id, 'rejected');
            notify('Rejected.');
            fetchPayments()
        } catch (e) {
        }
    }

    const total = payments.reduce((s, p) => s + (p.amount || 0), 0)
    const handleLogout = () => {
        logout();
        navigate('/')
    }

    return (
        <div id="app">
            <h2 className="text">Payment Processing Dashboard</h2>

            {msg && <div className="success-msg">{msg}</div>}

            <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                {['pending', 'settled', 'rejected'].map(f => (
                    <button
                        key={f}
                        className={'nav-tab' + (filter === f ? ' active' : '')}
                        onClick={() => setFilter(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {payments.length > 0 && (
                <div className="panel" style={{marginBottom: '1.5rem', textAlign: 'center'}}>
                    <p className="text" style={{margin: 0}}>
                        <strong>{filter.charAt(0).toUpperCase() + filter.slice(1)} Payments:</strong> {payments.length} &nbsp;|&nbsp;
                        <strong>Total Amount:</strong> <span style={{color: '#4ade80'}}>Rs. {total}</span>
                    </p>
                </div>
            )}

            {loading ? (
                <div className="text" style={{textAlign: 'center', padding: '2rem'}}>
                    <span className="spinner"/> Loading payments...
                </div>
            ) : payments.length === 0 ? (
                <div className="panel" style={{textAlign: 'center'}}>
                    <p className="text" style={{margin: 0}}>No {filter} payments found.</p>
                </div>
            ) : (
                <div style={{display: 'grid', gap: '1rem'}}>
                    {payments.map(p => (
                        <div key={p._id} className="panel">
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                                gap: 10,
                                marginBottom: 12
                            }}>
                                <div>
                                    <h4 className="text" style={{margin: '0 0 0.4rem 0'}}>Payment
                                        #{p._id.slice(-8)}</h4>
                                    <p className="text"
                                       style={{margin: '0 0 0.25rem 0', fontSize: '0.85rem', opacity: 0.7}}>Order:
                                        #{p.orderId?.slice(-8)}</p>
                                    <p className="text" style={{
                                        margin: '0 0 0.25rem 0',
                                        fontSize: '0.85rem',
                                        opacity: 0.7
                                    }}>Vendor: {p.vendorName}</p>
                                    {p.supplierName && <p className="text" style={{
                                        margin: '0 0 0.25rem 0',
                                        fontSize: '0.85rem',
                                        opacity: 0.7
                                    }}>Supplier: {p.supplierName}</p>}
                                    <p className="text"
                                       style={{margin: '0 0 0.25rem 0', fontSize: '0.85rem', opacity: 0.7}}>
                                        {new Date(p.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    {p.status === 'settled' && p.paymentMethod && (
                                        <p className="text"
                                           style={{margin: '0 0 0.25rem 0', fontSize: '0.85rem', opacity: 0.7}}>
                                            Method: {p.paymentMethod.toUpperCase()}
                                        </p>
                                    )}
                                    {p.transactionId && <p className="text" style={{
                                        margin: 0,
                                        fontSize: '0.75rem',
                                        opacity: 0.5
                                    }}>TXN: {p.transactionId}</p>}
                                </div>
                                <div style={{textAlign: 'right'}}>
                                    <div style={{
                                        fontWeight: 800,
                                        fontSize: '1.25rem',
                                        color: '#4ade80',
                                        marginBottom: 8
                                    }}>Rs. {p.amount}</div>
                                    <span
                                        className={'badge badge-' + (p.status === 'pending' ? 'pending' : p.status === 'settled' ? 'settled' : 'rejected')}>{p.status}</span>
                                </div>
                            </div>
                            {p.status === 'pending' && (
                                <div style={{
                                    display: 'flex',
                                    gap: '0.75rem',
                                    justifyContent: 'flex-end',
                                    paddingTop: 12,
                                    borderTop: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <button className="btn" onClick={() => reject(p._id)} style={{
                                        maxWidth: 100,
                                        margin: 0,
                                        background: 'rgba(239,68,68,0.3)',
                                        borderColor: 'rgba(239,68,68,0.4)',
                                        color: '#ef4444'
                                    }}>Reject
                                    </button>
                                    <button className="btn" onClick={() => setSelected(p)} style={{
                                        maxWidth: 140,
                                        margin: 0,
                                        background: 'rgba(76,222,128,0.3)',
                                        borderColor: 'rgba(76,222,128,0.4)',
                                        color: '#4ade80'
                                    }}>Pay Now
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div style={{
                marginTop: '2rem',
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                {user?.type === 'Admin' && (
                    <button className="switch-link" onClick={() => navigate('/admin')}
                            style={{width: 'auto', minHeight: 'auto', padding: '0.5rem 1rem'}}>Admin Dashboard</button>
                )}
                <button className="switch-link" onClick={() => navigate('/dashboard')}
                        style={{width: 'auto', minHeight: 'auto', padding: '0.5rem 1rem'}}>Back to Dashboard
                </button>
                <button className="switch-link" onClick={handleLogout}
                        style={{width: 'auto', minHeight: 'auto', padding: '0.5rem 1rem'}}>Logout
                </button>
            </div>

            {selected && (
                <PaymentModal
                    payment={selected}
                    onClose={() => setSelected(null)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    )
}
