const logger = require('../utils/logger');
const greenCorridorService = require('../services/greenCorridorService');

/**
 * Create green corridor for emergency vehicle
 */
exports.createGreenCorridor = async (req, res, next) => {
  try {
    const { vehicleId, vehicleType, route, priority } = req.body;

    // Validation
    if (!vehicleId || !vehicleType || !route) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle ID, type, and route are required'
      });
    }

    if (!route.coordinates || !Array.isArray(route.coordinates) || route.coordinates.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Route must have at least 2 coordinates'
      });
    }

    // Create corridor
    const corridor = await greenCorridorService.createCorridor({
      vehicleId,
      vehicleType,
      route,
      priority: priority || 'high'
    });

    res.status(201).json({
      success: true,
      message: 'Green corridor created successfully',
      data: { corridor }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update vehicle location
 */
exports.updateVehicleLocation = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const { latitude, longitude, heading, speed } = req.body;

    // Validation
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Update location
    const update = await greenCorridorService.updateVehicleLocation(vehicleId, {
      latitude,
      longitude,
      heading: heading || null,
      speed: speed || null,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Vehicle location updated',
      data: update
    });
  } catch (error) {
    if (error.message.includes('No active corridor')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * Get active green corridors
 */
exports.getActiveCorridors = async (req, res, next) => {
  try {
    const corridors = greenCorridorService.getActiveCorridors();

    res.json({
      success: true,
      data: {
        count: corridors.length,
        corridors
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get specific corridor
 */
exports.getCorridor = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;

    const corridor = greenCorridorService.getActiveCorridors()
      .find(c => c.vehicleId === vehicleId);

    if (!corridor) {
      return res.status(404).json({
        success: false,
        message: `No corridor found for vehicle ${vehicleId}`
      });
    }

    res.json({
      success: true,
      data: { corridor }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear green corridor
 */
exports.clearGreenCorridor = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;

    await greenCorridorService.clearCorridor(vehicleId);

    res.json({
      success: true,
      message: 'Green corridor cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Override specific signal
 */
exports.overrideSignal = async (req, res, next) => {
  try {
    const { signalId, vehicleId, duration } = req.body;

    // Validation
    if (!signalId || !vehicleId) {
      return res.status(400).json({
        success: false,
        message: 'Signal ID and vehicle ID are required'
      });
    }

    // Override signal
    const override = await greenCorridorService.overrideSignal(
      signalId,
      vehicleId,
      duration || 60
    );

    res.json({
      success: true,
      message: 'Signal overridden successfully',
      data: { override }
    });
  } catch (error) {
    next(error);
  }
};