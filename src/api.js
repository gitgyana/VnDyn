// MongoDB Atlas Data API
// All data is stored and retrieved from MongoDB Atlas

const ATLAS_BASE_URL = "https://ap-southeast-1.aws.data.mongodb-api.com/app/data-dkucxpj/endpoint/data/v1";
const API_KEY = "GdkdLnxcaBLaT7oQrZf0lCGpCLrFWqVJxeOX7tDNVJP6VwEeMlh8h9hCVfDnFkGH";
const DB_NAME = "vndyn";
const DATA_SOURCE = "VnDynCluster001";

const headers = {
    "Content-Type": "application/json",
    "api-key": API_KEY,
};

const req = async (action, collection, body = {}) => {
    const res = await fetch(`${ATLAS_BASE_URL}/action/${action}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            dataSource: DATA_SOURCE,
            database: DB_NAME,
            collection,
            ...body,
        }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed: ${res.status}`);
    }
    return res.json();
};

export const generateObjectId = () =>
    Date.now().toString(16) + Math.random().toString(36).substr(2, 9);

const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));

// ── Users ──────────────────────────────────────────────────────────────
export const userAPI = {
    register: async (userData) => {
        await delay();
        const check = await req("findOne", "users", {
            filter: {$or: [{email: userData.email}, {phone: userData.phone}]},
        });
        if (check.document) throw new Error("User already exists with this email or phone");
        const newUser = {_id: userData.email, ...userData, createdAt: new Date().toISOString()};
        await req("insertOne", "users", {document: newUser});
        return {success: true, data: newUser};
    },

    login: async (loginValue, password) => {
        await delay();
        const result = await req("findOne", "users", {
            filter: {$or: [{email: loginValue}, {phone: loginValue}], password},
        });
        if (!result.document) throw new Error("Invalid credentials");
        return {success: true, data: result.document};
    },

    getAll: async () => {
        await delay();
        const result = await req("find", "users", {filter: {}});
        return result.documents || [];
    },

    ensureDefaults: async () => {
        const defaults = [
            {
                _id: "admin@vndyn.com", email: "admin@vndyn.com", phone: "9999999999",
                fullName: "System Admin", password: "admin123", type: "Admin",
                address: {
                    street: "123 Admin Street",
                    city: "Mumbai",
                    state: "Maharashtra",
                    pincode: "400001",
                    landmark: "Near Central Station"
                },
                createdAt: new Date().toISOString(),
            },
            {
                _id: "vendor@test.com", email: "vendor@test.com", phone: "8888888888",
                fullName: "Test Vendor", password: "vendor123", type: "Street Vendor",
                address: {
                    street: "456 Vendor Road",
                    city: "Delhi",
                    state: "Delhi",
                    pincode: "110001",
                    landmark: "Chandni Chowk"
                },
                createdAt: new Date().toISOString(),
            },
            {
                _id: "supplier@test.com", email: "supplier@test.com", phone: "7777777777",
                fullName: "Test Supplier", password: "supplier123", type: "Retailer to Vendor",
                address: {
                    street: "789 Supply Lane",
                    city: "Bangalore",
                    state: "Karnataka",
                    pincode: "560001",
                    landmark: "Near Tech Park"
                },
                createdAt: new Date().toISOString(),
            },
        ];
        for (const u of defaults) {
            const exists = await req("findOne", "users", {filter: {_id: u._id}});
            if (!exists.document) await req("insertOne", "users", {document: u});
        }
    },
};

// ── Resources ──────────────────────────────────────────────────────────
export const resourceAPI = {
    getAll: async () => {
        await delay();
        const result = await req("find", "resources", {filter: {}, sort: {name: 1}});
        return result.documents || [];
    },

    create: async (resourceData) => {
        await delay();
        const newResource = {...resourceData, _id: generateObjectId(), createdAt: new Date().toISOString()};
        await req("insertOne", "resources", {document: newResource});
        return {success: true, data: newResource};
    },

    delete: async (id) => {
        await delay();
        await req("deleteOne", "resources", {filter: {_id: id}});
        return {success: true};
    },

    ensureDefaults: async () => {
        const count = await req("find", "resources", {filter: {}});
        if ((count.documents || []).length > 0) return;
        const defaults = [
            {
                _id: "res1",
                name: "Fresh Vegetables",
                description: "Daily fresh vegetables for street food preparation",
                price: 150,
                category: "Ingredients",
                createdAt: new Date().toISOString()
            },
            {
                _id: "res2",
                name: "Cooking Oil",
                description: "High quality cooking oil for frying",
                price: 120,
                category: "Ingredients",
                createdAt: new Date().toISOString()
            },
            {
                _id: "res3",
                name: "Paper Plates",
                description: "Eco-friendly disposable plates",
                price: 80,
                category: "Packaging",
                createdAt: new Date().toISOString()
            },
            {
                _id: "res4",
                name: "Napkins",
                description: "Quality paper napkins for customers",
                price: 50,
                category: "Packaging",
                createdAt: new Date().toISOString()
            },
        ];
        for (const r of defaults) await req("insertOne", "resources", {document: r});
    },
};

