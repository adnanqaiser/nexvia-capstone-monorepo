const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const inMemoryUsers = [
  { id: 'usr-admin-1', email: 'admin@corporate.com', passwordHash: bcrypt.hashSync('admin123', 8), name: 'Principal Admin', role: 'ADMIN', vendorStatus: 'APPROVED' },
  { id: 'usr-vendor-1', email: 'vendor@corporate.com', passwordHash: bcrypt.hashSync('vendor123', 8), name: 'Apex Tech Merchants', role: 'VENDOR', vendorStatus: 'APPROVED' },
  { id: 'usr-cust-1', email: 'customer@corporate.com', passwordHash: bcrypt.hashSync('customer123', 8), name: 'Enterprise Buyer', role: 'CUSTOMER', vendorStatus: 'APPROVED' }
];

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = inMemoryUsers.find(u => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid credentials provided.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'super-secret-jwt-key-production-grade',
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Authentication successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, vendorStatus: user.vendorStatus }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server authentication error', details: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const existing = inMemoryUsers.find(u => u.email === email);
    if (existing) {
      return res.status(400).json({ error: 'User email already exists.' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      email,
      passwordHash: bcrypt.hashSync(password, 8),
      name,
      role: role || 'CUSTOMER',
      vendorStatus: role === 'VENDOR' ? 'PENDING' : 'APPROVED'
    };

    inMemoryUsers.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET || 'super-secret-jwt-key-production-grade',
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Registration completed successfully',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, vendorStatus: newUser.vendorStatus }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failure', details: err.message });
  }
};

const getMerchants = async (req, res) => {
  const vendors = inMemoryUsers
    .filter(u => u.role === 'VENDOR')
    .map(({ passwordHash, ...vendor }) => vendor);
  return res.json(vendors);
};

const updateMerchantStatus = async (req, res) => {
  const { vendorId } = req.params;
  const { status } = req.body; // APPROVED or REJECTED
  
  const user = inMemoryUsers.find(u => u.id === vendorId);
  if (user) {
    user.vendorStatus = status;
    return res.json({ message: `Vendor status updated to ${status}`, user });
  }
  return res.status(404).json({ error: 'Vendor not found' });
};

module.exports = { login, register, getMerchants, updateMerchantStatus };
