import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMsg, setStatusMsg] = useState("");

    const fetchComplaints = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_URL}/complaints`
            );
            setComplaints(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resolveComplaint = async (id) => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/complaints/${id}/resolve`
            );
            setStatusMsg("Complaint resolved!");
            fetchComplaints();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchComplaints();
        // eslint-disable-next-line
    }, []);

    return (
        <div id="app">
            <h1>Admin Dashboard</h1>

            {loading ? (
                <p className="text">Loading…</p>
            ) : complaints.length ? (
                <table className="text" style={{ width: "100%" }}>
                    <thead>
                    <tr>
                        <th>Vendor / Supplier</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th />
                    </tr>
                    </thead>
                    <tbody>
                    {complaints.map((c) => (
                        <tr key={c._id}>
                            <td>{c.partyName}</td>
                            <td>{c.category}</td>
                            <td>{c.message}</td>
                            <td>{c.status}</td>
                            <td>
                                {c.status !== "Resolved" && (
                                    <button
                                        className="btn"
                                        style={{ maxWidth: 160 }}
                                        onClick={() => resolveComplaint(c._id)}
                                    >
                                        Mark Resolved
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text">No complaints found.</p>
            )}

            {statusMsg && <div id="msg">{statusMsg}</div>}
        </div>
    );
}
