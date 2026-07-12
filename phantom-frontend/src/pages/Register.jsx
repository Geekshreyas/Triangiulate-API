import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Building2, Shield, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const EASE = [0.16, 1, 0.3, 1];
const FONT_DISPLAY = "'Clash Display', ui-sans-serif, system-ui";
const FONT_BODY = "'General Sans', ui-sans-serif, system-ui";
const FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";

const ROLES = [
  { id: 'hospital', label: 'Hospital', icon: Building2, desc: 'Submit & manage claims' },
  { id: 'adjudicator', label: 'Admin / Adjudicator (Demo Only)', icon: Shield, desc: 'Review & investigate' },
  { id: 'superadmin', label: 'Compliance / Superadmin (Demo Only)', icon: ShieldCheck, desc: 'Audit oversight' },
];

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'hospital' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      if (formData.role === 'hospital') navigate('/submit');
      else if (formData.role === 'superadmin') navigate('/compliance');
      else navigate('/');
    } catch (err) {
      setError('Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputWrap = (name) => ({
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '13px 16px',
    background: 'rgba(15,23,42,0.6)',
    border: `1px solid ${focused === name ? 'rgba(0,242,254,0.5)' : 'rgba(143,247,255,0.12)'}`,
    borderRadius: 12,
    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: focused === name ? '0 0 0 4px rgba(0,242,254,0.08)' : 'none',
  });

  const inputStyle = {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: '#E2E8F0', fontFamily: FONT_MONO, fontSize: 14,
  };

  const labelStyle = {
    display: 'block', marginBottom: 8,
    fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.2em',
    color: '#64748B', textTransform: 'uppercase',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0B0F19', padding: '24px', position: 'relative', fontFamily: FONT_BODY,
    }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%', width: '60%', height: '80%',
          background: 'radial-gradient(circle at center, rgba(0,242,254,0.1), transparent 60%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-30%', left: '-10%', width: '70%', height: '90%',
          background: 'radial-gradient(circle at center, rgba(30,58,95,0.35), transparent 60%)',
          filter: 'blur(80px)',
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{
          position: 'relative', zIndex: 1, width: '100%', maxWidth: 480,
          background: 'linear-gradient(180deg, rgba(30,41,59,0.7), rgba(15,23,42,0.85))',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(143,247,255,0.12)',
          borderRadius: 20,
          padding: 'clamp(28px, 5vw, 40px)',
          boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.28em',
            color: '#00F2FE', textTransform: 'uppercase', marginBottom: 8,
          }}>
            ▲ New Operator · Access Request
          </div>
          <h1 style={{
            margin: 0, marginBottom: 6,
            fontFamily: FONT_DISPLAY, fontWeight: 600,
            fontSize: 'clamp(26px, 4vw, 32px)', color: '#F8FAFC',
            letterSpacing: '-0.02em',
          }}>
            Provision Account
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: '#94A3B8' }}>
            Configure your role and enter the detection grid.
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 18 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{
                display: 'flex', gap: 10,
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
            <label style={labelStyle}>Full Name</label>
            <div style={inputWrap('name')}>
              <User size={16} color={focused === 'name' ? '#00F2FE' : '#64748B'} />
              <input
                type="text" required placeholder="Jane Doe"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <div style={inputWrap('email')}>
              <Mail size={16} color={focused === 'email' ? '#00F2FE' : '#64748B'} />
              <input
                type="email" required placeholder="operator@triangulate.io"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={inputWrap('password')}>
              <Lock size={16} color={focused === 'password' ? '#00F2FE' : '#64748B'} />
              <input
                type="password" required placeholder="••••••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Role Assignment</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 10,
            }}>
              {ROLES.map((r) => {
                const active = formData.role === r.id;
                const Icon = r.icon;
                return (
                  <motion.button
                    key={r.id}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: EASE }}
                    onClick={() => setFormData({ ...formData, role: r.id })}
                    style={{
                      position: 'relative',
                      padding: '14px 12px',
                      background: active
                        ? 'linear-gradient(180deg, rgba(0,242,254,0.12), rgba(0,242,254,0.04))'
                        : 'rgba(15,23,42,0.6)',
                      border: `1px solid ${active ? 'rgba(0,242,254,0.5)' : 'rgba(143,247,255,0.1)'}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex', flexDirection: 'column', gap: 6,
                      transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                      boxShadow: active ? '0 0 0 4px rgba(0,242,254,0.06)' : 'none',
                    }}
                  >
                    <Icon size={16} color={active ? '#00F2FE' : '#94A3B8'} />
                    <div style={{
                      fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 13,
                      color: active ? '#F8FAFC' : '#CBD5E1',
                    }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.3 }}>
                      {r.desc}
                    </div>
                  </motion.button>
                );
              })}
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
              boxShadow: '0 12px 32px -8px rgba(0,242,254,0.4)',
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
                Provisioning
              </>
            ) : (
              <>Create Account <ArrowRight size={16} /></>
            )}
          </motion.button>
        </form>

        <div style={{
          marginTop: 24, paddingTop: 20,
          borderTop: '1px solid rgba(143,247,255,0.08)',
          textAlign: 'center',
        }}>
          <p style={{ margin: 0, fontSize: 13, color: '#94A3B8' }}>
            Already provisioned?{' '}
            <Link to="/login" style={{ color: '#00F2FE', textDecoration: 'none', fontWeight: 500 }}>
              Sign in →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
