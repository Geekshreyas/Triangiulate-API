import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const EASE = [0.16, 1, 0.3, 1];

const FONT_DISPLAY = "'Clash Display', ui-sans-serif, system-ui";
const FONT_BODY = "'General Sans', ui-sans-serif, system-ui";
const FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";

function TriangulateMark({ size = 44 }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <defs>
        <linearGradient id="lg-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B0F19" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <linearGradient id="lg-line" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F2FE" />
          <stop offset="100%" stopColor="#8FF7FF" />
        </linearGradient>
        <radialGradient id="lg-node" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#00F2FE" />
        </radialGradient>
        <filter id="lg-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width="100" height="100" rx="24" fill="url(#lg-bg)" />
      <motion.circle
        cx="50" cy="55" r="15" fill="none" stroke="#00F2FE"
        strokeWidth="1.3" strokeDasharray="6.5 6" opacity="0.4"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50px 55px' }}
      />
      {[[50,26,50,55],[27,69,50,55],[73,69,50,55]].map((l, i) => (
        <motion.line
          key={i}
          x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]}
          stroke="url(#lg-line)" strokeWidth="2.6" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: EASE }}
        />
      ))}
      <circle cx="50" cy="26" r="5" fill="url(#lg-node)" />
      <circle cx="27" cy="69" r="5" fill="url(#lg-node)" />
      <circle cx="73" cy="69" r="5" fill="url(#lg-node)" />
      <circle cx="50" cy="55" r="5.5" fill="#00F2FE" filter="url(#lg-glow)" />
    </motion.svg>
  );
}

function AmbientField() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '80%',
        background: 'radial-gradient(circle at center, rgba(0,242,254,0.12), transparent 60%)',
        filter: 'blur(60px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-30%', right: '-10%', width: '70%', height: '90%',
        background: 'radial-gradient(circle at center, rgba(30,58,95,0.35), transparent 60%)',
        filter: 'blur(80px)',
      }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
        <defs>
          <pattern id="grid-login" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#8FF7FF" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-login)" />
      </svg>
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (result.role?.toLowerCase() === 'hospital') navigate('/submit');
      else navigate('/');
    } else {
      setError(result.message);
    }
  };

  const inputWrap = (name) => ({
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '14px 16px',
    background: 'rgba(15,23,42,0.6)',
    border: `1px solid ${focused === name ? 'rgba(0,242,254,0.5)' : 'rgba(143,247,255,0.12)'}`,
    borderRadius: 12,
    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: focused === name ? '0 0 0 4px rgba(0,242,254,0.08)' : 'none',
  });

  const inputStyle = {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: '#E2E8F0', fontFamily: FONT_MONO, fontSize: 14, letterSpacing: '0.02em',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0B0F19', padding: '24px', position: 'relative', fontFamily: FONT_BODY,
    }}>
      <AmbientField />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{
          position: 'relative', zIndex: 1, width: '100%', maxWidth: 440,
          background: 'linear-gradient(180deg, rgba(30,41,59,0.7), rgba(15,23,42,0.85))',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(143,247,255,0.12)',
          borderRadius: 20,
          padding: 'clamp(32px, 5vw, 44px)',
          boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,242,254,0.04)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <TriangulateMark size={56} />
          <div style={{
            marginTop: 20,
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.28em',
            color: '#00F2FE', textTransform: 'uppercase',
          }}>
            ▲ Triangulate API
          </div>
          <h1 style={{
            marginTop: 12, marginBottom: 6,
            fontFamily: FONT_DISPLAY, fontWeight: 600,
            fontSize: 'clamp(24px, 4vw, 30px)', color: '#F8FAFC',
            letterSpacing: '-0.02em', textAlign: 'center',
          }}>
            Secure Access Portal
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: '#94A3B8', textAlign: 'center' }}>
            Authenticate to enter the detection grid
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                padding: '12px 14px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 10,
                color: '#FCA5A5', fontSize: 13,
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{
              display: 'block', marginBottom: 8,
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.2em',
              color: '#64748B', textTransform: 'uppercase',
            }}>
              Email Address
            </label>
            <div style={inputWrap('email')}>
              <Mail size={16} color={focused === 'email' ? '#00F2FE' : '#64748B'} />
              <input
                type="email" value={email} required
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                placeholder="operator@triangulate.io"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block', marginBottom: 8,
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.2em',
              color: '#64748B', textTransform: 'uppercase',
            }}>
              Password
            </label>
            <div style={inputWrap('password')}>
              <Lock size={16} color={focused === 'password' ? '#00F2FE' : '#64748B'} />
              <input
                type="password" value={password} required
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                placeholder="••••••••••••"
                style={inputStyle}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            transition={{ duration: 0.2, ease: EASE }}
            style={{
              marginTop: 8, padding: '15px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: loading
                ? 'rgba(0,242,254,0.3)'
                : 'linear-gradient(135deg, #00F2FE, #8FF7FF)',
              color: '#0B0F19', border: 'none', borderRadius: 12,
              cursor: loading ? 'wait' : 'pointer',
              fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 14,
              letterSpacing: '0.02em',
              boxShadow: '0 12px 32px -8px rgba(0,242,254,0.4)',
              transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{
                    width: 14, height: 14, borderRadius: '50%',
                    border: '2px solid rgba(11,15,25,0.3)', borderTopColor: '#0B0F19',
                  }}
                />
                Authenticating
              </>
            ) : (
              <>Enter Grid <ArrowRight size={16} /></>
            )}
          </motion.button>
        </form>

        <div style={{
          marginTop: 28, paddingTop: 20,
          borderTop: '1px solid rgba(143,247,255,0.08)',
          display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center',
        }}>
          <p style={{ margin: 0, fontSize: 13, color: '#94A3B8' }}>
            No credentials?{' '}
            <Link to="/register" style={{
              color: '#00F2FE', textDecoration: 'none', fontWeight: 500,
            }}>
              Request access →
            </Link>
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.18em',
            color: '#475569', textTransform: 'uppercase',
          }}>
            <ShieldCheck size={12} />
            
          </div>
        </div>
      </motion.div>
    </div>
  );
}
