import React, { useState } from "react";
import axios from "axios";

export default function ComplaintForm({ partyId, partyName, onSubmitted }) {
    const [category, setCategory] = useState("Order");
    const [message, setMessage] = useState("");
    const [err, setErr] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setErr("Please enter complaint details");
            return;
        }
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/complaints`, {
                partyId,
                partyName,
                category,
                message,
            });
            setMessage("");
            setErr("");
            onSubmitted?.();
        } catch (error) {
            console.error(error);
            setErr("Could not submit complaint.");
        }
    };

    return (
        <form onSubmit={submit} className="text" style={{ marginTop: "1.5rem" }}>
            <h3>Lodge a Complaint</h3>

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%", marginBottom: "1rem" }}
            >
                <option value="Order">Order Issue</option>
                <option value="Payment">Payment Issue</option>
                <option value="Delivery">Delivery Issue</option>
            </select>

            <textarea
                rows="4"
                placeholder="Describe your issue..."
                style={{ width: "100%", padding: "0.75rem" }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            {err && <p className="error-msg">{err}</p>}

            <button className="btn" style={{ maxWidth: 220 }}>
                Submit Complaint
            </button>
        </form>
    );
}
