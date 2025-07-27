import React, { useEffect, useState } from "react";
import { complaintAPI } from "../mongoAPI";

export default function Admin({ onHome, onBack }) {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const data = await complaintAPI.getAll();
            setComplaints(data);
        } catch (error) {
            setMessage("Failed to load complaints: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const resolveComplaint = async (complaintId) => {
        try {
            await complaintAPI.resolve(complaintId);
            setMessage("Complaint resolved successfully!");
            setTimeout(() => setMessage(""), 3000);
            fetchComplaints(); // Refresh the list
        } catch (error) {
            setMessage("Failed to resolve complaint: " + error.message);
        }
    };

    const deleteComplaint = async (complaintId) => {
        if (window.confirm("Are you sure you want to delete this complaint?")) {
            try {
                await complaintAPI.delete(complaintId);
                setMessage("Complaint deleted successfully!");
                setTimeout(() => setMessage(""), 3000);
                fetchComplaints(); // Refresh the list
            } catch (error) {
                setMessage("Failed to delete complaint: " + error.message);
            }
        }
    };

    if (loading) {
        return (
            <div id="app">
                <div className="text" style={{ textAlign: 'center' }}>
                    Loading complaints...
                </div>
            </div>
        );
    }

    return (
        <div id="app">
            <h2 className="text">Admin Dashboard - Complaint Management</h2>

            <div className="text" style={{ marginBottom: '2rem' }}>
                {complaints.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '2rem' }}>
                        No complaints found.
                    </p>
                ) : (
                    <>
                        <div style={{ marginBottom: '1rem' }}>
                            <strong>Total Complaints: {complaints.length}</strong>
                            <br />
                            <small>
                                Pending: {complaints.filter(c => c.status === 'pending').length} |
                                Resolved: {complaints.filter(c => c.status === 'resolved').length}
                            </small>
                        </div>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {complaints.map((complaint) => (
                                <div key={complaint._id} style={{
                                    background: complaint.status === 'resolved'
                                        ? 'rgba(34, 197, 94, 0.1)'
                                        : 'rgba(255, 255, 255, 0.1)',
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    backdropFilter: 'blur(10px)',
                                    border: complaint.status === 'pending'
                                        ? '1px solid rgba(220, 38, 38, 0.3)'
                                        : '1px solid rgba(34, 197, 94, 0.3)'
                                }}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '1rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <div>
                                            <strong>Complainant:</strong><br />
                                            {complaint.partyName}
                                        </div>
                                        <div>
                                            <strong>Category:</strong><br />
                                            <span style={{ color: '#d6e3ab' }}>{complaint.category}</span>
                                        </div>
                                        <div>
                                            <strong>Status:</strong><br />
                                            <span style={{
                                                color: complaint.status === 'resolved' ? '#22c55e' : '#dc2626',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase'
                                            }}>
                        {complaint.status}
                      </span>
                                        </div>
                                        <div>
                                            <strong>Date:</strong><br />
                                            {new Date(complaint.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <strong>Description:</strong><br />
                                        <div style={{
                                            background: 'rgba(0, 0, 0, 0.2)',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            marginTop: '0.5rem',
                                            fontStyle: 'italic'
                                        }}>
                                            {complaint.message}
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                        flexWrap: 'wrap',
                                        justifyContent: 'flex-end'
                                    }}>
                                        {complaint.status === 'pending' && (
                                            <button
                                                className="btn"
                                                onClick={() => resolveComplaint(complaint._id)}
                                                style={{
                                                    maxWidth: '140px',
                                                    padding: '0.5rem',
                                                    background: 'rgba(34, 197, 94, 0.3)'
                                                }}
                                            >
                                                Mark Resolved
                                            </button>
                                        )}
                                        <button
                                            className="btn"
                                            onClick={() => deleteComplaint(complaint._id)}
                                            style={{
                                                maxWidth: '100px',
                                                padding: '0.5rem',
                                                background: 'rgba(220, 38, 38, 0.3)'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {message && (
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: message.includes('Failed') ? 'rgba(220, 38, 38, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                    color: '#fff'
                }}>
                    {message}
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                <button
                    type="button"
                    className="switch-link"
                    onClick={onBack}
                >
                    ← Back to Dashboard
                </button>
                <button
                    type="button"
                    className="switch-link"
                    onClick={onHome}
                >
                    Home
                </button>
            </div>
        </div>
    );
}