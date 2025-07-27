import React, { useState, useEffect } from "react";
import { resourceAPI, orderAPI, generateObjectId } from "../mongoAPI";
import ComplaintForm from "./ComplaintForm";

export default function VendorPortal({ user, onHome, onBack }) {
    const [resources, setResources] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [showComplaints, setShowComplaints] = useState(false);

    useEffect(() => {
        fetchResources();
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

    const addToCart = (item) => {
        if (!cart.find((c) => c._id === item._id)) {
            setCart([...cart, item]);
            setMessage(`Added ${item.name} to cart`);
            setTimeout(() => setMessage(""), 3000);
        } else {
            setMessage(`${item.name} is already in cart`);
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item._id !== itemId));
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
                <div className="text" style={{ textAlign: 'center' }}>
                    Loading resources...
                </div>
            </div>
        );
    }

    return (
        <div id="app">
            <h2 className="text">Vendor Portal - {user.fullName}</h2>

            {!showComplaints ? (
                <>
                    <div className="text" style={{ marginBottom: '2rem' }}>
                        <h3>Available Resources</h3>
                        {resources.length === 0 ? (
                            <p>No resources available at the moment.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                                {resources.map((resource) => (
                                    <div key={resource._id} style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        padding: '1rem',
                                        borderRadius: '0.5rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <strong>{resource.name}</strong><br />
                                            <small>{resource.description}</small><br />
                                            <span style={{ color: '#d6e3ab' }}>₹{resource.price || 'Price not set'}</span>
                                        </div>
                                        <button
                                            className="btn"
                                            style={{ maxWidth: '120px', padding: '0.5rem' }}
                                            onClick={() => addToCart(resource)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="text" style={{ marginBottom: '2rem' }}>
                            <h3>Cart ({cart.length} items)</h3>
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                marginBottom: '1rem'
                            }}>
                                {cart.map((item) => (
                                    <div key={item._id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.5rem 0',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}>
                                        <span>{item.name} - ₹{item.price || 0}</span>
                                        <button
                                            className="switch-link"
                                            onClick={() => removeFromCart(item._id)}
                                            style={{ color: '#dc2626', padding: '0.25rem' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <div style={{
                                    marginTop: '1rem',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    color: '#d6e3ab'
                                }}>
                                    Total: ₹{calculateTotal()}
                                </div>
                            </div>
                            <button className="btn" onClick={placeOrder}>
                                Place Order
                            </button>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                            className="btn"
                            onClick={() => setShowComplaints(true)}
                            style={{ maxWidth: '200px', background: 'rgba(220, 38, 38, 0.3)' }}
                        >
                            File a Complaint
                        </button>
                    </div>
                </>
            ) : (
                <ComplaintForm
                    partyId={user.email}
                    partyName={user.fullName}
                    onSubmitted={() => {
                        setShowComplaints(false);
                        setMessage("Complaint submitted successfully!");
                        setTimeout(() => setMessage(""), 5000);
                    }}
                />
            )}

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