import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentProcessing() {
    const [payments, setPayments] = useState([]);
    const [msg, setMsg] = useState("");

    const fetchPayments = () =>
        axios
            .get(`${process.env.REACT_APP_API_URL}/payments?status=Pending`)
            .then(({ data }) => setPayments(data))
            .catch(console.error);

    const settle = async (id) => {
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/payments/${id}`, {
                status: "Settled",
            });
            setMsg("Payment settled.");
            fetchPayments();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <div id="app">
            <h2>Payment Processing</h2>

            {payments.length ? (
                <table className="text" style={{ width: "100%" }}>
                    <thead>
                    <tr>
                        <th>Order</th>
                        <th>Vendor</th>
                        <th>Amount</th>
                        <th />
                    </tr>
                    </thead>
                    <tbody>
                    {payments.map((p) => (
                        <tr key={p._id}>
                            <td>{p.orderId}</td>
                            <td>{p.vendorName}</td>
                            <td>₹{p.amount}</td>
                            <td>
                                <button
                                    className="btn"
                                    style={{ maxWidth: 140 }}
                                    onClick={() => settle(p._id)}
                                >
                                    Release
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text">No payments pending.</p>
            )}

            {msg && <div id="msg">{msg}</div>}
        </div>
    );
}
