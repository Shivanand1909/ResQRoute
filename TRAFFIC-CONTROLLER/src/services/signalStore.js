const logger = require('../utils/logger');

/**
 * In-memory storage for traffic signals
 * In production, this would be Redis or a database
 */
class SignalStore {
  constructor() {
    this.signals = new Map();
    this.corridors = new Map();
    this.overrides = new Map();
  }

  // Signal Management
  addSignal(signalId, signalData) {
    this.signals.set(signalId, {
      ...signalData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    logger.info(`Signal added: ${signalId}`);
  }

  getSignal(signalId) {
    return this.signals.get(signalId);
  }

  getAllSignals() {
    return Array.from(this.signals.values());
  }

  updateSignal(signalId, updates) {
    const signal = this.signals.get(signalId);
    if (!signal) return null;

    const updated = {
      ...signal,
      ...updates,
      updatedAt: new Date()
    };
    this.signals.set(signalId, updated);
    return updated;
  }

  deleteSignal(signalId) {
    return this.signals.delete(signalId);
  }

  // Green Corridor Management
  addCorridor(vehicleId, corridorData) {
    this.corridors.set(vehicleId, {
      ...corridorData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    logger.info(`Green corridor created for vehicle: ${vehicleId}`);
  }

  getCorridor(vehicleId) {
    return this.corridors.get(vehicleId);
  }

  getAllCorridors() {
    return Array.from(this.corridors.values());
  }

  updateCorridor(vehicleId, updates) {
    const corridor = this.corridors.get(vehicleId);
    if (!corridor) return null;

    const updated = {
      ...corridor,
      ...updates,
      updatedAt: new Date()
    };
    this.corridors.set(vehicleId, updated);
    return updated;
  }

  deleteCorridor(vehicleId) {
    return this.corridors.delete(vehicleId);
  }

  // Signal Override Management
  addOverride(key, overrideData) {
    this.overrides.set(key, {
      ...overrideData,
      createdAt: new Date()
    });
  }

  getOverride(key) {
    return this.overrides.get(key);
  }

  deleteOverride(key) {
    return this.overrides.delete(key);
  }

  // Cleanup expired overrides
  cleanupExpiredOverrides() {
    const now = Date.now();
    for (const [key, override] of this.overrides.entries()) {
      if (override.expiresAt && override.expiresAt < now) {
        this.overrides.delete(key);
        logger.info(`Expired override removed: ${key}`);
      }
    }
  }
}

// Create singleton instance
const signalStore = new SignalStore();

// Cleanup expired overrides every minute
setInterval(() => {
  signalStore.cleanupExpiredOverrides();
}, 60000);

module.exports = signalStore;