require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 6080;
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';
const MOCK_MODE = process.env.MOCK_MODE === 'true';

// Start server
app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   🚦 ResQRoute Traffic Controller RUNNING       ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`  🌐  URL         : http://localhost:${PORT}`);
  console.log(`  ❤️   Health      : http://localhost:${PORT}/health`);
  console.log(`  📡  Backend     : ${BACKEND_URL}`);
  console.log(`  🔧  Mode        : ${MOCK_MODE ? 'MOCK (No MQTT)' : 'Production'}`);
  console.log(`  📊  Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  
  if (MOCK_MODE) {
    console.log('  ℹ️   Running in MOCK MODE');
    console.log('     - No MQTT broker required');
    console.log('     - All traffic operations are simulated');
    console.log('     - Perfect for development & testing');
  }
  
  console.log('\n  📚 API Endpoints:');
  console.log(`     POST   /api/emergency/corridor`);
  console.log(`     GET    /api/emergency/corridor`);
  console.log(`     PATCH  /api/emergency/vehicle/:id/location`);
  console.log(`     DELETE /api/emergency/corridor/:id`);
  console.log(`     POST   /api/signals/init`);
  console.log(`     GET    /api/signals`);
  console.log('');
  console.log('╚══════════════════════════════════════════════════╝\n');

  logger.info(`Traffic Controller started on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});