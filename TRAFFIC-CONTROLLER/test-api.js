/**
 * API Testing Script for Traffic Controller
 * Tests all major endpoints
 * 
 * Usage: node test-api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:6080';
let testsPassed = 0;
let testsFailed = 0;

console.log('\n🧪 Testing Traffic Controller API...\n');

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 6080,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ statusCode: res.statusCode, data: response });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test functions
async function testHealthCheck() {
  try {
    console.log('Test 1: Health Check');
    const { statusCode, data } = await makeRequest('GET', '/health');
    
    if (statusCode === 200 && data.status === 'OK') {
      console.log('  ✅ PASSED - Health check working');
      console.log(`     Mode: ${data.mode}`);
      testsPassed++;
    } else {
      console.log('  ❌ FAILED - Unexpected response');
      testsFailed++;
    }
  } catch (error) {
    console.log('  ❌ FAILED -', error.message);
    testsFailed++;
  }
  console.log('');
}

async function testCreateSignal() {
  try {
    console.log('Test 2: Create Signal');
    const signalData = {
      signalId: 'TEST_SIGNAL_001',
      location: {
        latitude: 28.6139,
        longitude: 77.2090
      },
      currentState: 'red'
    };

    const { statusCode, data } = await makeRequest('POST', '/api/signals/init', signalData);
    
    if (statusCode === 201 && data.success) {
      console.log('  ✅ PASSED - Signal created');
      console.log(`     Signal ID: ${data.data.signal.signalId}`);
      testsPassed++;
    } else {
      console.log('  ❌ FAILED - Could not create signal');
      testsFailed++;
    }
  } catch (error) {
    console.log('  ❌ FAILED -', error.message);
    testsFailed++;
  }
  console.log('');
}

async function testGetSignals() {
  try {
    console.log('Test 3: Get All Signals');
    const { statusCode, data } = await makeRequest('GET', '/api/signals');
    
    if (statusCode === 200 && data.success) {
      console.log('  ✅ PASSED - Retrieved signals');
      console.log(`     Count: ${data.data.count}`);
      testsPassed++;
    } else {
      console.log('  ❌ FAILED - Could not get signals');
      testsFailed++;
    }
  } catch (error) {
    console.log('  ❌ FAILED -', error.message);
    testsFailed++;
  }
  console.log('');
}

async function testCreateGreenCorridor() {
  try {
    console.log('Test 4: Create Green Corridor');
    const corridorData = {
      vehicleId: 'TEST_AMB_001',
      vehicleType: 'ambulance',
      route: {
        coordinates: [
          { lat: 28.6139, lng: 77.2090 },
          { lat: 28.6200, lng: 77.2150 }
        ]
      },
      priority: 'high'
    };

    const { statusCode, data } = await makeRequest('POST', '/api/emergency/corridor', corridorData);
    
    if (statusCode === 201 && data.success) {
      console.log('  ✅ PASSED - Green corridor created');
      console.log(`     Vehicle: ${data.data.corridor.vehicleId}`);
      console.log(`     Signals affected: ${data.data.corridor.affectedSignals.length}`);
      testsPassed++;
      return data.data.corridor.vehicleId;
    } else {
      console.log('  ❌ FAILED - Could not create corridor');
      testsFailed++;
    }
  } catch (error) {
    console.log('  ❌ FAILED -', error.message);
    testsFailed++;
  }
  console.log('');
  return null;
}

async function testUpdateVehicleLocation(vehicleId) {
  try {
    console.log('Test 5: Update Vehicle Location');
    const locationData = {
      latitude: 28.6150,
      longitude: 77.2100,
      heading: 45,
      speed: 60
    };

    const { statusCode, data } = await makeRequest('PATCH', `/api/emergency/vehicle/${vehicleId}/location`, locationData);
    
    if (statusCode === 200 && data.success) {
      console.log('  ✅ PASSED - Location updated');
      console.log(`     Upcoming signals: ${data.data.upcomingSignals}`);
      testsPassed++;
    } else {
      console.log('  ❌ FAILED - Could not update location');
      testsFailed++;
    }
  } catch (error) {
    console.log('  ❌ FAILED -', error.message);
    testsFailed++;
  }
  console.log('');
}

async function testGetActiveCorridors() {
  try {
    console.log('Test 6: Get Active Corridors');
    const { statusCode, data } = await makeRequest('GET', '/api/emergency/corridor');
    
    if (statusCode === 200 && data.success) {
      console.log('  ✅ PASSED - Retrieved corridors');
      console.log(`     Active: ${data.data.count}`);
      testsPassed++;
    } else {
      console.log('  ❌ FAILED - Could not get corridors');
      testsFailed++;
    }
  } catch (error) {
    console.log('  ❌ FAILED -', error.message);
    testsFailed++;
  }
  console.log('');
}

async function testClearCorridor(vehicleId) {
  try {
    console.log('Test 7: Clear Green Corridor');
    const { statusCode, data } = await makeRequest('DELETE', `/api/emergency/corridor/${vehicleId}`);
    
    if (statusCode === 200 && data.success) {
      console.log('  ✅ PASSED - Corridor cleared');
      testsPassed++;
    } else {
      console.log('  ❌ FAILED - Could not clear corridor');
      testsFailed++;
    }
  } catch (error) {
    console.log('  ❌ FAILED -', error.message);
    testsFailed++;
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  await testHealthCheck();
  await testCreateSignal();
  await testGetSignals();
  
  const vehicleId = await testCreateGreenCorridor();
  
  if (vehicleId) {
    await testUpdateVehicleLocation(vehicleId);
    await testGetActiveCorridors();
    await testClearCorridor(vehicleId);
  }

  // Results
  console.log('═══════════════════════════════════════════');
  console.log('TEST RESULTS');
  console.log('═══════════════════════════════════════════');
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log(`📊 Total:  ${testsPassed + testsFailed}`);
  console.log('═══════════════════════════════════════════\n');

  if (testsFailed === 0) {
    console.log('🎉 All tests passed! Traffic Controller is working correctly.\n');
  } else {
    console.log('⚠️  Some tests failed. Check the output above for details.\n');
    console.log('Make sure the server is running: npm start\n');
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('\n❌ Test suite failed:', error.message);
  console.log('\nMake sure the server is running on http://localhost:6080\n');
});