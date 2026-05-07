import {useState} from 'react'

export default function PaymentModal({payment, onClose, onSuccess}) {
    const [step, setStep] = useState('method')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [card, setCard] = useState({number: '', holderName: '', expiry: '', cvv: '', upiId: ''})
    const [processingMsg, setProcessingMsg] = useState('')

    const METHODS = [
        {id: 'card', label: 'Credit / Debit Card', icon: '💳'},
        {id: 'upi', label: 'UPI Payment', icon: '📱'},
        {id: 'netbanking', label: 'Net Banking', icon: '🏦'},
        {id: 'cod', label: 'Cash on Delivery', icon: '💵'}
    ]

    const fmtCard = v => {
        const n = v.replace(/\D/g, '');
        const p = []
        for (let i = 0; i < n.length && i < 16; i += 4) p.push(n.slice(i, i + 4))
        return p.join(' ')
    }

    const simulate = async () => {
        setStep('processing')
        const msgs = ['Initializing secure connection...', 'Verifying details...', 'Connecting to gateway...', 'Processing transaction...', 'Confirming payment...']
        for (const m of msgs) {
            setProcessingMsg(m);
            await new Promise(r => setTimeout(r, 700))
        }
        const ok = Math.random() > 0.05
        if (ok) {
            setStep('success')
            onSuccess({paymentMethod, lastFour: card.number.replace(/\s/g, '').slice(-4), holderName: card.holderName})
        } else {
            setStep('failed')
        }
    }

    const inputStyle = {
        width: '100%', padding: '12px 14px',
        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 10, color: 'var(--text)', fontSize: '0.9375rem', outline: 'none',
        transition: 'border-color 0.2s', fontFamily: 'var(--font-body)'
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
            <div className="card"
                 style={{width: '100%', maxWidth: 460, maxHeight: '90vh', overflow: 'auto', padding: '32px 28px'}}>

                {/* Header */}
                <div style={{textAlign: 'center', marginBottom: 28}}>
                    <div style={{fontSize: '2.5rem', marginBottom: 8}}>
                        {step === 'method' && '🔒'}{step === 'processing' && '⏳'}{step === 'success' && '✅'}{step === 'failed' && '❌'}
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        color: 'var(--text)',
                        marginBottom: 4
                    }}>
                        {step === 'method' && 'Secure Payment'}
                        {step === 'processing' && 'Processing...'}
                        {step === 'success' && 'Payment Successful!'}
                        {step === 'failed' && 'Payment Failed'}
                    </h2>
                    {step === 'method' && (
                        <p style={{color: 'var(--text-2)', fontSize: '0.9375rem'}}>
                            Amount: <strong style={{color: 'var(--accent)'}}>₹{payment?.amount}</strong>
                        </p>
                    )}
                </div>

                {step === 'method' && (
                    <div>
                        {/* Method selection */}
                        <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20}}>
                            {METHODS.map(m => (
                                <div key={m.id} onClick={() => setPaymentMethod(m.id)} style={{
                                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                                    borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                                    border: `1px solid ${paymentMethod === m.id ? 'rgba(0,229,160,0.4)' : 'var(--border)'}`,
                                    background: paymentMethod === m.id ? 'var(--accent-dim)' : 'var(--surface)'
                                }}>
                                    <span style={{fontSize: '1.25rem'}}>{m.icon}</span>
                                    <span style={{
                                        color: paymentMethod === m.id ? 'var(--accent)' : 'var(--text)',
                                        fontWeight: 500
                                    }}>{m.label}</span>
                                </div>
                            ))}
                        </div>

                        {paymentMethod === 'card' && (
                            <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16}}>
                                <input style={inputStyle} placeholder="Card Number" maxLength={19}
                                       value={card.number}
                                       onChange={e => setCard(p => ({...p, number: fmtCard(e.target.value)}))}/>
                                <input style={inputStyle} placeholder="Card Holder Name"
                                       value={card.holderName}
                                       onChange={e => setCard(p => ({...p, holderName: e.target.value}))}/>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
                                    <input style={inputStyle} placeholder="MM/YY" maxLength={5}
                                           value={card.expiry} onChange={e => {
                                        let v = e.target.value.replace(/\D/g, '')
                                        if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4)
                                        setCard(p => ({...p, expiry: v}))
                                    }}/>
                                    <input style={inputStyle} type="password" placeholder="CVV" maxLength={3}
                                           value={card.cvv} onChange={e => setCard(p => ({
                                        ...p,
                                        cvv: e.target.value.replace(/\D/g, '').slice(0, 3)
                                    }))}/>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'upi' && (
                            <div style={{marginBottom: 16}}>
                                <input style={inputStyle} placeholder="UPI ID (e.g. name@upi)"
                                       value={card.upiId}
                                       onChange={e => setCard(p => ({...p, upiId: e.target.value}))}/>
                            </div>
                        )}

                        {(paymentMethod === 'netbanking' || paymentMethod === 'cod') && (
                            <div style={{
                                padding: '16px', borderRadius: 10, textAlign: 'center',
                                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', marginBottom: 16
                            }}>
                                <p style={{color: 'var(--text-2)', fontSize: '0.9rem'}}>
                                    {paymentMethod === 'cod' ? `Pay ₹${payment?.amount} on delivery. +₹50 COD charges apply.` : 'You will be redirected to your bank\'s secure portal.'}
                                </p>
                            </div>
                        )}

                        <div style={{display: 'flex', gap: 12}}>
                            <button className="btn-ghost" onClick={onClose} style={{flex: 1}}>Cancel</button>
                            <button className="btn-primary" disabled={!paymentMethod} onClick={simulate}
                                    style={{flex: 2, opacity: !paymentMethod ? 0.4 : 1}}>
                                Pay ₹{payment?.amount}
                            </button>
                        </div>

                        <p style={{textAlign: 'center', marginTop: 14, fontSize: '0.75rem', color: 'var(--text-3)'}}>
                            🔒 Secured by 256-bit SSL Encryption
                        </p>
                    </div>
                )}

                {step === 'processing' && (
                    <div style={{textAlign: 'center', padding: '20px 0'}}>
                        <div style={{
                            width: 56, height: 56, border: '3px solid rgba(255,255,255,0.08)',
                            borderTop: '3px solid var(--accent)', borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite', margin: '0 auto 20px'
                        }}/>
                        <p style={{color: 'var(--text)', marginBottom: 8}}>{processingMsg}</p>
                        <p style={{color: 'var(--text-3)', fontSize: '0.85rem'}}>Do not close this window</p>
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                )}

                {step === 'success' && (
                    <div style={{textAlign: 'center'}}>
                        <div style={{
                            width: 72, height: 72, borderRadius: '50%', background: 'var(--accent-dim)',
                            border: '1px solid rgba(0,229,160,0.3)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.75rem'
                        }}>✓
                        </div>
                        <h3 style={{color: 'var(--accent)', marginBottom: 16}}>Payment Completed!</h3>
                        <div style={{
                            padding: '16px',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: 10,
                            marginBottom: 20,
                            fontSize: '0.9rem',
                            textAlign: 'left'
                        }}>
                            <p style={{color: 'var(--text-2)', marginBottom: 6}}><strong
                                style={{color: 'var(--text)'}}>Amount:</strong> ₹{payment?.amount}</p>
                            <p style={{color: 'var(--text-2)', marginBottom: 6}}><strong
                                style={{color: 'var(--text)'}}>Method:</strong> {paymentMethod?.toUpperCase()}</p>
                            <p style={{color: 'var(--text-3)', fontSize: '0.8rem'}}>TXN{Date.now()}</p>
                        </div>
                        <button className="btn-primary" onClick={onClose} style={{width: '100%'}}>Continue</button>
                    </div>
                )}

                {step === 'failed' && (
                    <div style={{textAlign: 'center'}}>
                        <div style={{
                            width: 72, height: 72, borderRadius: '50%', background: 'var(--red-dim)',
                            border: '1px solid rgba(240,68,96,0.3)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.75rem', color: 'var(--red)'
                        }}>✕
                        </div>
                        <h3 style={{color: 'var(--red)', marginBottom: 12}}>Payment Failed</h3>
                        <p style={{color: 'var(--text-2)', marginBottom: 24, fontSize: '0.9rem'}}>
                            Something went wrong. Try again or use a different method.
                        </p>
                        <div style={{display: 'flex', gap: 12}}>
                            <button className="btn-ghost" onClick={onClose} style={{flex: 1}}>Cancel</button>
                            <button className="btn-danger" onClick={() => setStep('method')}
                                    style={{flex: 2, padding: '12px 20px'}}>
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
