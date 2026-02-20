import React, { useState } from 'react';
import LiveMap from '../components/LiveMap';
import HospitalDashboard from '../components/HospitalDashboard';
import FireStationDashboard from '../components/FireStationDashboard';

const TABS = [
  { id: 'overview',   label: '⬡ Overview',        },
  { id: 'hospitals',  label: '🏥 Hospitals',       },
  { id: 'firestations',label: '🔥 Fire Stations',  },
];

export default function ControlCenter() {
  const [tab, setTab] = useState('overview');

  return (
    <div style={{ height: '100%' }}>
      {/* Sub-nav */}
      <div style={{
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        display: 'flex',
        gap: 0,
      }}>
        {TABS.map(t => (
          <button key={t.id}
            className={`tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
            style={{ borderRadius: 0, padding: '14px 18px', borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'overview' && (
        <div className="page">
          <div className="page-header">
            <div>
              <div className="page-title">Control Center</div>
              <div className="page-subtitle">Unified emergency operations overview</div>
            </div>
            <span className="live-dot">LIVE MONITORING</span>
          </div>

          {/* Alert */}
          <div className="alert yellow">
            ⚡ <strong>Green corridor active</strong> on NH-48 — 3 traffic signals overridden for AMB-002
          </div>

          {/* Full-width map */}
          <div style={{ marginBottom: 20 }}>
            <LiveMap />
          </div>

          {/* Status grid */}
          <div className="grid-3">
            {/* Ambulance Status */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">🚑 Ambulance Fleet</span>
              </div>
              <div className="card-body">
                {[
                  { id: 'AMB-001', type: 'ALS', status: 'on_duty',   location: 'NH-48' },
                  { id: 'AMB-002', type: 'BLS', status: 'available', location: 'AIIMS' },
                  { id: 'AMB-003', type: 'ICU', status: 'available', location: 'Saket' },
                ].map(a => (
                  <div key={a.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid var(--border)'
                  }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 600 }}>{a.id}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)' }}>{a.type} · {a.location}</div>
                    </div>
                    <span className={`badge ${a.status === 'available' ? 'green' : 'yellow'}`}>
                      <span className="badge-dot" />{a.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fire Truck Status */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">🚒 Fire Truck Fleet</span>
              </div>
              <div className="card-body">
                {[
                  { id: 'FT-001', type: 'Pumper', status: 'on_duty',   location: 'Karol Bagh' },
                  { id: 'FT-002', type: 'Ladder', status: 'available', location: 'Central Station' },
                  { id: 'FT-003', type: 'Tanker', status: 'returning', location: 'Ring Road' },
                ].map(f => (
                  <div key={f.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid var(--border)'
                  }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 600 }}>{f.id}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)' }}>{f.type} · {f.location}</div>
                    </div>
                    <span className={`badge ${f.status === 'available' ? 'green' : f.status === 'on_duty' ? 'red' : 'yellow'}`}>
                      <span className="badge-dot" />{f.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic Signals */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">🚦 Traffic Signals</span>
                <span className="live-dot">ACTIVE</span>
              </div>
              <div className="card-body">
                {[
                  { id: 'SIG-001', location: 'AIIMS Junction',     status: 'green_corridor', vehicle: 'AMB-002' },
                  { id: 'SIG-002', location: 'Ring Road Cross',    status: 'green_corridor', vehicle: 'AMB-002' },
                  { id: 'SIG-003', location: 'Karol Bagh Chowk',   status: 'overridden',     vehicle: 'FT-001'  },
                  { id: 'SIG-004', location: 'CP Outer Circle',    status: 'normal',         vehicle: null       },
                ].map(s => (
                  <div key={s.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '7px 0', borderBottom: '1px solid var(--border)'
                  }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text)' }}>{s.location}</div>
                      {s.vehicle && <div style={{ fontSize: 10, color: 'var(--text3)' }}>→ {s.vehicle}</div>}
                    </div>
                    <span className={`badge ${s.status === 'green_corridor' ? 'green' : s.status === 'overridden' ? 'yellow' : 'gray'}`}>
                      {s.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'hospitals'   && <HospitalDashboard />}
      {tab === 'firestations' && <FireStationDashboard />}
    </div>
  );
}