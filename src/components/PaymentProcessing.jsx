import React, { useEffect, useState } from "react";
import { paymentAPI } from "../mongoAPI";

export default function PaymentProcessing({ user, onHome, onUserData, onAdmin }) {
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
                <div className="text" style={{ textAlign: "center", padding: "2rem" }}>
                    Loading payments...
                </div>
            </div>
        );
    }

    return (
        <div id="app">
            <h2 className="text">Payment Processing Dashboard</h2>

            {message && (
                <div style={{
                    background: "rgba(76, 222, 128, 0.2)",
                    color: "#4ade80",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    textAlign: "center",
                    border: "1px solid rgba(76, 222, 128, 0.3)"
                }}>
                    {message}
                </div>
            )}

            {/* Filter Controls */}
            <div style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "2rem",
                justifyContent: "center",
                flexWrap: "wrap"
            }}>
                <button
                    className={filter === "pending" ? "btn" : "switch-link"}
                    onClick={() => setFilter("pending")}
                    style={{ maxWidth: "150px" }}
                >
                    Pending
                </button>
                <button
                    className={filter === "settled" ? "btn" : "switch-link"}
                    onClick={() => setFilter("settled")}
                    style={{ maxWidth: "150px" }}
                >
                    Settled
                </button>
                <button
                    className={filter === "rejected" ? "btn" : "switch-link"}
                    onClick={() => setFilter("rejected")}
                    style={{ maxWidth: "150px" }}
                >
                    Rejected
                </button>
            </div>

            {/* Summary Stats */}
            {payments.length > 0 && (
                <div style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    marginBottom: "2rem",
                    textAlign: "center"
                }}>
                    <h3 className="text" style={{ margin: "0 0 0.5rem 0" }}>
                        {filter.charAt(0).toUpperCase() + filter.slice(1)} Payments Summary
                    </h3>
                    <p className="text" style={{ margin: 0 }}>
                        <strong>Total:</strong> {payments.length} payments | 
                        <strong> Amount:</strong> ₹{calculateTotalAmount()}
                    </p>
                </div>
            )}

            {/* Payments List */}
            {payments.length > 0 ? (
                <div style={{ display: "grid", gap: "1rem" }}>
                    {payments.map((payment) => (
                        <div key={payment._id} style={{
                            background: "rgba(255, 255, 255, 0.1)",
                            padding: "1.5rem",
                            borderRadius: "0.5rem",
                            border: "1px solid rgba(255, 255, 255, 0.2)"
                        }}>
                            <div style={{ 
                                display: "flex", 
                                justifyContent: "space-between", 
                                alignItems: "flex-start",
                                marginBottom: "1rem"
                            }}>
                                <div style={{ flex: 1 }}>
                                    <h4 className="text" style={{ margin: "0 0 0.5rem 0" }}>
                                        Payment #{payment._id.slice(-8)}
                                    </h4>
                                    <p className="text" style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
                                        <strong>Order ID:</strong> #{payment.orderId.slice(-8)}
                                    </p>
                                    <p className="text" style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
                                        <strong>Vendor:</strong> {payment.vendorName}
                                    </p>
                                    <p className="text" style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
                                        <strong>Supplier:</strong> {payment.supplierName}
                                    </p>
                                    <p className="text" style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
                                        <strong>Date:</strong> {new Date(payment.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="text" style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold" }}>
                                        <strong>Amount:</strong> ₹{payment.amount}
                                    </p>
                                </div>
                                
                                <span style={{
                                    padding: "0.5rem 1rem",
                                    borderRadius: "1rem",
                                    fontSize: "0.8rem",
                                    fontWeight: "bold",
                                    background: payment.status === "pending" ? 
                                        "rgba(234, 179, 8, 0.2)" : 
                                        payment.status === "settled" ? 
                                        "rgba(34, 197, 94, 0.2)" : 
                                        "rgba(239, 68, 68, 0.2)",
                                    color: payment.status === "pending" ? 
                                        "#eab308" : 
                                        payment.status === "settled" ? 
                                        "#22c55e" : 
                                        "#ef4444"
                                }}>
                                    {payment.status.toUpperCase()}
                                </span>
                            </div>
                            
                            {payment.status === "pending" && (
                                <div style={{ 
                                    display: "flex", 
                                    gap: "1rem", 
                                    justifyContent: "center",
                                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                                    paddingTop: "1rem"
                                }}>
                                    <button
                                        className="btn"
                                        onClick={() => settlePayment(payment._id)}
                                        style={{ 
                                            maxWidth: "140px", 
                                            margin: 0,
                                            background: "rgba(34, 197, 94, 0.8)"
                                        }}
                                    >
                                        Settle Payment
                                    </button>
                                    <button
                                        className="btn"
                                        onClick={() => rejectPayment(payment._id)}
                                        style={{ 
                                            maxWidth: "120px", 
                                            margin: 0,
                                            background: "rgba(239, 68, 68, 0.8)"
                                        }}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    padding: "2rem",
                    borderRadius: "0.5rem",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    textAlign: "center"
                }}>
                    <p className="text" style={{ margin: 0, fontSize: "1.1rem" }}>
                        No {filter} payments found.
                    </p>
                </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ 
                marginTop: "2rem", 
                display: "flex", 
                gap: "1rem", 
                justifyContent: "center",
                flexWrap: "wrap"
            }}>
                {user?.type === "Admin" && (
                    <button className="switch-link" onClick={onAdmin}>
                        Admin Dashboard
                    </button>
                )}
                <button className="switch-link" onClick={onUserData}>
                    Back to Dashboard
                </button>
                <button className="switch-link" onClick={onHome}>
                    Logout
                </button>
            </div>
        </div>
    );
}
