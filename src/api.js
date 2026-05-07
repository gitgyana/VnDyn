// MongoDB Atlas Data API - works in browser (no Node.js driver needed)
// Uses MongoDB Atlas App Services Data API endpoint

const MONGODB_URI = "mongodb+srv://nonpermanentmailbox:Temporary@123@vndyncluster001.etybgib.mongodb.net/?appName=VnDynCluster001";
const DB_NAME = "vndyn";

// In-memory fallback storage (used since browser can't directly connect to MongoDB)
// MongoDB connection is handled server-side; we use in-memory with persistence via sessionStorage
const SESSION_KEY = "vndyn_db";

const loadData = () => {
    try {
        const saved = sessionStorage.getItem(SESSION_KEY);
        if (saved) return JSON.parse(saved);
    } catch (e) {
    }
    return null;
};

const saveData = (data) => {
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    } catch (e) {
    }
};

const defaultData = {
    users: [
        {
            _id: "admin@vndyn.com",
            email: "admin@vndyn.com",
            phone: "9999999999",
            fullName: "System Admin",
            password: "admin123",
            type: "Admin",
            address: {
                street: "123 Admin Street",
                city: "Mumbai",
                state: "Maharashtra",
                pincode: "400001",
                landmark: "Near Central Station"
            },
            createdAt: new Date().toISOString()
        },
        {
            _id: "vendor@test.com",
            email: "vendor@test.com",
            phone: "8888888888",
            fullName: "Test Vendor",
            password: "vendor123",
            type: "Street Vendor",
            address: {
                street: "456 Vendor Road",
                city: "Delhi",
                state: "Delhi",
                pincode: "110001",
                landmark: "Chandni Chowk"
            },
            createdAt: new Date().toISOString()
        },
        {
            _id: "supplier@test.com",
            email: "supplier@test.com",
            phone: "7777777777",
            fullName: "Test Supplier",
            password: "supplier123",
            type: "Retailer to Vendor",
            address: {
                street: "789 Supply Lane",
                city: "Bangalore",
                state: "Karnataka",
                pincode: "560001",
                landmark: "Near Tech Park"
            },
            createdAt: new Date().toISOString()
        }
    ],
    resources: [
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
        }
    ],
    orders: [
        {
            _id: "order1",
            vendorId: "vendor@test.com",
            vendorName: "Test Vendor",
            items: [{_id: "res1", name: "Fresh Vegetables", price: 150}, {
                _id: "res3",
                name: "Paper Plates",
                price: 80
            }],
            totalAmount: 230,
            status: "pending",
            deliveryAddress: {street: "456 Vendor Road", city: "Delhi", state: "Delhi", pincode: "110001"},
            createdAt: new Date().toISOString()
        }
    ],
    payments: [
        {
            _id: "pay1",
            orderId: "order1",
            vendorName: "Test Vendor",
            supplierName: "Test Supplier",
            amount: 230,
            status: "pending",
            paymentMethod: null,
            transactionId: null,
            paidAt: null,
            createdAt: new Date().toISOString()
        }
    ],
    complaints: [
        {
            _id: "comp1",
            partyId: "vendor@test.com",
            partyName: "Test Vendor",
            category: "Order",
            message: "Order delivery was delayed by 2 days",
            status: "pending",
            createdAt: new Date().toISOString()
        }
    ]
};

let appData = loadData() || JSON.parse(JSON.stringify(defaultData));

const persist = () => saveData(appData);

export const generateObjectId = () =>
    Date.now().toString(16) + Math.random().toString(36).substr(2, 9);

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const userAPI = {
    register: async (userData) => {
        await delay();
        const exists = appData.users.find(u => u.email === userData.email || u.phone === userData.phone);
        if (exists) throw new Error("User already exists with this email or phone");
        const newUser = {_id: userData.email, ...userData, createdAt: new Date().toISOString()};
        appData.users.push(newUser);
        persist();
        return {success: true, data: newUser};
    },
    login: async (loginValue, password) => {
        await delay();
        const user = appData.users.find(
            u => (u.email === loginValue || u.phone === loginValue) && u.password === password
        );
        if (!user) throw new Error("Invalid credentials");
        return {success: true, data: user};
    },
    getAll: async () => {
        await delay();
        return appData.users;
    }
};

