import { MongoClient, ServerApiVersion } from 'mongodb';

// MongoDB Configuration from environment variables
const MONGODB_URI = process.env.REACT_APP_MONGODB_URI;
const DB_NAME = process.env.REACT_APP_MONGODB_DB_NAME || 'vndyn';

// Collection names
const COLLECTIONS = {
  users: process.env.REACT_APP_USERS_COLLECTION || 'users',
  resources: process.env.REACT_APP_RESOURCES_COLLECTION || 'resources',
  orders: process.env.REACT_APP_ORDERS_COLLECTION || 'orders',
  payments: process.env.REACT_APP_PAYMENTS_COLLECTION || 'payments',
  complaints: process.env.REACT_APP_COMPLAINTS_COLLECTION || 'complaints'
};

// Fallback in-memory storage for development without MongoDB
let appData = {
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
      createdAt: new Date()
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
      createdAt: new Date()
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
      createdAt: new Date()
    }
  ],
  resources: [
    {
      _id: "res1",
      name: "Fresh Vegetables",
      description: "Daily fresh vegetables for street food preparation",
      price: 150,
      category: "Ingredients",
      createdAt: new Date()
    },
    {
      _id: "res2",
      name: "Cooking Oil",
      description: "High quality cooking oil for frying",
      price: 120,
      category: "Ingredients",
      createdAt: new Date()
    },
    {
      _id: "res3",
      name: "Paper Plates",
      description: "Eco-friendly disposable plates",
      price: 80,
      category: "Packaging",
      createdAt: new Date()
    },
    {
      _id: "res4",
      name: "Napkins",
      description: "Quality paper napkins for customers",
      price: 50,
      category: "Packaging",
      createdAt: new Date()
    }
  ],
  orders: [
    {
      _id: "order1",
      vendorId: "vendor@test.com",
      vendorName: "Test Vendor",
      items: [
        { _id: "res1", name: "Fresh Vegetables", price: 150 },
        { _id: "res3", name: "Paper Plates", price: 80 }
      ],
      totalAmount: 230,
      status: "pending",
      deliveryAddress: {
        street: "456 Vendor Road",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        landmark: "Chandni Chowk"
      },
      createdAt: new Date()
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
      createdAt: new Date()
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
      createdAt: new Date()
    }
  ]
};

// MongoDB Client
let client = null;
let db = null;

const connectDB = async () => {
  if (!MONGODB_URI) {
    console.warn('MongoDB URI not found in environment variables. Using in-memory storage.');
    return null;
  }

  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      await client.connect();
      db = client.db(DB_NAME);
      console.log('Connected to MongoDB successfully');
    }
    return db;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    console.warn('Falling back to in-memory storage');
    return null;
  }
};

export const generateObjectId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get collection (MongoDB or fallback)
const getCollection = async (collectionName) => {
  const database = await connectDB();
  if (database) {
    return database.collection(collectionName);
  }
  return null;
};

export const userAPI = {
  register: async (userData) => {
    await simulateDelay();

    const collection = await getCollection(COLLECTIONS.users);

    if (collection) {
      // MongoDB implementation
      const existingUser = await collection.findOne({
        $or: [{ email: userData.email }, { phone: userData.phone }]
      });

      if (existingUser) {
        throw new Error('User already exists with this email or phone');
      }

      const newUser = {
        _id: userData.email,
        ...userData,
        createdAt: new Date()
      };

      await collection.insertOne(newUser);
      return { success: true, data: newUser };
    } else {
      // Fallback in-memory
      const existingUser = appData.users.find(u =>
          u.email === userData.email || u.phone === userData.phone
      );

      if (existingUser) {
        throw new Error('User already exists with this email or phone');
      }

      const newUser = {
        _id: userData.email,
        ...userData,
        createdAt: new Date()
      };

      appData.users.push(newUser);
      return { success: true, data: newUser };
    }
  },

  login: async (loginValue, password) => {
    await simulateDelay();

    const collection = await getCollection(COLLECTIONS.users);

    if (collection) {
      const user = await collection.findOne({
        $and: [
          { $or: [{ email: loginValue }, { phone: loginValue }] },
          { password: password }
        ]
      });

      if (user) {
        return { success: true, data: user };
      }
    } else {
      const user = appData.users.find(u =>
          (u.email === loginValue || u.phone === loginValue) && u.password === password
      );

      if (user) {
        return { success: true, data: user };
      }
    }

    throw new Error('Invalid credentials');
  },

  checkExists: async (email, phone) => {
    await simulateDelay();
    const collection = await getCollection(COLLECTIONS.users);

    if (collection) {
      const exists = await collection.findOne({
        $or: [{ email: email }, { phone: phone }]
      });
      return !!exists;
    }

    return appData.users.some(u => u.email === email || u.phone === phone);
  },

  getAll: async () => {
    await simulateDelay();
    const collection = await getCollection(COLLECTIONS.users);

    if (collection) {
      return await collection.find({}).toArray();
    }
    return appData.users;
  }
};

