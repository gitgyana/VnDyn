import {useState} from 'react'

export default function PaymentModal({payment, onClose, onSuccess}) {
    const [step, setStep] = useState('method')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [card, setCard] = useState({number: '', holderName: '', expiry: '', cvv: '', upiId: ''})
    const [processingMsg, setProcessingMsg] = useState('')

    const METHODS = [
        {id: 'card', label: 'Credit / Debit Card'},
        {id: 'upi', label: 'UPI Payment'},
        {id: 'netbanking', label: 'Net Banking'},
        {id: 'cod', label: 'Cash on Delivery'},
    ]

    const fmtCard = v => {
        const n = v.replace(/\D/g, '')
        const p = []
        for (let i = 0; i < n.length && i < 16; i += 4) p.push(n.slice(i, i + 4))
        return p.join(' ')
    }

    const simulate = async () => {
        setStep('processing')
        const msgs = ['Initializing secure connection...', 'Verifying details...', 'Connecting to gateway...', 'Processing transaction...', 'Confirming payment...']
        for (const m of msgs) {
            setProcessingMsg(m)
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
        width: '100%',
        padding: '12px 14px',
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 10,
        color: '#fff',
        fontSize: '0.9375rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        display: 'block',
        boxSizing: 'border-box',
        marginBottom: '10px',
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
            <div style={{
                width: '100%', maxWidth: 460, maxHeight: '90vh', overflow: 'auto',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-xl)', padding: '32px 28px', backdropFilter: 'blur(20px)'
            }}>
                <div style={{textAlign: 'center', marginBottom: 28}}>
                    <h3 style={{
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 700,
                        color: '#fff',
                        marginBottom: 4,
                        fontSize: '1.25rem'
                    }}>
                        {step === 'method' && 'Secure Payment'}
                        {step === 'processing' && 'Processing...'}
                        {step === 'success' && 'Payment Successful!'}
                        {step === 'failed' && 'Payment Failed'}
                    </h3>
                    {step === 'method' && (
                        <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '0.9375rem'}}>
                            Amount: <strong style={{color: '#4ade80'}}>Rs. {payment?.amount}</strong>
                        </p>
                    )}
                </div>

                {step === 'method' && (
                    <div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20}}>
                            {METHODS.map(m => (
                                <div key={m.id} onClick={() => setPaymentMethod(m.id)} style={{
                                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                                    borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                                    border: `1px solid ${paymentMethod === m.id ? 'rgba(0,229,160,0.5)' : 'rgba(255,255,255,0.12)'}`,
                                    background: paymentMethod === m.id ? 'rgba(0,229,160,0.12)' : 'rgba(255,255,255,0.04)',
                                }}>
                                    <div style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        border: `2px solid ${paymentMethod === m.id ? '#4ade80' : 'rgba(255,255,255,0.3)'}`,
                                        background: paymentMethod === m.id ? '#4ade80' : 'transparent',
                                        flexShrink: 0
                                    }}/>
                                    <span style={{
                                        color: paymentMethod === m.id ? '#4ade80' : '#fff',
                                        fontWeight: 500
                                    }}>{m.label}</span>
                                </div>
                            ))}
                        </div>

                        {paymentMethod === 'card' && (
                            <div style={{marginBottom: 16}}>
                                <input style={inputStyle} placeholder="Card Number" maxLength={19} value={card.number}
                                       onChange={e => setCard(p => ({...p, number: fmtCard(e.target.value)}))}/>
                                <input style={inputStyle} placeholder="Card Holder Name" value={card.holderName}
                                       onChange={e => setCard(p => ({...p, holderName: e.target.value}))}/>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
                                    <input style={{...inputStyle, marginBottom: 0}} placeholder="MM/YY" maxLength={5}
                                           value={card.expiry} onChange={e => {
                                        let v = e.target.value.replace(/\D/g, '')
                                        if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4)
                                        setCard(p => ({...p, expiry: v}))
                                    }}/>
                                    <input style={{...inputStyle, marginBottom: 0}} type="password" placeholder="CVV"
                                           maxLength={3} value={card.cvv} onChange={e => setCard(p => ({
                                        ...p,
                                        cvv: e.target.value.replace(/\D/g, '').slice(0, 3)
                                    }))}/>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'upi' && (
                            <div style={{marginBottom: 16}}>
                                <input style={inputStyle} placeholder="UPI ID (e.g. name@upi)" value={card.upiId}
                                       onChange={e => setCard(p => ({...p, upiId: e.target.value}))}/>
                            </div>
                        )}

                        {(paymentMethod === 'netbanking' || paymentMethod === 'cod') && (
                            <div style={{
                                padding: 16,
                                borderRadius: 10,
                                textAlign: 'center',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                marginBottom: 16
                            }}>
                                <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: 0}}>
                                    {paymentMethod === 'cod' ? 'Pay Rs. ' + payment?.amount + ' on delivery. +Rs. 50 COD charges apply.' : 'You will be redirected to your bank\'s secure portal.'}
                                </p>
                            </div>
                        )}

                        <div style={{display: 'flex', gap: 12}}>
                            <button className="btn" onClick={onClose} style={{flex: 1, margin: 0}}>Cancel</button>
                            <button className="btn primary-btn" disabled={!paymentMethod} onClick={simulate}
                                    style={{flex: 2, margin: 0, width: 'auto', opacity: !paymentMethod ? 0.4 : 1}}>
                                Pay Rs. {payment?.amount}
                            </button>
                        </div>

                        <p style={{
                            textAlign: 'center',
                            marginTop: 14,
                            fontSize: '0.75rem',
                            color: 'rgba(255,255,255,0.4)'
                        }}>
                            Secured by 256-bit SSL Encryption
                        </p>
                    </div>
                )}

                {step === 'processing' && (
                    <div style={{textAlign: 'center', padding: '20px 0'}}>
                        <span className="spinner"
                              style={{width: 40, height: 40, margin: '0 auto 20px', display: 'block'}}/>
                        <p style={{color: '#fff', marginBottom: 8}}>{processingMsg}</p>
                        <p style={{color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem'}}>Do not close this window</p>
                    </div>
                )}

                {step === 'success' && (
                    <div style={{textAlign: 'center'}}>
                        <div style={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            background: 'rgba(76,222,128,0.15)',
                            border: '1px solid rgba(76,222,128,0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            fontSize: '1.75rem',
                            color: '#4ade80'
                        }}>
                            &#10003;
                        </div>
                        <h3 style={{color: '#4ade80', marginBottom: 16}}>Payment Completed!</h3>
                        <div style={{
                            padding: 16,
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: 10,
                            marginBottom: 20,
                            fontSize: '0.9rem',
                            textAlign: 'left'
                        }}>
                            <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: 6}}><strong
                                style={{color: '#fff'}}>Amount:</strong> Rs. {payment?.amount}</p>
                            <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: 6}}><strong
                                style={{color: '#fff'}}>Method:</strong> {paymentMethod?.toUpperCase()}</p>
                            <p style={{
                                color: 'rgba(255,255,255,0.4)',
                                fontSize: '0.8rem',
                                margin: 0
                            }}>TXN{Date.now()}</p>
                        </div>
                        <button className="btn primary-btn" onClick={onClose} style={{margin: '0 auto'}}>Continue
                        </button>
                    </div>
                )}

                {step === 'failed' && (
                    <div style={{textAlign: 'center'}}>
                        <div style={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            fontSize: '1.75rem',
                            color: '#ef4444'
                        }}>
                            &#10007;
                        </div>
                        <h3 style={{color: '#ef4444', marginBottom: 12}}>Payment Failed</h3>
                        <p style={{color: 'rgba(255,255,255,0.7)', marginBottom: 24, fontSize: '0.9rem'}}>
                            Something went wrong. Try again or use a different method.
                        </p>
                        <div style={{display: 'flex', gap: 12}}>
                            <button className="btn" onClick={onClose} style={{flex: 1, margin: 0}}>Cancel</button>
                            <button className="btn" onClick={() => setStep('method')} style={{
                                flex: 2,
                                margin: 0,
                                background: 'rgba(239,68,68,0.3)',
                                borderColor: 'rgba(239,68,68,0.4)',
                                color: '#ef4444'
                            }}>Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
