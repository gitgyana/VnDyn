import React, { useEffect, useState } from "react";
import { paymentAPI } from "../mongoAPI";

export default function PaymentProcessing({ onHome, onBack }) {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [filter, setFilter] = useState("pending");

    useEffect(() => {
        fetchPayments();
    }, [filter]);

    const fetchPayments = async () => {
        try {
            const data = await paymentAPI.getByStatus(filter);
            setPayments(data);
        } catch (error) {
            setMessage("Failed to load payments: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const settlePayment = async (paymentId) => {
        try {
            await paymentAPI.updateStatus(paymentId, 'settled');
            setMessage("Payment settled successfully!");
            setTimeout(() => setMessage(""), 3000);
            fetchPayments(); // Refresh the list
        } catch (error) {
            setMessage("Failed to settle payment: " + error.message);
        }
    };

    const rejectPayment = async (paymentId) => {
        if (window.confirm("Are you sure you want to reject this payment?")) {
            try {
                await paymentAPI.updateStatus(paymentId, 'rejected');
                setMessage("Payment rejected!");
                setTimeout(() => setMessage(""), 3000);
                fetchPayments(); // Refresh the list
            } catch (error) {
                setMessage("Failed to reject payment: " + error.message);
            }
        }
    };

    const calculateTotalAmount = () => {
        return payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    };

    if (loading) {
        return (
            <div id="app">
                <div className="text" style={{ textAlign: 'center' }}>
                    Loading payments...
                </div>
            </div>
        );
    }

    return (
        <div id="app">
            <h2 className="text">Payment Processing</h2>

            {/* Filter Controls */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'center',
                marginBottom: '2rem',
                flexWrap: 'wrap'
            }}>
                <button
                    className={`btn ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                    style={{
                        maxWidth: '120px',
                        padding: '0.5rem',
                        background: filter === 'pending' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                    }}
                >
                    Pending
                </button>
                <button
                    className={`btn ${filter === 'settled' ? 'active' : ''}`}
                    onClick={() => setFilter('settled')}
                    style={{
                        maxWidth: '120px',
                        padding: '0.5rem',
                        background: filter === 'settled' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                    }}
                >
                    Settled
                </button>
                <button
                    className={`btn ${filter === 'rejected' ? 'active' : ''}`}
                    onClick={() => setFilter('rejected')}
                    style={{
                        maxWidth: '120px',
                        padding: '0.5rem',
                        background: filter === 'rejected' ? 'rgba(220, 38, 38, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                    }}
                >
                    Rejected
                </button>
            </div>

            <div className="text" style={{ marginBottom: '2rem' }}>
                {payments.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '2rem' }}>
                        No {filter} payments found.
                    </p>
                ) : (
                    <>
                        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                            <strong>
                                {payments.length} {filter} payment{payments.length !== 1 ? 's' : ''}
                            </strong>
                            {filter === 'pending' && (
                                <div style={{ color: '#d6e3ab', marginTop: '0.5rem' }}>
                                    Total Pending Amount: ₹{calculateTotalAmount()}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {payments.map((payment) => (
                                <div key={payment._id} style={{
                                    background: payment.status === 'settled'
                                        ? 'rgba(34, 197, 94, 0.1)'
                                        : payment.status === 'rejected'
                                            ? 'rgba(220, 38, 38, 0.1)'
                                            : 'rgba(255, 255, 255, 0.1)',
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    backdropFilter: 'blur(10px)',
                                    border: payment.status === 'pending'
                                        ? '1px solid rgba(59, 130, 246, 0.3)'
                                        : payment.status === 'settled'
                                            ? '1px solid rgba(34, 197, 94, 0.3)'
                                            : '1px solid rgba(220, 38, 38, 0.3)'
                                }}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                        gap: '1rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <div>
                                            <strong>Order ID:</strong><br />
                                            <span style={{ fontSize: '0.9rem' }}>
                        #{payment.orderId?.slice(-8) || 'N/A'}
                      </span>
                                        </div>
                                        <div>
                                            <strong>Vendor:</strong><br />
                                            {payment.vendorName}
                                        </div>
                                        <div>
                                            <strong>Supplier:</strong><br />
                                            {payment.supplierName || 'Not assigned'}
                                        </div>
                                        <div>
                                            <strong>Amount:</strong><br />
                                            <span style={{ color: '#d6e3ab', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        ₹{payment.amount || 0}
                      </span>
                                        </div>
                                        <div>
                                            <strong>Status:</strong><br />
                                            <span style={{
                                                color: payment.status === 'settled' ? '#22c55e' :
                                                    payment.status === 'rejected' ? '#dc2626' : '#3b82f6',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase'
                                            }}>
                        {payment.status}
                      </span>
                                        </div>
                                        <div>
                                            <strong>Date:</strong><br />
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {payment.status === 'pending' && (
                                        <div style={{
                                            display: 'flex',
                                            gap: '0.5rem',
                                            justifyContent: 'flex-end'
                                        }}>
                                            <button
                                                className="btn"
                                                onClick={() => settlePayment(payment._id)}
                                                style={{
                                                    maxWidth: '120px',
                                                    padding: '0.5rem',
                                                    background: 'rgba(34, 197, 94, 0.3)'
                                                }}
                                            >
                                                Settle
                                            </button>
                                            <button
                                                className="btn"
                                                onClick={() => rejectPayment(payment._id)}
                                                style={{
                                                    maxWidth: '120px',
                                                    padding: '0.5rem',
                                                    background: 'rgba(220, 38, 38, 0.3)'
                                                }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {message && (
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: message.includes('Failed') ? 'rgba(220, 38, 38, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                    color: '#fff'
                }}>
                    {message}
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                <button
                    type="button"
                    className="switch-link"
                    onClick={onBack}
                >
                    ← Back to Dashboard
                </button>
                <button
                    type="button"
                    className="switch-link"
                    onClick={onHome}
                >
                    Home
                </button>
            </div>
        </div>
    );
}