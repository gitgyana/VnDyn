let appData = {
  users: [
    {
      _id: "admin@vndyn.com",
      email: "admin@vndyn.com",
      phone: "9999999999",
      fullName: "System Admin",
      password: "admin123",
      type: "Admin",
      createdAt: new Date()
    },
    {
      _id: "vendor@test.com",
      email: "vendor@test.com", 
      phone: "8888888888",
      fullName: "Test Vendor",
      password: "vendor123",
      type: "Street Vendor",
      createdAt: new Date()
    },
    {
      _id: "supplier@test.com",
      email: "supplier@test.com",
      phone: "7777777777", 
      fullName: "Test Supplier",
      password: "supplier123",
      type: "Retailer to Vendor",
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


export const generateObjectId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};


const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));


export const userAPI = {

  register: async (userData) => {
    await simulateDelay();
    

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
  },


  login: async (loginValue, password) => {
    await simulateDelay();
    
    const user = appData.users.find(u => 
      (u.email === loginValue || u.phone === loginValue) && u.password === password
    );
    
    if (user) {
      return { success: true, data: user };
    } else {
      throw new Error('Invalid credentials');
    }
  },


  checkExists: async (email, phone) => {
    await simulateDelay();
    const exists = appData.users.some(u => u.email === email || u.phone === phone);
    return exists;
  }
};


export const resourceAPI = {

  getAll: async () => {
    await simulateDelay();
    return appData.resources.sort((a, b) => a.name.localeCompare(b.name));
  },


  create: async (resourceData) => {
    await simulateDelay();
    const newResource = {
      _id: generateObjectId(),
      ...resourceData,
      createdAt: new Date()
    };
    appData.resources.push(newResource);
    return { success: true, data: newResource };
  }
};


export const orderAPI = {

  create: async (orderData) => {
    await simulateDelay();
    const newOrder = {
      _id: generateObjectId(),
      ...orderData,
      status: 'pending',
      createdAt: new Date()
    };
    appData.orders.push(newOrder);
    

    const payment = {
      _id: generateObjectId(),
      orderId: newOrder._id,
      vendorName: orderData.vendorName,
      supplierName: "System Supplier",
      amount: orderData.totalAmount,
      status: 'pending',
      createdAt: new Date()
    };
    appData.payments.push(payment);
    
    return { success: true, data: newOrder };
  },


  getByStatus: async (status) => {
    await simulateDelay();
    return appData.orders
      .filter(order => order.status === status)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },


  getByVendor: async (vendorId) => {
    await simulateDelay();
    return appData.orders
      .filter(order => order.vendorId === vendorId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },


  updateStatus: async (orderId, status, additionalData = {}) => {
    await simulateDelay();
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
    const newPayment = {
      _id: generateObjectId(),
      ...paymentData,
      status: 'pending',
      createdAt: new Date()
    };
    appData.payments.push(newPayment);
    return { success: true, data: newPayment };
  },


  getByStatus: async (status) => {
    await simulateDelay();
    return appData.payments
      .filter(payment => payment.status === status)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },


  updateStatus: async (paymentId, status) => {
    await simulateDelay();
    const paymentIndex = appData.payments.findIndex(payment => payment._id === paymentId);
    if (paymentIndex !== -1) {
      appData.payments[paymentIndex] = {
        ...appData.payments[paymentIndex],
        status: status,
        updatedAt: new Date()
      };
      return { success: true, data: appData.payments[paymentIndex] };
    }
    throw new Error('Payment not found');
  }
};


export const complaintAPI = {

  submit: async (complaintData) => {
    await simulateDelay();
    const newComplaint = {
      _id: generateObjectId(),
      ...complaintData,
      status: 'pending',
      createdAt: new Date()
    };
    appData.complaints.push(newComplaint);
    return { success: true, data: newComplaint };
  },


  getAll: async () => {
    await simulateDelay();
    return appData.complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },


  resolve: async (complaintId) => {
    await simulateDelay();
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
