import React, { useState, useEffect } from 'react';

const MOCK_MEDICAL = [
  {
    id: 'MED-001', bookingNumber: 'MED20260217001',
    emergencyType: 'cardiac_arrest', severity: 'critical',
    patient: { name: 'Ramesh Kumar', age: 65, bloodGroup: 'B+' },
    hospitalPreference: 'government',
    selectedHospital: 'AIIMS Delhi',
    assignedAmbulance: 'AMB-002 (ALS)',
    status: 'ambulance_on_way',
    eta: 6, location: 'Connaught Place, Delhi',
    createdAt: '5 min ago',
  },
  {
    id: 'MED-002', bookingNumber: 'MED20260217002',
    emergencyType: 'stroke', severity: 'severe',
    patient: { name: 'Priya Sharma', age: 48, bloodGroup: 'O+' },
    hospitalPreference: 'private_ai',
    selectedHospital: 'Apollo Hospital',
    assignedAmbulance: 'AMB-001 (BLS)',
    status: 'en_route_hospital',
    eta: 12, location: 'Lajpat Nagar, Delhi',
    createdAt: '12 min ago',
  },
  {
    id: 'MED-003', bookingNumber: 'MED20260217003',
    emergencyType: 'accident', severity: 'moderate',
    patient: { name: 'Anil Singh', age: 32, bloodGroup: 'A-' },
    hospitalPreference: 'government',
    selectedHospital: 'Safdarjung Hospital',
    assignedAmbulance: null,
    status: 'searching_ambulance',
    eta: null, location: 'NH-48, Delhi',
    createdAt: '2 min ago',
  },
];

const SEVERITY_COLOR = { critical: 'red', severe: 'yellow', moderate: 'yellow', mild: 'green' };
const STATUS_COLOR = {
  pending: 'gray', searching_ambulance: 'yellow', ambulance_assigned: 'blue',
  ambulance_on_way: 'blue', en_route_hospital: 'blue',
  reached_hospital: 'green', completed: 'green', cancelled: 'gray',
};
const STATUS_LABEL = {
  pending: 'Pending', searching_ambulance: 'Searching', ambulance_assigned: 'Assigned',
  ambulance_on_way: 'On Way', en_route_hospital: 'En Route',
  reached_hospital: 'Arrived', completed: 'Completed', cancelled: 'Cancelled',
};

export default function ActiveMedicalRequests() {
  const [requests, setRequests] = useState(MOCK_MEDICAL);
  const [selected, setSelected] = useState(null);

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">🚑 Medical Emergencies</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge red"><span className="badge-dot" />{requests.filter(r => r.severity === 'critical').length} critical</span>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>{requests.length} active</span>
        </div>
      </div>

      <div className="card-body no-pad">
        {requests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚑</div>
            <p>No active medical emergencies</p>
          </div>
        ) : (
          <div>
            {requests.map(req => (
              <div key={req.id}
                onClick={() => setSelected(selected?.id === req.id ? null : req)}
                style={{
                  padding: '12px 18px',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  borderLeft: `3px solid ${req.severity === 'critical' ? 'var(--red)' : req.severity === 'severe' ? 'var(--yellow)' : 'var(--border)'}`,
                  transition: 'background 0.2s',
                  background: selected?.id === req.id ? 'rgba(255,255,255,0.02)' : 'transparent',
                }}>

                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 12, color: 'var(--text)' }}>
                      {req.bookingNumber}
                    </span>
                    <span className={`badge ${SEVERITY_COLOR[req.severity]}`}>
                      <span className="badge-dot" />{req.severity}
                    </span>
                  </div>
                  <span className={`badge ${STATUS_COLOR[req.status]}`}>
                    {STATUS_LABEL[req.status]}
                  </span>
                </div>

                {/* Patient + Emergency */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <span style={{ color: 'var(--text)', fontSize: 12, fontWeight: 600 }}>
                      👤 {req.patient.name}
                    </span>
                    <span style={{ color: 'var(--text3)', fontSize: 11, marginLeft: 6 }}>
                      {req.patient.age}y · {req.patient.bloodGroup}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 10, color: 'var(--text3)',
                    background: 'var(--bg3)', padding: '2px 8px', borderRadius: 4
                  }}>
                    {req.emergencyType.replace('_', ' ')}
                  </span>
                </div>

                {/* Location + Hospital */}
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>
                  📍 {req.location} →&nbsp;
                  <span style={{ color: req.hospitalPreference === 'government' ? 'var(--green)' : 'var(--blue)' }}>
                    🏥 {req.selectedHospital}
                  </span>
                  <span style={{
                    marginLeft: 6, fontSize: 9,
                    color: req.hospitalPreference === 'government' ? 'var(--green)' : 'var(--blue)',
                    background: req.hospitalPreference === 'government' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)',
                    padding: '1px 5px', borderRadius: 3
                  }}>
                    {req.hospitalPreference === 'government' ? 'FREE' : 'PRIVATE'}
                  </span>
                </div>

                {/* Ambulance + ETA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: req.assignedAmbulance ? 'var(--blue)' : 'var(--yellow)' }}>
                    🚑 {req.assignedAmbulance || 'Searching ambulance...'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {req.eta && (
                      <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>
                        ETA: {req.eta} min
                      </span>
                    )}
                    <span style={{ fontSize: 10, color: 'var(--text3)' }}>{req.createdAt}</span>
                  </div>
                </div>

                {/* Expanded detail */}
                {selected?.id === req.id && (
                  <div style={{
                    marginTop: 12,
                    padding: 12,
                    background: 'var(--bg3)',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                  }}>
                    <div style={{ marginBottom: 10, fontFamily: 'Syne', fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Quick Actions
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button className="btn btn-sm btn-blue">Assign Ambulance</button>
                      <button className="btn btn-sm btn-green">Update Status</button>
                      <button className="btn btn-sm btn-secondary">View Details</button>
                      <button className="btn btn-sm btn-secondary">Contact Patient</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--text3)' }}>
          {requests.filter(r => r.status === 'searching_ambulance').length} awaiting ambulance
        </span>
        <button className="btn btn-sm btn-secondary">View All →</button>
      </div>
    </div>
  );
}