const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');

/**
 * @route   POST /api/emergency/corridor
 * @desc    Create green corridor for emergency vehicle
 * @access  Public (would be protected in production)
 */
router.post('/corridor', emergencyController.createGreenCorridor);

/**
 * @route   GET /api/emergency/corridor
 * @desc    Get all active green corridors
 * @access  Public
 */
router.get('/corridor', emergencyController.getActiveCorridors);

/**
 * @route   GET /api/emergency/corridor/:vehicleId
 * @desc    Get specific corridor
 * @access  Public
 */
router.get('/corridor/:vehicleId', emergencyController.getCorridor);

/**
 * @route   PATCH /api/emergency/vehicle/:vehicleId/location
 * @desc    Update emergency vehicle location
 * @access  Public (would be protected in production)
 */
router.patch('/vehicle/:vehicleId/location', emergencyController.updateVehicleLocation);

/**
 * @route   DELETE /api/emergency/corridor/:vehicleId
 * @desc    Clear green corridor
 * @access  Public (would be protected in production)
 */
router.delete('/corridor/:vehicleId', emergencyController.clearGreenCorridor);

/**
 * @route   POST /api/emergency/override
 * @desc    Override specific signal
 * @access  Public (would be protected in production)
 */
router.post('/override', emergencyController.overrideSignal);

module.exports = router;