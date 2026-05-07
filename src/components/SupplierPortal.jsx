import React, { useEffect, useState } from "react";
import { orderAPI } from "../api.js";

export default function SupplierPortal({ user, onHome, onUserData, onPayments }) {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("pending");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const pending = await orderAPI.getByStatus("pending");
            const all = await orderAPI.getByStatus("approved");
            const rejected = await orderAPI.getByStatus("rejected");

            setPendingOrders(pending);
            setAllOrders([...all, ...rejected, ...pending]);
        } catch (error) {
            setMessage("Failed to load orders: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const approveOrder = async (orderId) => {
        try {
            await orderAPI.updateStatus(orderId, "approved", {
                approvedBy: user.fullName,
                approvedAt: new Date()
            });
            setMessage("Order approved and dispatched!");
            setTimeout(() => setMessage(""), 3000);
            fetchOrders();
        } catch (error) {
            setMessage("Failed to approve order: " + error.message);
        }
    };

    const rejectOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to reject this order?")) {
            try {
                await orderAPI.updateStatus(orderId, "rejected", {
                    rejectedBy: user.fullName,
                    rejectedAt: new Date()
                });
                setMessage("Order rejected!");
                setTimeout(() => setMessage(""), 3000);
                fetchOrders();
            } catch (error) {
                setMessage("Failed to reject order: " + error.message);
            }
        }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case "pending": return { bg: "rgba(234, 179, 8, 0.2)", color: "#eab308" };
            case "approved": return { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" };
            case "rejected": return { bg: "rgba(239, 68, 68, 0.2)", color: "#ef4444" };
            default: return { bg: "rgba(255,255,255,0.1)", color: "#fff" };
        }
    };

    if (loading) {
        return (
            <div id="app">
                <div className="text" style={{ textAlign: "center", padding: "2rem" }}>
                    Loading orders...
                </div>
            </div>
        );
    }

    return (
        <div id="app">
            <h2 className="text">Supplier Portal - {user.fullName}</h2>

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

            {/* Tab Navigation */}
            <div style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "2rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                paddingBottom: "1rem"
            }}>
                <button
                    className={activeTab === "pending" ? "btn" : "switch-link"}
                    onClick={() => setActiveTab("pending")}
                    style={{ maxWidth: "200px" }}
                >
                    Pending Orders ({pendingOrders.length})
                </button>
                <button
                    className={activeTab === "all" ? "btn" : "switch-link"}
                    onClick={() => setActiveTab("all")}
                    style={{ maxWidth: "150px" }}
                >
                    All Orders
                </button>
            </div>

            {/* Pending Orders Tab */}
            {activeTab === "pending" && (
                <div>
                    <h3 className="text">Orders Awaiting Approval</h3>
                    {pendingOrders.length > 0 ? (
                        <div style={{ display: "grid", gap: "1rem" }}>
                            {pendingOrders.map((order) => (
                                <div key={order._id} style={{
                                    background: "rgba(255, 255, 255, 0.05)",
                                    padding: "1.5rem",
                                    borderRadius: "0.5rem",
                                    border: "1px solid rgba(255, 255, 255, 0.1)"
                                }}>
                                    <div style={{ marginBottom: "1rem" }}>
                                        <h4 className="text" style={{ margin: "0 0 0.5rem 0" }}>
                                            Order #{order._id.slice(-8)}
                                        </h4>
                                        <p className="text" style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", opacity: 0.8 }}>
                                            <strong>Vendor:</strong> {order.vendorName}
                                        </p>
                                        <p className="text" style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", opacity: 0.8 }}>
                                            <strong>Total Amount:</strong> ₹{order.totalAmount}
                                        </p>
                                        <p className="text" style={{ margin: "0 0 1rem 0", fontSize: "0.9rem", opacity: 0.8 }}>
                                            <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                                        </p>

                                        {/* Delivery Address */}
                                        {order.deliveryAddress && (
                                            <div style={{
                                                background: "rgba(0,0,0,0.2)",
                                                padding: "0.75rem",
                                                borderRadius: "0.5rem",
                                                marginBottom: "1rem"
                                            }}>
                                                <p className="text" style={{ margin: 0, fontSize: "0.85rem" }}>
                                                    <strong>📍 Deliver to:</strong> {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                                                </p>
                                            </div>
                                        )}

                                        {/* Order Items */}
                                        <div style={{ marginBottom: "1rem" }}>
                                            <h5 className="text" style={{ margin: "0 0 0.5rem 0" }}>Items:</h5>
                                            <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                                                {order.items.map((item, index) => (
                                                    <li key={index} className="text" style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                                                        {item.name} - ₹{item.price}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                                        <button
                                            className="btn"
                                            onClick={() => approveOrder(order._id)}
                                            style={{
                                                maxWidth: "140px",
                                                margin: 0,
                                                background: "rgba(34, 197, 94, 0.8)"
                                            }}
                                        >
                                            Approve & Dispatch
                                        </button>
                                        <button
                                            className="btn"
                                            onClick={() => rejectOrder(order._id)}
                                            style={{
                                                maxWidth: "100px",
                                                margin: 0,
                                                background: "rgba(239, 68, 68, 0.8)"
                                            }}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text" style={{ textAlign: "center", padding: "2rem", opacity: 0.7 }}>
                            No orders awaiting approval.
                        </div>
                    )}
                </div>
            )}

            {/* All Orders Tab */}
            {activeTab === "all" && (
                <div>
                    <h3 className="text">Order History</h3>
                    {allOrders.length > 0 ? (
                        <div style={{ display: "grid", gap: "1rem" }}>
                            {allOrders.map((order) => {
                                const statusStyle = getStatusStyle(order.status);
                                return (
                                    <div key={order._id} style={{
                                        background: "rgba(255, 255, 255, 0.05)",
                                        padding: "1rem",
                                        borderRadius: "0.5rem",
                                        border: "1px solid rgba(255, 255, 255, 0.1)"
                                    }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div>
                                                <h4 className="text" style={{ margin: "0 0 0.5rem 0" }}>
                                                    Order #{order._id.slice(-8)}
                                                </h4>
                                                <p className="text" style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", opacity: 0.8 }}>
                                                    Vendor: {order.vendorName} | Amount: ₹{order.totalAmount}
                                                </p>
                                                <p className="text" style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8 }}>
                                                    Date: {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span style={{
                                                padding: "0.25rem 0.75rem",
                                                borderRadius: "1rem",
                                                fontSize: "0.8rem",
                                                fontWeight: "bold",
                                                background: statusStyle.bg,
                                                color: statusStyle.color
                                            }}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text" style={{ opacity: 0.7 }}>No orders found.</p>
                    )}
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
                <button className="switch-link" onClick={onPayments}>
                    Payment Processing
                </button>
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
