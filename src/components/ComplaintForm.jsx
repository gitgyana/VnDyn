import React, { useState } from "react";
import { complaintAPI } from "../mongoAPI";

export default function ComplaintForm({ user, onHome, onUserData, onSuccess }) {
    const [category, setCategory] = useState("Order");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setError("Please enter complaint details");
            return;
        }

        setLoading(true);
        try {
            const complaintData = {
                partyId: user.email,
                partyName: user.fullName,
                category,
                message: message.trim()
            };

            await complaintAPI.submit(complaintData);
            setMessage("");
            setError("");
            
            if (onSuccess) {
                onSuccess("Complaint submitted successfully!");
            } else {
                // If no onSuccess callback, show success message in component
                setError(""); // Clear any existing errors
                alert("Complaint submitted successfully!");
                setMessage(""); // Clear the form
            }
        } catch (error) {
            console.error(error);
            setError("Could not submit complaint. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="app">
            <h2 className="text">Lodge a Complaint</h2>
            
            <div style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "2rem",
                borderRadius: "1rem",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)"
            }}>
                <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem" }}>
                    <div>
                        <label className="text" style={{ 
                            display: "block", 
                            marginBottom: "0.5rem",
                            fontWeight: "bold"
                        }}>
                            Complaint Category:
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{ width: "100%", maxWidth: "400px" }}
                            disabled={loading}
                        >
                            <option value="Order">Order Issue</option>
                            <option value="Payment">Payment Issue</option>
                            <option value="Delivery">Delivery Issue</option>
                            <option value="Product Quality">Product Quality</option>
                            <option value="Service">Service Issue</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="text" style={{ 
                            display: "block", 
                            marginBottom: "0.5rem",
                            fontWeight: "bold"
                        }}>
                            Describe your issue:
                        </label>
                        <textarea
                            rows="6"
                            placeholder="Please provide detailed information about your complaint..."
                            style={{
                                width: "100%",
                                maxWidth: "400px",
                                padding: "1rem",
                                borderRadius: "0.5rem",
                                border: "1px solid rgba(255, 255, 255, 0.3)",
                                background: "rgba(255, 255, 255, 0.1)",
                                color: "#2d3436",
                                fontSize: "1rem",
                                resize: "vertical",
                                minHeight: "120px"
                            }}
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                setError(""); // Clear error when user starts typing
                            }}
                            disabled={loading}
                            required
                        />
                    </div>

                    {error && (
                        <div style={{
                            color: "#ef4444",
                            background: "rgba(239, 68, 68, 0.1)",
                            padding: "0.75rem",
                            borderRadius: "0.5rem",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            textAlign: "center"
                        }}>
                            {error}
                        </div>
                    )}

                    <button 
                        className="btn" 
                        type="submit" 
                        disabled={loading || !message.trim()}
                        style={{ 
                            maxWidth: "200px", 
                            margin: "0 auto",
                            opacity: loading || !message.trim() ? 0.6 : 1
                        }}
                    >
                        {loading ? "Submitting..." : "Submit Complaint"}
                    </button>
                </form>

                {/* User Info Display */}
                <div style={{
                    marginTop: "2rem",
                    padding: "1rem",
                    borderTop: "1px solid rgba(255, 255, 255, 0.2)"
                }}>
                    <h4 className="text" style={{ margin: "0 0 0.5rem 0" }}>
                        Complaint will be filed by:
                    </h4>
                    <p className="text" style={{ margin: "0 0 0.25rem 0", fontSize: "0.9rem" }}>
                        <strong>Name:</strong> {user.fullName}
                    </p>
                    <p className="text" style={{ margin: "0 0 0.25rem 0", fontSize: "0.9rem" }}>
                        <strong>Type:</strong> {user.type}
                    </p>
                    <p className="text" style={{ margin: 0, fontSize: "0.9rem" }}>
                        <strong>Email:</strong> {user.email}
                    </p>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div style={{ 
                marginTop: "2rem", 
                display: "flex", 
                gap: "1rem", 
                justifyContent: "center",
                flexWrap: "wrap"
            }}>
                <button 
                    className="switch-link" 
                    onClick={onUserData}
                    disabled={loading}
                >
                    Back to Dashboard
                </button>
                <button 
                    className="switch-link" 
                    onClick={onHome}
                    disabled={loading}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
