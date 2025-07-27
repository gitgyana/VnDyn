import React, { useState, useEffect } from "react";
import { resourceAPI, orderAPI, generateObjectId } from "../mongoAPI";

export default function VendorPortal({ user, onHome, onUserData, onComplaints }) {
    const [resources, setResources] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [myOrders, setMyOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("browse"); // browse, cart, orders

    useEffect(() => {
        fetchResources();
        fetchMyOrders();
    }, []);

    const fetchResources = async () => {
        try {
            const data = await resourceAPI.getAll();
            setResources(data);
        } catch (error) {
            setMessage("Failed to load resources: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyOrders = async () => {
        try {
            const orders = await orderAPI.getByVendor(user.email);
            setMyOrders(orders);
        } catch (error) {
            console.error("Failed to load orders:", error);
        }
    };

    const addToCart = (item) => {
        if (!cart.find((c) => c._id === item._id)) {
            setCart([...cart, item]);
            setMessage(`Added ${item.name} to cart!`);
            setTimeout(() => setMessage(""), 3000);
        } else {
            setMessage(`${item.name} is already in cart!`);
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item._id !== itemId));
        setMessage("Item removed from cart");
        setTimeout(() => setMessage(""), 3000);
    };

    const placeOrder = async () => {
        if (cart.length === 0) {
            setMessage("Cart is empty!");
            return;
        }

        try {
            const totalAmount = cart.reduce((sum, item) => sum + (item.price || 0), 0);
            const orderData = {
                _id: generateObjectId(),
                vendorId: user.email,
                vendorName: user.fullName,
                items: cart.map(item => ({
                    id: item._id,
                    name: item.name,
                    price: item.price || 0
                })),
                totalAmount: totalAmount,
                status: 'pending'
            };

            await orderAPI.create(orderData);
            setMessage("Order placed successfully!");
            setCart([]);
            fetchMyOrders(); // Refresh orders
            setTimeout(() => setMessage(""), 5000);
        } catch (error) {
            setMessage("Failed to place order: " + error.message);
        }
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price || 0), 0);
    };

    if (loading) {
        return (
            <div id="app">
                <div className="text" style={{ textAlign: "center", padding: "2rem" }}>
                    Loading resources...
                </div>
            </div>
        );
    }

    return (
        <div id="app">
            <h2 className="text">Vendor Portal - {user.fullName}</h2>

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
                borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                paddingBottom: "1rem"
            }}>
                <button
                    className={activeTab === "browse" ? "btn" : "switch-link"}
                    onClick={() => setActiveTab("browse")}
                    style={{ maxWidth: "150px" }}
                >
                    Browse Items
                </button>
                <button
                    className={activeTab === "cart" ? "btn" : "switch-link"}
                    onClick={() => setActiveTab("cart")}
                    style={{ maxWidth: "150px" }}
                >
                    Cart ({cart.length})
                </button>
                <button
                    className={activeTab === "orders" ? "btn" : "switch-link"}
                    onClick={() => setActiveTab("orders")}
                    style={{ maxWidth: "150px" }}
                >
                    My Orders
                </button>
            </div>

            {/* Browse Resources Tab */}
            {activeTab === "browse" && (
                <div>
                    <h3 className="text">Available Resources</h3>
                    {resources.length > 0 ? (
                        <div style={{ display: "grid", gap: "1rem" }}>
                            {resources.map((resource) => (
                                <div key={resource._id} style={{
                                    background: "rgba(255, 255, 255, 0.1)",
                                    padding: "1rem",
                                    borderRadius: "0.5rem",
                                    border: "1px solid rgba(255, 255, 255, 0.2)"
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <h4 className="text" style={{ margin: "0 0 0.5rem 0" }}>
                                                {resource.name}
                                            </h4>
                                            <p className="text" style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
                                                {resource.description}
                                            </p>
                                            <p className="text" style={{ margin: 0, fontWeight: "bold" }}>
                                                ₹{resource.price}
                                            </p>
                                        </div>
                                        <button
                                            className="btn"
                                            onClick={() => addToCart(resource)}
                                            style={{ maxWidth: "100px", margin: 0 }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text">No resources available at the moment.</p>
                    )}
                </div>
            )}

            {/* Cart Tab */}
            {activeTab === "cart" && (
                <div>
                    {cart.length > 0 ? (
                        <>
                            <h3 className="text">Shopping Cart</h3>
                            <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
                                {cart.map((item) => (
                                    <div key={item._id} style={{
                                        background: "rgba(255, 255, 255, 0.1)",
                                        padding: "1rem",
                                        borderRadius: "0.5rem",
                                        border: "1px solid rgba(255, 255, 255, 0.2)",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <div>
                                            <h4 className="text" style={{ margin: "0 0 0.5rem 0" }}>
                                                {item.name}
                                            </h4>
                                            <p className="text" style={{ margin: 0, fontWeight: "bold" }}>
                                                ₹{item.price}
                                            </p>
                                        </div>
                                        <button
                                            className="switch-link"
                                            onClick={() => removeFromCart(item._id)}
                                            style={{ maxWidth: "80px", color: "#ef4444" }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div style={{
                                background: "rgba(255, 255, 255, 0.1)",
                                padding: "1rem",
                                borderRadius: "0.5rem",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                textAlign: "center"
                            }}>
                                <h3 className="text">Total: ₹{calculateTotal()}</h3>
                                <button className="btn" onClick={placeOrder}>
                                    Place Order
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text" style={{ textAlign: "center", padding: "2rem" }}>
                            Your cart is empty. Browse items to add them to cart.
                        </div>
                    )}
                </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
                <div>
                    <h3 className="text">My Orders</h3>
                    {myOrders.length > 0 ? (
                        <div style={{ display: "grid", gap: "1rem" }}>
                            {myOrders.map((order) => (
                                <div key={order._id} style={{
                                    background: "rgba(255, 255, 255, 0.1)",
                                    padding: "1rem",
                                    borderRadius: "0.5rem",
                                    border: "1px solid rgba(255, 255, 255, 0.2)"
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <h4 className="text" style={{ margin: "0 0 0.5rem 0" }}>
                                                Order #{order._id.slice(-8)}
                                            </h4>
                                            <p className="text" style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
                                                Items: {order.items.length} | Total: ₹{order.totalAmount}
                                            </p>
                                            <p className="text" style={{ margin: 0, fontSize: "0.9rem" }}>
                                                Date: {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span style={{
                                            padding: "0.25rem 0.75rem",
                                            borderRadius: "1rem",
                                            fontSize: "0.8rem",
                                            fontWeight: "bold",
                                            background: order.status === "pending" ? 
                                                "rgba(234, 179, 8, 0.2)" : 
                                                order.status === "approved" ? 
                                                "rgba(34, 197, 94, 0.2)" : 
                                                "rgba(239, 68, 68, 0.2)",
                                            color: order.status === "pending" ? 
                                                "#eab308" : 
                                                order.status === "approved" ? 
                                                "#22c55e" : 
                                                "#ef4444"
                                        }}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text">No orders found.</p>
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
                <button className="switch-link" onClick={onComplaints}>
                    File Complaint
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
