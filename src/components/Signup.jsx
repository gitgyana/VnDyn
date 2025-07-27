import React, { useState } from "react";

function openUserTab(data, msg) {
    // Use the userData page instead of a new tab
    // This will be handled by onSuccess
}

export default function Signup({ selectedType, onHome, onLogin, onSuccess }) {
    const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = e => setForm(f => ({ ...f, [e.target.id]: e.target.value }));

    const handleSubmit = e => {
        e.preventDefault();
        const { fullName, phone, email, password } = form;
        if (!fullName || !phone || !email || !password) return setError("Fill all fields!");
        if (!/^\d{10,}$/.test(phone)) return setError("Invalid phone number (min 10 digits)");
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) return setError("Invalid email format");
        if (password.length < 4) return setError("Password must be at least 4 characters");
        let users = JSON.parse(localStorage.getItem("users") || "{}");
        if (users[email] || users[phone]) return setError("Email or Phone already registered. Please login.");
        users[email] = users[phone] = { type: selectedType, ...form };
        localStorage.setItem("users", JSON.stringify(users));
        onSuccess({ type: selectedType, ...form }, "Signup Successful!");
    };

    return (
        <div id="app">
            <h2>Signup as <br /><span style={{ color: "#d6e3ab" }}>{selectedType}</span></h2>
            <form className="mgn-aln-ctr" onSubmit={handleSubmit} autoComplete="off">
                <input type="text" id="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
                <input type="tel" id="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required pattern="\d{10,}" />
                <input type="email" id="email" placeholder="Email" value={form.email} onChange={handleChange} required pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" />
                <input type="password" id="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                <button className="btn" type="submit">Sign Up</button>
                <button className="switch-link" type="button" onClick={onLogin}>Already have an account? Login</button>
            </form>
            <button type="button" className="switch-link" onClick={onHome}>Back</button>
            <div className="error-msg">{error}</div>
        </div>
    );
}
