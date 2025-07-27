import React, { useState } from "react";
import { userAPI } from "../mongoAPI";

export default function Login({ onSuccess, onSignup, onHome }) {
    const [loginValue, setLoginValue] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const value = loginValue.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[0-9]{10,15}$/;

        // Validation
        if (!value || !password) {
            setError("Fill all fields!");
            return;
        }

        if (!emailPattern.test(value) && !phonePattern.test(value)) {
            setError("Enter a valid email or phone number!");
            return;
        }

        setLoading(true);
        try {
            const result = await userAPI.login(value, password);
            if (result.success) {
                onSuccess(result.data);
            }
        } catch (err) {
            setError(err.message || "Invalid credentials!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="app">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Email or Phone"
                    value={loginValue}
                    onChange={(e) => {
                        setLoginValue(e.target.value);
                        setError(""); // Clear error when user starts typing
                    }}
                    required
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError(""); // Clear error when user starts typing
                    }}
                    required
                    disabled={loading}
                />
                <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
                <button
                    type="button"
                    className="switch-link"
                    onClick={onSignup}
                    disabled={loading}
                >
                    Don't have an account? Sign up
                </button>
            </form>
            <button
                type="button"
                className="switch-link"
                onClick={onHome}
                disabled={loading}
            >
                ← Back
            </button>
            {error && <div className="error-msg">{error}</div>}
        </div>
    );
}