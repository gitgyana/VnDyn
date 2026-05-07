import React, { useState } from "react";

export default function PaymentModal({ payment, onClose, onSuccess }) {
    const [step, setStep] = useState("method"); // method, processing, success, failed
    const [paymentMethod, setPaymentMethod] = useState("");
    const [cardDetails, setCardDetails] = useState({
        number: "",
        holderName: "",
        expiry: "",
        cvv: "",
        upiId: ""
    });
    const [processingMessage, setProcessingMessage] = useState("");

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || "";
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(" ");
        }
        return v;
    };

    const simulatePayment = async () => {
        setStep("processing");

        const messages = [
            "Initializing secure connection...",
            "Verifying card details...",
            "Connecting to payment gateway...",
            "Processing transaction...",
            "Confirming payment..."
        ];

        for (let i = 0; i < messages.length; i++) {
            setProcessingMessage(messages[i]);
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        // Simulate 95% success rate
        const isSuccess = Math.random() > 0.05;

        if (isSuccess) {
            setStep("success");
            const lastFour = cardDetails.number.replace(/\s/g, "").slice(-4);
            onSuccess({
                paymentMethod,
                lastFour: paymentMethod === "card" ? lastFour : null,
                holderName: cardDetails.holderName
            });
        } else {
            setStep("failed");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        simulatePayment();
    };

    const getPaymentMethodIcon = () => {
        switch(paymentMethod) {
            case "card": return "💳";
            case "upi": return "📱";
            case "netbanking": return "🏦";
            case "cod": return "💵";
            default: return "💰";
        }
    };

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "1rem"
        }}>
            <div style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                borderRadius: "1.5rem",
                border: "1px solid rgba(255,255,255,0.1)",
                maxWidth: "500px",
                width: "100%",
                maxHeight: "90vh",
                overflow: "auto",
                padding: "2rem",
                boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
            }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
                        {step === "method" && "🔒"}
                        {step === "processing" && "⏳"}
                        {step === "success" && "✅"}
                        {step === "failed" && "❌"}
                    </div>
                    <h2 className="text" style={{ margin: 0, color: "#fff" }}>
                        {step === "method" && "Secure Payment"}
                        {step === "processing" && "Processing..."}
                        {step === "success" && "Payment Successful!"}
                        {step === "failed" && "Payment Failed"}
                    </h2>
                    {step === "method" && (
                        <p className="text" style={{ opacity: 0.7, marginTop: "0.5rem" }}>
                            Amount: <strong style={{ color: "#4ade80" }}>₹{payment?.amount}</strong>
                        </p>
                    )}
                </div>

                {/* Method Selection */}
                {step === "method" && (
                    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
                        <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1rem" }}>
                            {[
                                { id: "card", label: "Credit / Debit Card", icon: "💳" },
                                { id: "upi", label: "UPI Payment", icon: "📱" },
                                { id: "netbanking", label: "Net Banking", icon: "🏦" },
                                { id: "cod", label: "Cash on Delivery", icon: "💵" }
                            ].map((method) => (
                                <div
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                    style={{
                                        padding: "1rem",
                                        borderRadius: "0.75rem",
                                        border: paymentMethod === method.id
                                            ? "2px solid #4ade80"
                                            : "1px solid rgba(255,255,255,0.1)",
                                        background: paymentMethod === method.id
                                            ? "rgba(76, 222, 128, 0.1)"
                                            : "rgba(255,255,255,0.05)",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "1rem",
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    <span style={{ fontSize: "1.5rem" }}>{method.icon}</span>
                                    <span style={{ color: "#fff", fontWeight: "500" }}>
                                        {method.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Card Details Form */}
                        {paymentMethod === "card" && (
                            <div style={{ display: "grid", gap: "1rem", animation: "fadeIn 0.3s" }}>
                                <input
                                    type="text"
                                    name="number"
                                    placeholder="Card Number (e.g., 4111 1111 1111 1111)"
                                    value={cardDetails.number}
                                    onChange={(e) => setCardDetails({
                                        ...cardDetails,
                                        number: formatCardNumber(e.target.value)
                                    })}
                                    maxLength="19"
                                    required
                                    style={{
                                        background: "rgba(255,255,255,0.1)",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        color: "#fff",
                                        padding: "1rem",
                                        borderRadius: "0.75rem",
                                        fontSize: "1rem"
                                    }}
                                />
                                <input
                                    type="text"
                                    name="holderName"
                                    placeholder="Card Holder Name"
                                    value={cardDetails.holderName}
                                    onChange={handleCardChange}
                                    required
                                    style={{
                                        background: "rgba(255,255,255,0.1)",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        color: "#fff",
                                        padding: "1rem",
                                        borderRadius: "0.75rem",
                                        fontSize: "1rem"
                                    }}
                                />
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <input
                                        type="text"
                                        name="expiry"
                                        placeholder="MM/YY"
                                        value={cardDetails.expiry}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/\D/g, "");
                                            if (value.length >= 2) {
                                                value = value.slice(0, 2) + "/" + value.slice(2, 4);
                                            }
                                            setCardDetails({ ...cardDetails, expiry: value });
                                        }}
                                        maxLength="5"
                                        required
                                        style={{
                                            background: "rgba(255,255,255,0.1)",
                                            border: "1px solid rgba(255,255,255,0.2)",
                                            color: "#fff",
                                            padding: "1rem",
                                            borderRadius: "0.75rem",
                                            fontSize: "1rem"
                                        }}
                                    />
                                    <input
                                        type="password"
                                        name="cvv"
                                        placeholder="CVV"
                                        value={cardDetails.cvv}
                                        onChange={(e) => setCardDetails({
                                            ...cardDetails,
                                            cvv: e.target.value.replace(/\D/g, "").slice(0, 3)
                                        })}
                                        maxLength="3"
                                        required
                                        style={{
                                            background: "rgba(255,255,255,0.1)",
                                            border: "1px solid rgba(255,255,255,0.2)",
                                            color: "#fff",
                                            padding: "1rem",
                                            borderRadius: "0.75rem",
                                            fontSize: "1rem"
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* UPI Form */}
                        {paymentMethod === "upi" && (
                            <div style={{ animation: "fadeIn 0.3s" }}>
                                <input
                                    type="text"
                                    name="upiId"
                                    placeholder="UPI ID (e.g., name@upi)"
                                    value={cardDetails.upiId}
                                    onChange={handleCardChange}
                                    required
                                    style={{
                                        background: "rgba(255,255,255,0.1)",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        color: "#fff",
                                        padding: "1rem",
                                        borderRadius: "0.75rem",
                                        fontSize: "1rem",
                                        width: "100%"
                                    }}
                                />
                                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                                    You will receive a payment request on your UPI app
                                </p>
                            </div>
                        )}

                        {/* Net Banking */}
                        {paymentMethod === "netbanking" && (
                            <div style={{
                                padding: "1.5rem",
                                background: "rgba(255,255,255,0.05)",
                                borderRadius: "0.75rem",
                                textAlign: "center",
                                animation: "fadeIn 0.3s"
                            }}>
                                <p className="text" style={{ margin: 0 }}>
                                    You will be redirected to your bank's secure login page
                                </p>
                            </div>
                        )}

                        {/* COD */}
                        {paymentMethod === "cod" && (
                            <div style={{
                                padding: "1.5rem",
                                background: "rgba(255,255,255,0.05)",
                                borderRadius: "0.75rem",
                                textAlign: "center",
                                animation: "fadeIn 0.3s"
                            }}>
                                <p className="text" style={{ margin: 0 }}>
                                    Pay <strong>₹{payment?.amount}</strong> when your order is delivered
                                </p>
                                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                                    Additional ₹50 COD charges may apply
                                </p>
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                            <button
                                type="button"
                                className="switch-link"
                                onClick={onClose}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn"
                                disabled={!paymentMethod}
                                style={{
                                    flex: 2,
                                    margin: 0,
                                    opacity: !paymentMethod ? 0.5 : 1,
                                    background: "linear-gradient(45deg, #00d4ff, #00ff95)"
                                }}
                            >
                                Pay ₹{payment?.amount}
                            </button>
                        </div>

                        <div style={{
                            textAlign: "center",
                            marginTop: "1rem",
                            padding: "0.75rem",
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: "0.5rem"
                        }}>
                            <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
                                🔒 Secured by 256-bit SSL Encryption
                            </p>
                        </div>
                    </form>
                )}

                {/* Processing */}
                {step === "processing" && (
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                        <div style={{
                            width: "60px",
                            height: "60px",
                            border: "4px solid rgba(255,255,255,0.1)",
                            borderTop: "4px solid #4ade80",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                            margin: "0 auto 1.5rem"
                        }} />
                        <p className="text" style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                            {processingMessage}
                        </p>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
                            Please do not close this window
                        </p>
                    </div>
                )}

                {/* Success */}
                {step === "success" && (
                    <div style={{ textAlign: "center", padding: "1rem" }}>
                        <div style={{
                            width: "80px",
                            height: "80px",
                            background: "rgba(76, 222, 128, 0.2)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 1.5rem",
                            fontSize: "2.5rem"
                        }}>
                            ✓
                        </div>
                        <h3 className="text" style={{ color: "#4ade80", marginBottom: "1rem" }}>
                            Payment Completed!
                        </h3>
                        <div style={{
                            background: "rgba(255,255,255,0.05)",
                            padding: "1.5rem",
                            borderRadius: "0.75rem",
                            marginBottom: "1.5rem"
                        }}>
                            <p className="text" style={{ margin: "0 0 0.5rem 0" }}>
                                <strong>Amount Paid:</strong> ₹{payment?.amount}
                            </p>
                            <p className="text" style={{ margin: "0 0 0.5rem 0" }}>
                                <strong>Method:</strong> {getPaymentMethodIcon()} {paymentMethod?.toUpperCase()}
                            </p>
                            <p className="text" style={{ margin: 0, fontSize: "0.9rem", opacity: 0.7 }}>
                                Transaction ID: TXN{Date.now()}
                            </p>
                        </div>
                        <button className="btn" onClick={onClose} style={{ margin: 0 }}>
                            Continue
                        </button>
                    </div>
                )}

                {/* Failed */}
                {step === "failed" && (
                    <div style={{ textAlign: "center", padding: "1rem" }}>
                        <div style={{
                            width: "80px",
                            height: "80px",
                            background: "rgba(239, 68, 68, 0.2)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 1.5rem",
                            fontSize: "2.5rem"
                        }}>
                            ✕
                        </div>
                        <h3 className="text" style={{ color: "#ef4444", marginBottom: "1rem" }}>
                            Payment Failed
                        </h3>
                        <p className="text" style={{ marginBottom: "1.5rem", opacity: 0.8 }}>
                            Something went wrong. Please try again or use a different payment method.
                        </p>
                        <div style={{ display: "flex", gap: "1rem" }}>
                            <button
                                className="switch-link"
                                onClick={onClose}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn"
                                onClick={() => setStep("method")}
                                style={{
                                    flex: 2,
                                    margin: 0,
                                    background: "rgba(239, 68, 68, 0.8)"
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
