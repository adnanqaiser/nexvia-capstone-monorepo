const prisma = require('../config/db');

// Platform financial tracking ledger
let orderLedger = [
  {
    id: 'ord-1001',
    customerId: 'usr-cust-1',
    customerName: 'Enterprise Buyer',
    totalAmount: 339.49,
    platformFee: 33.95, // 10% Platform Commission
    vendorAmount: 305.54,
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'ord-1002',
    customerId: 'usr-cust-2',
    customerName: 'Global Logistics Inc',
    totalAmount: 149.50,
    platformFee: 14.95, // 10% Platform Commission
    vendorAmount: 134.55,
    status: 'PROCESSING',
    createdAt: new Date(Date.now() - 43200000).toISOString()
  }
];

/**
 * Manage multi-party transaction checks, automatically computing 10% platform
 * base commissions on checkout sequences before logging order status records.
 */
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const customerId = req.user ? req.user.id : 'usr-cust-1';
    const customerName = req.user ? req.user.name : 'Customer';

    const grossTotal = parseFloat(totalAmount) || 0;
    
    // Automatic computation of 10% platform base commission
    const BASE_COMMISSION_RATE = 0.10;
    const platformFee = parseFloat((grossTotal * BASE_COMMISSION_RATE).toFixed(2));
    const vendorAmount = parseFloat((grossTotal - platformFee).toFixed(2));

    const newOrder = {
      id: `ord-${Date.now()}`,
      customerId,
      customerName,
      totalAmount: grossTotal,
      platformFee,
      vendorAmount,
      status: 'PROCESSING',
      items: items || [],
      createdAt: new Date().toISOString()
    };

    orderLedger.unshift(newOrder);

    // Attempt Prisma DB sync safely
    if (prisma.order && typeof prisma.order.create === 'function') {
      try {
        await prisma.order.create({
          data: {
            customerId,
            totalAmount: grossTotal,
            platformFee,
            vendorAmount,
            status: 'PROCESSING'
          }
        });
      } catch (dbErr) {
        console.warn('[Order DB Sync Failover]: Logging transaction to primary operational ledger.');
      }
    }

    return res.status(201).json({
      message: 'Transaction processed successfully. 10% platform base commission applied.',
      order: newOrder
    });
  } catch (error) {
    return res.status(500).json({ error: 'Order transaction processing failed', details: error.message });
  }
};

const getOrdersLedger = async (req, res) => {
  const grossVolume = orderLedger.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalCommissions = orderLedger.reduce((acc, curr) => acc + curr.platformFee, 0);

  return res.json({
    metrics: {
      grossVolume: parseFloat(grossVolume.toFixed(2)),
      totalCommissions: parseFloat(totalCommissions.toFixed(2)),
      totalOrders: orderLedger.length
    },
    orders: orderLedger
  });
};

module.exports = { createOrder, getOrdersLedger, orderLedger };
