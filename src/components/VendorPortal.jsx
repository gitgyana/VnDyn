import React, { useState, useEffect } from "react";
import { resourceAPI, orderAPI } from "../mongoAPI";

export default function VendorPortal({ user, onHome }) {
    const [resources, setResources] = useState([]);
    const [cart, setCart] = useState([]);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await resourceAPI.getAll();
                setResources(response.documents || []);
            } catch (error) {
                console.error("Error fetching resources:", error);
                setMsg("Failed to load resources. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    const addToCart = (item) => {
        if (!cart.find((c) => c._id === item._id)) {
            setCart([...cart, item]);
            setMsg(`${item.name} added to cart!`);
            setTimeout(() => setMsg(""), 3000);
        } else {
            setMsg("Item already in cart!");
            setTimeout(() => setMsg(""), 3000);
        }
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item._id !== itemId));
    };

    const placeOrder = async () => {
        if (cart.length === 0) {
            setMsg("Cart is empty!");
            return;
        }

        try {
            const orderData = {
                vendorId: user.email,
                vendorName: user.fullName,
                items: cart.map(({ _id, name, price }) => ({ _id, name, price })),
                totalAmount: cart.reduce((sum, item) => sum + item.price, 0)
            };

            await orderAPI.create(orderData);
            setMsg("Order placed successfully!");
            setCart([]);
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            console.error("Error placing order:", err);
            setMsg("Failed to place order. Please try again.");
        }
    };

    if (loading) {
        return (
            <div id="app">
                <h2>Loading resources...</h2>
            </div>
        );
    }

    return (
        <div id="app">
            <h2>Browse &amp; Place Order</h2>
            <p className="text">Welcome, {user.fullName}!</p>

            {msg && (
                <div
                    id="msg"
                    className="text"
                    style={{
                        padding: "1rem",
                        marginBottom: "1rem",
                        backgroundColor: msg.includes("Failed") || msg.includes("empty") ? "#fee2e2" : "#d1fae5",
                        color: msg.includes("Failed") || msg.includes("empty") ? "#dc2626" : "#059669",
                        borderRadius: "0.5rem"
                    }}
                >
                    {msg}
                </div>
            )}

            {/* Resources List */}
            <div style={{ marginBottom: "2rem" }}>
                <h3>Available Resources</h3>
                {resources.length > 0 ? (
                    <div style={{ display: "grid", gap: "1rem" }}>
                        {resources.map((resource) => (
                            <div
                                key={resource._id}
                                style={{
                                    border: "1px solid #e5e7eb",
                                    padding: "1rem",
                                    borderRadius: "0.5rem",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    backgroundColor: "rgba(255, 255, 255, 0.1)"
                                }}
                            >
                                <div>
                                    <strong className="text">{resource.name}</strong>
                                    <p className="text" style={{
                                        margin: "0.5rem 0",
                                        fontSize: "0.9rem"
                                    }}>
                                        {resource.description}
                                    </p>
                                    <p className="text" style={{
                                        margin: 0,
                                        fontWeight: "bold"
                                    }}>
                                        ₹{resource.price}
                                    </p>
                                </div>
                                <button
                                    className="btn"
                                    style={{
                                        maxWidth: 120,
                                        minHeight: "auto",
                                        padding: "0.5rem 1rem"
                                    }}
                                    onClick={() => addToCart(resource)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text">No resources available at the moment.</p>
                )}
            </div>

            {/* Cart */}
            {cart.length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                    <h3>Cart ({cart.length} items)</h3>
                    <div style={{ marginBottom: "1rem" }}>
                        {cart.map((item) => (
                            <div
                                key={item._id}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "0.5rem",
                                    marginBottom: "0.5rem",
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    borderRadius: "0.25rem"
                                }}
                            >
                                <span className="text">
                                    {item.name} - ₹{item.price}
                                </span>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    style={{
                                        background: "#dc2626",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "0.25rem",
                                        padding: "0.25rem 0.5rem",
                                        cursor: "pointer"
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="text" style={{
                        fontWeight: "bold",
                        marginBottom: "1rem"
                    }}>
                        Total: ₹{cart.reduce((sum, item) => sum + item.price, 0)}
                    </div>
                    <button className="btn" onClick={placeOrder}>
                        Place Order
                    </button>
                </div>
            )}

            <button type="button" className="switch-link" onClick={onHome}>
                ← Back to Home
            </button>
        </div>
    );
}