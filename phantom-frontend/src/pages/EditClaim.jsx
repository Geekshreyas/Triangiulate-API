import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Upload, Save, FileCheck2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const HEADING = { fontFamily: '"Clash Display", ui-sans-serif, system-ui, sans-serif', fontWeight: 500, letterSpacing: '-0.02em' };
const BODY = { fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' };
const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace' };

const PAGE_BG = 'radial-gradient(1200px 600px at 10% -10%, rgba(0,242,254,0.08), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(143,247,255,0.05), transparent 60%), #0B0F19';
const PANEL = 'linear-gradient(180deg, rgba(30,41,59,0.55) 0%, rgba(15,23,42,0.55) 100%)';

const inputBase = {
  width: '100%', padding: '12px 14px', marginTop: 6,
  background: 'rgba(11,15,25,0.6)',
  border: '1px solid rgba(148,163,184,0.18)',
  borderRadius: 10, color: '#F8FAFC',
  fontSize: 14, outline: 'none',
  transition: 'border-color 200ms ease, box-shadow 200ms ease, background 200ms ease',
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
};

const focusOn = (e) => {
  e.currentTarget.style.borderColor = 'rgba(0,242,254,0.6)';
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,242,254,0.12)';
  e.currentTarget.style.background = 'rgba(11,15,25,0.9)';
};
const focusOff = (e) => {
  e.currentTarget.style.borderColor = 'rgba(148,163,184,0.18)';
  e.currentTarget.style.boxShadow = 'none';
  e.currentTarget.style.background = 'rgba(11,15,25,0.6)';
};

const labelStyle = { ...MONO, fontSize: 10, color: '#94A3B8', letterSpacing: '0.15em', fontWeight: 500, textTransform: 'uppercase' };