export const resourceAPI = {
  getAll: async () => {
    await simulateDelay();
    const collection = await getCollection(COLLECTIONS.resources);

    if (collection) {
      const resources = await collection.find({}).toArray();
      return resources.sort((a, b) => a.name.localeCompare(b.name));
    }
    return appData.resources.sort((a, b) => a.name.localeCompare(b.name));
  },

  create: async (resourceData) => {
    await simulateDelay();
    const collection = await getCollection(COLLECTIONS.resources);

    const newResource = {
      _id: generateObjectId(),
      ...resourceData,
      createdAt: new Date()
    };

    if (collection) {
      await collection.insertOne(newResource);
    } else {
      appData.resources.push(newResource);
    }

    return { success: true, data: newResource };
  }
};

export const orderAPI = {
  create: async (orderData) => {
    await simulateDelay();
    const collection = await getCollection(COLLECTIONS.orders);
    const paymentsCollection = await getCollection(COLLECTIONS.payments);

    const newOrder = {
      _id: generateObjectId(),
      ...orderData,
      status: 'pending',
      createdAt: new Date()
    };

    if (collection) {
      await collection.insertOne(newOrder);
    } else {
      appData.orders.push(newOrder);
    }

    const payment = {
      _id: generateObjectId(),
      orderId: newOrder._id,
      vendorName: orderData.vendorName,
      supplierName: "System Supplier",
      amount: orderData.totalAmount,
      status: 'pending',
      paymentMethod: null,
      transactionId: null,
      paidAt: null,
      createdAt: new Date()
    };

    if (paymentsCollection) {
      await paymentsCollection.insertOne(payment);
    } else {
      appData.payments.push(payment);
    }

    return { success: true, data: newOrder };
  },

  getByStatus: async (status) => {
    await simulateDelay();
    const collection = await getCollection(COLLECTIONS.orders);

    if (collection) {
      const orders = await collection.find({ status }).toArray();
      return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return appData.orders
        .filter(order => order.status === status)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getByVendor: async (vendorId) => {
    await simulateDelay();
    const collection = await getCollection(COLLECTIONS.orders);

    if (collection) {
      const orders = await collection.find({ vendorId }).toArray();
      return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return appData.orders
        .filter(order => order.vendorId === vendorId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  updateStatus: async (orderId, status, additionalData = {}) => {
    await simulateDelay();
    const collection = await getCollection(COLLECTIONS.orders);

    if (collection) {
      await collection.updateOne(
          { _id: orderId },
          {
            $set: {
              status: status,
              updatedAt: new Date(),
              ...additionalData
            }
          }
      );
      const updated = await collection.findOne({ _id: orderId });
      return { success: true, data: updated };
    }

    const orderIndex = appData.orders.findIndex(order => order._id === orderId);
    if (orderIndex !== -1) {
      appData.orders[orderIndex] = {
        ...appData.orders[orderIndex],
        status: status,
        updatedAt: new Date(),
        ...additionalData
      };
      return { success: true, data: appData.orders[orderIndex] };
    }
    throw new Error('Order not found');
  }
};

export const paymentAPI = {
  create: async (paymentData) => {
    await simulateDelay();
    const collection = await getCollection(COLLECTIONS.payments);

    const newPayment = {
      _id: generateObjectId(),
      ...paymentData,
      status: 'pending',
      createdAt: new Date()
    };

    if (collection) {
      await collection.insertOne(newPayment);
    } else {
      appData.payments.push(newPayment);
    }

    return { success: true, data: newPayment };
  },

  getByStatus: async (status) => {
    await simulateDelay();
    const collection = await getCollection(COLLECTIONS.payments);

    if (collection) {
      const payments = await collection.find({ status }).toArray();
      return payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return appData.payments
        .filter(payment => payment.status === status)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById: async (paymentId) => {
    await simulateDelay();
    const collection = await getCollection(COLLECTIONS.payments);

    if (collection) {
      return await collection.findOne({ _id: paymentId });
    }

    return appData.payments.find(payment => payment._id === paymentId);
  },

  updateStatus: async (paymentId, status, paymentDetails = {}) => {
    await simulateDelay();
    const collection = await getCollection(COLLECTIONS.payments);

    const updateData = {
      status: status,
      updatedAt: new Date(),
      ...paymentDetails
    };

    if (collection) {
      await collection.updateOne(
          { _id: paymentId },
          { $set: updateData }
      );
      const updated = await collection.findOne({ _id: paymentId });
      return { success: true, data: updated };
    }

    const paymentIndex = appData.payments.findIndex(payment => payment._id === paymentId);
    if (paymentIndex !== -1) {
      appData.payments[paymentIndex] = {
        ...appData.payments[paymentIndex],
        ...updateData
      };
      return { success: true, data: appData.payments[paymentIndex] };
    }
    throw new Error('Payment not found');
  },

  processPayment: async (paymentId, paymentMethod, cardDetails = {}) => {
    await simulateDelay(1500); // Simulate processing time

    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();

    const paymentDetails = {
      paymentMethod: paymentMethod,
      transactionId: transactionId,
      paidAt: new Date(),
      cardLastFour: cardDetails.lastFour || null,
      cardHolderName: cardDetails.holderName || null
    };

    return await paymentAPI.updateStatus(paymentId, 'settled', paymentDetails);
  }
};

export const complaintAPI = {
  submit: async (complaintData) => {
    await simulateDelay();
    const collection = await getCollection(COLLECTIONS.complaints);

    const newComplaint = {
      _id: generateObjectId(),
      ...complaintData,
      status: 'pending',
      createdAt: new Date()
    };

    if (collection) {
      await collection.insertOne(newComplaint);
    } else {
      appData.complaints.push(newComplaint);
    }

    return { success: true, data: newComplaint };
  },

  getAll: async () => {
    await simulateDelay();
    const collection = await getCollection(COLLECTIONS.complaints);

    if (collection) {
      const complaints = await collection.find({}).toArray();
      return complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return appData.complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  resolve: async (complaintId) => {
    await simulateDelay();
    const collection = await getCollection(COLLECTIONS.complaints);

    if (collection) {
      await collection.updateOne(
          { _id: complaintId },
          {
            $set: {
              status: 'resolved',
              resolvedAt: new Date()
            }
          }
      );
      const updated = await collection.findOne({ _id: complaintId });
      return { success: true, data: updated };
    }

    const complaintIndex = appData.complaints.findIndex(complaint => complaint._id === complaintId);
    if (complaintIndex !== -1) {
      appData.complaints[complaintIndex] = {
        ...appData.complaints[complaintIndex],
        status: 'resolved',
        resolvedAt: new Date()
      };
      return { success: true, data: appData.complaints[complaintIndex] };
    }
    throw new Error('Complaint not found');
  },

  delete: async (complaintId) => {
    await simulateDelay();
    const collection = await getCollection(COLLECTIONS.complaints);

    if (collection) {
      await collection.deleteOne({ _id: complaintId });
      return { success: true };
    }

    const complaintIndex = appData.complaints.findIndex(complaint => complaint._id === complaintId);
    if (complaintIndex !== -1) {
      appData.complaints.splice(complaintIndex, 1);
      return { success: true };
    }
    throw new Error('Complaint not found');
  }
};

export default {
  userAPI,
  resourceAPI,
  orderAPI,
  paymentAPI,
  complaintAPI,
  generateObjectId
};
