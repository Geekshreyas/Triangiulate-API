import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, ShieldCheck, ShieldAlert, Check, X, FileText, User, Stethoscope, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const HEADING = { fontFamily: '"Clash Display", ui-sans-serif, system-ui, sans-serif', fontWeight: 500, letterSpacing: '-0.02em' };
const BODY = { fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' };
const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace' };

const PAGE_BG = 'radial-gradient(1200px 600px at 10% -10%, rgba(0,242,254,0.08), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(143,247,255,0.05), transparent 60%), #0B0F19';
const PANEL = 'linear-gradient(180deg, rgba(30,41,59,0.55) 0%, rgba(15,23,42,0.55) 100%)';

const ClaimDetail = () => {
  const { id } = useParams();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClaimDetails = async () => {
      try {
        const { data } = await api.get(`/api/claims/${id}`);
        setClaim(data);
      } catch (error) {} finally {
        setLoading(false);
      }
    };
    fetchClaimDetails();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    const isConfirmed = window.confirm(`Are you sure you want to ${newStatus.toUpperCase()} this claim?`);
    if (!isConfirmed) return;
    setIsSubmitting(true);
    try {
      const { data } = await api.put(`/api/claims/${id}/status`, { status: newStatus });
      setClaim(data);
      toast.success(`Claim successfully ${newStatus}!`);
    } catch (error) {
      alert('Failed to update claim status. Check console.');
      toast.error(error.response?.data?.message || 'Failed to update claim status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: PAGE_BG, color: '#F8FAFC', padding: '48px 24px', ...BODY }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ height: 24, width: 180, background: 'rgba(148,163,184,0.15)', borderRadius: 6, marginBottom: 24 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 24 }}>
            <div style={{ height: 480, background: PANEL, border: '1px solid rgba(148,163,184,0.12)', borderRadius: 16 }} />
            <div style={{ height: 480, background: PANEL, border: '1px solid rgba(148,163,184,0.12)', borderRadius: 16 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div style={{ minHeight: '100vh', background: PAGE_BG, color: '#F8FAFC', padding: 48, ...BODY }}>
        <p style={MONO}>Claim data not found.</p>
      </div>
    );
  }

  const actualSum = claim.procedures.reduce((acc, proc) => acc + (proc.cost * (proc.quantity || 1)), 0);
  const hasMathError = actualSum !== claim.totalBilledAmount;
  const flaggedString = claim.flaggedReasons?.join(' ') || '';
  const hasGenderError = flaggedString.includes('Gender');
  const hasAgeError = flaggedString.includes('Age');

  const getRiskTier = (score) => {
    if (score >= 70) return { color: '#F87171', label: 'HIGH RISK', ring: 'rgba(248,113,113,0.4)' };
    if (score >= 40) return { color: '#FBBF24', label: 'ELEVATED', ring: 'rgba(251,191,36,0.4)' };
    return { color: '#00F2FE', label: 'CLEAN', ring: 'rgba(0,242,254,0.4)' };
  };
  const risk = getRiskTier(claim.riskScore);

  return (
    <div style={{ minHeight: '100vh', background: PAGE_BG, color: '#F8FAFC', ...BODY }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 24px 80px' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: '#94A3B8', textDecoration: 'none', fontSize: 13,
            padding: '8px 14px', borderRadius: 999,
            border: '1px solid rgba(148,163,184,0.15)',
            background: 'rgba(15,23,42,0.5)',
            marginBottom: 28, transition: 'all 200ms ease',
            ...MONO,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#00F2FE'; e.currentTarget.style.borderColor = 'rgba(0,242,254,0.35)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.15)'; }}
        >
          <ArrowLeft size={14} /> BACK TO DASHBOARD
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ ...MONO, fontSize: 11, color: '#00F2FE', letterSpacing: '0.2em', marginBottom: 8 }}>CLAIM · {claim.claimId}</div>
          <h1 style={{ ...HEADING, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', margin: 0 }}>Investigation Record</h1>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'flex-start' }}>
          <motion.section
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
            style={{
              gridColumn: 'span 2', minWidth: 0,
              background: PANEL, border: '1px solid rgba(148,163,184,0.12)',
              borderRadius: 16, padding: 28, backdropFilter: 'blur(20px)',
            }}
          >
            <h2 style={{ ...HEADING, fontSize: '1.25rem', margin: '0 0 20px', paddingBottom: 14, borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
              Claim Document Data
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
              <div style={{ padding: 16, background: 'rgba(11,15,25,0.5)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 12 }}>
                {[
                  { icon: FileText, label: 'Claim ID', value: claim.claimId },
                  { icon: Stethoscope, label: 'Provider NPI', value: claim.providerId },
                  { icon: Calendar, label: 'Date of Service', value: claim.dateOfService ? new Date(claim.dateOfService).toLocaleDateString() : 'N/A' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <Icon size={14} color="#00F2FE" />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ ...MONO, fontSize: 10, color: '#94A3B8', letterSpacing: '0.1em' }}>{label.toUpperCase()}</div>
                      <div style={{ ...MONO, fontSize: 13, color: '#F8FAFC', wordBreak: 'break-all' }}>{value}</div>
                    </div>
                  </div>
                ))}
                {claim.documentUrl && (
                  <a
                    href={claim.documentUrl.replace('/upload/', '/upload/fl_attachment/')}
                    download
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      marginTop: 8, padding: '8px 14px',
                      background: 'linear-gradient(135deg, #00F2FE 0%, #8FF7FF 100%)',
                      color: '#0B0F19', textDecoration: 'none', borderRadius: 8,
                      fontSize: 12, fontWeight: 600, ...MONO, letterSpacing: '0.05em',
                    }}
                  >
                    <Download size={14} /> DOWNLOAD SOURCE
                  </a>
                )}
              </div>

              <div style={{
                padding: 16, borderRadius: 12,
                background: (hasGenderError || hasAgeError) ? 'rgba(248,113,113,0.08)' : 'rgba(11,15,25,0.5)',
                border: (hasGenderError || hasAgeError) ? '1px solid rgba(248,113,113,0.35)' : '1px solid rgba(148,163,184,0.08)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <User size={14} color={(hasGenderError || hasAgeError) ? '#F87171' : '#00F2FE'} />
                  <div style={{ ...MONO, fontSize: 10, color: '#94A3B8', letterSpacing: '0.1em' }}>PATIENT PROFILE</div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ ...MONO, fontSize: 10, color: '#94A3B8' }}>GENDER</div>
                  <div style={{ ...MONO, fontSize: 14, color: hasGenderError ? '#F87171' : '#F8FAFC' }}>{claim.patientGender || 'Unknown'}</div>
                </div>
                <div>
                  <div style={{ ...MONO, fontSize: 10, color: '#94A3B8' }}>AGE</div>
                  <div style={{ ...MONO, fontSize: 14, color: hasAgeError ? '#F87171' : '#F8FAFC' }}>{claim.patientAge || 'Unknown'}</div>
                </div>
              </div>
            </div>

            <h3 style={{ ...HEADING, fontSize: '1rem', margin: '0 0 12px' }}>Itemized Procedures</h3>
            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid rgba(148,163,184,0.1)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 480 }}>
                <thead>
                  <tr style={{ background: 'rgba(11,15,25,0.6)' }}>
                    {['Code', 'Description', 'Qty', 'Unit Cost'].map((h) => (
                      <th key={h} style={{ padding: '12px 14px', ...MONO, fontSize: 10, color: '#94A3B8', letterSpacing: '0.15em', fontWeight: 500 }}>
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {claim.procedures.map((proc, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      style={{ borderTop: '1px solid rgba(148,163,184,0.08)' }}
                    >
                      <td style={{ padding: '12px 14px', ...MONO, fontSize: 13, color: '#00F2FE' }}>{proc.code}</td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#F8FAFC' }}>{proc.description}</td>
                      <td style={{ padding: '12px 14px', ...MONO, fontSize: 13, color: '#F8FAFC' }}>{proc.quantity || 1}</td>
                      <td style={{ padding: '12px 14px', ...MONO, fontSize: 13, color: '#F8FAFC' }}>${proc.cost}</td>
                    </motion.tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'rgba(11,15,25,0.4)', borderTop: '1px solid rgba(148,163,184,0.12)' }}>
                    <td colSpan="3" style={{ padding: '12px 14px', textAlign: 'right', ...MONO, fontSize: 11, color: '#94A3B8', letterSpacing: '0.1em' }}>ACTUAL SUM</td>
                    <td style={{ padding: '12px 14px', ...MONO, fontSize: 14, color: '#F8FAFC', fontWeight: 600 }}>${actualSum}</td>
                  </tr>
                  <tr style={{ background: hasMathError ? 'rgba(248,113,113,0.1)' : 'transparent' }}>
                    <td colSpan="3" style={{ padding: '12px 14px', textAlign: 'right', ...MONO, fontSize: 11, color: hasMathError ? '#F87171' : '#94A3B8', letterSpacing: '0.1em' }}>
                      HOSPITAL TOTAL BILLED
                    </td>
                    <td style={{
                      padding: '12px 14px', ...MONO, fontSize: 14, fontWeight: 600,
                      color: hasMathError ? '#F87171' : '#F8FAFC',
                    }}>
                      ${claim.totalBilledAmount}
                      {hasMathError && <span style={{ marginLeft: 8, fontSize: 10, letterSpacing: '0.1em' }}>⚠ MISMATCH</span>}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              position: 'sticky', top: 24, minWidth: 0,
              background: PANEL, border: '1px solid rgba(148,163,184,0.12)',
              borderRadius: 16, padding: 28, backdropFilter: 'blur(20px)',
              boxShadow: `0 0 0 1px ${risk.ring} inset`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              {claim.riskScore >= 40 ? <ShieldAlert size={16} color={risk.color} /> : <ShieldCheck size={16} color={risk.color} />}
              <h2 style={{ ...HEADING, fontSize: '1.1rem', margin: 0 }}>Triangulate Validation</h2>
            </div>

            <div style={{ position: 'relative', textAlign: 'center', padding: '12px 0' }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                style={{ ...HEADING, fontSize: 'clamp(3rem, 8vw, 4rem)', color: risk.color, lineHeight: 1, textShadow: `0 0 40px ${risk.ring}` }}
              >
                {claim.riskScore}<span style={{ fontSize: '0.5em', opacity: 0.6 }}>%</span>
              </motion.div>
              <div style={{ ...MONO, fontSize: 10, color: '#94A3B8', letterSpacing: '0.2em', marginTop: 4 }}>PROBABILITY OF FRAUD</div>
              <div style={{
                display: 'inline-block', marginTop: 12,
                padding: '4px 12px', borderRadius: 999,
                background: `${risk.color}18`, border: `1px solid ${risk.ring}`,
                ...MONO, fontSize: 10, color: risk.color, letterSpacing: '0.15em', fontWeight: 600,
              }}>
                {risk.label}
              </div>
            </div>

            <div style={{ width: '100%', background: 'rgba(148,163,184,0.12)', borderRadius: 999, height: 6, overflow: 'hidden', margin: '24px 0' }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${claim.riskScore}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                style={{ height: '100%', background: `linear-gradient(90deg, ${risk.color}, ${risk.color}aa)`, boxShadow: `0 0 12px ${risk.ring}` }}
              />
            </div>

            <h3 style={{ ...HEADING, fontSize: '0.95rem', margin: '20px 0 12px' }}>Flagged Anomalies</h3>
            {claim.flaggedReasons && claim.flaggedReasons.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <AnimatePresence>
                  {claim.flaggedReasons.map((reason, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      style={{
                        padding: '10px 12px', borderRadius: 8,
                        background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)',
                        color: '#FCA5A5', fontSize: 13, lineHeight: 1.5,
                        display: 'flex', gap: 10, alignItems: 'flex-start',
                      }}
                    >
                      <span style={{ color: '#F87171', marginTop: 2 }}>▲</span>
                      <span>{reason}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            ) : (
              <div style={{
                padding: 14, borderRadius: 10,
                background: 'rgba(0,242,254,0.06)', border: '1px solid rgba(0,242,254,0.25)',
                color: '#8FF7FF', fontSize: 13, display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <ShieldCheck size={16} style={{ marginTop: 1 }} />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>Clean Claim</div>
                  <div style={{ opacity: 0.75, fontSize: 12 }}>All arithmetic and clinical layers passed.</div>
                </div>
              </div>
            )}
          </motion.aside>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          style={{ marginTop: 40, paddingTop: 28, borderTop: '1px solid rgba(148,163,184,0.12)' }}
        >
          {claim.status === 'Pending' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              <motion.button
                onClick={() => handleStatusUpdate('Approved')}
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                style={{
                  padding: '16px 24px',
                  background: isSubmitting ? 'rgba(0,242,254,0.2)' : 'linear-gradient(135deg, #00F2FE 0%, #8FF7FF 100%)',
                  color: '#0B0F19', border: 'none', borderRadius: 12,
                  fontWeight: 600, fontSize: 14, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  ...MONO, letterSpacing: '0.1em',
                  boxShadow: '0 8px 24px -8px rgba(0,242,254,0.5)',
                }}
              >
                <Check size={16} /> {isSubmitting ? 'PROCESSING…' : 'APPROVE PAYMENT'}
              </motion.button>
              <motion.button
                onClick={() => handleStatusUpdate('Rejected')}
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                style={{
                  padding: '16px 24px',
                  background: 'rgba(15,23,42,0.6)',
                  color: '#FCA5A5', border: '1px solid rgba(248,113,113,0.4)', borderRadius: 12,
                  fontWeight: 600, fontSize: 14, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  ...MONO, letterSpacing: '0.1em',
                }}
              >
                <X size={16} /> {isSubmitting ? 'PROCESSING…' : 'REJECT CLAIM'}
              </motion.button>
            </div>
          ) : (
            <div style={{
              padding: 24, textAlign: 'center', borderRadius: 12,
              background: claim.status === 'Approved' ? 'rgba(0,242,254,0.06)' : 'rgba(248,113,113,0.06)',
              border: claim.status === 'Approved' ? '1px solid rgba(0,242,254,0.3)' : '1px solid rgba(248,113,113,0.3)',
            }}>
              <div style={{ ...MONO, fontSize: 11, color: '#94A3B8', letterSpacing: '0.2em', marginBottom: 6 }}>ADJUDICATION STATUS</div>
              <h3 style={{ ...HEADING, margin: 0, fontSize: '1.5rem', color: claim.status === 'Approved' ? '#8FF7FF' : '#FCA5A5' }}>
                CLAIM {claim.status.toUpperCase()}
              </h3>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: '#94A3B8' }}>This claim has already been adjudicated.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ClaimDetail;
