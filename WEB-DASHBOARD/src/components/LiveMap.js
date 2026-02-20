import React, { useState, useEffect } from 'react';

// ── Mock vehicle positions (replace with real WebSocket data) ──
const MOCK_VEHICLES = [
  { id: 'AMB-001', type: 'ambulance', lat: 28.567, lng: 77.209, status: 'on_duty',   label: 'AMB-001' },
  { id: 'AMB-002', type: 'ambulance', lat: 28.540, lng: 77.227, status: 'available', label: 'AMB-002' },
  { id: 'AMB-003', type: 'ambulance', lat: 28.635, lng: 77.224, status: 'available', label: 'AMB-003' },
  { id: 'FT-001',  type: 'firetruck', lat: 28.636, lng: 77.225, status: 'on_duty',   label: 'FT-001'  },
  { id: 'FT-002',  type: 'firetruck', lat: 28.704, lng: 77.217, status: 'available', label: 'FT-002'  },
];

const MOCK_INCIDENTS = [
  { id: 1, type: 'medical', lat: 28.632, lng: 77.220, desc: 'Cardiac Arrest', severity: 'critical' },
  { id: 2, type: 'fire',    lat: 28.552, lng: 77.190, desc: 'Building Fire',  severity: 'major'    },
];

export default function LiveMap() {
  const [vehicles, setVehicles]   = useState(MOCK_VEHICLES);
  const [selected, setSelected]   = useState(null);
  const [filter, setFilter]       = useState('all');

  // Simulate vehicle movement
  useEffect(() => {
    const t = setInterval(() => {
      setVehicles(prev => prev.map(v => ({
        ...v,
        lat: v.lat + (Math.random() - 0.5) * 0.002,
        lng: v.lng + (Math.random() - 0.5) * 0.002,
      })));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const filtered = vehicles.filter(v =>
    filter === 'all' || v.type === filter
  );

  const countByType = (type) => vehicles.filter(v => v.type === type).length;
  const countByStatus = (status) => vehicles.filter(v => v.status === status).length;

  return (
    <div className="card" style={{ minHeight: 420 }}>
      <div className="card-header">
        <span className="card-title">🗺 Live Vehicle Map</span>
        <span className="live-dot">TRACKING</span>
      </div>

      {/* Filters */}
      <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        {['all', 'ambulance', 'firetruck'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(f)}>
            {f === 'all' ? 'All Vehicles' : f === 'ambulance' ? '🚑 Ambulances' : '🚒 Fire Trucks'}
          </button>
        ))}
      </div>

      {/* Map Visualization */}
      <div style={{ padding: 16 }}>
        <div className="map-placeholder" style={{ height: 280, position: 'relative', overflow: 'hidden' }}>
          {/* Grid lines for map feel */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.3
          }} />

          {/* Vehicle dots */}
          {filtered.map((v, i) => {
            const x = ((v.lng - 77.18) / 0.06) * 100;
            const y = ((28.72 - v.lat)  / 0.18) * 100;
            const isAmb = v.type === 'ambulance';
            const isActive = v.status === 'on_duty';
            return (
              <div key={v.id}
                onClick={() => setSelected(selected?.id === v.id ? null : v)}
                style={{
                  position: 'absolute',
                  left: `${Math.max(2, Math.min(95, x))}%`,
                  top:  `${Math.max(2, Math.min(90, y))}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: 10,
                }}>
                <div style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: isAmb ? 'rgba(59,130,246,0.2)' : 'rgba(239,68,68,0.2)',
                  border: `2px solid ${isAmb ? 'var(--blue)' : 'var(--red)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13,
                  boxShadow: isActive ? `0 0 12px ${isAmb ? 'var(--blue)' : 'var(--red)'}` : 'none',
                  animation: isActive ? 'pulse 2s infinite' : 'none',
                }}>
                  {isAmb ? '🚑' : '🚒'}
                </div>
                <div style={{
                  fontSize: 9, color: 'var(--text3)', textAlign: 'center',
                  marginTop: 2, whiteSpace: 'nowrap'
                }}>
                  {v.label}
                </div>
              </div>
            );
          })}

          {/* Incident markers */}
          {MOCK_INCIDENTS.map(inc => {
            const x = ((inc.lng - 77.18) / 0.06) * 100;
            const y = ((28.72 - inc.lat) / 0.18) * 100;
            return (
              <div key={inc.id} style={{
                position: 'absolute',
                left: `${Math.max(2, Math.min(95, x))}%`,
                top:  `${Math.max(2, Math.min(90, y))}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 5,
              }}>
                <div style={{
                  width: 10, height: 10,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  boxShadow: '0 0 10px var(--accent)',
                  animation: 'pulse 1s infinite',
                }} />
              </div>
            );
          })}

          {/* Map legend */}
          <div style={{
            position: 'absolute', bottom: 10, left: 10,
            background: 'rgba(8,12,20,0.85)',
            border: '1px solid var(--border)',
            borderRadius: 6, padding: '6px 10px',
            fontSize: 10, color: 'var(--text3)',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)' }} />
              Ambulance
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)' }} />
              Fire Truck
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }} />
              Incident
            </div>
          </div>

          {/* Selected vehicle popup */}
          {selected && (
            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 8, padding: '10px 14px',
              fontSize: 11, minWidth: 160,
              boxShadow: 'var(--shadow)',
            }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>
                {selected.type === 'ambulance' ? '🚑' : '🚒'} {selected.label}
              </div>
              <div style={{ color: 'var(--text3)', marginBottom: 4 }}>
                Status: <span style={{ color: selected.status === 'on_duty' ? 'var(--yellow)' : 'var(--green)' }}>
                  {selected.status.replace('_', ' ')}
                </span>
              </div>
              <div style={{ color: 'var(--text3)' }}>
                Lat: {selected.lat.toFixed(4)}<br />
                Lng: {selected.lng.toFixed(4)}
              </div>
              <button className="btn btn-xs btn-secondary" style={{ marginTop: 8, width: '100%' }}
                onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          )}

          {/* Google Maps note */}
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            fontSize: 9, color: 'var(--text3)',
          }}>
            Add Google Maps API key to enable full map
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        padding: '10px 18px',
        borderTop: '1px solid var(--border)',
        display: 'flex', gap: 20,
      }}>
        <div style={{ fontSize: 11 }}>
          <span style={{ color: 'var(--text3)' }}>Total: </span>
          <span style={{ color: 'var(--text)', fontWeight: 600 }}>{vehicles.length}</span>
        </div>
        <div style={{ fontSize: 11 }}>
          <span style={{ color: 'var(--text3)' }}>On Duty: </span>
          <span style={{ color: 'var(--yellow)', fontWeight: 600 }}>{countByStatus('on_duty')}</span>
        </div>
        <div style={{ fontSize: 11 }}>
          <span style={{ color: 'var(--text3)' }}>Available: </span>
          <span style={{ color: 'var(--green)', fontWeight: 600 }}>{countByStatus('available')}</span>
        </div>
        <div style={{ fontSize: 11 }}>
          <span style={{ color: 'var(--text3)' }}>Ambulances: </span>
          <span style={{ color: 'var(--blue)', fontWeight: 600 }}>{countByType('ambulance')}</span>
        </div>
        <div style={{ fontSize: 11 }}>
          <span style={{ color: 'var(--text3)' }}>Fire Trucks: </span>
          <span style={{ color: 'var(--red)', fontWeight: 600 }}>{countByType('firetruck')}</span>
        </div>
      </div>
    </div>
  );
}