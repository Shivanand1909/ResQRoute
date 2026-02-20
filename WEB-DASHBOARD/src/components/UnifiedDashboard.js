import React, { useState, useEffect } from 'react';
import ActiveMedicalRequests from './ActiveMedicalRequests';
import ActiveFireRequests from './ActiveFireRequests';
import LiveMap from './LiveMap';

// ── Mock data (replace with API calls once backend is ready) ──
const MOCK_STATS = {
  activeEmergencies: 7,
  availableAmbulances: 12,
  availableFiretrucks: 8,
  hospitalsOnline: 6,
  resolvedToday: 24,
  avgResponseTime: '8.4 min',
};

const MOCK_RECENT = [
  { id: 1, type: 'medical', desc: 'Cardiac arrest – Connaught Place', time: '2 min ago', severity: 'critical', status: 'dispatched' },
  { id: 2, type: 'fire',    desc: 'Building fire – Karol Bagh',       time: '5 min ago', severity: 'major',    status: 'on_scene' },
  { id: 3, type: 'medical', desc: 'Road accident – NH-8',             time: '9 min ago', severity: 'severe',   status: 'en_route' },
  { id: 4, type: 'fire',    desc: 'Vehicle fire – Ring Road',         time: '14 min ago',severity: 'minor',    status: 'controlled' },
  { id: 5, type: 'medical', desc: 'Stroke – Lajpat Nagar',            time: '18 min ago',severity: 'severe',   status: 'at_hospital' },
];

function StatCard({ icon, value, label, color, delta }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {delta && <div className={`stat-delta ${delta.startsWith('+') ? '' : 'down'}`}>{delta}</div>}
    </div>
  );
}

function SeverityBadge({ severity }) {
  const map = {
    critical: 'red', major: 'red', severe: 'yellow',
    minor: 'green', moderate: 'yellow'
  };
  return <span className={`badge ${map[severity] || 'gray'}`}><span className="badge-dot" />{severity}</span>;
}

function StatusBadge({ status }) {
  const map = {
    dispatched: 'blue', on_scene: 'red', en_route: 'yellow',
    controlled: 'green', at_hospital: 'green', completed: 'gray'
  };
  return <span className={`badge ${map[status] || 'gray'}`}>{status.replace('_', ' ')}</span>;
}

export default function UnifiedDashboard() {
  const [stats, setStats]       = useState(MOCK_STATS);
  const [recent, setRecent]     = useState(MOCK_RECENT);
  const [activeTab, setActiveTab] = useState('all');
  const [time, setTime]         = useState(new Date());

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate live updates
  useEffect(() => {
    const t = setInterval(() => {
      setStats(s => ({ ...s, activeEmergencies: s.activeEmergencies + (Math.random() > 0.7 ? 1 : 0) }));
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const filtered = activeTab === 'all' ? recent
    : recent.filter(r => r.type === activeTab);

  return (
    <div className="page">
      {/* ── HEADER ── */}
      <div className="page-header">
        <div>
          <div className="page-title">Emergency Dashboard</div>
          <div className="page-subtitle">Real-time overview · ResQRoute Control Platform</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="live-dot">LIVE</span>
          <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'DM Mono' }}>
            {time.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* ── ALERT BANNER ── */}
      <div className="alert red">
        🚨 <strong>3 critical emergencies</strong> currently active — 2 ambulances dispatched, 1 awaiting assignment
      </div>

      {/* ── STATS GRID ── */}
      <div className="stats-grid">
        <StatCard icon="🚨" value={stats.activeEmergencies} label="Active Emergencies" color="red"    delta="+2 today" />
        <StatCard icon="🚑" value={stats.availableAmbulances} label="Ambulances Ready" color="blue"   delta="+3 online" />
        <StatCard icon="🚒" value={stats.availableFiretrucks} label="Fire Trucks Ready" color="yellow" />
        <StatCard icon="🏥" value={stats.hospitalsOnline}    label="Hospitals Online" color="green"  />
        <StatCard icon="✅" value={stats.resolvedToday}      label="Resolved Today"   color="green"  delta="+8 vs yesterday" />
        <StatCard icon="⏱" value={stats.avgResponseTime}    label="Avg Response Time" color="blue"  delta="-1.2 min" />
      </div>

      {/* ── MAP + RECENT ── */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <LiveMap />

        {/* Recent Emergencies */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">⚡ Recent Emergencies</span>
            <div className="tabs">
              {['all','medical','fire'].map(t => (
                <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`}
                  onClick={() => setActiveTab(t)}>
                  {t === 'all' ? 'All' : t === 'medical' ? '🚑 Medical' : '🔥 Fire'}
                </button>
              ))}
            </div>
          </div>
          <div className="card-body no-pad">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Incident</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>{r.type === 'medical' ? '🚑' : '🔥'}</span>
                          <span style={{ color: 'var(--text)', fontWeight: 500 }}>{r.desc}</span>
                        </div>
                      </td>
                      <td><SeverityBadge severity={r.severity} /></td>
                      <td><StatusBadge status={r.status} /></td>
                      <td style={{ color: 'var(--text3)', fontSize: 11 }}>{r.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── MEDICAL + FIRE REQUESTS ── */}
      <div className="grid-2">
        <ActiveMedicalRequests />
        <ActiveFireRequests />
      </div>
    </div>
  );
}