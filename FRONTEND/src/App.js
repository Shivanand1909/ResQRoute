import React, { useState, useEffect, useRef } from 'react';

/* ============================================================
   GLOBAL STYLES
   ============================================================ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #020408; color: #e8f4fd; font-family: 'Rajdhani', sans-serif; overflow-x: hidden; -webkit-tap-highlight-color: transparent; }
    input, button, select, textarea { font-family: inherit; }
    input[type="text"], input[type="tel"], input[type="number"], input[type="email"] { font-size: 16px; }
    input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    input[type=number] { -moz-appearance: textfield; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #020408; }
    ::-webkit-scrollbar-thumb { background: rgba(0,245,255,0.2); border-radius: 3px; }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideLeft { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
    @keyframes pulseNeon { 0%,100%{opacity:1} 50%{opacity:0.35} }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(127,255,0,0.2)} 50%{box-shadow:0 0 40px rgba(127,255,0,0.6)} }
    .em-card:hover { transform: translateY(-5px) !important; }
    .em-card:active { transform: translateY(-2px) !important; }
    @media (max-width: 600px) {
      .nav-status-text { display: none !important; }
      .nav-clock { display: none !important; }
      .em-grid { grid-template-columns: 1fr !important; }
      .stats-grid { grid-template-columns: 1fr 1fr !important; }
    }
    @media (max-width: 400px) {
      .stats-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

/* ============================================================
   SHARED UI COMPONENTS
   ============================================================ */
const BgGrid = ({ rgb = '0,245,255' }) => (
  <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
    backgroundImage:`linear-gradient(rgba(${rgb},0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(${rgb},0.025) 1px,transparent 1px)`,
    backgroundSize:'50px 50px' }} />
);

// FIX: RInput now accepts maxLength and handles numeric limiting correctly
const RInput = ({ label, type='text', value, onChange, placeholder, icon, maxLength, inputMode }) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (e) => {
    let val = e.target.value;
    // For numeric inputs, strip non-digits and enforce maxLength
    if (type === 'number' || inputMode === 'numeric') {
      val = val.replace(/\D/g, '');
    }
    if (maxLength !== undefined && val.length > maxLength) {
      val = val.slice(0, maxLength);
    }
    onChange(val);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'8px', width:'100%' }}>
      {label && (
        <label style={{
          fontFamily:"'Exo 2',sans-serif", fontSize:'11px', letterSpacing:'2px',
          textTransform:'uppercase', color: focused ? '#00f5ff' : 'rgba(0,245,255,0.6)',
          transition:'color 0.2s'
        }}>{label}</label>
      )}
      <div style={{ position:'relative' }}>
        {icon && (
          <span style={{
            position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)',
            fontSize:'16px', pointerEvents:'none', zIndex:1
          }}>{icon}</span>
        )}
        <input
          type={type === 'number' ? 'text' : type}
          inputMode={inputMode || (type === 'tel' ? 'tel' : type === 'number' ? 'numeric' : 'text')}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width:'100%',
            padding: icon ? '14px 16px 14px 44px' : '14px 16px',
            background: focused ? 'rgba(0,245,255,0.07)' : 'rgba(0,245,255,0.03)',
            border:`1px solid ${focused ? 'rgba(0,245,255,0.6)' : 'rgba(0,245,255,0.2)'}`,
            borderRadius:'8px', color:'#e8f4fd', fontSize:'16px',
            fontFamily:"'Share Tech Mono',monospace", letterSpacing:'1.5px',
            outline:'none', transition:'all 0.2s',
            boxShadow: focused ? '0 0 14px rgba(0,245,255,0.15)' : 'none',
            WebkitAppearance:'none',
          }}
        />
      </div>
    </div>
  );
};

const RButton = ({ children, onClick, fullWidth, size='md', loading, variant='primary', disabled, style: extraStyle }) => {
  const [hov, setHov] = useState(false);
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  const rgb = isSecondary ? '255,45,120' : '0,245,255';
  const color = isSecondary ? '#ff2d78' : '#00f5ff';
  return (
    <button onClick={onClick} disabled={loading || disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: size==='lg' ? '15px 28px' : size==='sm' ? '8px 16px' : '12px 22px',
        background: isGhost ? 'transparent' : `linear-gradient(135deg,rgba(${rgb},${hov?0.22:0.1}) 0%,rgba(${rgb},0.04) 100%)`,
        border:`1px solid rgba(${rgb},${isGhost?0.18:hov?0.7:0.4})`,
        borderRadius:'8px', color: isGhost ? `rgba(${rgb},0.5)` : color,
        fontSize: size==='lg'?'14px':size==='sm'?'11px':'13px',
        fontFamily:"'Exo 2',sans-serif", fontWeight:'700', letterSpacing:'2.5px', textTransform:'uppercase',
        cursor:(loading||disabled)?'not-allowed':'pointer',
        opacity: disabled?0.35:loading?0.65:1, transition:'all 0.2s',
        boxShadow: isGhost?'none':hov?`0 0 28px rgba(${rgb},0.3)`:`0 0 14px rgba(${rgb},0.1)`,
        transform: hov&&!disabled&&!loading?'translateY(-1px)':'none',
        display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
        ...extraStyle,
      }}>
      {loading
        ? <span style={{ width:'14px', height:'14px', border:`2px solid rgba(${rgb},0.3)`, borderTopColor:color, borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'inline-block' }} />
        : children}
    </button>
  );
};

const RCard = ({ title, badge, children, glow='primary', style: extraStyle }) => {
  const rgb = glow==='secondary'?'255,45,120':glow==='none'?'42,74,106':'0,245,255';
  const color = glow==='secondary'?'#ff2d78':glow==='none'?'#2a4a6a':'#00f5ff';
  return (
    <div style={{ background:'rgba(6,13,22,0.95)', border:`1px solid rgba(${rgb},0.18)`, borderRadius:'10px', overflow:'hidden', boxShadow:`0 0 30px rgba(${rgb},0.06)`, ...extraStyle }}>
      <div style={{ height:'2px', background:`linear-gradient(90deg,transparent,${color}60,transparent)` }} />
      {(title||badge) && (
        <div style={{ padding:'14px 20px', borderBottom:`1px solid rgba(${rgb},0.1)`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          {title && <span style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'12px', fontWeight:'700', letterSpacing:'2.5px', textTransform:'uppercase', color }}>{title}</span>}
          {badge && <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', letterSpacing:'1.5px', color, opacity:0.6 }}>{badge}</span>}
        </div>
      )}
      <div style={{ padding:'20px' }}>{children}</div>
    </div>
  );
};

const StepBar = ({ steps, current, color='#00f5ff', rgb='0,245,255' }) => (
  <div style={{ display:'flex', gap:'6px', marginBottom:'24px', overflowX:'auto', paddingBottom:'4px' }}>
    {steps.map((s, i) => (
      <div key={s.id} style={{ flex:'1 0 auto', minWidth:'52px' }}>
        <div style={{ height:'4px', borderRadius:'2px', marginBottom:'6px', transition:'all 0.3s',
          background: i<=current ? color : `rgba(${rgb},0.1)`,
          boxShadow: i<=current ? `0 0 8px rgba(${rgb},0.5)` : 'none' }} />
        <div style={{ fontSize:'9px', letterSpacing:'0.8px', textTransform:'uppercase', fontFamily:"'Exo 2',sans-serif",
          color: i<=current ? color : '#2a4a6a', textAlign:'center', whiteSpace:'nowrap' }}>
          {s.icon} {s.label}
        </div>
      </div>
    ))}
  </div>
);

const TopBar = ({ onBack, title, subtitle, color='#00f5ff', rgb='0,245,255', right }) => (
  <nav style={{ padding:'12px clamp(16px,4vw,32px)', borderBottom:`1px solid rgba(${rgb},0.12)`,
    background:'rgba(2,4,8,0.97)', backdropFilter:'blur(20px)',
    display:'flex', alignItems:'center', gap:'14px',
    position:'sticky', top:0, zIndex:100, flexWrap:'wrap' }}>
    {onBack && (
      <button onClick={onBack} style={{ background:'transparent', border:`1px solid rgba(${rgb},0.3)`, color,
        padding:'8px 14px', borderRadius:'6px', cursor:'pointer',
        fontSize:'13px', fontFamily:"'Exo 2',sans-serif", letterSpacing:'1px', fontWeight:'700', flexShrink:0 }}>
        ← BACK
      </button>
    )}
    <div style={{ flex:1, minWidth:0 }}>
      <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'clamp(13px,3vw,16px)', fontWeight:'800', color,
        letterSpacing:'2px', textTransform:'uppercase', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{title}</div>
      {subtitle && <div style={{ fontSize:'11px', color:'#2a4a6a', letterSpacing:'1.5px', fontFamily:"'Share Tech Mono',monospace" }}>{subtitle}</div>}
    </div>
    {right}
  </nav>
);

const SummaryRow = ({ label, value, rgb='0,245,255' }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px',
    paddingBottom:'10px', marginBottom:'10px', borderBottom:`1px solid rgba(${rgb},0.07)`, flexWrap:'wrap' }}>
    <span style={{ fontSize:'11px', color:'#5a7a9a', letterSpacing:'1.5px', textTransform:'uppercase', fontFamily:"'Exo 2',sans-serif", flexShrink:0 }}>{label}</span>
    <span style={{ fontSize:'13px', color:'#e8f4fd', fontFamily:"'Rajdhani',sans-serif", fontWeight:'600', textAlign:'right' }}>{value}</span>
  </div>
);

