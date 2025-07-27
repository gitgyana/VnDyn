// mongoAPI.js - MongoDB Atlas Data API Wrapper
import axios from 'axios';

// Configuration from environment variables
const API_URL = process.env.REACT_APP_MONGODB_API_URL;
const API_KEY = process.env.REACT_APP_MONGODB_API_KEY;
const DATA_SOURCE = process.env.REACT_APP_MONGODB_CLUSTER;
const DATABASE = process.env.REACT_APP_MONGODB_DATABASE;

// Base request configuration for MongoDB Atlas Data API
const createRequest = (action, payload) => {
    return axios.post(`${API_URL}/action/${action}`, {
        dataSource: DATA_SOURCE,
        database: DATABASE,
        ...payload
    }, {
        headers: {
            'Content-Type': 'application/json',
            'api-key': API_KEY,
            'Accept': 'application/json'
        }
    });
};

// Generic error handler
const handleError = (error, operation) => {
    console.error(`MongoDB API Error [${operation}]:`, error);
    if (error.response?.data) {
        throw new Error(error.response.data.error || `Failed to ${operation}`);
    }
    throw new Error(`Network error during ${operation}`);
};

// User API functions
export const userAPI = {
    // Register a new user
    register: async (userData) => {
        try {
            const response = await createRequest('insertOne', {
                collection: 'users',
                document: {
                    ...userData,
                    _id: userData.email, // Use email as _id for easy lookup
                    createdAt: new Date()
                }
            });
            return { success: true, data: userData };
        } catch (error) {
            handleError(error, 'register user');
        }
    },

    // Login user
    login: async (loginValue, password) => {
        try {
            const response = await createRequest('findOne', {
                collection: 'users',
                filter: {
                    $or: [
                        { email: loginValue },
                        { phone: loginValue }
                    ]
                }
            });

            const user = response.data.document;
            if (user && user.password === password) {
                return { success: true, data: user };
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            handleError(error, 'login user');
        }
    },

    // Check if user exists
    checkExists: async (email, phone) => {
        try {
            const response = await createRequest('findOne', {
                collection: 'users',
                filter: {
                    $or: [
                        { email: email },
                        { phone: phone }
                    ]
                }
            });

            return response.data.document !== null;
        } catch (error) {
            handleError(error, 'check user existence');
        }
    }
};

// Resource API functions
export const resourceAPI = {
    // Get all resources
    getAll: async () => {
        try {
            const response = await createRequest('find', {
                collection: 'resources',
                sort: { name: 1 }
            });
            return response.data.documents || [];
        } catch (error) {
            handleError(error, 'fetch resources');
        }
    },

    // Add a new resource (admin function)
    create: async (resourceData) => {
        try {
            const response = await createRequest('insertOne', {
                collection: 'resources',
                document: {
                    ...resourceData,
                    createdAt: new Date()
                }
            });
            return { success: true, data: resourceData };
        } catch (error) {
            handleError(error, 'create resource');
        }
    }
};

// Order API functions
export const orderAPI = {
    // Create a new order
    create: async (orderData) => {
        try {
            const response = await createRequest('insertOne', {
                collection: 'orders',
                document: {
                    ...orderData,
                    status: 'pending',
                    createdAt: new Date()
                }
            });
            return { success: true, data: response.data };
        } catch (error) {
            handleError(error, 'create order');
        }
    },

    // Get orders by status
    getByStatus: async (status) => {
        try {
            const response = await createRequest('find', {
                collection: 'orders',
                filter: { status: status },
                sort: { createdAt: -1 }
            });
            return response.data.documents || [];
        } catch (error) {
            handleError(error, 'fetch orders');
        }
    },

    // Get orders by vendor ID
    getByVendor: async (vendorId) => {
        try {
            const response = await createRequest('find', {
                collection: 'orders',
                filter: { vendorId: vendorId },
                sort: { createdAt: -1 }
            });
            return response.data.documents || [];
        } catch (error) {
            handleError(error, 'fetch vendor orders');
        }
    },

    // Update order status
    updateStatus: async (orderId, status, additionalData = {}) => {
        try {
            const response = await createRequest('updateOne', {
                collection: 'orders',
                filter: { _id: { $oid: orderId } },
                update: {
                    $set: {
                        status: status,
                        updatedAt: new Date(),
                        ...additionalData
                    }
                }
            });
            return { success: true, data: response.data };
        } catch (error) {
            handleError(error, 'update order status');
        }
    }
};

// Payment API functions
export const paymentAPI = {
    // Create a payment record
    create: async (paymentData) => {
        try {
            const response = await createRequest('insertOne', {
                collection: 'payments',
                document: {
                    ...paymentData,
                    status: 'pending',
                    createdAt: new Date()
                }
            });
            return { success: true, data: response.data };
        } catch (error) {
            handleError(error, 'create payment');
        }
    },

    // Get payments by status
    getByStatus: async (status) => {
        try {
            const response = await createRequest('find', {
                collection: 'payments',
                filter: { status: status },
                sort: { createdAt: -1 }
            });
            return response.data.documents || [];
        } catch (error) {
            handleError(error, 'fetch payments');
        }
    },

    // Update payment status
    updateStatus: async (paymentId, status) => {
        try {
            const response = await createRequest('updateOne', {
                collection: 'payments',
                filter: { _id: { $oid: paymentId } },
                update: {
                    $set: {
                        status: status,
                        updatedAt: new Date()
                    }
                }
            });
            return { success: true, data: response.data };
        } catch (error) {
            handleError(error, 'update payment status');
        }
    }
};

// Complaint API functions
export const complaintAPI = {
    // Submit a new complaint
    submit: async (complaintData) => {
        try {
            const response = await createRequest('insertOne', {
                collection: 'complaints',
                document: {
                    ...complaintData,
                    status: 'pending',
                    createdAt: new Date()
                }
            });
            return { success: true, data: response.data };
        } catch (error) {
            handleError(error, 'submit complaint');
        }
    },

    // Get all complaints (admin function)
    getAll: async () => {
        try {
            const response = await createRequest('find', {
                collection: 'complaints',
                sort: { createdAt: -1 }
            });
            return response.data.documents || [];
        } catch (error) {
            handleError(error, 'fetch complaints');
        }
    },

    // Resolve a complaint
    resolve: async (complaintId) => {
        try {
            const response = await createRequest('updateOne', {
                collection: 'complaints',
                filter: { _id: { $oid: complaintId } },
                update: {
                    $set: {
                        status: 'resolved',
                        resolvedAt: new Date()
                    }
                }
            });
            return { success: true, data: response.data };
        } catch (error) {
            handleError(error, 'resolve complaint');
        }
    },

    // Delete a complaint (admin function)
    delete: async (complaintId) => {
        try {
            const response = await createRequest('deleteOne', {
                collection: 'complaints',
                filter: { _id: { $oid: complaintId } }
            });
            return { success: true, data: response.data };
        } catch (error) {
            handleError(error, 'delete complaint');
        }
    }
};

// Utility function to generate ObjectId string (for client-side ID generation)
export const generateObjectId = () => {
    return new Date().getTime().toString(16) + Math.random().toString(16).substr(2, 8);
};

export default {
    userAPI,
    resourceAPI,
    orderAPI,
    paymentAPI,
    complaintAPI,
    generateObjectId
};