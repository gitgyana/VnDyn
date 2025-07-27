import React, { useState, useEffect } from "react";
import axios from "axios";

export default function VendorPortal({ user }) {
    const [resources, setResources] = useState([]);
    const [cart, setCart] = useState([]);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/resources`)
            .then(({ data }) => setResources(data))
            .catch(console.error);
    }, []);

    const addToCart = (item) => {
        if (!cart.find((c) => c._id === item._id)) {
            setCart([...cart, item]);
        }
    };

    const placeOrder = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/orders`, {
                vendorId: user._id,
                items: cart.map(({ _id }) => _id),
            });
            setMsg("Order placed successfully!");
            setCart([]);
        } catch (err) {
            console.error(err);
            setMsg("Failed to place order.");
        }
    };

    return (
        <div id="app">
            <h2>Browse &amp; Place Order</h2>

            <ul className="text">
                {resources.map((r) => (
                    <li key={r._id} style={{ marginBottom: "1rem" }}>
                        {r.name} – ₹{r.price}
                        <button
                            className="btn"
                            style={{ maxWidth: 120 }}
                            onClick={() => addToCart(r)}
                        >
                            Add
                        </button>
                    </li>
                ))}
            </ul>

            {cart.length > 0 && (
                <>
                    <h3>Selected Items</h3>
                    <ul className="text">
                        {cart.map((i) => (
                            <li key={i._id}>{i.name}</li>
                        ))}
                    </ul>
                    <button className="btn" onClick={placeOrder}>
                        Place Order
                    </button>
                </>
            )}

            {msg && <div id="msg">{msg}</div>}
        </div>
    );
}
