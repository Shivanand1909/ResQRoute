const express = require('express');
const router = express.Router();

const signalRoutes = require('./signalRoutes');
const emergencyRoutes = require('./emergencyRoutes');

// Mount routes
router.use('/signals', signalRoutes);
router.use('/emergency', emergencyRoutes);

module.exports = router;