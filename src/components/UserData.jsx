import React from "react";

export default function UserData({ user, onHome, onPortal }) {
    if (!user) return null;

    const { fullName, type, phone, email, msg } = user;

    const handlePortalNavigation = () => {
        if (type === "Street Vendor") {
            onPortal("vendor");
        } else if (type === "Retailer to Vendor") {
            onPortal("supplier");
        }
    };

    return (
        <div id="app">
            <div className="text" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                {msg && <div style={{ color: '#d6e3ab', marginBottom: '1rem', fontSize: '1.2rem' }}>{msg}</div>}

                <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Welcome, {fullName}!</h2>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    marginBottom: '2rem',
                    backdropFilter: 'blur(10px)'
                }}>
                    <table style={{
                        width: '100%',
                        fontSize: '1rem',
                        borderCollapse: 'collapse'
                    }}>
                        <tbody>
                        <tr style={{ marginBottom: '0.5rem' }}>
                            <td style={{ padding: '0.5rem 0', textAlign: 'left', fontWeight: 'bold' }}>Account Type:</td>
                            <td style={{ padding: '0.5rem 0', color: '#d6e3ab', fontWeight: 'bold' }}>{type}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '0.5rem 0', textAlign: 'left', fontWeight: 'bold' }}>Phone:</td>
                            <td style={{ padding: '0.5rem 0' }}>{phone}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '0.5rem 0', textAlign: 'left', fontWeight: 'bold' }}>Email:</td>
                            <td style={{ padding: '0.5rem 0' }}>{email}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Portal Navigation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <button
                        className="btn"
                        onClick={handlePortalNavigation}
                        style={{ maxWidth: '300px' }}
                    >
                        {type === "Street Vendor" ? "Go to Vendor Portal" : "Go to Supplier Portal"}
                    </button>

                    {/* Admin and Payment buttons - could be role-based in future */}
                    <button
                        className="btn"
                        onClick={() => onPortal("admin")}
                        style={{ maxWidth: '300px', background: 'rgba(220, 38, 38, 0.3)' }}
                    >
                        Admin Dashboard
                    </button>

                    <button
                        className="btn"
                        onClick={() => onPortal("payments")}
                        style={{ maxWidth: '300px', background: 'rgba(34, 197, 94, 0.3)' }}
                    >
                        Payment Processing
                    </button>
                </div>

                <button
                    type="button"
                    className="switch-link"
                    onClick={onHome}
                    style={{ marginTop: '2rem' }}
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
}