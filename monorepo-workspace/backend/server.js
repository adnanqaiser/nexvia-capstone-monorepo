require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');

const { initializePrismaDatabase } = require('./src/config/prismaInit');
const setupWebSocketServer = require('./src/services/wsServer');

// Modular Route Imports
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const workspaceRoutes = require('./src/routes/workspaceRoutes');

const app = express();
const PORT = process.env.PORT || 6000;

// Express Middleware Stack
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Link Modular Endpoint Interfaces
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/workspace', workspaceRoutes);

// Health Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Corporate Multi-Benchmark Dual-Engine',
    ports: { http: PORT, ws: PORT },
    timestamp: new Date().toISOString()
  });
});

// Create Native HTTP Server Wrapping Express App
const server = http.createServer(app);

// Initialize Dual WebSocket Engine on same HTTP Port
setupWebSocketServer(server);

// Bootstrapping Runner
async function bootstrapServer() {
  // Execute resilient asynchronous Prisma DB push validation runner
  await initializePrismaDatabase();

  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 CORE ENGINE SERVER ACTIVE ON PORT: ${PORT}`);
    console.log(`🛒 Project 1 (FS-01: Multi-Vendor Marketplace): http://localhost:${PORT}/api/products`);
    console.log(`📝 Project 2 (FS-02: Real-Time Collaborative WS): ws://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
}

bootstrapServer().catch((err) => {
  console.error('Fatal Server Bootstrapping Error:', err);
});