const SelectGrid = ({ options, selected, onSelect, color='#00f5ff', rgb='0,245,255' }) => (
  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:'10px' }}>
    {options.map(opt => {
      const isSel = selected === opt.id;
      return (
        <div key={opt.id} onClick={() => onSelect(opt.id)} style={{
          padding:'14px 10px', borderRadius:'8px', cursor:'pointer', textAlign:'center',
          background: isSel ? `rgba(${rgb},0.12)` : 'rgba(4,9,15,0.7)',
          border:`1px solid ${isSel ? color : `rgba(${rgb},0.18)`}`,
          boxShadow: isSel ? `0 0 20px rgba(${rgb},0.2)` : 'none',
          transition:'all 0.2s', userSelect:'none',
        }}>
          <div style={{ fontSize:'26px', marginBottom:'7px', lineHeight:1 }}>{opt.icon}</div>
          <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'11px', fontWeight:'700', letterSpacing:'1px', textTransform:'uppercase', lineHeight:'1.3', color: isSel ? color : '#e8f4fd' }}>{opt.label}</div>
          {opt.desc && <div style={{ fontSize:'10px', color:'#5a7a9a', marginTop:'4px', lineHeight:'1.3' }}>{opt.desc}</div>}
        </div>
      );
    })}
  </div>
);

/* ============================================================
   LOGIN SCREEN
   ============================================================ */
const LoginScreen = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // FIX: Strip non-digits and enforce 10-digit max for phone
  const handlePhoneChange = (val) => {
    setError('');
    const digits = val.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
  };

  // FIX: Enforce 6-digit max for OTP
  const handleOtpChange = (val) => {
    setError('');
    const digits = val.replace(/\D/g, '').slice(0, 6);
    setOtp(digits);
  };

  const sendOTP = () => {
    setError('');
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); }, 1500);
  };

  const verify = () => {
    setError('');
    if (!otp || otp.length < 4) {
      setError('Enter the OTP sent to your number');
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1500);
  };

  const Corner = ({ s }) => <div style={{ position:'absolute', width:'18px', height:'18px', opacity:0.45, ...s }} />;

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px', position:'relative', overflow:'hidden' }}>
      <BgGrid />
      <div style={{ position:'fixed', top:'-200px', left:'-200px', width:'500px', height:'500px', background:'radial-gradient(circle,rgba(0,245,255,0.07) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', bottom:'-200px', right:'-200px', width:'500px', height:'500px', background:'radial-gradient(circle,rgba(255,45,120,0.07) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />

      <div style={{ width:'100%', maxWidth:'420px', padding:'clamp(24px,6vw,44px) clamp(20px,6vw,36px)', background:'linear-gradient(145deg,#060d16 0%,#030810 100%)', border:'1px solid rgba(0,245,255,0.15)', borderRadius:'12px', boxShadow:'0 0 60px rgba(0,245,255,0.08),0 30px 80px rgba(0,0,0,0.8)', position:'relative', overflow:'hidden', zIndex:1, animation:'slideUp 0.5s ease' }}>
        <Corner s={{ top:'12px', left:'12px', borderTop:'2px solid #00f5ff', borderLeft:'2px solid #00f5ff' }} />
        <Corner s={{ top:'12px', right:'12px', borderTop:'2px solid #00f5ff', borderRight:'2px solid #00f5ff' }} />
        <Corner s={{ bottom:'12px', left:'12px', borderBottom:'2px solid #00f5ff', borderLeft:'2px solid #00f5ff' }} />
        <Corner s={{ bottom:'12px', right:'12px', borderBottom:'2px solid #00f5ff', borderRight:'2px solid #00f5ff' }} />
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#00f5ff,#ff2d78,transparent)' }} />

        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ fontSize:'clamp(44px,12vw,60px)', marginBottom:'12px', filter:'drop-shadow(0 0 16px rgba(0,245,255,0.6))', animation:'float 3s ease-in-out infinite', lineHeight:1 }}>🚨</div>
          <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'clamp(20px,6vw,26px)', fontWeight:'900', letterSpacing:'4px', textTransform:'uppercase', background:'linear-gradient(135deg,#00f5ff 0%,#ff2d78 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:'4px' }}>ResQRoute</div>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'#2a4a6a', letterSpacing:'3px' }}>SMART EMERGENCY RESPONSE</div>
        </div>

        <div style={{ display:'flex', gap:'8px', marginBottom:'28px' }}>
          {['Enter Mobile','Verify OTP'].map((label, i) => {
            const active = i === 0 || step === 'otp';
            return (
              <div key={i} style={{ flex:1 }}>
                <div style={{ height:'3px', borderRadius:'2px', marginBottom:'6px', transition:'all 0.3s', background: active?'#00f5ff':'rgba(0,245,255,0.15)', boxShadow: active?'0 0 8px rgba(0,245,255,0.5)':'none' }} />
                <div style={{ fontSize:'10px', letterSpacing:'1.5px', textTransform:'uppercase', fontFamily:"'Exo 2',sans-serif", color: active?'#00f5ff':'#2a4a6a', transition:'color 0.3s' }}>{label}</div>
              </div>
            );
          })}
        </div>

        {step === 'phone' ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            <div>
              <RInput
                label="Mobile Number (10 digits)"
                type="text"
                inputMode="numeric"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="10-digit mobile number"
                icon="📱"
                maxLength={10}
              />
              <div style={{ marginTop:'6px', fontSize:'11px', color: phone.length === 10 ? '#7fff00' : '#5a7a9a', fontFamily:"'Share Tech Mono',monospace", letterSpacing:'1px' }}>
                {phone.length}/10 digits {phone.length === 10 ? '✓' : ''}
              </div>
            </div>
            {error && <div style={{ fontSize:'12px', color:'#ff2d78', fontFamily:"'Exo 2',sans-serif", letterSpacing:'1px' }}>⚠ {error}</div>}
            <RButton onClick={sendOTP} fullWidth size="lg" loading={loading}>SEND OTP</RButton>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            <div style={{ textAlign:'center', fontSize:'13px', color:'#5a7a9a' }}>OTP sent to <span style={{ color:'#00f5ff' }}>+91 {phone}</span></div>
            <div>
              <RInput
                label="Enter OTP (6 digits)"
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={handleOtpChange}
                placeholder="6-digit OTP code"
                icon="🔐"
                maxLength={6}
              />
              <div style={{ marginTop:'6px', fontSize:'11px', color: otp.length === 6 ? '#7fff00' : '#5a7a9a', fontFamily:"'Share Tech Mono',monospace", letterSpacing:'1px' }}>
                {otp.length}/6 digits {otp.length === 6 ? '✓' : ''}
              </div>
            </div>
            {error && <div style={{ fontSize:'12px', color:'#ff2d78', fontFamily:"'Exo 2',sans-serif", letterSpacing:'1px' }}>⚠ {error}</div>}
            <RButton onClick={verify} fullWidth size="lg" loading={loading}>VERIFY & ACCESS</RButton>
            <RButton variant="ghost" onClick={() => { setStep('phone'); setError(''); setOtp(''); }} fullWidth size="sm">← Change Number</RButton>
          </div>
        )}

        <div style={{ marginTop:'28px', paddingTop:'16px', borderTop:'1px solid rgba(0,245,255,0.08)', textAlign:'center', fontSize:'10px', color:'#2a4a6a', fontFamily:"'Share Tech Mono',monospace", letterSpacing:'1px' }}>
          © 2026 ResQRoute. All rights reserved
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   HOME SCREEN
   ============================================================ */
