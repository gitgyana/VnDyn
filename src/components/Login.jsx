import React, { useState } from "react";

export default function Login({ onHome, onSignup, onSuccess }) {
    const [value, setValue] = useState("");
    const [pw, setPw] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[0-9]{10,15}$/;
        if (!value || !pw) return setError("Fill all fields!");
        const users = JSON.parse(localStorage.getItem("users") || "{}");
        let userKey = null;
        if (emailPattern.test(value)) {
            userKey = Object.keys(users).find(key => users[key].email === value);
        } else if (phonePattern.test(value)) {
            userKey = Object.keys(users).find(key => users[key].phone === value);
        } else {
            return setError("Enter a valid email or phone!");
        }
        const user = userKey ? users[userKey] : null;
        if (!user || user.password !== pw) return setError("Invalid credentials!");
        onSuccess({ ...user }, "Login Successful!");
    };

    return (
        <div id="app">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" id="login-value" placeholder="Email or Phone" value={value} onChange={e => setValue(e.target.value)} required />
                <input type="password" id="login-password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} required />
                <button className="btn" type="submit">Login</button>
                <button type="button" className="switch-link" onClick={onSignup}>Don't have an account? Sign up</button>
            </form>
            <button type="button" className="switch-link" onClick={onHome}>Back</button>
            <div className="error-msg">{error}</div>
        </div>
    );
}
