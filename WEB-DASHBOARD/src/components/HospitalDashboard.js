import React, { useState } from 'react';

const MOCK_HOSPITALS = [
  {
    _id: '1', name: 'AIIMS Delhi', type: 'government',
    status: 'operational',
    emergencyCapacity: { totalBeds: 2500, availableBeds: 45, icuBeds: 250, availableICU: 8 },
    specializations: ['cardiology', 'neurology', 'trauma'],
    rating: 4.8, pricing: { acceptsAyushman: true },
    location: { address: 'Ansari Nagar, New Delhi' },
    ambulances: 5,
  },
  {
    _id: '2', name: 'Apollo Hospital', type: 'private',
    status: 'operational',
    emergencyCapacity: { totalBeds: 700, availableBeds: 18, icuBeds: 150, availableICU: 4 },
    specializations: ['cardiology', 'oncology', 'neurology'],
    rating: 4.7, pricing: { acceptsAyushman: false, emergencyFee: 3000 },
    location: { address: 'Sarita Vihar, Delhi' },
    ambulances: 8,
  },
  {
    _id: '3', name: 'Safdarjung Hospital', type: 'government',
    status: 'operational',
    emergencyCapacity: { totalBeds: 1800, availableBeds: 32, icuBeds: 180, availableICU: 5 },
    specializations: ['trauma', 'gynecology', 'orthopedics'],
    rating: 4.5, pricing: { acceptsAyushman: true },
    location: { address: 'Ring Road, New Delhi' },
    ambulances: 4,
  },
];

export default function HospitalDashboard() {
  const [hospitals] = useState(MOCK_HOSPITALS);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? hospitals
    : hospitals.filter(h => h.type === filter);

  const totalBeds     = hospitals.reduce((a, h) => a + h.emergencyCapacity.availableBeds, 0);
  const totalICU      = hospitals.reduce((a, h) => a + h.emergencyCapacity.availableICU, 0);
  const govCount      = hospitals.filter(h => h.type === 'government').length;
  const pvtCount      = hospitals.filter(h => h.type === 'private').length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">🏥 Hospital Dashboard</div>
          <div className="page-subtitle">Real-time hospital capacity and availability</div>
        </div>
        <div className="tabs">
          {['all', 'government', 'private'].map(f => (
            <button key={f} className={`tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}>
              {f === 'all' ? 'All Hospitals'
               : f === 'government' ? '🏛 Government (FREE)'
               : '🏨 Private'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card blue">
          <div className="stat-icon">🏥</div>
          <div className="stat-value">{hospitals.length}</div>
          <div className="stat-label">Total Hospitals</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">🛏</div>
          <div className="stat-value">{totalBeds}</div>
          <div className="stat-label">Available Beds</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">🫁</div>
          <div className="stat-value">{totalICU}</div>
          <div className="stat-label">Available ICU</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon">🚑</div>
          <div className="stat-value">{hospitals.reduce((a, h) => a + h.ambulances, 0)}</div>
          <div className="stat-label">Total Ambulances</div>
        </div>
      </div>

      {/* Hospital Cards */}
      <div className="grid-auto">
        {filtered.map(h => {
          const bedPct = Math.round((h.emergencyCapacity.availableBeds / h.emergencyCapacity.totalBeds) * 100);
          const icuPct = Math.round((h.emergencyCapacity.availableICU  / h.emergencyCapacity.icuBeds)   * 100);
          const isGov  = h.type === 'government';

          return (
            <div key={h._id} className="card">
              <div className="card-header">
                <span className="card-title">
                  {isGov ? '🏛' : '🏨'} {h.name}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className={`badge ${isGov ? 'green' : 'blue'}`}>
                    {isGov ? 'FREE' : 'PRIVATE'}
                  </span>
                  <span className="badge green">
                    <span className="badge-dot" />{h.status}
                  </span>
                </div>
              </div>
              <div className="card-body">
                {/* Rating + Address */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>
                    📍 {h.location.address}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--yellow)' }}>
                    ⭐ {h.rating} rating
                    {isGov && h.pricing.acceptsAyushman && (
                      <span style={{ marginLeft: 8, color: 'var(--green)', fontSize: 10 }}>
                        ✓ Ayushman Bharat
                      </span>
                    )}
                  </div>
                </div>

                {/* Bed capacity */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>Emergency Beds</span>
                    <span style={{ fontSize: 11, color: 'var(--text)' }}>
                      {h.emergencyCapacity.availableBeds} / {h.emergencyCapacity.totalBeds}
                    </span>
                  </div>
                  <div className="progress">
                    <div className={`progress-bar ${bedPct > 50 ? 'green' : bedPct > 20 ? 'yellow' : 'red'}`}
                      style={{ width: `${bedPct}%` }} />
                  </div>
                </div>

                {/* ICU capacity */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>ICU Beds</span>
                    <span style={{ fontSize: 11, color: 'var(--text)' }}>
                      {h.emergencyCapacity.availableICU} / {h.emergencyCapacity.icuBeds}
                    </span>
                  </div>
                  <div className="progress">
                    <div className={`progress-bar ${icuPct > 50 ? 'green' : icuPct > 20 ? 'yellow' : 'red'}`}
                      style={{ width: `${icuPct}%` }} />
                  </div>
                </div>

                {/* Specializations */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Specializations
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {h.specializations.map(s => (
                      <span key={s} className="badge gray">{s.replace('_', ' ')}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-sm btn-secondary" style={{ flex: 1 }}>Update Capacity</button>
                  <button className="btn btn-sm btn-blue" style={{ flex: 1 }}>View Details</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}