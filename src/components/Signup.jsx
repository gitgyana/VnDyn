import React, { useState } from "react";
import { userAPI } from "../mongoAPI";

export default function Signup({ selectedType, onSuccess, onHome, onLogin }) {
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { fullName, phone, email, password } = form;


        if (!fullName || !phone || !email || !password) {
            setError("Fill all fields!");
            return;
        }
        if (!/^\d{10,}$/.test(phone)) {
            setError("Invalid phone number (minimum 10 digits)");
            return;
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            setError("Invalid email format");
            return;  
        }
        if (password.length < 4) {
            setError("Password must be at least 4 characters");
            return;
        }

        setLoading(true);
        try {
            const userData = {
                fullName,
                phone,
                email,
                password,
                type: selectedType
            };

            const result = await userAPI.register(userData);
            
            if (result.success) {
                onSuccess(result.data, "Signup Successful!");
            }
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="app">
            <h2>
                Signup as <br />
                <span style={{ color: "#d6e3ab" }}>{selectedType}</span>
            </h2>
            <form className="mgn-aln-ctr" onSubmit={handleSubmit} autoComplete="off">
                <input
                    type="text"
                    id="fullName"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <input
                    type="tel"
                    id="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    pattern="\d{10,}"
                    disabled={loading}
                />
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
                <button
                    className="switch-link"
                    type="button" 
                    onClick={onLogin}
                    disabled={loading}
                >
                    Already have an account? Login
                </button>
            </form>
            <button 
                type="button" 
                className="switch-link" 
                onClick={onHome}
                disabled={loading}
            >
                Back
            </button>
            {error && <div className="error-msg">{error}</div>}
        </div>
    );
}
