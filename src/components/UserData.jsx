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

    const { fullName, type, phone, email, address } = user;

    const handlePortalNavigation = () => {
        if (type === "Street Vendor") {
            onVendorPortal();
        } else if (type === "Retailer to Vendor") {
            onSupplierPortal();
        } else if (type === "Admin") {
            onAdmin();
        }
    };

    const getRoleColor = () => {
        switch(type) {
            case "Admin": return "#ef4444";
            case "Street Vendor": return "#4ade80";
            case "Retailer to Vendor": return "#60a5fa";
            default: return "#d6e3ab";
        }
    };

    const getRoleIcon = () => {
        switch(type) {
            case "Admin": return "👑";
            case "Street Vendor": return "🍜";
            case "Retailer to Vendor": return "📦";
            default: return "👤";
        }
    };

    return (
        <div id="app">
            <div style={{
                background: "rgba(255, 255, 255, 0.05)",
                maxWidth: "450px",
                margin: "2rem auto",
                padding: "2rem",
                borderRadius: "1rem",
                textAlign: "center",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
                {message && <div style={{
                    color: "#4ade80",
                    marginBottom: "1rem",
                    fontWeight: "bold",
                    background: "rgba(76, 222, 128, 0.1)",
                    padding: "0.75rem",
                    borderRadius: "0.5rem"
                }}>{message}</div>}

                <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${getRoleColor()}40, ${getRoleColor()}20)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    fontSize: "2.5rem",
                    border: `2px solid ${getRoleColor()}60`
                }}>
                    {getRoleIcon()}
                </div>

                <h2 style={{ color: "#fff", marginBottom: "1.5rem" }}>
                    Welcome, {fullName}!
                </h2>

                <table style={{
                    width: "100%",
                    margin: "0 auto 2rem",
                    fontSize: "1rem",
                    color: "#fff",
                    borderCollapse: "separate",
                    borderSpacing: "0 0.5rem"
                }}>
                    <tbody>
                    <tr>
                        <td style={{ padding: "0.5rem", textAlign: "left", opacity: 0.7 }}>
                            <strong>Account Type:</strong>
                        </td>
                        <td style={{
                            padding: "0.5rem",
                            color: getRoleColor(),
                            fontWeight: "bold",
                            textAlign: "right"
                        }}>
                            {type}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: "0.5rem", textAlign: "left", opacity: 0.7 }}>
                            <strong>Phone:</strong>
                        </td>
                        <td style={{ padding: "0.5rem", textAlign: "right" }}>
                            {phone}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: "0.5rem", textAlign: "left", opacity: 0.7 }}>
                            <strong>Email:</strong>
                        </td>
                        <td style={{ padding: "0.5rem", textAlign: "right" }}>
                            {email}
                        </td>
                    </tr>
                    {address && (
                        <>
                            <tr>
                                <td colSpan="2" style={{
                                    padding: "1rem 0.5rem 0.5rem",
                                    textAlign: "left",
                                    opacity: 0.7,
                                    borderTop: "1px solid rgba(255,255,255,0.1)"
                                }}>
                                    <strong>📍 Delivery Address:</strong>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2" style={{
                                    padding: "0.5rem",
                                    textAlign: "left",
                                    fontSize: "0.9rem",
                                    opacity: 0.9
                                }}>
                                    {address.street}, {address.city}, {address.state} - {address.pincode}
                                    {address.landmark && (
                                        <div style={{ marginTop: "0.25rem", opacity: 0.7, fontSize: "0.85rem" }}>
                                            Landmark: {address.landmark}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        </>
                    )}
                    </tbody>
                </table>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <button
                        className="btn"
                        onClick={handlePortalNavigation}
                        style={{
                            maxWidth: "300px",
                            margin: "0 auto",
                            background: `linear-gradient(135deg, ${getRoleColor()}40, ${getRoleColor()}20)`,
                            border: `1px solid ${getRoleColor()}60`
                        }}
                    >
                        {type === "Street Vendor" && "🍜 Go to Vendor Portal"}
                        {type === "Retailer to Vendor" && "📦 Go to Supplier Portal"}
                        {type === "Admin" && "👑 Go to Admin Dashboard"}
                    </button>

                    {/* Additional navigation options */}
                    {(type === "Admin" || type === "Retailer to Vendor") && (
                        <button
                            className="btn"
                            onClick={onPayments}
                            style={{ maxWidth: "300px", margin: "0 auto" }}
                        >
                            💳 Payment Processing
                        </button>
                    )}

                    <button
                        className="btn"
                        onClick={onComplaints}
                        style={{ maxWidth: "300px", margin: "0 auto" }}
                    >
                        📝 File Complaint
                    </button>

                    {type === "Admin" && (
                        <button
                            className="btn"
                            onClick={onAdmin}
                            style={{ maxWidth: "300px", margin: "0 auto" }}
                        >
                            ⚙️ Manage Complaints & Resources
                        </button>
                    )}

                    <button
                        type="button"
                        className="switch-link"
                        onClick={onHome}
                        style={{
                            marginTop: "1rem",
                            color: "rgba(255,255,255,0.6)",
                            textDecoration: "underline"
                        }}
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
