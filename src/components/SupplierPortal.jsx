import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SupplierPortal({ user }) {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [msg, setMsg] = useState("");

    const fetchOrders = () =>
        axios
            .get(`${process.env.REACT_APP_API_URL}/orders?supplier=${user._id}`)
            .then(({ data }) => setPendingOrders(data))
            .catch(console.error);

    const approveOrder = async (id) => {
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/orders/${id}`, {
                status: "Approved",
            });
            setMsg("Order approved & dispatched!");
            fetchOrders();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line
    }, []);

    return (
        <div id="app">
            <h2>Supplier – Approve &amp; Dispatch</h2>

            {pendingOrders.length ? (
                pendingOrders.map((o) => (
                    <div key={o._id} style={{ margin: "1.25rem 0" }}>
                        <p className="text">
                            <strong>Order #</strong>
                            {o._id} &nbsp; {o.items.length} items
                        </p>
                        <button
                            className="btn"
                            style={{ maxWidth: 180 }}
                            onClick={() => approveOrder(o._id)}
                        >
                            Approve &amp; Dispatch
                        </button>
                    </div>
                ))
            ) : (
                <p className="text">No orders awaiting approval.</p>
            )}

            {msg && <div id="msg">{msg}</div>}
        </div>
    );
}
