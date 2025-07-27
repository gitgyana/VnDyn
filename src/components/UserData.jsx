import React from "react";

export default function UserData({ user, onHome }) {
    if (!user) return null;
    const { fullName, type, phone, email, msg } = user;

    return (
        <div id="app">
            <div style={{
                background: "white",
                maxWidth: 350,
                margin: "3rem auto",
                padding: "32px 24px",
                borderRadius: 13,
                boxShadow: "0 5px 24px rgba(0,0,0,0.13)",
                textAlign: "center",
            }}>
                <div className="title-msg">{msg}</div>
                <h2>{fullName}</h2>
                <table style={{ margin: "0 auto", fontSize: "1.07rem" }}>
                    <tbody>
                    <tr><td>Account Type</td><td style={{ color: "#6366f1", fontWeight: "bold" }}>{type}</td></tr>
                    <tr><td>Phone</td><td>{phone}</td></tr>
                    <tr><td>Email</td><td>{email}</td></tr>
                    </tbody>
                </table>
                <button type="button" className="btn" style={{ marginTop: 16 }} onClick={onHome}>Back to Home</button>
            </div>
        </div>
    );
}
