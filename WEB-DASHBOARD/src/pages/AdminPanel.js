import React, { useState } from 'react';

const MOCK_USERS = [
  { id: 1, name: 'Suresh Nair',    role: 'control_center', email: 'suresh@resqroute.in', status: 'active',   lastLogin: '2 min ago' },
  { id: 2, name: 'Priya Rajan',    role: 'hospital_admin', email: 'priya@aiims.gov.in',  status: 'active',   lastLogin: '1 hr ago'  },
  { id: 3, name: 'Rajesh Driver',  role: 'ambulance_driver',email: 'rajesh@resqroute.in',status: 'active',   lastLogin: '5 min ago' },
  { id: 4, name: 'Admin User',     role: 'admin',          email: 'admin@resqroute.in',  status: 'active',   lastLogin: 'just now'  },
  { id: 5, name: 'Vikram Captain', role: 'fire_fighter',   email: 'vikram@delhi.gov.in', status: 'inactive', lastLogin: '2 days ago'},
];

const MOCK_LOGS = [
  { id: 1, action: 'Ambulance AMB-002 dispatched',       user: 'Suresh Nair',   time: '15:02:34', type: 'dispatch' },
  { id: 2, action: 'Hospital AIIMS capacity updated',    user: 'Priya Rajan',   time: '14:58:12', type: 'update'   },
  { id: 3, action: 'Fire Truck FT-001 status → on_duty', user: 'System',        time: '14:51:20', type: 'status'   },
  { id: 4, action: 'New medical booking MED-007 created',user: 'User App',      time: '14:47:05', type: 'booking'  },
  { id: 5, action: 'Traffic signal SIG-003 overridden',  user: 'System Auto',   time: '14:43:11', type: 'traffic'  },
  { id: 6, action: 'Admin login from 192.168.1.1',       user: 'Admin User',    time: '14:40:00', type: 'auth'     },
];

const ROLE_COLOR = {
  admin: 'red', control_center: 'blue', hospital_admin: 'green',
  ambulance_driver: 'blue', fire_fighter: 'yellow'
};
const LOG_COLOR = {
  dispatch: 'red', update: 'blue', status: 'yellow', booking: 'green', traffic: 'yellow', auth: 'gray'
};