const stats = [
  { label:'Avg Response', value:'6.2', unit:'min', color:'#00f5ff', rgb:'0,245,255', delta:'-18%' },
  { label:'Active Units', value:'47', unit:'veh', color:'#7fff00', rgb:'127,255,0', delta:'+3' },
  { label:'Lives Saved', value:'23', unit:'ppl', color:'#ff9500', rgb:'255,149,0', delta:'+5' },
  { label:'Uptime', value:'99.9', unit:'%', color:'#7fff00', rgb:'127,255,0', delta:'SLA' },
];
const activity = [
  { msg:'AMB-23 dispatched · Sector 15, Noida', time:'2m ago', color:'#00f5ff', rgb:'0,245,255' },
  { msg:'Fire-07 responding · Khan Market fire', time:'8m ago', color:'#ff2d78', rgb:'255,45,120' },
  { msg:'Patient delivered · Apollo Hospital', time:'15m ago', color:'#7fff00', rgb:'127,255,0' },
  { msg:'Green corridor active · NH-48', time:'22m ago', color:'#ff9500', rgb:'255,149,0' },
];

const HomeScreen = ({ onNavigate, user }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const timeStr = time.toLocaleTimeString('en-IN', { hour12:false });
  const dateStr = time.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' });

  return (
    <div style={{ minHeight:'100vh', background:'#020408', color:'#e8f4fd', fontFamily:"'Rajdhani',sans-serif", position:'relative' }}>
      <BgGrid />
      <div style={{ position:'fixed', top:'-300px', right:'-300px', width:'700px', height:'700px', background:'radial-gradient(circle,rgba(0,245,255,0.04) 0%,transparent 60%)', pointerEvents:'none', zIndex:0 }} />

      <nav style={{ padding:'12px clamp(16px,4vw,32px)', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(0,245,255,0.1)', background:'rgba(2,4,8,0.92)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:100, gap:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px', flexShrink:0 }}>
          <span style={{ fontSize:'clamp(22px,5vw,30px)', filter:'drop-shadow(0 0 10px rgba(0,245,255,0.6))' }}>🚨</span>
          <div>
            <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'clamp(15px,4vw,20px)', fontWeight:'900', letterSpacing:'3px', background:'linear-gradient(135deg,#00f5ff 0%,#ff2d78 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>ResQRoute</div>
            <div style={{ fontSize:'9px', color:'#2a4a6a', letterSpacing:'2px', fontFamily:"'Share Tech Mono',monospace" }}>SMART EMERGENCY PLATFORM</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap', justifyContent:'flex-end' }}>
          <div className="nav-clock" style={{ textAlign:'right' }}>
            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'clamp(13px,3vw,19px)', color:'#00f5ff', letterSpacing:'2px', textShadow:'0 0 10px rgba(0,245,255,0.4)' }}>{timeStr}</div>
            <div style={{ fontSize:'9px', color:'#2a4a6a', letterSpacing:'1px' }}>{dateStr}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px clamp(8px,2vw,12px)', background:'rgba(127,255,0,0.08)', border:'1px solid rgba(127,255,0,0.3)', borderRadius:'6px', flexShrink:0 }}>
            <div style={{ width:'7px', height:'7px', background:'#7fff00', borderRadius:'50%', boxShadow:'0 0 8px #7fff00', animation:'pulseNeon 1.5s ease infinite', flexShrink:0 }} />
            <span className="nav-status-text" style={{ fontSize:'10px', color:'#7fff00', fontFamily:"'Exo 2',sans-serif", letterSpacing:'1.5px', fontWeight:'700', whiteSpace:'nowrap' }}>ALL SYSTEMS LIVE</span>
          </div>
          {user && <div style={{ fontSize:'12px', color:'#5a7a9a', fontFamily:"'Exo 2',sans-serif", letterSpacing:'1px', whiteSpace:'nowrap' }}>👤 {user.name.split(' ')[0]}</div>}
          <button
            onClick={() => onNavigate('login')}
            title="Logout"
            style={{ background:'transparent', border:'1px solid rgba(0,245,255,0.25)', color:'rgba(0,245,255,0.6)', padding:'7px 13px', borderRadius:'6px', cursor:'pointer', fontSize:'11px', fontFamily:"'Exo 2',sans-serif", letterSpacing:'1.5px', fontWeight:'700', flexShrink:0, transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(0,245,255,0.6)'; e.currentTarget.style.color='#00f5ff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(0,245,255,0.25)'; e.currentTarget.style.color='rgba(0,245,255,0.6)'; }}
          >⏻ LOGOUT</button>
        </div>
      </nav>

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'clamp(24px,5vw,40px) clamp(16px,4vw,32px)', position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:'clamp(32px,6vw,52px)', animation:'slideUp 0.5s ease' }}>
          <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'11px', fontWeight:'700', letterSpacing:'4px', color:'#2a4a6a', marginBottom:'14px' }}>◆ INDIA'S FIRST AI-POWERED EMERGENCY PLATFORM ◆</div>
          <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'clamp(34px,7vw,60px)', fontWeight:'900', lineHeight:'1.1', marginBottom:'16px' }}>
            <span style={{ background:'linear-gradient(135deg,#00f5ff 0%,#7fff00 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>EVERY SECOND</span>
            <br /><span style={{ color:'#e8f4fd' }}>MATTERS.</span>
          </div>
          <p style={{ fontSize:'clamp(13px,3vw,17px)', color:'#5a7a9a', maxWidth:'480px', margin:'0 auto', lineHeight:'1.6' }}>One tap. Nearest ambulance or fire truck. Real-time tracking. Green corridor.</p>
        </div>

        <div className="em-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'clamp(28px,5vw,48px)', animation:'slideUp 0.5s ease 0.1s both' }}>
          {[
            { screen:'medical-booking', emoji:'🚑', label:'MEDICAL', sub:'Ambulance · Hospital · ICU', cta:'BOOK AMBULANCE →', color:'#00f5ff', rgb:'0,245,255' },
            { screen:'fire-booking', emoji:'🚒', label:'FIRE', sub:'Fire Trucks · HazMat · Rescue', cta:'REPORT FIRE →', color:'#ff2d78', rgb:'255,45,120' },
          ].map(item => (
            <div key={item.screen} className="em-card"
              onClick={() => onNavigate(item.screen)}
              style={{ padding:'clamp(22px,4vw,36px) clamp(18px,3vw,28px)', background:`linear-gradient(145deg,rgba(${item.rgb},0.08) 0%,rgba(4,9,15,0.95) 100%)`, border:`1px solid rgba(${item.rgb},0.35)`, borderRadius:'12px', cursor:'pointer', boxShadow:`0 0 40px rgba(${item.rgb},0.12),0 20px 60px rgba(0,0,0,0.6)`, transition:'transform 0.3s,box-shadow 0.3s', position:'relative', overflow:'hidden', textAlign:'center' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,transparent,${item.color},transparent)` }} />
              <div style={{ fontSize:'clamp(44px,10vw,64px)', marginBottom:'12px', filter:`drop-shadow(0 0 16px rgba(${item.rgb},0.6))`, animation:'float 3s ease-in-out infinite', lineHeight:1 }}>{item.emoji}</div>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'clamp(18px,5vw,26px)', fontWeight:'900', color:item.color, letterSpacing:'3px', textTransform:'uppercase', marginBottom:'8px' }}>{item.label}</div>
              <div style={{ fontSize:'clamp(11px,2.5vw,14px)', color:'#5a7a9a', marginBottom:'18px' }}>{item.sub}</div>
              <div style={{ display:'inline-flex', alignItems:'center', padding:'10px clamp(14px,3vw,24px)', background:`rgba(${item.rgb},0.1)`, border:`1px solid rgba(${item.rgb},0.4)`, borderRadius:'4px', color:item.color, fontFamily:"'Exo 2',sans-serif", fontSize:'clamp(10px,2vw,13px)', fontWeight:'700', letterSpacing:'2px' }}>{item.cta}</div>
            </div>
          ))}
        </div>

        <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'clamp(20px,4vw,36px)', animation:'slideUp 0.5s ease 0.2s both' }}>
          {stats.map(s => (
            <div key={s.label} style={{ padding:'clamp(12px,3vw,20px)', background:'rgba(6,13,22,0.9)', border:'1px solid rgba(0,245,255,0.1)', borderRadius:'8px', textAlign:'center' }}>
              <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'clamp(22px,5vw,36px)', color:s.color, textShadow:`0 0 15px rgba(${s.rgb},0.4)`, lineHeight:1, marginBottom:'4px', fontWeight:'700' }}>
                {s.value}<span style={{ fontSize:'clamp(11px,2vw,15px)', marginLeft:'3px' }}>{s.unit}</span>
              </div>
              <div style={{ fontSize:'10px', color:'#2a4a6a', letterSpacing:'1px', textTransform:'uppercase', fontFamily:"'Exo 2',sans-serif", marginBottom:'6px' }}>{s.label}</div>
              <div style={{ fontSize:'11px', color:s.color, fontFamily:"'Share Tech Mono',monospace", padding:'2px 6px', background:`rgba(${s.rgb},0.08)`, borderRadius:'3px', display:'inline-block' }}>{s.delta}</div>
            </div>
          ))}
        </div>

        <div style={{ padding:'clamp(14px,3vw,24px)', background:'rgba(6,13,22,0.9)', border:'1px solid rgba(0,245,255,0.1)', borderRadius:'8px', animation:'slideUp 0.5s ease 0.3s both' }}>
          <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'12px', fontWeight:'700', letterSpacing:'2.5px', textTransform:'uppercase', color:'#00f5ff', marginBottom:'14px', display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'8px', height:'8px', background:'#7fff00', borderRadius:'50%', boxShadow:'0 0 8px #7fff00', animation:'pulseNeon 1s ease infinite', flexShrink:0 }} />
            Live Activity Feed
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {activity.map((item, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 14px', background:'rgba(4,9,15,0.6)', border:`1px solid rgba(${item.rgb},0.1)`, borderRadius:'6px', animation:`slideLeft 0.4s ease ${i*0.07}s both`, flexWrap:'wrap' }}>
                <div style={{ width:'6px', height:'6px', background:item.color, borderRadius:'50%', boxShadow:`0 0 8px ${item.color}`, flexShrink:0 }} />
                <div style={{ flex:1, minWidth:'120px', fontSize:'clamp(11px,3vw,13px)', color:'#e8f4fd', fontFamily:"'Rajdhani',sans-serif", fontWeight:'500' }}>{item.msg}</div>
                <div style={{ fontSize:'11px', color:'#2a4a6a', fontFamily:"'Share Tech Mono',monospace", whiteSpace:'nowrap' }}>{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   MEDICAL BOOKING SCREEN
   FIX: StepContent extracted as named components OUTSIDE the
   parent to prevent remount on every state update (which caused
   input focus loss).
   ============================================================ */
const medSteps = [
  { id:'emergency', label:'Emergency', icon:'⚡' },
  { id:'patient',   label:'Patient',   icon:'👤' },
  { id:'vehicle',   label:'Vehicle',   icon:'🚑' },
  { id:'hospital',  label:'Hospital',  icon:'🏥' },
  { id:'location',  label:'Location',  icon:'📍' },
  { id:'confirm',   label:'Confirm',   icon:'✅' },
];
const emergencyTypes = [
  { id:'cardiac', label:'Cardiac Arrest', icon:'❤️' },
  { id:'accident', label:'Accident/Trauma', icon:'🤕' },
  { id:'stroke', label:'Stroke', icon:'🧠' },
  { id:'respiratory', label:'Breathing Issue', icon:'🫁' },
  { id:'labour', label:'Labour/Delivery', icon:'🤰' },
  { id:'other', label:'Other Medical', icon:'🏥' },
];
const vehicleTypes = [
  { id:'als', label:'ALS Ambulance', desc:'Advanced Life Support · ICU equipped', icon:'🚑' },
  { id:'bls', label:'BLS Ambulance', desc:'Basic Life Support · Standard', icon:'🏥' },
  { id:'neonatal', label:'Neonatal Unit', desc:'Newborn & infant care', icon:'👶' },
];

// Each step is its own stable component — prevents remount / focus loss
const MedEmergencyStep = ({ booking, upd }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <p style={{ fontSize:'13px', color:'#5a7a9a' }}>Select the nature of the emergency</p>
    <SelectGrid options={emergencyTypes} selected={booking.emergencyType} onSelect={v => upd('emergencyType', v)} />
  </div>
);

const MedPatientStep = ({ booking, updP }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
      <div style={{ gridColumn:'1/-1' }}>
        <RInput label="Patient Name" type="text" value={booking.patient.name} onChange={v => updP('name', v)} placeholder="Full name" icon="👤" />
      </div>
      <RInput label="Age (years)" type="number" inputMode="numeric" value={booking.patient.age} onChange={v => updP('age', v)} placeholder="e.g. 35" icon="🎂" maxLength={3} />
      <RInput label="Contact No." type="text" inputMode="numeric" value={booking.patient.contact} onChange={v => updP('contact', v)} placeholder="+91 XXXXX" icon="📞" maxLength={10} />
    </div>
    <div>
      <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'rgba(0,245,255,0.6)', marginBottom:'10px' }}>Gender</div>
      <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
        {['Male','Female','Other'].map(g => (
          <button key={g} onClick={() => updP('gender', g)} style={{ padding:'9px 18px', borderRadius:'6px', cursor:'pointer', background: booking.patient.gender===g?'rgba(0,245,255,0.12)':'rgba(4,9,15,0.7)', border:`1px solid ${booking.patient.gender===g?'#00f5ff':'rgba(0,245,255,0.2)'}`, color: booking.patient.gender===g?'#00f5ff':'#e8f4fd', fontFamily:"'Exo 2',sans-serif", fontSize:'12px', fontWeight:'700', letterSpacing:'1.5px', transition:'all 0.2s' }}>{g}</button>
        ))}
      </div>
    </div>
  </div>
);

const MedVehicleStep = ({ booking, upd }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
    <p style={{ fontSize:'13px', color:'#5a7a9a' }}>Choose vehicle based on patient condition</p>
    {vehicleTypes.map(v => {
      const isSel = booking.vehicleType === v.id;
      return (
        <div key={v.id} onClick={() => upd('vehicleType', v.id)} style={{ padding:'16px', borderRadius:'8px', cursor:'pointer', background: isSel?'rgba(0,245,255,0.08)':'rgba(4,9,15,0.7)', border:`1px solid ${isSel?'#00f5ff':'rgba(0,245,255,0.15)'}`, display:'flex', alignItems:'center', gap:'14px', transition:'all 0.2s', boxShadow: isSel?'0 0 20px rgba(0,245,255,0.15)':'none' }}>
          <div style={{ fontSize:'30px', lineHeight:1, flexShrink:0 }}>{v.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'13px', fontWeight:'700', color: isSel?'#00f5ff':'#e8f4fd', letterSpacing:'1.5px' }}>{v.label}</div>
            <div style={{ fontSize:'12px', color:'#5a7a9a', marginTop:'2px' }}>{v.desc}</div>
          </div>
          {isSel && <div style={{ width:'10px', height:'10px', background:'#00f5ff', borderRadius:'50%', boxShadow:'0 0 8px #00f5ff', flexShrink:0 }} />}
        </div>
      );
    })}
  </div>
);

const MedHospitalStep = ({ booking, upd }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <p style={{ fontSize:'13px', color:'#5a7a9a' }}>Choose hospital preference</p>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
      {[
        { id:'government', label:'Government', sub:'FREE · AIIMS · Safdarjung', icon:'🏛️', color:'#7fff00', rgb:'127,255,0' },
        { id:'private', label:'Private', sub:'Premium · Faster beds', icon:'🏥', color:'#00f5ff', rgb:'0,245,255' }
      ].map(h => {
        const isSel = booking.hospitalPreference === h.id;
        return (
          <div key={h.id} onClick={() => upd('hospitalPreference', h.id)} style={{ padding:'20px 16px', borderRadius:'8px', cursor:'pointer', textAlign:'center', background: isSel?`rgba(${h.rgb},0.1)`:'rgba(4,9,15,0.7)', border:`2px solid ${isSel?h.color:`rgba(${h.rgb},0.2)`}`, transition:'all 0.2s' }}>
            <div style={{ fontSize:'36px', lineHeight:1, marginBottom:'10px' }}>{h.icon}</div>
            <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'14px', fontWeight:'800', color: isSel?h.color:'#e8f4fd', letterSpacing:'2px', marginBottom:'4px' }}>{h.label}</div>
            <div style={{ fontSize:'11px', color:'#5a7a9a' }}>{h.sub}</div>
          </div>
        );
      })}
    </div>
    {booking.hospitalPreference === 'government' && (
      <div style={{ padding:'14px', background:'rgba(127,255,0,0.06)', border:'1px solid rgba(127,255,0,0.2)', borderRadius:'8px', fontSize:'13px', color:'#7fff00', lineHeight:'1.5' }}>
        ✅ Auto-routed to nearest government hospital with available beds
      </div>
    )}
  </div>
);

const MedLocationStep = ({ booking, upd }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <p style={{ fontSize:'13px', color:'#5a7a9a' }}>Enter the patient pickup location</p>
    <RInput label="Pickup Address" type="text" value={booking.location} onChange={v => upd('location', v)} placeholder="Building, street, landmark, city" icon="📍" />
    <div style={{ padding:'12px 14px', background:'rgba(0,245,255,0.04)', border:'1px solid rgba(0,245,255,0.1)', borderRadius:'8px', fontSize:'12px', color:'#5a7a9a', fontFamily:"'Share Tech Mono',monospace" }}>
      💡 Add a nearby landmark for faster dispatch
    </div>
  </div>
);

const MedConfirmStep = ({ booking, onBook, loading, onBackHome }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <div style={{ padding:'16px', background:'rgba(0,245,255,0.05)', border:'1px solid rgba(0,245,255,0.2)', borderRadius:'8px' }}>
      <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'12px', color:'#00f5ff', letterSpacing:'2px', marginBottom:'14px' }}>◆ BOOKING SUMMARY</div>
      <SummaryRow label="Emergency" value={booking.emergencyType?.toUpperCase() || '—'} />
      <SummaryRow label="Patient" value={booking.patient?.name || '—'} />
      <SummaryRow label="Age" value={booking.patient?.age ? `${booking.patient.age} yrs` : '—'} />
      <SummaryRow label="Vehicle" value={booking.vehicleType?.toUpperCase() || '—'} />
      <SummaryRow label="Hospital" value={booking.hospitalPreference === 'government' ? 'Govt Hospital (FREE)' : 'Private Hospital'} />
      <SummaryRow label="Location" value={booking.location || '—'} />
    </div>
    <div style={{ padding:'14px', background:'rgba(127,255,0,0.06)', border:'1px solid rgba(127,255,0,0.2)', borderRadius:'6px', fontSize:'13px', color:'#7fff00', lineHeight:'1.5' }}>
      ✅ Ambulance dispatched immediately. Avg response: <strong>6–8 min</strong>.
    </div>
    <RButton onClick={onBook} fullWidth size="lg" loading={loading}>🚑 DISPATCH AMBULANCE NOW</RButton>
    <RButton variant="ghost" onClick={onBackHome} fullWidth size="sm">🏠 Cancel & Back to Home</RButton>
  </div>
);

const MedicalBookingScreen = ({ onNavigate }) => {
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState({
    emergencyType: null,
    patient: { name:'', age:'', gender:'', contact:'' },
    vehicleType: null,
    hospitalPreference: null,
    location: ''
  });
  const [loading, setLoading] = useState(false);

  const upd = (k, v) => setBooking(b => ({ ...b, [k]:v }));
  const updP = (k, v) => setBooking(b => ({ ...b, patient: { ...b.patient, [k]:v } }));

  const canNext = () => {
    switch (medSteps[step].id) {
      case 'emergency': return !!booking.emergencyType;
      case 'patient':   return !!booking.patient.name && !!booking.patient.age;
      case 'vehicle':   return !!booking.vehicleType;
      case 'hospital':  return !!booking.hospitalPreference;
      case 'location':  return !!booking.location;
      default: return true;
    }
  };

  const book = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onNavigate('tracking', { type:'medical', booking }); }, 2000);
  };

  const renderStep = () => {
    switch (medSteps[step].id) {
      case 'emergency': return <MedEmergencyStep booking={booking} upd={upd} />;
      case 'patient':   return <MedPatientStep booking={booking} updP={updP} />;
      case 'vehicle':   return <MedVehicleStep booking={booking} upd={upd} />;
      case 'hospital':  return <MedHospitalStep booking={booking} upd={upd} />;
      case 'location':  return <MedLocationStep booking={booking} upd={upd} />;
      case 'confirm':   return <MedConfirmStep booking={booking} onBook={book} loading={loading} onBackHome={() => onNavigate('home')} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#020408', color:'#e8f4fd', fontFamily:"'Rajdhani',sans-serif", position:'relative' }}>
      <BgGrid />
      <TopBar onBack={() => step > 0 ? setStep(s => s-1) : onNavigate('home')} title="Medical Emergency Booking" subtitle={`STEP ${step+1} OF ${medSteps.length} · ${medSteps[step].label.toUpperCase()}`} />
      <div style={{ maxWidth:'680px', margin:'0 auto', padding:'clamp(20px,4vw,32px) clamp(16px,4vw,24px)', position:'relative', zIndex:1 }}>
        <StepBar steps={medSteps} current={step} />
        <RCard title={medSteps[step].label} glow="primary" style={{ marginBottom:'20px', animation:'slideUp 0.3s ease' }}>
          {renderStep()}
        </RCard>
        {medSteps[step].id !== 'confirm' && (
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <RButton onClick={() => setStep(s => s+1)} size="lg" disabled={!canNext()}>
              NEXT: {medSteps[step+1]?.label?.toUpperCase()} →
            </RButton>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   FIRE BOOKING SCREEN
   FIX: Same pattern — step sub-components defined OUTSIDE to
   prevent remount / focus loss on each keystroke.
   ============================================================ */
const fireSteps = [
  { id:'type',     label:'Fire Type', icon:'🔥' },
  { id:'details',  label:'Details',   icon:'📋' },
  { id:'building', label:'Building',  icon:'🏢' },
  { id:'vehicle',  label:'Vehicles',  icon:'🚒' },
  { id:'location', label:'Location',  icon:'📍' },
  { id:'confirm',  label:'Dispatch',  icon:'🆘' },
];
const fireTypes = [
  { id:'residential', label:'Residential', icon:'🏠' },
  { id:'commercial',  label:'Commercial',  icon:'🏢' },
  { id:'industrial',  label:'Industrial',  icon:'🏭' },
  { id:'vehicle',     label:'Vehicle',     icon:'🚗' },
  { id:'forest',      label:'Forest/Open', icon:'🌲' },
  { id:'hazmat',      label:'HazMat/Chem', icon:'☢️' },
];
const buildingTypes = [
  { id:'apartment', label:'Apartment', icon:'🏘️' },
  { id:'house',     label:'House',     icon:'🏡' },
  { id:'office',    label:'Office',    icon:'🏢' },
  { id:'factory',   label:'Factory',   icon:'🏭' },
  { id:'mall',      label:'Mall/Plaza',icon:'🏬' },
  { id:'other',     label:'Other',     icon:'🏗️' },
];

const FireTypeStep = ({ booking, upd }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <p style={{ fontSize:'13px', color:'#5a7a9a' }}>Select the type of fire emergency</p>
    <SelectGrid options={fireTypes} selected={booking.fireType} onSelect={v => upd('fireType', v)} color="#ff2d78" rgb="255,45,120" />
  </div>
);

const FireDetailsStep = ({ booking, upd }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
    <div>
      <p style={{ fontSize:'13px', color:'#5a7a9a', marginBottom:'12px' }}>Fire scale / severity</p>
      <SelectGrid
        options={[
          { id:'small', label:'Small', desc:'Contained, 1-2 rooms', icon:'🔸' },
          { id:'medium', label:'Medium', desc:'Spreading, 1 floor', icon:'🔶' },
          { id:'major', label:'Major', desc:'Entire building', icon:'🔴' }
        ]}
        selected={booking.scale}
        onSelect={v => upd('scale', v)}
        color="#ff2d78" rgb="255,45,120"
      />
    </div>
    <div>
      <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'rgba(255,45,120,0.7)', marginBottom:'8px' }}>People trapped / injured</div>
      <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
        {['0','1-5','5-10','10+'].map(n => (
          <button key={n} onClick={() => upd('trapped', n)} style={{ padding:'9px 18px', borderRadius:'6px', cursor:'pointer', background: booking.trapped===n?'rgba(255,45,120,0.12)':'rgba(4,9,15,0.7)', border:`1px solid ${booking.trapped===n?'#ff2d78':'rgba(255,45,120,0.2)'}`, color: booking.trapped===n?'#ff2d78':'#e8f4fd', fontFamily:"'Exo 2',sans-serif", fontSize:'12px', fontWeight:'700', letterSpacing:'1.5px', transition:'all 0.2s' }}>{n}</button>
        ))}
      </div>
    </div>
  </div>
);

const FireBuildingStep = ({ booking, upd }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
    <div>
      <p style={{ fontSize:'13px', color:'#5a7a9a', marginBottom:'12px' }}>Building type</p>
      <SelectGrid options={buildingTypes} selected={booking.buildingType} onSelect={v => upd('buildingType', v)} color="#ff2d78" rgb="255,45,120" />
    </div>
    <RInput label="Number of floors" type="number" inputMode="numeric" value={booking.floors} onChange={v => upd('floors', v)} placeholder="e.g. 5" icon="🏢" maxLength={3} />
  </div>
);

const fireVehicleOptions = [
  { id:'standard', label:'Standard Response', desc:'2 fire trucks · Water cannon', icon:'🚒' },
  { id:'heavy',    label:'Heavy Response',    desc:'3 trucks + rescue unit',     icon:'🔥' },
  { id:'hazmat',   label:'HazMat Response',   desc:'Chemical/hazmat unit',       icon:'☢️' },
  { id:'aerial',   label:'Aerial Response',   desc:'Ladder truck for high-rise', icon:'🏗️' },
];

const FireVehicleStep = ({ booking, upd }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
    <p style={{ fontSize:'13px', color:'#5a7a9a' }}>Select response unit</p>
    {fireVehicleOptions.map(v => {
      const isSel = booking.vehicleType === v.id;
      return (
        <div key={v.id} onClick={() => upd('vehicleType', v.id)} style={{ padding:'14px', borderRadius:'8px', cursor:'pointer', background: isSel?'rgba(255,45,120,0.08)':'rgba(4,9,15,0.7)', border:`1px solid ${isSel?'#ff2d78':'rgba(255,45,120,0.15)'}`, display:'flex', alignItems:'center', gap:'14px', transition:'all 0.2s' }}>
          <div style={{ fontSize:'28px', lineHeight:1, flexShrink:0 }}>{v.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'13px', fontWeight:'700', color: isSel?'#ff2d78':'#e8f4fd', letterSpacing:'1.5px' }}>{v.label}</div>
            <div style={{ fontSize:'12px', color:'#5a7a9a', marginTop:'2px' }}>{v.desc}</div>
          </div>
          {isSel && <div style={{ width:'10px', height:'10px', background:'#ff2d78', borderRadius:'50%', boxShadow:'0 0 8px #ff2d78', flexShrink:0 }} />}
        </div>
      );
    })}
  </div>
);

const FireLocationStep = ({ booking, upd }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <p style={{ fontSize:'13px', color:'#5a7a9a' }}>Enter the fire location precisely</p>
    <RInput label="Fire Location Address" type="text" value={booking.location} onChange={v => upd('location', v)} placeholder="Building, street, landmark, city" icon="📍" />
    <div style={{ padding:'12px 14px', background:'rgba(255,45,120,0.04)', border:'1px solid rgba(255,45,120,0.1)', borderRadius:'8px', fontSize:'12px', color:'#5a7a9a', fontFamily:"'Share Tech Mono',monospace" }}>
      ⚠ Be specific — units will route to exact location
    </div>
  </div>
);

const FireConfirmStep = ({ booking, onDispatch, loading, onBackHome }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <div style={{ padding:'16px', borderRadius:'8px', display:'flex', gap:'14px', alignItems:'flex-start', background:'linear-gradient(135deg,rgba(255,45,120,0.1) 0%,rgba(255,149,0,0.07) 100%)', border:'1px solid rgba(255,45,120,0.3)' }}>
      <div style={{ fontSize:'32px', filter:'drop-shadow(0 0 8px #ff2d78)', lineHeight:1, flexShrink:0 }}>🤖</div>
      <div>
        <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'12px', color:'#ff2d78', letterSpacing:'2px', fontWeight:'700', marginBottom:'4px' }}>AI FIRE ANALYSIS</div>
        <div style={{ fontSize:'13px', color:'#e8f4fd', lineHeight:'1.5' }}>
          Classified as <strong style={{ color:'#ff2d78' }}>{(booking.scale||'MAJOR').toUpperCase()} FIRE</strong>. Deploying <strong>3 fire trucks + 1 HazMat</strong>. Spread risk: <strong style={{ color:'#ff9500' }}>High</strong>.
        </div>
      </div>
    </div>
    <div style={{ padding:'16px', background:'rgba(255,45,120,0.04)', border:'1px solid rgba(255,45,120,0.2)', borderRadius:'8px' }}>
      <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'12px', color:'#ff2d78', letterSpacing:'2px', marginBottom:'14px' }}>◆ DISPATCH SUMMARY</div>
      <SummaryRow label="Fire Type" value={booking.fireType?.toUpperCase()||'—'} rgb="255,45,120" />
      <SummaryRow label="Scale" value={booking.scale?.toUpperCase()||'—'} rgb="255,45,120" />
      <SummaryRow label="Building" value={booking.buildingType?.toUpperCase()||'—'} rgb="255,45,120" />
      <SummaryRow label="Trapped" value={booking.trapped||'0'} rgb="255,45,120" />
      <SummaryRow label="Response" value={booking.vehicleType?.toUpperCase()||'—'} rgb="255,45,120" />
      <SummaryRow label="Location" value={booking.location||'—'} rgb="255,45,120" />
    </div>
    <RButton onClick={onDispatch} fullWidth size="lg" variant="secondary" loading={loading}>🚒 DISPATCH FIRE UNITS NOW</RButton>
    <RButton variant="ghost" onClick={onBackHome} fullWidth size="sm">🏠 Cancel & Back to Home</RButton>
  </div>
);

const FireBookingScreen = ({ onNavigate }) => {
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState({
    fireType: null, scale: null, trapped: '0',
    buildingType: null, floors: '', vehicleType: null, location: ''
  });
  const [loading, setLoading] = useState(false);

  const upd = (k, v) => setBooking(b => ({ ...b, [k]:v }));

  const dispatch = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onNavigate('tracking', { type:'fire', booking }); }, 2000);
  };

  const renderStep = () => {
    switch (fireSteps[step].id) {
      case 'type':     return <FireTypeStep booking={booking} upd={upd} />;
      case 'details':  return <FireDetailsStep booking={booking} upd={upd} />;
      case 'building': return <FireBuildingStep booking={booking} upd={upd} />;
      case 'vehicle':  return <FireVehicleStep booking={booking} upd={upd} />;
      case 'location': return <FireLocationStep booking={booking} upd={upd} />;
      case 'confirm':  return <FireConfirmStep booking={booking} onDispatch={dispatch} loading={loading} onBackHome={() => onNavigate('home')} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#020408', color:'#e8f4fd', fontFamily:"'Rajdhani',sans-serif", position:'relative' }}>
      <div style={{ position:'fixed', inset:0, backgroundImage:`linear-gradient(rgba(255,45,120,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,45,120,0.02) 1px,transparent 1px)`, backgroundSize:'50px 50px', pointerEvents:'none', zIndex:0 }} />
      <TopBar onBack={() => step > 0 ? setStep(s => s-1) : onNavigate('home')} title="🔥 Fire Emergency Report" subtitle={`STEP ${step+1} OF ${fireSteps.length} · ${fireSteps[step].label.toUpperCase()}`} color="#ff2d78" rgb="255,45,120" />
      <div style={{ maxWidth:'680px', margin:'0 auto', padding:'clamp(20px,4vw,32px) clamp(16px,4vw,24px)', position:'relative', zIndex:1 }}>
        <StepBar steps={fireSteps} current={step} color="#ff2d78" rgb="255,45,120" />
        <RCard title={fireSteps[step].label} glow="secondary" style={{ marginBottom:'20px', animation:'slideUp 0.3s ease' }}>
          {renderStep()}
        </RCard>
        {fireSteps[step].id !== 'confirm' && (
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <RButton onClick={() => setStep(s => s+1)} size="lg" variant="secondary">
              NEXT: {fireSteps[step+1]?.label?.toUpperCase()} →
            </RButton>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   TRACKING SCREEN
   ============================================================ */
const statusFlow = ['dispatched','en_route','nearby','arrived'];
const statusInfo = {
  dispatched: { label:'UNIT DISPATCHED', color:'#ff9500', desc:'Emergency unit assigned, leaving the station.' },
  en_route:   { label:'EN ROUTE',        color:'#00f5ff', desc:'Vehicle navigating via green corridor.' },
  nearby:     { label:'APPROACHING',     color:'#7fff00', desc:'Less than 1km away. Keep path clear.' },
  arrived:    { label:'ARRIVED',         color:'#7fff00', desc:'Emergency unit has reached your location.' },
};

const LiveMap = ({ type }) => {
  const [vPos, setVPos] = useState({ x:0.15, y:0.75 });
  const color = type==='fire'?'#ff2d78':'#00f5ff';
  const rgb = type==='fire'?'255,45,120':'0,245,255';
  useEffect(() => {
    let t = 0;
    const id = setInterval(() => { t += 0.008; setVPos({ x:0.15+Math.min(t,0.65), y:0.75-Math.min(t,0.5) }); }, 60);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ position:'relative', borderRadius:'8px', overflow:'hidden', background:'#040a10', border:`1px solid rgba(${rgb},0.15)`, aspectRatio:'16/9', minHeight:'180px' }}>
      <svg width="100%" height="100%" style={{ position:'absolute', inset:0 }}>
        <defs><pattern id="mg" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke={`rgba(${rgb},0.08)`} strokeWidth="0.5"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#mg)"/>
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke={`rgba(${rgb},0.15)`} strokeWidth="2" strokeDasharray="8,8"/>
        <line x1="40%" y1="0" x2="40%" y2="100%" stroke={`rgba(${rgb},0.12)`} strokeWidth="2" strokeDasharray="6,6"/>
        <line x1={`${vPos.x*100}%`} y1={`${vPos.y*100}%`} x2="82%" y2="22%" stroke={color} strokeWidth="2" strokeDasharray="5,4" opacity="0.5"/>
        <circle cx={`${vPos.x*100}%`} cy={`${vPos.y*100}%`} r="11" fill={`rgba(${rgb},0.2)`}/>
        <circle cx={`${vPos.x*100}%`} cy={`${vPos.y*100}%`} r="5" fill={color}/>
        <circle cx="82%" cy="22%" r="12" fill={`rgba(${rgb},0.12)`}/>
        <circle cx="82%" cy="22%" r="5" fill="#7fff00"/>
        <circle cx="82%" cy="22%" r="14" fill="none" stroke="#7fff00" strokeWidth="1" opacity="0.4">
          <animate attributeName="r" from="10" to="24" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </svg>
      <div style={{ position:'absolute', bottom:'10px', left:'10px', fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'#2a4a6a', letterSpacing:'1px' }}>LIVE MAP · UPDATING</div>
      <div style={{ position:'absolute', top:'10px', right:'10px', padding:'4px 10px', background:'rgba(127,255,0,0.1)', border:'1px solid rgba(127,255,0,0.3)', borderRadius:'4px', fontFamily:"'Exo 2',sans-serif", fontSize:'10px', color:'#7fff00', fontWeight:'700', letterSpacing:'1.5px' }}>● GPS TRACKING</div>
    </div>
  );
};

const TrackingScreen = ({ onNavigate, params = {} }) => {
  const { type='medical' } = params;
  const [status, setStatus] = useState('dispatched');
  const [showAlert, setShowAlert] = useState(true);
  const color = type==='fire'?'#ff2d78':'#00f5ff';
  const rgb = type==='fire'?'255,45,120':'0,245,255';
  const s = statusInfo[status];
  const eta = status==='arrived'?0:status==='nearby'?1:status==='en_route'?5:8;
  const dist = status==='arrived'?'0 m':status==='nearby'?'0.8 km':'3.8 km';

  useEffect(() => {
    const timers = [setTimeout(()=>setStatus('en_route'),4000), setTimeout(()=>setStatus('nearby'),14000), setTimeout(()=>setStatus('arrived'),22000)];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ minHeight:'100vh', background:'#020408', color:'#e8f4fd', fontFamily:"'Rajdhani',sans-serif", position:'relative' }}>
      <div style={{ position:'fixed', inset:0, backgroundImage:`linear-gradient(rgba(${rgb},0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(${rgb},0.02) 1px,transparent 1px)`, backgroundSize:'50px 50px', pointerEvents:'none', zIndex:0 }} />

      {showAlert && (
        <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, padding:'12px clamp(16px,4vw,32px)', background:'linear-gradient(135deg,rgba(255,149,0,0.97) 0%,rgba(255,45,120,0.93) 100%)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', flex:1 }}>
            <span style={{ fontSize:'22px', flexShrink:0 }}>{type==='fire'?'🚒':'🚑'}</span>
            <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'clamp(12px,3vw,15px)', fontWeight:'800', color:'#fff', letterSpacing:'2px', textTransform:'uppercase' }}>⚠ CLEAR THE LANE! {type==='fire'?'FIRE TRUCK':'AMBULANCE'} APPROACHING</div>
          </div>
          <button onClick={() => setShowAlert(false)} style={{ background:'rgba(255,255,255,0.2)', border:'none', color:'#fff', padding:'6px 14px', borderRadius:'4px', cursor:'pointer', fontFamily:"'Exo 2',sans-serif", fontSize:'12px', fontWeight:'700', letterSpacing:'1px', flexShrink:0 }}>DISMISS</button>
        </div>
      )}

      <div style={{ padding:`${showAlert?'72px':'12px'} clamp(16px,4vw,32px) 12px`, borderBottom:`1px solid rgba(${rgb},0.15)`, background:'rgba(2,4,8,0.97)', backdropFilter:'blur(20px)', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, gap:'12px', flexWrap:'wrap', transition:'padding 0.3s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px', flexShrink:0 }}>
          <button
            onClick={() => onNavigate('home')}
            style={{ background:'transparent', border:`1px solid rgba(${rgb},0.3)`, color, padding:'8px 14px', borderRadius:'6px', cursor:'pointer', fontSize:'13px', fontFamily:"'Exo 2',sans-serif", letterSpacing:'1px', fontWeight:'700', flexShrink:0, transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=color; e.currentTarget.style.boxShadow=`0 0 12px rgba(${rgb},0.3)`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=`rgba(${rgb},0.3)`; e.currentTarget.style.boxShadow='none'; }}
          >← BACK</button>
          <div style={{ fontSize:'clamp(22px,5vw,30px)', filter:`drop-shadow(0 0 8px ${color})` }}>{type==='fire'?'🚒':'🚑'}</div>
          <div>
            <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'clamp(13px,3vw,16px)', fontWeight:'800', color, letterSpacing:'2px', textTransform:'uppercase' }}>LIVE TRACKING</div>
            <div style={{ fontSize:'11px', color:'#2a4a6a', fontFamily:"'Share Tech Mono',monospace", letterSpacing:'1px' }}>{type==='fire'?'FIRE UNIT FT-47':'AMBULANCE AMB-23'}</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px clamp(10px,2vw,16px)', background:`rgba(${rgb},0.08)`, border:`1px solid ${s.color}`, borderRadius:'6px', boxShadow:`0 0 20px rgba(${rgb},0.2)`, animation: status==='arrived'?'glowPulse 1s ease infinite':'none', flexShrink:0 }}>
          <div style={{ width:'8px', height:'8px', background:s.color, borderRadius:'50%', boxShadow:`0 0 8px ${s.color}`, animation:'pulseNeon 1s ease infinite', flexShrink:0 }} />
          <span style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'clamp(11px,2.5vw,13px)', color:s.color, fontWeight:'800', letterSpacing:'1px', whiteSpace:'nowrap' }}>{s.label}</span>
        </div>
      </div>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'clamp(16px,3vw,28px) clamp(16px,4vw,24px)', display:'flex', flexDirection:'column', gap:'16px', position:'relative', zIndex:1 }}>
        <div style={{ padding:'16px', background:`rgba(${rgb},0.04)`, border:`1px solid rgba(${rgb},0.15)`, borderRadius:'8px' }}>
          <div style={{ display:'flex', overflowX:'auto' }}>
            {statusFlow.map((st, i) => {
              const isActive = statusFlow.indexOf(status) >= i;
              const isCurrent = status === st;
              return (
                <div key={st} style={{ flex:'1 0 auto', display:'flex', flexDirection:'column', alignItems:'center', position:'relative', minWidth:'64px' }}>
                  {i < statusFlow.length-1 && <div style={{ position:'absolute', top:'14px', left:'50%', right:'-50%', height:'2px', background: statusFlow.indexOf(status)>i?color:`rgba(${rgb},0.1)`, transition:'background 0.5s', zIndex:0 }} />}
                  <div style={{ width:'28px', height:'28px', background: isActive?`rgba(${rgb},0.2)`:'rgba(4,9,15,0.8)', border:`2px solid ${isActive?color:`rgba(${rgb},0.15)`}`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1, position:'relative', boxShadow: isCurrent?`0 0 15px rgba(${rgb},0.5)`:'none', transition:'all 0.5s', flexShrink:0 }}>
                    {isActive && <div style={{ width:'8px', height:'8px', background:color, borderRadius:'50%' }} />}
                  </div>
                  <div style={{ marginTop:'7px', fontSize:'9px', letterSpacing:'0.5px', textTransform:'uppercase', fontFamily:"'Exo 2',sans-serif", color: isActive?color:'#2a4a6a', textAlign:'center', fontWeight: isCurrent?'800':'400', whiteSpace:'nowrap', padding:'0 4px' }}>
                    {statusInfo[st].label.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <RCard title="Live Map" badge="REAL-TIME" glow={type==='fire'?'secondary':'primary'}><LiveMap type={type} /></RCard>

        <RCard title="ETA & Vehicle Info" glow={type==='fire'?'secondary':'primary'}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:'12px' }}>
            {[
              { label:'ETA', value: eta===0?'ARRIVED':`${eta} MIN`, c: eta===0?'#7fff00':color },
              { label:'Distance', value:dist, c:color },
              { label:'Vehicle ID', value: type==='fire'?'FT-47':'AMB-23', c:color },
              { label:'Driver', value: type==='fire'?'Suresh K.':'Rajan P.', c:'#e8f4fd' },
            ].map(item => (
              <div key={item.label} style={{ padding:'14px', background:`rgba(${rgb},0.04)`, border:`1px solid rgba(${rgb},0.12)`, borderRadius:'8px', textAlign:'center' }}>
                <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'clamp(15px,4vw,22px)', color:item.c, fontWeight:'700', marginBottom:'4px', wordBreak:'break-word' }}>{item.value}</div>
                <div style={{ fontSize:'10px', color:'#2a4a6a', letterSpacing:'1.5px', textTransform:'uppercase', fontFamily:"'Exo 2',sans-serif" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </RCard>

        <div style={{ padding:'14px 18px', background:`rgba(${rgb},0.04)`, border:`1px solid rgba(${rgb},0.15)`, borderRadius:'8px', fontSize:'clamp(13px,3vw,14px)', color:'#e8f4fd', lineHeight:'1.6' }}>
          <span style={{ color, fontWeight:'700' }}>◆ STATUS: </span>{s.desc}
        </div>

        <RCard title="Driver Contact" glow="none">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', flexWrap:'wrap' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'14px', flex:1, minWidth:'180px' }}>
              <div style={{ width:'46px', height:'46px', background:`rgba(${rgb},0.1)`, border:`1px solid rgba(${rgb},0.3)`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0 }}>👨‍✈️</div>
              <div>
                <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:'clamp(13px,3vw,15px)', fontWeight:'700', color:'#e8f4fd' }}>{type==='fire'?'Suresh Kumar':'Rajan Patel'}</div>
                <div style={{ fontSize:'12px', color:'#5a7a9a' }}>{type==='fire'?'Chief Fire Officer · 12 yrs':'Paramedic · Certified ALS'}</div>
              </div>
            </div>
            <button style={{ padding:'10px clamp(14px,3vw,20px)', background:`rgba(${rgb},0.1)`, border:`1px solid rgba(${rgb},0.4)`, borderRadius:'6px', color, fontFamily:"'Exo 2',sans-serif", fontSize:'12px', fontWeight:'700', letterSpacing:'1.5px', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>📞 CALL</button>
          </div>
        </RCard>

        {/* Bottom back button — easy access after scrolling */}
        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', paddingTop:'4px', paddingBottom:'20px' }}>
          <button
            onClick={() => onNavigate('home')}
            style={{ flex:1, minWidth:'160px', padding:'14px 20px', background:'rgba(0,245,255,0.05)', border:'1px solid rgba(0,245,255,0.25)', borderRadius:'8px', color:'#00f5ff', fontFamily:"'Exo 2',sans-serif", fontSize:'13px', fontWeight:'700', letterSpacing:'2px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(0,245,255,0.1)'; e.currentTarget.style.borderColor='rgba(0,245,255,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(0,245,255,0.05)'; e.currentTarget.style.borderColor='rgba(0,245,255,0.25)'; }}
          >🏠 BACK TO HOME</button>
          <button
            onClick={() => onNavigate(type === 'fire' ? 'fire-booking' : 'medical-booking')}
            style={{ flex:1, minWidth:'160px', padding:'14px 20px', background:`rgba(${rgb},0.05)`, border:`1px solid rgba(${rgb},0.25)`, borderRadius:'8px', color, fontFamily:"'Exo 2',sans-serif", fontSize:'13px', fontWeight:'700', letterSpacing:'2px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background=`rgba(${rgb},0.1)`; e.currentTarget.style.borderColor=`rgba(${rgb},0.5)`; }}
            onMouseLeave={e => { e.currentTarget.style.background=`rgba(${rgb},0.05)`; e.currentTarget.style.borderColor=`rgba(${rgb},0.25)`; }}
          >{type==='fire'?'🚒':'🚑'} NEW BOOKING</button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   ROOT APP
   ============================================================ */
const App = () => {
  const [screen, setScreen] = useState('login');
  const [screenParams, setScreenParams] = useState({});
  const [user, setUser] = useState(null);

  const navigate = (screenName, params = {}) => {
    setScreen(screenName);
    setScreenParams(params);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleLogin = () => {
    setUser({ name: 'Rahul Sharma', phone: '+91 98765 43210' });
    navigate('home');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'login':           return <LoginScreen onLogin={handleLogin} />;
      case 'home':            return <HomeScreen onNavigate={navigate} user={user} />;
      case 'medical-booking': return <MedicalBookingScreen onNavigate={navigate} />;
      case 'fire-booking':    return <FireBookingScreen onNavigate={navigate} />;
      case 'tracking':        return <TrackingScreen onNavigate={navigate} params={screenParams} />;
      default:                return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: '100vh', background: '#020408' }}>
        {renderScreen()}
      </div>
    </>
  );
};

export default App;