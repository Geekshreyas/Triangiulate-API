import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Plus, UploadCloud, Send, Loader2 } from 'lucide-react';
import api from '../utils/api';

const SubmitClaim = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        claimId: `CLM-${Math.floor(Math.random() * 100000)}`,
        patientId: '', providerId: '', totalBilledAmount: '',
        patientGender: 'Unknown', patientAge: '', diagnosisCodes: '', dateOfService: ''
    });
    const [procedures, setProcedures] = useState([{ code: '', description: '', cost: '', quantity: 1 }]);
    const [file, setFile] = useState(null);

    const handleAddProcedure = () => setProcedures([...procedures, { code: '', description: '', cost: '', quantity: 1 }]);
    const handleProcedureChange = (index, field, value) => {
        const updated = [...procedures];
        updated[index][field] = value;
        setProcedures(updated);
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
            await api.post('/api/claims/submit', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Claim submitted to AI Engine successfully!');
            setFormData({
                claimId: `CLM-${Math.floor(Math.random() * 1000000)}`,
                patientId: '', providerId: '', totalBilledAmount: '',
                patientGender: 'Unknown', patientAge: '', diagnosisCodes: '', dateOfService: ''
            });
            setProcedures([{ code: '', description: '', cost: '', quantity: 1 }]);
            setFile(null);
            e.target.reset();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit claim');
        } finally {
            setIsSubmitting(false);
        }
    };

    const headings = { fontFamily: '"Clash Display", ui-sans-serif, system-ui, sans-serif' };
    const body = { fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' };
    const mono = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' };

    const fieldStyle = {
        width: '100%',
        padding: '11px 14px',
        marginTop: '8px',
        background: 'rgba(11,15,25,0.6)',
        border: '1px solid rgba(148,163,184,0.18)',
        borderRadius: '10px',
        color: '#F8FAFC',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        ...body,
    };
    const labelStyle = { fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#94A3B8', ...mono };

    const onFocus = (e) => { e.target.style.borderColor = 'rgba(0,242,254,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,242,254,0.12)'; };
    const onBlur = (e) => { e.target.style.borderColor = 'rgba(148,163,184,0.18)'; e.target.style.boxShadow = 'none'; };

    return (
        <div className="min-h-screen w-full" style={{ background: 'radial-gradient(1000px 500px at 80% -10%, rgba(0,242,254,0.06), transparent 60%), #0B0F19', color: '#F8FAFC', ...body }}>
            <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em]" style={{ color: '#00F2FE', ...mono }}>
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00F2FE] shadow-[0_0_10px_#00F2FE]" />
                        Provider Portal
                    </div>
                    <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.02em]" style={{ ...headings, fontWeight: 600 }}>
                        Submit a claim for triangulation
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm sm:text-base" style={{ color: '#94A3B8' }}>
                        Upload a claim document and route it through the Phantom Detection gateway.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs" style={{ background: 'rgba(0,242,254,0.06)', border: '1px solid rgba(0,242,254,0.25)', color: '#8FF7FF', ...mono }}>
                        <span>Claim ID</span>
                        <span style={{ color: '#F8FAFC' }}>{formData.claimId}</span>
                    </div>
                </motion.div>

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                    className="mt-8 flex flex-col gap-6"
                >
                    <div className="rounded-2xl p-5 sm:p-7" style={{ background: 'linear-gradient(180deg, rgba(30,41,59,0.55), rgba(15,23,42,0.55))', border: '1px solid rgba(148,163,184,0.12)', backdropFilter: 'blur(8px)' }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                            <div>
                                <label style={labelStyle}>Patient ID</label>
                                <input type="text" required value={formData.patientId} onChange={e => setFormData({ ...formData, patientId: e.target.value })} onFocus={onFocus} onBlur={onBlur} style={fieldStyle} placeholder="PAT-123" />
                            </div>
                            <div>
                                <label style={labelStyle}>Provider NPI</label>
                                <input type="text" required value={formData.providerId} onChange={e => setFormData({ ...formData, providerId: e.target.value })} onFocus={onFocus} onBlur={onBlur} style={fieldStyle} placeholder="DOC-999" />
                            </div>
                            <div>
                                <label style={labelStyle}>Total Billed ($)</label>
                                <input type="number" required value={formData.totalBilledAmount} onChange={e => setFormData({ ...formData, totalBilledAmount: e.target.value })} onFocus={onFocus} onBlur={onBlur} style={{ ...fieldStyle, ...mono }} placeholder="5000" />
                            </div>
                            <div>
                                <label style={labelStyle}>Patient Gender</label>
                                <select value={formData.patientGender} onChange={e => setFormData({ ...formData, patientGender: e.target.value })} onFocus={onFocus} onBlur={onBlur} style={fieldStyle}>
                                    <option value="Unknown">Select…</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Patient Age</label>
                                <input type="number" required value={formData.patientAge} onChange={e => setFormData({ ...formData, patientAge: e.target.value })} onFocus={onFocus} onBlur={onBlur} style={{ ...fieldStyle, ...mono }} placeholder="45" />
                            </div>
                            <div>
                                <label style={labelStyle}>Date of Service</label>
                                <input type="date" required value={formData.dateOfService} onChange={e => setFormData({ ...formData, dateOfService: e.target.value })} onFocus={onFocus} onBlur={onBlur} style={fieldStyle} />
                            </div>
                            <div className="sm:col-span-2">
                                <label style={labelStyle}>ICD-10 Diagnosis Codes</label>
                                <input type="text" value={formData.diagnosisCodes} onChange={e => setFormData({ ...formData, diagnosisCodes: e.target.value })} onFocus={onFocus} onBlur={onBlur} style={{ ...fieldStyle, ...mono }} placeholder="O80, P09" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl p-5 sm:p-7" style={{ background: 'linear-gradient(180deg, rgba(30,41,59,0.55), rgba(15,23,42,0.55))', border: '1px solid rgba(148,163,184,0.12)' }}>
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between mb-5">
                            <div className="min-w-0">
                                <div style={labelStyle}>Itemized</div>
                                <h3 className="mt-1 truncate text-lg sm:text-xl" style={{ ...headings, fontWeight: 500 }}>CPT procedure codes</h3>
                            </div>
                            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} type="button" onClick={handleAddProcedure}
                                className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm"
                                style={{ background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.35)', color: '#8FF7FF' }}>
                                <Plus size={14} /> Add row
                            </motion.button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {procedures.map((proc, index) => (
                                <motion.div key={index} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    className="grid grid-cols-2 sm:grid-cols-[1fr_2fr_1fr_1fr] gap-3">
                                    <input type="text" placeholder="Code · 99213" required value={proc.code} onChange={e => handleProcedureChange(index, 'code', e.target.value)} onFocus={onFocus} onBlur={onBlur} style={{ ...fieldStyle, ...mono, marginTop: 0 }} />
                                    <input type="text" placeholder="Description" value={proc.description} onChange={e => handleProcedureChange(index, 'description', e.target.value)} onFocus={onFocus} onBlur={onBlur} style={{ ...fieldStyle, marginTop: 0 }} />
                                    <input type="number" placeholder="Cost" required value={proc.cost} onChange={e => handleProcedureChange(index, 'cost', e.target.value)} onFocus={onFocus} onBlur={onBlur} style={{ ...fieldStyle, ...mono, marginTop: 0 }} />
                                    <input type="number" placeholder="Qty" required value={proc.quantity} onChange={e => handleProcedureChange(index, 'quantity', e.target.value)} onFocus={onFocus} onBlur={onBlur} style={{ ...fieldStyle, ...mono, marginTop: 0 }} />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <label className="group relative rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors"
                        style={{ background: 'rgba(11,15,25,0.5)', border: '1.5px dashed rgba(0,242,254,0.35)' }}>
                        <div className="flex flex-col items-center gap-3">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.3)' }}>
                                <UploadCloud size={20} color="#8FF7FF" />
                            </span>
                            <div>
                                <div style={{ ...headings, fontWeight: 500, color: '#F8FAFC' }}>
                                    {file ? file.name : 'Upload claim document'}
                                </div>
                                <div className="mt-1 text-xs" style={{ color: '#64748B', ...mono }}>PDF · JPG · PNG</div>
                            </div>
                        </div>
                        <input type="file" accept=".pdf, .jpg, .jpeg, .png" onChange={e => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </label>

                    <motion.button
                        whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                        type="submit" disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{
                            background: isSubmitting ? 'rgba(148,163,184,0.15)' : 'linear-gradient(135deg, #00F2FE, #8FF7FF)',
                            color: isSubmitting ? '#94A3B8' : '#0B0F19',
                            border: '1px solid rgba(0,242,254,0.5)',
                            boxShadow: isSubmitting ? 'none' : '0 10px 40px -12px rgba(0,242,254,0.5)',
                            fontWeight: 600, ...headings,
                            letterSpacing: '0.01em',
                        }}
                    >
                        {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Uploading & analyzing…</> : <><Send size={16} /> Submit claim</>}
                    </motion.button>
                </motion.form>
            </div>
        </div>
    );
};

export default SubmitClaim;