// ── Orders ─────────────────────────────────────────────────────────────
export const orderAPI = {
    create: async (orderData) => {
        await delay();
        const newOrder = {
            _id: generateObjectId(), ...orderData,
            status: "pending", createdAt: new Date().toISOString(),
        };
        await req("insertOne", "orders", {document: newOrder});
        const payment = {
            _id: generateObjectId(), orderId: newOrder._id,
            vendorName: orderData.vendorName, supplierName: "System Supplier",
            amount: orderData.totalAmount, status: "pending",
            paymentMethod: null, transactionId: null, paidAt: null,
            createdAt: new Date().toISOString(),
        };
        await req("insertOne", "payments", {document: payment});
        return {success: true, data: newOrder};
    },

    getByStatus: async (status) => {
        await delay();
        const result = await req("find", "orders", {
            filter: {status}, sort: {createdAt: -1},
        });
        return result.documents || [];
    },

    getByVendor: async (vendorId) => {
        await delay();
        const result = await req("find", "orders", {
            filter: {vendorId}, sort: {createdAt: -1},
        });
        return result.documents || [];
    },

    updateStatus: async (orderId, status, extra = {}) => {
        await delay();
        await req("updateOne", "orders", {
            filter: {_id: orderId},
            update: {$set: {status, updatedAt: new Date().toISOString(), ...extra}},
        });
        const result = await req("findOne", "orders", {filter: {_id: orderId}});
        return {success: true, data: result.document};
    },
};

// ── Payments ───────────────────────────────────────────────────────────
export const paymentAPI = {
    getByStatus: async (status) => {
        await delay();
        const result = await req("find", "payments", {
            filter: {status}, sort: {createdAt: -1},
        });
        return result.documents || [];
    },

    updateStatus: async (paymentId, status, extra = {}) => {
        await delay();
        await req("updateOne", "payments", {
            filter: {_id: paymentId},
            update: {$set: {status, updatedAt: new Date().toISOString(), ...extra}},
        });
        const result = await req("findOne", "payments", {filter: {_id: paymentId}});
        return {success: true, data: result.document};
    },

    processPayment: async (paymentId, paymentMethod, cardDetails = {}) => {
        const txId = "TXN" + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
        return paymentAPI.updateStatus(paymentId, "settled", {
            paymentMethod, transactionId: txId,
            paidAt: new Date().toISOString(),
            cardLastFour: cardDetails.lastFour || null,
            cardHolderName: cardDetails.holderName || null,
        });
    },
};

// ── Complaints ─────────────────────────────────────────────────────────
export const complaintAPI = {
    submit: async (data) => {
        await delay();
        const newComplaint = {
            _id: generateObjectId(), ...data,
            status: "pending", createdAt: new Date().toISOString(),
        };
        await req("insertOne", "complaints", {document: newComplaint});
        return {success: true, data: newComplaint};
    },

    getAll: async () => {
        await delay();
        const result = await req("find", "complaints", {filter: {}, sort: {createdAt: -1}});
        return result.documents || [];
    },

    resolve: async (id) => {
        await delay();
        await req("updateOne", "complaints", {
            filter: {_id: id},
            update: {$set: {status: "resolved", resolvedAt: new Date().toISOString()}},
        });
        return {success: true};
    },

    delete: async (id) => {
        await delay();
        await req("deleteOne", "complaints", {filter: {_id: id}});
        return {success: true};
    },
};

export default {userAPI, resourceAPI, orderAPI, paymentAPI, complaintAPI, generateObjectId};
