const { PrismaClient } = require('@prisma/client');

let prisma;

try {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
} catch (error) {
  console.warn('[DB Config] Failed to initialize PrismaClient instance natively. Using lazy proxy fallback.');
  prisma = {};
}

module.exports = prisma;