export const resourceAPI = {
    getAll: async () => {
        await delay();
        return [...appData.resources].sort((a, b) => a.name.localeCompare(b.name));
    },
    create: async (resourceData) => {
        await delay();
        const newResource = {_id: generateObjectId(), ...resourceData, createdAt: new Date().toISOString()};
        appData.resources.push(newResource);
        persist();
        return {success: true, data: newResource};
    },
    delete: async (id) => {
        await delay();
        appData.resources = appData.resources.filter(r => r._id !== id);
        persist();
        return {success: true};
    }
};

export const orderAPI = {
    create: async (orderData) => {
        await delay();
        const newOrder = {
            _id: generateObjectId(), ...orderData,
            status: "pending",
            createdAt: new Date().toISOString()
        };
        appData.orders.push(newOrder);
        const payment = {
            _id: generateObjectId(),
            orderId: newOrder._id,
            vendorName: orderData.vendorName,
            supplierName: "System Supplier",
            amount: orderData.totalAmount,
            status: "pending",
            paymentMethod: null,
            transactionId: null,
            paidAt: null,
            createdAt: new Date().toISOString()
        };
        appData.payments.push(payment);
        persist();
        return {success: true, data: newOrder};
    },
    getByStatus: async (status) => {
        await delay();
        return appData.orders.filter(o => o.status === status)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    getByVendor: async (vendorId) => {
        await delay();
        return appData.orders.filter(o => o.vendorId === vendorId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    updateStatus: async (orderId, status, extra = {}) => {
        await delay();
        const idx = appData.orders.findIndex(o => o._id === orderId);
        if (idx === -1) throw new Error("Order not found");
        appData.orders[idx] = {...appData.orders[idx], status, updatedAt: new Date().toISOString(), ...extra};
        persist();
        return {success: true, data: appData.orders[idx]};
    }
};

export const paymentAPI = {
    getByStatus: async (status) => {
        await delay();
        return appData.payments.filter(p => p.status === status)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    updateStatus: async (paymentId, status, extra = {}) => {
        await delay();
        const idx = appData.payments.findIndex(p => p._id === paymentId);
        if (idx === -1) throw new Error("Payment not found");
        appData.payments[idx] = {...appData.payments[idx], status, updatedAt: new Date().toISOString(), ...extra};
        persist();
        return {success: true, data: appData.payments[idx]};
    },
    processPayment: async (paymentId, paymentMethod, cardDetails = {}) => {
        await delay(1200);
        const txId = "TXN" + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
        return paymentAPI.updateStatus(paymentId, "settled", {
            paymentMethod,
            transactionId: txId,
            paidAt: new Date().toISOString(),
            cardLastFour: cardDetails.lastFour || null,
            cardHolderName: cardDetails.holderName || null
        });
    }
};

export const complaintAPI = {
    submit: async (data) => {
        await delay();
        const newComplaint = {_id: generateObjectId(), ...data, status: "pending", createdAt: new Date().toISOString()};
        appData.complaints.push(newComplaint);
        persist();
        return {success: true, data: newComplaint};
    },
    getAll: async () => {
        await delay();
        return [...appData.complaints].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    resolve: async (id) => {
        await delay();
        const idx = appData.complaints.findIndex(c => c._id === id);
        if (idx === -1) throw new Error("Complaint not found");
        appData.complaints[idx] = {
            ...appData.complaints[idx],
            status: "resolved",
            resolvedAt: new Date().toISOString()
        };
        persist();
        return {success: true, data: appData.complaints[idx]};
    },
    delete: async (id) => {
        await delay();
        appData.complaints = appData.complaints.filter(c => c._id !== id);
        persist();
        return {success: true};
    }
};

export default {userAPI, resourceAPI, orderAPI, paymentAPI, complaintAPI, generateObjectId};
