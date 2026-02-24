const logger = require('../utils/logger');
const signalStore = require('../services/signalStore');

/**
 * Initialize a new traffic signal
 */
exports.initializeSignal = async (req, res, next) => {
  try {
    const { signalId, location, currentState = 'red' } = req.body;

    // Validation
    if (!signalId || !location) {
      return res.status(400).json({
        success: false,
        message: 'Signal ID and location are required'
      });
    }

    if (!location.latitude || !location.longitude) {
      return res.status(400).json({
        success: false,
        message: 'Location must have latitude and longitude'
      });
    }

    // Create signal
    const signal = {
      signalId,
      location,
      currentState,
      isOverridden: false,
      emergencyVehicles: [],
      lastUpdate: new Date()
    };

    signalStore.addSignal(signalId, signal);

    logger.info(`Signal initialized: ${signalId} at [${location.latitude}, ${location.longitude}]`);

    res.status(201).json({
      success: true,
      message: 'Signal initialized successfully',
      data: { signal }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get signal by ID
 */
exports.getSignal = async (req, res, next) => {
  try {
    const { signalId } = req.params;

    const signal = signalStore.getSignal(signalId);

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: `Signal ${signalId} not found`
      });
    }

    res.json({
      success: true,
      data: { signal }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all signals
 */
exports.getAllSignals = async (req, res, next) => {
  try {
    const signals = signalStore.getAllSignals();

    res.json({
      success: true,
      data: {
        count: signals.length,
        signals
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update signal state
 */
exports.updateSignalState = async (req, res, next) => {
  try {
    const { signalId } = req.params;
    const { state } = req.body;

    // Validation
    if (!['red', 'yellow', 'green'].includes(state)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid state. Must be: red, yellow, or green'
      });
    }

    const signal = signalStore.getSignal(signalId);

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: `Signal ${signalId} not found`
      });
    }

    // Update signal
    const updated = signalStore.updateSignal(signalId, {
      currentState: state,
      lastUpdate: new Date()
    });

    logger.info(`Signal ${signalId} state changed to ${state}`);

    res.json({
      success: true,
      message: 'Signal state updated',
      data: { signal: updated }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset signal to normal operation
 */
exports.resetSignal = async (req, res, next) => {
  try {
    const { signalId } = req.params;

    const signal = signalStore.getSignal(signalId);

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: `Signal ${signalId} not found`
      });
    }

    // Reset signal
    const updated = signalStore.updateSignal(signalId, {
      currentState: 'red',
      isOverridden: false,
      emergencyVehicles: [],
      lastUpdate: new Date()
    });

    logger.info(`Signal ${signalId} reset to normal operation`);

    res.json({
      success: true,
      message: 'Signal reset successfully',
      data: { signal: updated }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete signal
 */
exports.deleteSignal = async (req, res, next) => {
  try {
    const { signalId } = req.params;

    const deleted = signalStore.deleteSignal(signalId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Signal ${signalId} not found`
      });
    }

    logger.info(`Signal deleted: ${signalId}`);

    res.json({
      success: true,
      message: 'Signal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};