const EditClaim = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    claimId: '', patientId: '', providerId: '', totalBilledAmount: '',
    patientGender: 'Unknown', patientAge: '', diagnosisCodes: '', dateOfService: '',
  });

  const [procedures, setProcedures] = useState([{ code: '', description: '', cost: '', quantity: 1 }]);
  const [file, setFile] = useState(null);
  const [existingDocumentUrl, setExistingDocumentUrl] = useState(null);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const { data } = await api.get(`/api/claims/${id}`);
        let formattedDate = '';
        if (data.dateOfService) {
          const d = new Date(data.dateOfService);
          formattedDate = d.toISOString().split('T')[0];
        }
        setFormData({
          claimId: data.claimId,
          patientId: data.patientId,
          providerId: data.providerId,
          totalBilledAmount: data.totalBilledAmount,
          patientGender: data.patientGender || 'Unknown',
          patientAge: data.patientAge || '',
          diagnosisCodes: (data.diagnosisCodes || []).join(', '),
          dateOfService: formattedDate,
        });
        if (data.procedures && data.procedures.length > 0) setProcedures(data.procedures);
        setExistingDocumentUrl(data.documentUrl);
      } catch (error) {
        toast.error('Failed to load claim data.');
      } finally {
        setLoading(false);
      }
    };
    fetchClaim();
  }, [id]);

  const handleAddProcedure = () => {
    setProcedures([...procedures, { code: '', description: '', cost: '', quantity: 1 }]);
  };

  const handleProcedureChange = (index, field, value) => {
    const updatedProcedures = [...procedures];
    updatedProcedures[index][field] = value;
    setProcedures(updatedProcedures);
  };

  const handleRemoveProcedure = (index) => {
    const updatedProcedures = procedures.filter((_, i) => i !== index);
    setProcedures(updatedProcedures);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = new FormData();
    payload.append('claimId', formData.claimId);
    payload.append('patientId', formData.patientId);
    payload.append('providerId', formData.providerId);
    payload.append('totalBilledAmount', Number(formData.totalBilledAmount));
    payload.append('patientGender', formData.patientGender);
    if (formData.dateOfService) payload.append('dateOfService', formData.dateOfService);
    if (formData.patientAge) payload.append('patientAge', Number(formData.patientAge));
    const codesArray = formData.diagnosisCodes.split(',').map(c => c.trim()).filter(c => c !== '');
    if (codesArray.length > 0) payload.append('diagnosisCodes', JSON.stringify(codesArray));
    const formattedProcedures = procedures.map(p => ({ ...p, cost: Number(p.cost), quantity: Number(p.quantity) }));
    payload.append('procedures', JSON.stringify(formattedProcedures));
    if (file) payload.append('document', file);

    try {
      await api.put(`/api/claims/${id}/edit`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Claim updated successfully!');
      navigate('/my-claims');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update claim');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: PAGE_BG, color: '#F8FAFC', padding: 48, ...BODY }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ height: 24, width: 180, background: 'rgba(148,163,184,0.15)', borderRadius: 6, marginBottom: 20 }} />
          <div style={{ height: 560, background: PANEL, border: '1px solid rgba(148,163,184,0.12)', borderRadius: 16 }} />
        </div>
      </div>
    );
  }

  const fields = [
    { key: 'patientId', label: 'Patient ID', type: 'text' },
    { key: 'providerId', label: 'Provider NPI', type: 'text' },
    { key: 'totalBilledAmount', label: 'Total Billed ($)', type: 'number' },
    { key: 'patientGender', label: 'Patient Gender', type: 'select' },
    { key: 'patientAge', label: 'Patient Age', type: 'number' },
    { key: 'dateOfService', label: 'Date of Service', type: 'date' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: PAGE_BG, color: '#F8FAFC', ...BODY }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>
        <Link
          to="/my-claims"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: '#94A3B8', textDecoration: 'none', fontSize: 13,
            padding: '8px 14px', borderRadius: 999,
            border: '1px solid rgba(148,163,184,0.15)',
            background: 'rgba(15,23,42,0.5)',
            marginBottom: 28, ...MONO,
            transition: 'all 200ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#00F2FE'; e.currentTarget.style.borderColor = 'rgba(0,242,254,0.35)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.15)'; }}
        >
          <ArrowLeft size={14} /> BACK TO MY CLAIMS
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ ...MONO, fontSize: 11, color: '#00F2FE', letterSpacing: '0.2em', marginBottom: 8 }}>
            EDIT · {formData.claimId}
          </div>
          <h1 style={{ ...HEADING, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', margin: 0 }}>Modify Claim</h1>
          <p style={{ color: '#94A3B8', marginTop: 8, fontSize: 14 }}>Update the details below and resubmit to the validation engine.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
          onSubmit={handleSubmit}
          style={{
            background: PANEL, border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: 16, padding: 28, backdropFilter: 'blur(20px)',
            display: 'flex', flexDirection: 'column', gap: 24,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {fields.map((f) => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                {f.type === 'select' ? (
                  <select
                    value={formData[f.key]}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    style={inputBase}
                    onFocus={focusOn} onBlur={focusOff}
                  >
                    <option value="Unknown">Select…</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <input
                    type={f.type}
                    required={f.key !== 'patientAge' ? true : true}
                    value={formData[f.key]}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    style={inputBase}
                    onFocus={focusOn} onBlur={focusOff}
                  />
                )}
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>ICD-10 Diagnosis Codes (comma separated)</label>
              <input
                type="text"
                value={formData.diagnosisCodes}
                onChange={(e) => setFormData({ ...formData, diagnosisCodes: e.target.value })}
                style={inputBase}
                onFocus={focusOn} onBlur={focusOff}
              />
            </div>
          </div>

          <div style={{
            background: 'rgba(11,15,25,0.5)',
            border: '1px solid rgba(148,163,184,0.1)',
            borderRadius: 12, padding: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ ...HEADING, margin: 0, fontSize: '1.05rem' }}>Itemized Procedures</h3>
                <div style={{ ...MONO, fontSize: 10, color: '#94A3B8', letterSpacing: '0.15em', marginTop: 4 }}>CPT PROCEDURE CODES</div>
              </div>
              <motion.button
                type="button"
                onClick={handleAddProcedure}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', background: 'rgba(0,242,254,0.1)',
                  color: '#00F2FE', border: '1px solid rgba(0,242,254,0.35)',
                  borderRadius: 8, cursor: 'pointer',
                  ...MONO, fontSize: 12, letterSpacing: '0.1em', fontWeight: 600,
                }}
              >
                <Plus size={14} /> ADD ROW
              </motion.button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <AnimatePresence initial={false}>
                {procedures.map((proc, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'grid', gridTemplateColumns: 'minmax(80px,1fr) minmax(140px,2fr) minmax(80px,1fr) minmax(60px,0.7fr) auto', gap: 8 }}
                  >
                    <input type="text" placeholder="Code" required value={proc.code}
                      onChange={(e) => handleProcedureChange(index, 'code', e.target.value)}
                      style={{ ...inputBase, marginTop: 0, padding: '10px 12px' }}
                      onFocus={focusOn} onBlur={focusOff} />
                    <input type="text" placeholder="Description" value={proc.description}
                      onChange={(e) => handleProcedureChange(index, 'description', e.target.value)}
                      style={{ ...inputBase, marginTop: 0, padding: '10px 12px', fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' }}
                      onFocus={focusOn} onBlur={focusOff} />
                    <input type="number" placeholder="Cost" required value={proc.cost}
                      onChange={(e) => handleProcedureChange(index, 'cost', e.target.value)}
                      style={{ ...inputBase, marginTop: 0, padding: '10px 12px' }}
                      onFocus={focusOn} onBlur={focusOff} />
                    <input type="number" placeholder="Qty" required value={proc.quantity}
                      onChange={(e) => handleProcedureChange(index, 'quantity', e.target.value)}
                      style={{ ...inputBase, marginTop: 0, padding: '10px 12px' }}
                      onFocus={focusOn} onBlur={focusOff} />
                    <motion.button
                      type="button" onClick={() => handleRemoveProcedure(index)}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '0 12px', background: 'rgba(248,113,113,0.08)',
                        color: '#F87171', border: '1px solid rgba(248,113,113,0.3)',
                        borderRadius: 10, cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}
                      aria-label="Remove procedure"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <label style={{
            padding: 24, borderRadius: 12,
            border: '1.5px dashed rgba(0,242,254,0.3)',
            background: 'rgba(0,242,254,0.03)',
            textAlign: 'center', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            transition: 'all 200ms ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,242,254,0.6)'; e.currentTarget.style.background = 'rgba(0,242,254,0.06)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,242,254,0.3)'; e.currentTarget.style.background = 'rgba(0,242,254,0.03)'; }}
          >
            <Upload size={20} color="#00F2FE" />
            <div style={{ ...MONO, fontSize: 11, color: '#94A3B8', letterSpacing: '0.15em' }}>
              UPLOAD REPLACEMENT DOCUMENT (OPTIONAL)
            </div>
            {existingDocumentUrl && !file && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#8FF7FF', fontSize: 12, ...MONO }}>
                <FileCheck2 size={14} /> EXISTING DOCUMENT ATTACHED
              </div>
            )}
            {file && (
              <div style={{ ...MONO, fontSize: 12, color: '#00F2FE' }}>{file.name}</div>
            )}
            <input
              type="file" accept=".pdf, .jpg, .jpeg, .png"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
            <div style={{ ...MONO, fontSize: 10, color: '#64748B' }}>PDF · JPG · PNG</div>
          </label>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.005 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.995 }}
            style={{
              padding: '16px 24px',
              background: isSubmitting ? 'rgba(0,242,254,0.2)' : 'linear-gradient(135deg, #00F2FE 0%, #8FF7FF 100%)',
              color: '#0B0F19', border: 'none', borderRadius: 12,
              fontSize: 14, fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              ...MONO, letterSpacing: '0.1em',
              boxShadow: '0 12px 32px -12px rgba(0,242,254,0.55)',
            }}
          >
            <Save size={16} /> {isSubmitting ? 'SAVING…' : 'SAVE & RE-EVALUATE'}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default EditClaim;
