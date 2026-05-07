// All API calls go to the local Flask backend (http://localhost:3001)
// Run the backend first:  python server.py

const BASE = "http://localhost:3001/api";

const req = async (method, path, body = null) => {
    const opts = {
        method,
        headers: {"Content-Type": "application/json"},
    };
    if (body !== null) opts.body = JSON.stringify(body);
    const res = await fetch(`${BASE}${path}`, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
};

export const generateObjectId = () =>
    Date.now().toString(16) + Math.random().toString(36).substr(2, 9);


// ── Users ──────────────────────────────────────────────────────────────────
export const userAPI = {
    login: async (loginValue, password) => {
        return req("POST", "/users/login", {loginValue, password});
    },
    register: async (userData) => {
        return req("POST", "/users/register", userData);
    },
};


// ── Resources ──────────────────────────────────────────────────────────────
export const resourceAPI = {
    getAll: async () => {
        return req("GET", "/resources");
    },
    create: async (resourceData) => {
        return req("POST", "/resources", resourceData);
    },
    delete: async (id) => {
        return req("DELETE", `/resources/${id}`);
    },
};


// ── Orders ─────────────────────────────────────────────────────────────────
export const orderAPI = {
    create: async (orderData) => {
        return req("POST", "/orders", orderData);
    },
    getByStatus: async (status) => {
        return req("GET", `/orders/status/${status}`);
    },
    getByVendor: async (vendorId) => {
        return req("GET", `/orders/vendor/${encodeURIComponent(vendorId)}`);
    },
    updateStatus: async (orderId, status, extra = {}) => {
        return req("PATCH", `/orders/${orderId}/status`, {status, ...extra});
    },
};


// ── Payments ───────────────────────────────────────────────────────────────
export const paymentAPI = {
    getByStatus: async (status) => {
        return req("GET", `/payments/status/${status}`);
    },
    updateStatus: async (paymentId, status, extra = {}) => {
        return req("PATCH", `/payments/${paymentId}/status`, {status, ...extra});
    },
    processPayment: async (paymentId, paymentMethod, cardDetails = {}) => {
        return req("POST", `/payments/${paymentId}/process`, {
            paymentMethod,
            lastFour: cardDetails.lastFour || null,
            holderName: cardDetails.holderName || null,
        });
    },
};


// ── Complaints ─────────────────────────────────────────────────────────────
export const complaintAPI = {
    getAll: async () => {
        return req("GET", "/complaints");
    },
    submit: async (data) => {
        return req("POST", "/complaints", data);
    },
    resolve: async (id) => {
        return req("PATCH", `/complaints/${id}/resolve`, {});
    },
    delete: async (id) => {
        return req("DELETE", `/complaints/${id}`);
    },
};

export default {userAPI, resourceAPI, orderAPI, paymentAPI, complaintAPI, generateObjectId};
