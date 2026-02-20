import React, { useState } from 'react';

const MOCK_STATIONS = [
  {
    _id: '1', name: 'Central Fire Station Delhi', code: 'CFS-DL-001',
    status: 'operational',
    location: { address: 'Connaught Place, New Delhi' },
    personnel: { total: 85, onDuty: 42 },
    equipment: { firetrucks: 8, waterTankers: 3, ladderTrucks: 2, rescueVehicles: 2 },
    coverageArea: { radius: 15, districts: ['Central Delhi', 'New Delhi'] },
    rating: 4.7, totalIncidentsHandled: 3420,
  },
  {
    _id: '2', name: 'North Delhi Fire Station', code: 'NFS-DL-002',
    status: 'operational',
    location: { address: 'Model Town, Delhi' },
    personnel: { total: 70, onDuty: 35 },
    equipment: { firetrucks: 6, waterTankers: 2, ladderTrucks: 1, rescueVehicles: 1 },
    coverageArea: { radius: 12, districts: ['North Delhi', 'Model Town'] },
    rating: 4.5, totalIncidentsHandled: 2810,
  },
];

const MOCK_TRUCKS = [
  { id: 'FT-001', type: 'pumper',  status: 'on_duty',   station: 'Central', water: '4000/4000L' },
  { id: 'FT-002', type: 'ladder',  status: 'available', station: 'Central', water: '2000/2000L' },
  { id: 'FT-003', type: 'tanker',  status: 'available', station: 'North',   water: '10000/10000L' },
  { id: 'FT-004', type: 'pumper',  status: 'returning', station: 'North',   water: '1200/4000L' },
  { id: 'FT-005', type: 'rescue',  status: 'available', station: 'Central', water: 'N/A' },
];

const STATUS_COLOR = {
  available: 'green', on_duty: 'red',
  returning: 'yellow', refilling: 'blue',
  maintenance: 'gray', offline: 'gray',
};

export default function FireStationDashboard() {
  const [stations]  = useState(MOCK_STATIONS);
  const [trucks]    = useState(MOCK_TRUCKS);
  const [activeTab, setActiveTab] = useState('stations');

  const availableTrucks = trucks.filter(t => t.status === 'available').length;
  const onDutyTrucks    = trucks.filter(t => t.status === 'on_duty').length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">🔥 Fire Station Dashboard</div>
          <div className="page-subtitle">Station management and fire truck tracking</div>
        </div>
        <div className="tabs">
          <button className={`tab ${activeTab === 'stations' ? 'active' : ''}`} onClick={() => setActiveTab('stations')}>Stations</button>
          <button className={`tab ${activeTab === 'trucks'   ? 'active' : ''}`} onClick={() => setActiveTab('trucks')}>Fire Trucks</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        <div className="stat-card red">
          <div className="stat-icon">🏚</div>
          <div className="stat-value">{stations.length}</div>
          <div className="stat-label">Fire Stations</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon">🚒</div>
          <div className="stat-value">{trucks.length}</div>
          <div className="stat-label">Total Trucks</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{availableTrucks}</div>
          <div className="stat-label">Available Now</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{onDutyTrucks}</div>
          <div className="stat-label">On Active Duty</div>
        </div>
      </div>

      {/* STATIONS TAB */}
      {activeTab === 'stations' && (
        <div className="grid-2">
          {stations.map(s => {
            const dutyPct = Math.round((s.personnel.onDuty / s.personnel.total) * 100);
            return (
              <div key={s._id} className="card">
                <div className="card-header">
                  <span className="card-title">🔥 {s.name}</span>
                  <span className="badge green"><span className="badge-dot" />{s.status}</span>
                </div>
                <div className="card-body">
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12 }}>
                    📍 {s.location.address} · Code: <strong style={{ color: 'var(--text)' }}>{s.code}</strong>
                  </div>

                  {/* Personnel */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: 'var(--text3)' }}>Personnel On Duty</span>
                      <span style={{ fontSize: 11, color: 'var(--text)' }}>{s.personnel.onDuty} / {s.personnel.total}</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar green" style={{ width: `${dutyPct}%` }} />
                    </div>
                  </div>

                  {/* Equipment grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    {[
                      ['🚒', 'Fire Trucks', s.equipment.firetrucks],
                      ['💧', 'Water Tankers', s.equipment.waterTankers],
                      ['🪜', 'Ladder Trucks', s.equipment.ladderTrucks],
                      ['🛻', 'Rescue Vehicles', s.equipment.rescueVehicles],
                    ].map(([icon, label, val]) => (
                      <div key={label} style={{
                        background: 'var(--bg3)', borderRadius: 6,
                        padding: '8px 10px', textAlign: 'center',
                      }}>
                        <div style={{ fontSize: 16, marginBottom: 2 }}>{icon}</div>
                        <div style={{ fontSize: 16, fontFamily: 'Syne', fontWeight: 800, color: 'var(--text)' }}>{val}</div>
                        <div style={{ fontSize: 9, color: 'var(--text3)' }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Coverage + Stats */}
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12 }}>
                    📡 Coverage: {s.coverageArea.radius}km radius · {s.coverageArea.districts.join(', ')}<br />
                    📊 Total incidents: <span style={{ color: 'var(--text)' }}>{s.totalIncidentsHandled.toLocaleString()}</span> · 
                    ⭐ {s.rating}
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm btn-secondary" style={{ flex: 1 }}>View Trucks</button>
                    <button className="btn btn-sm btn-primary"   style={{ flex: 1 }}>Dispatch</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TRUCKS TAB */}
      {activeTab === 'trucks' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">🚒 All Fire Trucks</span>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>{trucks.length} vehicles</span>
          </div>
          <div className="card-body no-pad">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Vehicle ID</th>
                    <th>Type</th>
                    <th>Station</th>
                    <th>Water Level</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trucks.map(t => (
                    <tr key={t.id}>
                      <td style={{ color: 'var(--text)', fontWeight: 600 }}>{t.id}</td>
                      <td>
                        <span className="badge blue">{t.type}</span>
                      </td>
                      <td style={{ color: 'var(--text3)' }}>{t.station}</td>
                      <td style={{ fontSize: 11 }}>💧 {t.water}</td>
                      <td>
                        <span className={`badge ${STATUS_COLOR[t.status]}`}>
                          <span className="badge-dot" />{t.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-xs btn-secondary">Details</button>
                          {t.status === 'available' && (
                            <button className="btn btn-xs btn-primary">Dispatch</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}