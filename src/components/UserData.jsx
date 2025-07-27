import React from "react";

export default function UserData({ 
    user, 
    message, 
    onHome, 
    onVendorPortal, 
    onSupplierPortal, 
    onAdmin, 
    onPayments, 
    onComplaints 
}) {
    if (!user) return null;

    const { fullName, type, phone, email } = user;

    const handlePortalNavigation = () => {
        if (type === "Street Vendor") {
            onVendorPortal();
        } else if (type === "Retailer to Vendor") {
            onSupplierPortal();
        } else if (type === "Admin") {
            onAdmin();
        }
    };

    return (
        <div id="app">
            <div style={{
                background: "rgba(255, 255, 255, 0.1)",
                maxWidth: "400px",
                margin: "2rem auto",
                padding: "2rem",
                borderRadius: "1rem",
                textAlign: "center",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)"
            }}>
                {message && <div style={{ 
                    color: "#4ade80", 
                    marginBottom: "1rem", 
                    fontWeight: "bold" 
                }}>{message}</div>}
                
                <h2 style={{ color: "#fff", marginBottom: "1.5rem" }}>
                    Welcome, {fullName}!
                </h2>
                
                <table style={{ 
                    width: "100%", 
                    margin: "0 auto 2rem", 
                    fontSize: "1rem",
                    color: "#fff"
                }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: "0.5rem", textAlign: "left" }}>
                                <strong>Account Type:</strong>
                            </td>
                            <td style={{ 
                                padding: "0.5rem", 
                                color: "#d6e3ab", 
                                fontWeight: "bold",
                                textAlign: "right"
                            }}>
                                {type}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: "0.5rem", textAlign: "left" }}>
                                <strong>Phone:</strong>
                            </td>
                            <td style={{ padding: "0.5rem", textAlign: "right" }}>
                                {phone}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: "0.5rem", textAlign: "left" }}>
                                <strong>Email:</strong>
                            </td>
                            <td style={{ padding: "0.5rem", textAlign: "right" }}>
                                {email}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <button 
                        className="btn" 
                        onClick={handlePortalNavigation}
                        style={{ maxWidth: "300px", margin: "0 auto" }}
                    >
                        {type === "Street Vendor" && "Go to Vendor Portal"}
                        {type === "Retailer to Vendor" && "Go to Supplier Portal"}
                        {type === "Admin" && "Go to Admin Dashboard"}
                    </button>

                    {/* Additional navigation options */}
                    {(type === "Admin" || type === "Retailer to Vendor") && (
                        <button 
                            className="btn" 
                            onClick={onPayments}
                            style={{ maxWidth: "300px", margin: "0 auto" }}
                        >
                            Payment Processing
                        </button>
                    )}

                    <button 
                        className="btn" 
                        onClick={onComplaints}
                        style={{ maxWidth: "300px", margin: "0 auto" }}
                    >
                        File Complaint
                    </button>

                    {type === "Admin" && (
                        <button 
                            className="btn" 
                            onClick={onAdmin}
                            style={{ maxWidth: "300px", margin: "0 auto" }}
                        >
                            Manage Complaints
                        </button>
                    )}

                    <button 
                        type="button" 
                        className="switch-link" 
                        onClick={onHome}
                        style={{ 
                            marginTop: "1rem",
                            color: "#fff",
                            textDecoration: "underline"
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
