import React, { useState } from "react";
import { userAPI } from "../mongoAPI";

export default function Signup({ selectedType, onSuccess, onHome, onLogin }) {
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        pincode: "",
        landmark: ""
    });

    const [userType, setUserType] = useState(selectedType || "Street Vendor");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1 = basic info, 2 = address

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
        setError("");
    };

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
        setError("");
    };

    const validateStep1 = () => {
        const { fullName, phone, email, password, confirmPassword } = form;

        if (!fullName || !phone || !email || !password || !confirmPassword) {
            setError("Fill all fields!");
            return false;
        }
        if (!/^\d{10,}$/.test(phone)) {
            setError("Invalid phone number (minimum 10 digits)");
            return false;
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            setError("Invalid email format");
            return false;
        }
        if (password.length < 4) {
            setError("Password must be at least 4 characters");
            return false;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!address.street || !address.city || !address.state || !address.pincode) {
            setError("Please fill all required address fields!");
            return false;
        }
        if (!/^\d{6}$/.test(address.pincode)) {
            setError("Invalid pincode (6 digits required)");
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
            setError("");
        }
    };

    const handleBack = () => {
        setStep(1);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep2()) return;

        setLoading(true);
        try {
            const userData = {
                fullName: form.fullName,
                phone: form.phone,
                email: form.email,
                password: form.password,
                type: userType,
                address: address
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

    const userTypes = [
        { value: "Street Vendor", label: "Street Vendor", desc: "Buy resources for your food business" },
        { value: "Retailer to Vendor", label: "Supplier / Retailer", desc: "Sell resources to vendors" },
        { value: "Admin", label: "Administrator", desc: "Manage platform operations" }
    ];

    return (
        <div id="app">
            <h2>
                Signup as <br />
                <span style={{ color: "#d6e3ab" }}>{userType}</span>
            </h2>

            {/* Progress Indicator */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginBottom: "2rem"
            }}>
                <div style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "2rem",
                    background: step >= 1 ? "rgba(76, 222, 128, 0.3)" : "rgba(255,255,255,0.1)",
                    color: step >= 1 ? "#4ade80" : "#fff",
                    fontSize: "0.85rem",
                    fontWeight: "bold"
                }}>
                    1. Basic Info
                </div>
                <div style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "2rem",
                    background: step >= 2 ? "rgba(76, 222, 128, 0.3)" : "rgba(255,255,255,0.1)",
                    color: step >= 2 ? "#4ade80" : "#fff",
                    fontSize: "0.85rem",
                    fontWeight: "bold"
                }}>
                    2. Address
                </div>
            </div>

            <form className="mgn-aln-ctr" onSubmit={handleSubmit} autoComplete="off">
                {step === 1 && (
                    <>
                        {/* User Type Selection */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label className="text" style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontWeight: "bold",
                                textAlign: "left"
                            }}>
                                Select Account Type:
                            </label>
                            <div style={{ display: "grid", gap: "0.75rem" }}>
                                {userTypes.map((type) => (
                                    <div
                                        key={type.value}
                                        onClick={() => setUserType(type.value)}
                                        style={{
                                            padding: "1rem",
                                            borderRadius: "0.75rem",
                                            border: userType === type.value
                                                ? "2px solid #4ade80"
                                                : "1px solid rgba(255,255,255,0.2)",
                                            background: userType === type.value
                                                ? "rgba(76, 222, 128, 0.1)"
                                                : "rgba(255,255,255,0.05)",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease"
                                        }}
                                    >
                                        <div style={{
                                            fontWeight: "bold",
                                            color: userType === type.value ? "#4ade80" : "#fff",
                                            marginBottom: "0.25rem"
                                        }}>
                                            {type.label}
                                        </div>
                                        <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>
                                            {type.desc}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

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
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />

                        <button
                            type="button"
                            className="btn"
                            onClick={handleNext}
                            disabled={loading}
                        >
                            Next: Add Address
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div style={{ textAlign: "left", marginBottom: "1rem" }}>
                            <h3 className="text" style={{ margin: "0 0 0.5rem 0" }}>
                                Delivery Address
                            </h3>
                            <p className="text" style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8 }}>
                                Where should orders be delivered?
                            </p>
                        </div>

                        <input
                            type="text"
                            name="street"
                            placeholder="Street Address *"
                            value={address.street}
                            onChange={handleAddressChange}
                            required
                            disabled={loading}
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="City *"
                            value={address.city}
                            onChange={handleAddressChange}
                            required
                            disabled={loading}
                        />
                        <input
                            type="text"
                            name="state"
                            placeholder="State *"
                            value={address.state}
                            onChange={handleAddressChange}
                            required
                            disabled={loading}
                        />
                        <input
                            type="text"
                            name="pincode"
                            placeholder="Pincode (6 digits) *"
                            value={address.pincode}
                            onChange={handleAddressChange}
                            required
                            pattern="\d{6}"
                            disabled={loading}
                        />
                        <input
                            type="text"
                            name="landmark"
                            placeholder="Landmark (Optional)"
                            value={address.landmark}
                            onChange={handleAddressChange}
                            disabled={loading}
                        />

                        <div style={{
                            background: "rgba(255,255,255,0.05)",
                            padding: "1rem",
                            borderRadius: "0.75rem",
                            marginBottom: "1rem"
                        }}>
                            <p className="text" style={{ margin: 0, fontSize: "0.85rem" }}>
                                <strong>Account Type:</strong> {userType}
                            </p>
                            <p className="text" style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem" }}>
                                <strong>Email:</strong> {form.email}
                            </p>
                        </div>

                        <div style={{ display: "flex", gap: "1rem" }}>
                            <button
                                type="button"
                                className="switch-link"
                                onClick={handleBack}
                                disabled={loading}
                                style={{ flex: 1 }}
                            >
                                ← Back
                            </button>
                            <button
                                className="btn"
                                type="submit"
                                disabled={loading}
                                style={{ flex: 2, margin: 0 }}
                            >
                                {loading ? "Signing Up..." : "Complete Sign Up"}
                            </button>
                        </div>
                    </>
                )}

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
                Back to Home
            </button>

            {error && <div className="error-msg">{error}</div>}
        </div>
    );
}
