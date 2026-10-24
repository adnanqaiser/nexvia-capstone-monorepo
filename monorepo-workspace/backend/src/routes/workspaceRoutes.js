const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// In-Memory document store for fast collaboration API querying
let sampleDocuments = [
  { id: 'doc-arch-specs', title: 'System Architecture Specs', content: '# Multi-Tenant Architecture Standard\n\nHigh availability system design specs.', workspaceId: 'ws-core' },
  { id: 'doc-api-ref', title: 'REST & WebSocket API Matrix', content: '# Central API Endpoint Matrix\n\nWebSocket Handshake: ws://localhost:6000', workspaceId: 'ws-core' },
  { id: 'doc-security', title: 'OAuth2 & Role-Based Security', content: '# RBAC Policies\n\nUser Roles: CUSTOMER, VENDOR, ADMIN.', workspaceId: 'ws-core' }
];

router.get('/documents', authMiddleware(), (req, res) => {
  res.json(sampleDocuments);
});

router.post('/documents', authMiddleware(), (req, res) => {
  const { title, content } = req.body;
  const newDoc = {
    id: `doc-${Date.now()}`,
    title: title || 'Untitled Document',
    content: content || '',
    workspaceId: 'ws-core'
  };
  sampleDocuments.push(newDoc);
  res.status(201).json(newDoc);
});

module.exports = router;
