import React, { useState } from 'react';

const PENDING = [
  { id: 'MED-007', type: 'medical', emergency: 'Cardiac Arrest', location: 'Dwarka Sector 10', severity: 'critical', patient: 'Mohan Lal, 70y', time: '30 sec ago', hospitalPref: 'government' },
  { id: 'MED-008', type: 'medical', emergency: 'Accident',       location: 'Outer Ring Road',  severity: 'severe',   patient: 'Sunita Devi, 35y', time: '1 min ago', hospitalPref: 'private_ai' },
  { id: 'FIRE-005',type: 'fire',    emergency: 'Electrical Fire', location: 'Janakpuri B Block',severity: 'moderate', patient: null, time: '2 min ago', hospitalPref: null },
];

const AVAILABLE_AMBULANCES = [
  { id: 'AMB-002', type: 'BLS', location: 'AIIMS', distance: '3.2 km', eta: 8  },
  { id: 'AMB-003', type: 'ICU', location: 'Saket', distance: '5.1 km', eta: 12 },
  { id: 'AMB-005', type: 'ALS', location: 'Karol Bagh', distance: '7.8 km', eta: 16 },
];

const AVAILABLE_TRUCKS = [
  { id: 'FT-002', type: 'Ladder', location: 'Central Station', distance: '4.1 km', eta: 9  },
  { id: 'FT-003', type: 'Tanker', location: 'North Station',   distance: '6.2 km', eta: 14 },
];

export default function DispatchCenter() {
  const [selected, setSelected]     = useState(null);
  const [dispatched, setDispatched] = useState([]);
  const [assignedVehicle, setAssignedVehicle] = useState(null);

  function handleDispatch() {
    if (!selected || !assignedVehicle) return;
    setDispatched(d => [...d, { ...selected, vehicle: assignedVehicle, dispatchedAt: 'just now' }]);
    setSelected(null);
    setAssignedVehicle(null);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Dispatch Center</div>
          <div className="page-subtitle">Assign vehicles to incoming emergencies</div>
        </div>
        <span className="live-dot">LIVE QUEUE</span>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>

        {/* LEFT — Pending Queue */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <span className="card-title">⚡ Pending Queue</span>
              <span className="badge red"><span className="badge-dot" />{PENDING.length} waiting</span>
            </div>
            <div className="card-body no-pad">
              {PENDING.map(req => (
                <div key={req.id}
                  onClick={() => { setSelected(req); setAssignedVehicle(null); }}
                  style={{
                    padding: '12px 18px',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    borderLeft: `3px solid ${req.severity === 'critical' ? 'var(--red)' : req.severity === 'severe' ? 'var(--yellow)' : 'var(--border)'}`,
                    background: selected?.id === req.id ? 'rgba(232,69,69,0.05)' : 'transparent',
                    transition: 'background 0.2s',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 12, color: 'var(--text)' }}>
                      {req.type === 'medical' ? '🚑' : '🔥'} {req.id}
                    </span>
                    <span className={`badge ${req.severity === 'critical' ? 'red' : req.severity === 'severe' ? 'yellow' : 'green'}`}>
                      <span className="badge-dot" />{req.severity}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 4 }}>{req.emergency}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>📍 {req.location}</div>
                  {req.patient && <div style={{ fontSize: 11, color: 'var(--text3)' }}>👤 {req.patient}</div>}
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{req.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dispatched log */}
          {dispatched.length > 0 && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">✅ Dispatched</span>
              </div>
              <div className="card-body no-pad">
                {dispatched.map((d, i) => (
                  <div key={i} style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: 'var(--text)' }}>{d.id} → {d.vehicle}</span>
                      <span className="badge green">dispatched</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{d.location} · {d.dispatchedAt}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Assign Panel */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🎯 Assign Vehicle</span>
          </div>
          <div className="card-body">
            {!selected ? (
              <div className="empty-state">
                <div className="empty-icon">👆</div>
                <p>Select an emergency from the queue to assign a vehicle</p>
              </div>
            ) : (
              <div>
                {/* Selected emergency details */}
                <div style={{
                  background: 'var(--bg3)', borderRadius: 8,
                  padding: 14, marginBottom: 18,
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 8, color: 'var(--accent)' }}>
                    Selected: {selected.id}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 4 }}>{selected.emergency}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>📍 {selected.location}</div>
                  {selected.patient && <div style={{ fontSize: 11, color: 'var(--text3)' }}>👤 {selected.patient}</div>}
                  {selected.hospitalPref && (
                    <div style={{ marginTop: 6 }}>
                      <span className={`badge ${selected.hospitalPref === 'government' ? 'green' : 'blue'}`}>
                        {selected.hospitalPref === 'government' ? '🏛 Government Hospital (FREE)' : '🏨 Private Hospital (AI)'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Available vehicles */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {selected.type === 'medical' ? '🚑 Available Ambulances' : '🚒 Available Fire Trucks'}
                  </div>
                  {(selected.type === 'medical' ? AVAILABLE_AMBULANCES : AVAILABLE_TRUCKS).map(v => (
                    <div key={v.id}
                      onClick={() => setAssignedVehicle(v.id)}
                      style={{
                        padding: '10px 14px',
                        border: `1px solid ${assignedVehicle === v.id ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: 8, marginBottom: 8, cursor: 'pointer',
                        background: assignedVehicle === v.id ? 'rgba(232,69,69,0.08)' : 'var(--bg3)',
                        transition: 'all 0.2s',
                      }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 12 }}>{v.id}</span>
                          <span style={{ color: 'var(--text3)', fontSize: 11, marginLeft: 8 }}>{v.type}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>ETA: {v.eta} min</div>
                          <div style={{ fontSize: 10, color: 'var(--text3)' }}>{v.distance}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>📍 {v.location}</div>
                    </div>
                  ))}
                </div>

                {/* Dispatch button */}
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                  disabled={!assignedVehicle}
                  onClick={handleDispatch}>
                  {assignedVehicle ? `🚨 Dispatch ${assignedVehicle} Now` : 'Select a vehicle first'}
                </button>

                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                  onClick={() => setSelected(null)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}