const express = require('express');
const router = express.Router();
const signalController = require('../controllers/signalController');

/**
 * @route   POST /api/signals/init
 * @desc    Initialize a new traffic signal
 * @access  Public (would be protected in production)
 */
router.post('/init', signalController.initializeSignal);

/**
 * @route   GET /api/signals
 * @desc    Get all traffic signals
 * @access  Public
 */
router.get('/', signalController.getAllSignals);

/**
 * @route   GET /api/signals/:signalId
 * @desc    Get specific traffic signal
 * @access  Public
 */
router.get('/:signalId', signalController.getSignal);

/**
 * @route   PATCH /api/signals/:signalId/state
 * @desc    Update signal state (red/yellow/green)
 * @access  Public (would be protected in production)
 */
router.patch('/:signalId/state', signalController.updateSignalState);

/**
 * @route   POST /api/signals/:signalId/reset
 * @desc    Reset signal to normal operation
 * @access  Public (would be protected in production)
 */
router.post('/:signalId/reset', signalController.resetSignal);

/**
 * @route   DELETE /api/signals/:signalId
 * @desc    Delete a signal
 * @access  Public (would be protected in production)
 */
router.delete('/:signalId', signalController.deleteSignal);

module.exports = router;