export default function AdminPanel() {
  const [tab, setTab]     = useState('overview');
  const [users]           = useState(MOCK_USERS);
  const [logs]            = useState(MOCK_LOGS);

  const systemStats = [
    { label: 'Total Users',       value: users.length,                            icon: '👥', color: 'blue'   },
    { label: 'Active Sessions',   value: users.filter(u => u.status === 'active').length, icon: '🟢', color: 'green'  },
    { label: 'API Calls Today',   value: '2,847',                                 icon: '⚡', color: 'yellow' },
    { label: 'System Uptime',     value: '99.9%',                                 icon: '📈', color: 'green'  },
    { label: 'DB Size',           value: '124 MB',                                icon: '🗄', color: 'blue'   },
    { label: 'Avg Response',      value: '142ms',                                 icon: '⏱', color: 'green'  },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">⚙ Admin Panel</div>
          <div className="page-subtitle">System management, users, and configuration</div>
        </div>
        <div className="tabs">
          {['overview', 'users', 'logs', 'settings'].map(t => (
            <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {tab === 'overview' && (
        <div>
          <div className="stats-grid">
            {systemStats.map(s => (
              <div key={s.label} className={`stat-card ${s.color}`}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid-2">
            {/* System Health */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">💚 System Health</span>
                <span className="badge green"><span className="badge-dot" />All Systems OK</span>
              </div>
              <div className="card-body">
                {[
                  { label: 'MongoDB Database',     status: 'online',  latency: '12ms'  },
                  { label: 'Redis Cache',           status: 'online',  latency: '3ms'   },
                  { label: 'WebSocket Server',      status: 'online',  latency: '8ms'   },
                  { label: 'AI/ML Service',         status: 'online',  latency: '145ms' },
                  { label: 'Firebase (FCM)',         status: 'online',  latency: '220ms' },
                  { label: 'Google Maps API',       status: 'online',  latency: '89ms'  },
                  { label: 'Traffic Signal MQTT',   status: 'online',  latency: '5ms'   },
                ].map(s => (
                  <div key={s.label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '8px 0',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    <span style={{ fontSize: 12, color: 'var(--text)' }}>{s.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, color: 'var(--text3)' }}>{s.latency}</span>
                      <span className={`badge ${s.status === 'online' ? 'green' : 'red'}`}>
                        <span className="badge-dot" />{s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">⚡ Quick Actions</span>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: '🔄 Reseed Database',       color: 'btn-secondary', desc: 'Reload sample data'          },
                    { label: '🔧 Clear Redis Cache',      color: 'btn-secondary', desc: 'Clear all cached data'       },
                    { label: '📊 Export Analytics',       color: 'btn-blue',      desc: 'Download reports as CSV'     },
                    { label: '🚨 Broadcast Emergency Alert', color: 'btn-primary', desc: 'Send alert to all users'   },
                    { label: '🔒 Lock Down System',       color: 'btn-secondary', desc: 'Disable new bookings'        },
                    { label: '📱 Test Push Notification', color: 'btn-secondary', desc: 'Send test FCM message'       },
                  ].map(a => (
                    <button key={a.label} className={`btn ${a.color}`}
                      style={{ justifyContent: 'space-between', textAlign: 'left' }}>
                      <span>{a.label}</span>
                      <span style={{ fontSize: 10, opacity: 0.7 }}>{a.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {tab === 'users' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">👥 System Users</span>
            <button className="btn btn-primary btn-sm">+ Add User</button>
          </div>
          <div className="card-body no-pad">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ color: 'var(--text)', fontWeight: 600 }}>{u.name}</td>
                      <td><span className={`badge ${ROLE_COLOR[u.role]}`}>{u.role.replace('_', ' ')}</span></td>
                      <td style={{ color: 'var(--text3)' }}>{u.email}</td>
                      <td>
                        <span className={`badge ${u.status === 'active' ? 'green' : 'gray'}`}>
                          <span className="badge-dot" />{u.status}
                        </span>
                      </td>
                      <td style={{ fontSize: 11, color: 'var(--text3)' }}>{u.lastLogin}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-xs btn-secondary">Edit</button>
                          <button className="btn btn-xs btn-secondary">
                            {u.status === 'active' ? 'Disable' : 'Enable'}
                          </button>
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

      {/* LOGS TAB */}
      {tab === 'logs' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">📋 Activity Logs</span>
            <button className="btn btn-secondary btn-sm">Export Logs</button>
          </div>
          <div className="card-body no-pad">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Action</th>
                    <th>User</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(l => (
                    <tr key={l.id}>
                      <td style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'DM Mono' }}>{l.time}</td>
                      <td style={{ color: 'var(--text)', fontSize: 12 }}>{l.action}</td>
                      <td style={{ color: 'var(--text3)' }}>{l.user}</td>
                      <td><span className={`badge ${LOG_COLOR[l.type]}`}>{l.type}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {tab === 'settings' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <span className="card-title">⚙ System Settings</span>
            </div>
            <div className="card-body">
              {[
                { label: 'MongoDB URI',      val: 'mongodb://localhost:27017/resqroute', type: 'text' },
                { label: 'Backend API URL',  val: 'http://localhost:5000/api',           type: 'text' },
                { label: 'AI Service URL',   val: 'http://localhost:8000',               type: 'text' },
                { label: 'Google Maps Key',  val: '••••••••••••••••••••',                type: 'password' },
                { label: 'JWT Secret',       val: '••••••••••••••••••••',                type: 'password' },
              ].map(s => (
                <div key={s.label} className="form-group">
                  <label>{s.label}</label>
                  <input className="input" type={s.type} defaultValue={s.val} readOnly />
                </div>
              ))}
              <button className="btn btn-primary" style={{ marginTop: 8 }}>Save Settings</button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">🔔 Notification Settings</span>
            </div>
            <div className="card-body">
              {[
                'Send lane-clear alerts to public',
                'Auto-assign nearest ambulance',
                'AI hospital recommendations',
                'Traffic signal override on emergency',
                'Email alerts for critical cases',
                'SMS alerts to emergency contacts',
              ].map(setting => (
                <div key={setting} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: 12, color: 'var(--text)' }}>{setting}</span>
                  <div style={{
                    width: 36, height: 20, borderRadius: 10,
                    background: 'var(--green)', cursor: 'pointer',
                    position: 'relative', transition: 'background 0.2s',
                  }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%',
                      background: '#fff', position: 'absolute',
                      right: 3, top: 3,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}