import React, { useState } from 'react';

const MOCK_FIRE = [
  {
    id: 'FIRE-001', bookingNumber: 'FIRE20260217001',
    fireType: 'residential', severity: 'major',
    location: 'Karol Bagh, Delhi',
    buildingInfo: { type: 'residential', floors: 5, affectedFloors: [2, 3], occupants: 40, trapped: 3 },
    assignedTrucks: ['FT-001 (Pumper)', 'FT-003 (Ladder)'],
    status: 'on_scene', createdAt: '8 min ago',
    aiPrediction: { estimatedControlTime: 35, recommendedTrucks: 3 },
  },
  {
    id: 'FIRE-002', bookingNumber: 'FIRE20260217002',
    fireType: 'vehicle', severity: 'minor',
    location: 'Ring Road, Delhi',
    buildingInfo: { type: 'vehicle', floors: 0, occupants: 0, trapped: 0 },
    assignedTrucks: ['FT-002 (Pumper)'],
    status: 'under_control', createdAt: '22 min ago',
    aiPrediction: { estimatedControlTime: 10, recommendedTrucks: 1 },
  },
];

const SEV_COLOR = { catastrophic: 'red', major: 'red', moderate: 'yellow', minor: 'green' };
const STATUS_COLOR = {
  reported: 'yellow', dispatching: 'yellow', en_route: 'blue',
  on_scene: 'red', under_control: 'yellow',
  controlled: 'green', extinguished: 'green', completed: 'gray',
};

export default function ActiveFireRequests() {
  const [requests] = useState(MOCK_FIRE);
  const [selected, setSelected] = useState(null);

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">🔥 Fire Incidents</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge red">
            <span className="badge-dot" />
            {requests.filter(r => r.severity === 'major' || r.severity === 'catastrophic').length} major
          </span>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>{requests.length} active</span>
        </div>
      </div>

      <div className="card-body no-pad">
        {requests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔥</div>
            <p>No active fire incidents</p>
          </div>
        ) : (
          requests.map(req => (
            <div key={req.id}
              onClick={() => setSelected(selected?.id === req.id ? null : req)}
              style={{
                padding: '12px 18px',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                borderLeft: `3px solid ${req.severity === 'major' ? 'var(--accent)' : req.severity === 'minor' ? 'var(--green)' : 'var(--yellow)'}`,
                background: selected?.id === req.id ? 'rgba(255,255,255,0.02)' : 'transparent',
              }}>

              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 12, color: 'var(--text)' }}>
                    {req.bookingNumber}
                  </span>
                  <span className={`badge ${SEV_COLOR[req.severity]}`}>
                    <span className="badge-dot" />{req.severity}
                  </span>
                </div>
                <span className={`badge ${STATUS_COLOR[req.status]}`}>
                  {req.status.replace('_', ' ')}
                </span>
              </div>

              {/* Fire type + location */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--text)', fontSize: 12, fontWeight: 600 }}>
                  🔥 {req.fireType.replace('_', ' ').toUpperCase()} FIRE
                </span>
                <span style={{
                  fontSize: 10, color: 'var(--text3)',
                  background: 'var(--bg3)', padding: '2px 8px', borderRadius: 4
                }}>
                  {req.buildingInfo.floors > 0 ? `${req.buildingInfo.floors} floors` : 'Ground level'}
                </span>
              </div>

              {/* Location */}
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>
                📍 {req.location}
              </div>

              {/* Casualties info */}
              {req.buildingInfo.trapped > 0 && (
                <div style={{ marginBottom: 6 }}>
                  <span className="badge red">⚠ {req.buildingInfo.trapped} people trapped</span>
                </div>
              )}

              {/* Fire trucks */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 11, color: 'var(--blue)' }}>
                  🚒 {req.assignedTrucks.join(', ')}
                </div>
                <span style={{ fontSize: 10, color: 'var(--text3)' }}>{req.createdAt}</span>
              </div>

              {/* AI Prediction */}
              <div style={{
                display: 'flex', gap: 12,
                fontSize: 10, color: 'var(--text3)',
                background: 'rgba(59,130,246,0.05)',
                padding: '5px 8px', borderRadius: 6,
                border: '1px solid rgba(59,130,246,0.1)'
              }}>
                <span>🤖 AI: Control in ~{req.aiPrediction.estimatedControlTime} min</span>
                <span>·</span>
                <span>Needs {req.aiPrediction.recommendedTrucks} trucks</span>
              </div>

              {/* Expanded */}
              {selected?.id === req.id && (
                <div style={{
                  marginTop: 12, padding: 12,
                  background: 'var(--bg3)',
                  borderRadius: 8, border: '1px solid var(--border)',
                }}>
                  <div style={{ marginBottom: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div style={{ fontSize: 11 }}>
                      <span style={{ color: 'var(--text3)' }}>Occupants: </span>
                      <span style={{ color: 'var(--text)' }}>{req.buildingInfo.occupants}</span>
                    </div>
                    <div style={{ fontSize: 11 }}>
                      <span style={{ color: 'var(--text3)' }}>Affected Floors: </span>
                      <span style={{ color: 'var(--text)' }}>
                        {req.buildingInfo.affectedFloors?.join(', ') || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button className="btn btn-sm btn-primary">Dispatch More Trucks</button>
                    <button className="btn btn-sm btn-secondary">Update Status</button>
                    <button className="btn btn-sm btn-secondary">View Spread Map</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'var(--text3)' }}>
          {requests.reduce((a, r) => a + (r.buildingInfo.trapped || 0), 0)} people trapped total
        </span>
        <button className="btn btn-sm btn-secondary">View All →</button>
      </div>
    </div>
  );
}