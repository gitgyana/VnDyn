import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import {paymentAPI} from '../api'
import Layout from './Layout'
import PaymentModal from './PaymentModal'

export default function PaymentProcessing() {
    const {user} = useAuth()
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
            notify('Payment settled successfully!');
            setSelected(null);
            fetchPayments()
        } catch (e) {
            notify('Failed: ' + e.message)
        }
    }

    const reject = async (id) => {
        if (!confirm('Reject this payment?')) return
        try {
            await paymentAPI.updateStatus(id, 'rejected');
            notify('Rejected.');
            fetchPayments()
        } catch (e) {
        }
    }

    const METHOD_ICONS = {card: '💳', upi: '📱', netbanking: '🏦', cod: '💵'}
    const total = payments.reduce((s, p) => s + (p.amount || 0), 0)

    return (
        <Layout title="Payment Processing" subtitle="Manage and settle vendor payments">
            {msg && <div className="alert alert-success">{msg}</div>}

            <div className="tab-bar">
                {['pending', 'settled', 'rejected'].map(f => (
                    <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {payments.length > 0 && (
                <div className="card"
                     style={{padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 24, flexWrap: 'wrap'}}>
                    <div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-3)',
                            marginBottom: 4,
                            letterSpacing: '0.04em'
                        }}>TOTAL PAYMENTS
                        </div>
                        <div style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: '1.25rem'
                        }}>{payments.length}</div>
                    </div>
                    <div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-3)',
                            marginBottom: 4,
                            letterSpacing: '0.04em'
                        }}>TOTAL AMOUNT
                        </div>
                        <div style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            color: 'var(--accent)'
                        }}>₹{total}</div>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{textAlign: 'center', padding: 60}}><span className="spinner"/></div>
            ) : payments.length === 0 ? (
                <div style={{textAlign: 'center', padding: 48, color: 'var(--text-3)'}}>No {filter} payments.</div>
            ) : (
                <div style={{display: 'grid', gap: 12}}>
                    {payments.map(p => (
                        <div key={p._id} className="card" style={{padding: '20px 24px'}}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                                gap: 10,
                                marginBottom: 12
                            }}>
                                <div>
                                    <div style={{fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 6}}>
                                        Payment #{p._id.slice(-8)}
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gap: '4px',
                                        fontSize: '0.8125rem',
                                        color: 'var(--text-3)'
                                    }}>
                                        <span>Order: #{p.orderId?.slice(-8)}</span>
                                        <span>Vendor: <span
                                            style={{color: 'var(--text-2)'}}>{p.vendorName}</span></span>
                                        {p.supplierName && <span>Supplier: <span
                                            style={{color: 'var(--text-2)'}}>{p.supplierName}</span></span>}
                                        <span>{new Date(p.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}</span>
                                        {p.status === 'settled' && p.paymentMethod && (
                                            <span>{METHOD_ICONS[p.paymentMethod]} {p.paymentMethod?.toUpperCase()}</span>
                                        )}
                                        {p.transactionId && <span style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-3)'
                                        }}>TXN: {p.transactionId}</span>}
                                    </div>
                                </div>
                                <div style={{textAlign: 'right'}}>
                                    <div style={{
                                        fontFamily: 'var(--font-display)',
                                        fontWeight: 800,
                                        fontSize: '1.25rem',
                                        color: 'var(--accent)',
                                        marginBottom: 8
                                    }}>
                                        ₹{p.amount}
                                    </div>
                                    <span
                                        className={`badge ${p.status === 'pending' ? 'badge-pending' : p.status === 'settled' ? 'badge-settled' : 'badge-rejected'}`}>
                    {p.status}
                  </span>
                                </div>
                            </div>
                            {p.status === 'pending' && (
                                <div style={{
                                    display: 'flex',
                                    gap: 10,
                                    justifyContent: 'flex-end',
                                    paddingTop: 12,
                                    borderTop: '1px solid var(--border)'
                                }}>
                                    <button className="btn-danger" onClick={() => reject(p._id)}>Reject</button>
                                    <button className="btn-primary" onClick={() => setSelected(p)}
                                            style={{padding: '10px 20px', fontSize: '0.875rem'}}>
                                        💳 Pay Now
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div style={{marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                {user?.type === 'Admin' && (
                    <button className="btn-ghost" onClick={() => navigate('/admin')} style={{fontSize: '0.875rem'}}>⚙️
                        Admin</button>
                )}
                <button className="btn-ghost" onClick={() => navigate('/dashboard')} style={{fontSize: '0.875rem'}}>←
                    Dashboard
                </button>
            </div>

            {selected && (
                <PaymentModal
                    payment={selected}
                    onClose={() => setSelected(null)}
                    onSuccess={handleSuccess}
                />
            )}
        </Layout>
    )
}
