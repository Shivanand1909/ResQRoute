const logger = require('../utils/logger');
const signalStore = require('./signalStore');

/**
 * Green Corridor Service
 * Manages traffic signal overrides for emergency vehicles
 */
class GreenCorridorService {
  /**
   * Create a green corridor for an emergency vehicle
   */
  async createCorridor({ vehicleId, vehicleType, route, priority = 'high' }) {
    try {
      // Calculate affected signals along the route
      const affectedSignals = this.calculateAffectedSignals(route);

      const corridor = {
        vehicleId,
        vehicleType,
        route,
        priority,
        status: 'active',
        affectedSignals,
        currentLocation: route.coordinates[0],
        createdAt: new Date()
      };

      // Store the corridor
      signalStore.addCorridor(vehicleId, corridor);

      // Override all signals along the route
      for (const signalId of affectedSignals) {
        await this.overrideSignal(signalId, vehicleId, 300); // 5 minutes
      }

      logger.info(`Green corridor created for ${vehicleType} ${vehicleId} with ${affectedSignals.length} signals`);

      return corridor;
    } catch (error) {
      logger.error(`Failed to create corridor: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update vehicle location and adjust corridor
   */
  async updateVehicleLocation(vehicleId, location) {
    const corridor = signalStore.getCorridor(vehicleId);

    if (!corridor) {
      throw new Error(`No active corridor found for vehicle ${vehicleId}`);
    }

    // Update location
    corridor.currentLocation = location;

    // Get upcoming signals based on new location
    const upcomingSignals = this.getUpcomingSignals(location, corridor.route);

    // Release signals that are now behind the vehicle
    const passedSignals = corridor.affectedSignals.filter(
      signalId => !upcomingSignals.includes(signalId)
    );

    for (const signalId of passedSignals) {
      await this.releaseSignal(signalId, vehicleId);
    }

    // Update corridor
    corridor.affectedSignals = upcomingSignals;
    signalStore.updateCorridor(vehicleId, corridor);

    logger.info(`Vehicle ${vehicleId} location updated, ${upcomingSignals.length} signals ahead`);

    return {
      vehicleId,
      location,
      upcomingSignals: upcomingSignals.length,
      status: 'active'
    };
  }

  /**
   * Override a specific signal
   */
  async overrideSignal(signalId, vehicleId, durationSeconds = 60) {
    const key = `${signalId}-${vehicleId}`;

    const override = {
      signalId,
      vehicleId,
      state: 'green',
      startTime: new Date(),
      duration: durationSeconds,
      expiresAt: Date.now() + (durationSeconds * 1000)
    };

    signalStore.addOverride(key, override);

    logger.info(`Signal ${signalId} overridden to GREEN for vehicle ${vehicleId}`);

    // Auto-release after duration
    setTimeout(() => {
      this.releaseSignal(signalId, vehicleId);
    }, durationSeconds * 1000);

    return override;
  }

  /**
   * Release a signal override
   */
  async releaseSignal(signalId, vehicleId) {
    const key = `${signalId}-${vehicleId}`;
    const override = signalStore.getOverride(key);

    if (!override) return;

    signalStore.deleteOverride(key);

    logger.info(`Signal ${signalId} released from override for vehicle ${vehicleId}`);
  }

  /**
   * Clear green corridor
   */
  async clearCorridor(vehicleId) {
    const corridor = signalStore.getCorridor(vehicleId);

    if (!corridor) {
      logger.warn(`No corridor found for vehicle ${vehicleId}`);
      return;
    }

    // Release all signal overrides
    for (const signalId of corridor.affectedSignals) {
      await this.releaseSignal(signalId, vehicleId);
    }

    // Remove corridor
    signalStore.deleteCorridor(vehicleId);

    logger.info(`Green corridor cleared for vehicle ${vehicleId}`);
  }

  /**
   * Get all active corridors
   */
  getActiveCorridors() {
    return signalStore.getAllCorridors();
  }

  /**
   * Calculate which signals will be affected by the route
   * In production, this would query actual signal locations
   */
  calculateAffectedSignals(route) {
    const numSignals = Math.min(route.coordinates.length, 10);
    const signals = [];

    for (let i = 0; i < numSignals; i++) {
      signals.push(`SIGNAL_${String(i + 1).padStart(3, '0')}`);
    }

    return signals;
  }

  /**
   * Get signals ahead of vehicle based on current location
   */
  getUpcomingSignals(currentLocation, route) {
    // Simplified: return first 5 signals
    // In production, calculate based on actual positions
    const allSignals = this.calculateAffectedSignals(route);
    return allSignals.slice(0, 5);
  }
}

module.exports = new GreenCorridorService();