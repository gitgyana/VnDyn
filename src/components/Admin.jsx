import React, { useEffect, useState } from "react";
import { complaintAPI, resourceAPI, generateObjectId } from "../mongoAPI";

export default function Admin({ user, onHome, onUserData, onPayments }) {
    const [complaints, setComplaints] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("complaints"); // complaints, resources
    const [newResource, setNewResource] = useState({
        name: "",
        description: "",
        price: "",
        category: "Ingredients"
    });

    useEffect(() => {
        fetchComplaints();
        fetchResources();
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

    const fetchResources = async () => {
        try {
            const data = await resourceAPI.getAll();
            setResources(data);
        } catch (error) {
            console.error("Failed to load resources:", error);
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

    const handleResourceChange = (e) => {
        const { name, value } = e.target;
        setNewResource(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addResource = async (e) => {
        e.preventDefault();
        if (!newResource.name || !newResource.description || !newResource.price) {
            setMessage("Please fill all fields for the new resource");
            return;
        }

        try {
            const resourceData = {
                ...newResource,
                price: parseFloat(newResource.price),
                _id: generateObjectId()
            };

            await resourceAPI.create(resourceData);
            setMessage("Resource added successfully!");
            setNewResource({ name: "", description: "", price: "", category: "Ingredients" });
            fetchResources(); // Refresh the list
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Failed to add resource: " + error.message);
        }
    };

    if (loading) {
        return (
            <div id="app">
                <div className="text" style={{ textAlign: "center", padding: "2rem" }}>
                    Loading admin dashboard...
                </div>
            </div>
        );
    }

    return (
        <div id="app">
            <h2 className="text">Admin Dashboard - {user.fullName}</h2>

            {message && (
                <div style={{
                    background: "rgba(76, 222, 128, 0.2)",
                    color: "#4ade80",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    textAlign: "center",
                    border: "1px solid rgba(76, 222, 128, 0.3)"
                }}>
                    {message}
                </div>
            )}

            {/* Tab Navigation */}
            <div style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "2rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                paddingBottom: "1rem"
            }}>
                <button
                    className={activeTab === "complaints" ? "btn" : "switch-link"}
                    onClick={() => setActiveTab("complaints")}
                    style={{ maxWidth: "200px" }}
                >
                    Complaints ({complaints.filter(c => c.status === "pending").length})
                </button>
                <button
                    className={activeTab === "resources" ? "btn" : "switch-link"}
                    onClick={() => setActiveTab("resources")}
                    style={{ maxWidth: "200px" }}
                >
                    Manage Resources
                </button>
            </div>

            {/* Complaints Tab */}
            {activeTab === "complaints" && (
                <div>
                    <h3 className="text">Complaint Management</h3>
                    {complaints.length > 0 ? (
                        <div style={{ display: "grid", gap: "1rem" }}>
                            {complaints.map((complaint) => (
                                <div key={complaint._id} style={{
                                    background: "rgba(255, 255, 255, 0.1)",
                                    padding: "1.5rem",
                                    borderRadius: "0.5rem",
                                    border: "1px solid rgba(255, 255, 255, 0.2)"
                                }}>
                                    <div style={{ marginBottom: "1rem" }}>
                                        <h4 className="text" style={{ margin: "0 0 0.5rem 0" }}>
                                            {complaint.category} Complaint
                                        </h4>
                                        <p className="text" style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
                                            <strong>From:</strong> {complaint.partyName}
                                        </p>
                                        <p className="text" style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
                                            <strong>Date:</strong> {new Date(complaint.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text" style={{ margin: "0 0 1rem 0", fontSize: "0.9rem" }}>
                                            <strong>Message:</strong> {complaint.message}
                                        </p>
                                        <span style={{
                                            padding: "0.25rem 0.75rem",
                                            borderRadius: "1rem",
                                            fontSize: "0.8rem",
                                            fontWeight: "bold",
                                            background: complaint.status === "pending" ? 
                                                "rgba(234, 179, 8, 0.2)" : 
                                                "rgba(34, 197, 94, 0.2)",
                                            color: complaint.status === "pending" ? 
                                                "#eab308" : 
                                                "#22c55e"
                                        }}>
                                            {complaint.status.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    {complaint.status === "pending" && (
                                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                                            <button
                                                className="btn"
                                                onClick={() => resolveComplaint(complaint._id)}
                                                style={{ 
                                                    maxWidth: "120px", 
                                                    margin: 0,
                                                    background: "rgba(34, 197, 94, 0.8)"
                                                }}
                                            >
                                                Resolve
                                            </button>
                                            <button
                                                className="btn"
                                                onClick={() => deleteComplaint(complaint._id)}
                                                style={{ 
                                                    maxWidth: "100px", 
                                                    margin: 0,
                                                    background: "rgba(239, 68, 68, 0.8)"
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text" style={{ textAlign: "center", padding: "2rem" }}>
                            No complaints found.
                        </div>
                    )}
                </div>
            )}

            {/* Resources Tab */}
            {activeTab === "resources" && (
                <div>
                    <h3 className="text">Resource Management</h3>
                    
                    {/* Add New Resource Form */}
                    <div style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        padding: "1.5rem",
                        borderRadius: "0.5rem",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        marginBottom: "2rem"
                    }}>
                        <h4 className="text" style={{ margin: "0 0 1rem 0" }}>Add New Resource</h4>
                        <form onSubmit={addResource} style={{ display: "grid", gap: "1rem" }}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Resource Name"
                                value={newResource.name}
                                onChange={handleResourceChange}
                                required
                                style={{ maxWidth: "100%" }}
                            />
                            <input
                                type="text"
                                name="description"
                                placeholder="Description"
                                value={newResource.description}
                                onChange={handleResourceChange}
                                required
                                style={{ maxWidth: "100%" }}
                            />
                            <input
                                type="number"
                                name="price"
                                placeholder="Price (₹)"
                                value={newResource.price}
                                onChange={handleResourceChange}
                                required
                                min="0"
                                step="0.01"
                                style={{ maxWidth: "100%" }}
                            />
                            <select
                                name="category"
                                value={newResource.category}
                                onChange={handleResourceChange}
                                style={{ maxWidth: "100%" }}
                            >
                                <option value="Ingredients">Ingredients</option>
                                <option value="Packaging">Packaging</option>
                                <option value="Equipment">Equipment</option>
                                <option value="Supplies">Supplies</option>
                            </select>
                            <button 
                                type="submit" 
                                className="btn" 
                                style={{ maxWidth: "200px", margin: "0 auto" }}
                            >
                                Add Resource
                            </button>
                        </form>
                    </div>

                    {/* Existing Resources List */}
                    <h4 className="text">Existing Resources ({resources.length})</h4>
                    {resources.length > 0 ? (
                        <div style={{ display: "grid", gap: "1rem" }}>
                            {resources.map((resource) => (
                                <div key={resource._id} style={{
                                    background: "rgba(255, 255, 255, 0.1)",
                                    padding: "1rem",
                                    borderRadius: "0.5rem",
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <div>
                                        <h5 className="text" style={{ margin: "0 0 0.5rem 0" }}>
                                            {resource.name}
                                        </h5>
                                        <p className="text" style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
                                            {resource.description}
                                        </p>
                                        <p className="text" style={{ margin: 0, fontSize: "0.9rem" }}>
                                            <strong>₹{resource.price}</strong> | {resource.category}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text">No resources found.</p>
                    )}
                </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ 
                marginTop: "2rem", 
                display: "flex", 
                gap: "1rem", 
                justifyContent: "center",
                flexWrap: "wrap"
            }}>
                <button className="switch-link" onClick={onPayments}>
                    Payment Processing
                </button>
                <button className="switch-link" onClick={onUserData}>
                    Back to Dashboard
                </button>
                <button className="switch-link" onClick={onHome}>
                    Logout
                </button>
            </div>
        </div>
    );
}
