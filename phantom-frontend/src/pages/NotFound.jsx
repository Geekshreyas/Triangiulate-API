import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RadioTower } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];
const FONT_DISPLAY = "'Clash Display', ui-sans-serif, system-ui";
const FONT_BODY = "'General Sans', ui-sans-serif, system-ui";
const FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', fontFamily: FONT_BODY, background: '#0B0F19',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 600, height: 600, transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle at center, rgba(0,242,254,0.08), transparent 60%)',
          filter: 'blur(60px)',
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{
          position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 480,
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          style={{
            width: 120, height: 120, margin: '0 auto 28px',
            position: 'relative',
          }}
        >
          <svg viewBox="0 0 120 120" width="120" height="120">
            <defs>
              <linearGradient id="nf-line" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F2FE" />
                <stop offset="100%" stopColor="#8FF7FF" />
              </linearGradient>
              <radialGradient id="nf-node" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#00F2FE" />
              </radialGradient>
            </defs>
            <motion.circle
              cx="60" cy="65" r="34" fill="none" stroke="#00F2FE"
              strokeWidth="1" strokeDasharray="4 6" opacity="0.4"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '60px 65px' }}
            />
            {[[60,28,60,65],[28,84,60,65],[92,84,60,65]].map((l, i) => (
              <motion.line
                key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]}
                stroke="url(#nf-line)" strokeWidth="2" strokeLinecap="round"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: EASE, delay: i * 0.2 }}
              />
            ))}
            <circle cx="60" cy="28" r="6" fill="url(#nf-node)" />
            <circle cx="28" cy="84" r="6" fill="url(#nf-node)" />
            <circle cx="92" cy="84" r="6" fill="url(#nf-node)" opacity="0.3" />
            <motion.circle
              cx="60" cy="65" r="5" fill="#00F2FE"
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: EASE }}
              style={{ transformOrigin: '60px 65px' }}
            />
          </svg>
        </motion.div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', marginBottom: 20,
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 999,
          fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.24em',
          color: '#FCA5A5', textTransform: 'uppercase',
        }}>
          <RadioTower size={12} />
          Signal Lost · 404
        </div>

        <h1 style={{
          margin: '0 0 12px', fontFamily: FONT_DISPLAY, fontWeight: 600,
          fontSize: 'clamp(48px, 8vw, 72px)', color: '#F8FAFC',
          letterSpacing: '-0.03em', lineHeight: 1,
        }}>
          Off the grid.
        </h1>

        <p style={{
          margin: '0 0 32px', fontSize: 16, color: '#94A3B8',
          lineHeight: 1.6,
        }}>
          The coordinate you triangulated doesn't map to any known endpoint.
          Return to the control center to continue.
        </p>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: EASE }}
          style={{ display: 'inline-block' }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #00F2FE, #8FF7FF)',
              color: '#0B0F19', textDecoration: 'none',
              borderRadius: 12, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 14,
              boxShadow: '0 12px 32px -8px rgba(0,242,254,0.4)',
            }}
          >
            <ArrowLeft size={16} />
            Return to Dashboard
          </Link>
        </motion.div>

        <div style={{
          marginTop: 40, fontFamily: FONT_MONO, fontSize: 10,
          letterSpacing: '0.2em', color: '#475569', textTransform: 'uppercase',
        }}>
          ERR_ROUTE_NOT_TRIANGULATED
        </div>
      </motion.div>
    </div>
  );
}
