import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Lock, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import api from '../utils/api';

const headings = { fontFamily: '"Clash Display", ui-sans-serif, system-ui, sans-serif' };
const body = { fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' };
const mono = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' };

const statusStyles = {
    Pending:  { color: '#FBBF24', bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.35)' },
    Approved: { color: '#34D399', bg: 'rgba(52,211,153,0.10)', border: 'rgba(52,211,153,0.35)' },
    Rejected: { color: '#F87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.35)' },
};

const MyClaims = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = sessionStorage.getItem('my_claims_page');
        return savedPage ? parseInt(savedPage) : 1;
    });
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        sessionStorage.setItem('my_claims_page', currentPage);
    }, [currentPage]);

    const fetchMyClaims = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/claims/my-claims', { params: { page: currentPage, limit: 10 } });
            setClaims(response.data.docs);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            toast.error("Failed to load your claims.");
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => { fetchMyClaims(); }, [fetchMyClaims]);

    const handleDelete = async (claimId) => {
        const isConfirmed = window.confirm("Are you sure you want to completely delete this claim? This action cannot be undone.");
        if (!isConfirmed) return;
        try {
            await api.delete(`/api/claims/${claimId}`);
            toast.success("Claim successfully deleted.");
            fetchMyClaims();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete claim.");
        }
    };

    const labelKicker = { fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#00F2FE', ...mono };
    const colLabel = { fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#64748B', ...mono };

    return (
        <div className="min-h-screen w-full" style={{ background: 'radial-gradient(1000px 500px at 10% -10%, rgba(0,242,254,0.06), transparent 60%), #0B0F19', color: '#F8FAFC', ...body }}>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between sm:items-end">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2" style={labelKicker}>
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00F2FE] shadow-[0_0_10px_#00F2FE]" />
                            Provider Portal
                        </div>
                        <h1 className="mt-2 truncate text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.02em]" style={{ ...headings, fontWeight: 600 }}>
                            My submitted claims
                        </h1>
                        <p className="mt-2 text-sm sm:text-base" style={{ color: '#94A3B8' }}>
                            Every claim you've routed through the triangulation engine.
                        </p>
                    </div>
                    <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/submit')}
                        className="shrink-0 inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm"
                        style={{
                            background: 'linear-gradient(135deg, #00F2FE, #8FF7FF)',
                            color: '#0B0F19', border: '1px solid rgba(0,242,254,0.5)',
                            boxShadow: '0 10px 40px -12px rgba(0,242,254,0.5)',
                            fontWeight: 600, ...headings,
                        }}>
                        <Plus size={14} /> Submit new claim
                    </motion.button>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                    className="mt-8 rounded-2xl overflow-hidden"
                    style={{ background: 'linear-gradient(180deg, rgba(30,41,59,0.55), rgba(15,23,42,0.55))', border: '1px solid rgba(148,163,184,0.12)', backdropFilter: 'blur(8px)' }}>

                    <div className="hidden lg:grid grid-cols-[1.1fr_1fr_1fr_1fr_0.9fr_1fr] gap-4 px-5 py-3 border-b" style={{ borderColor: 'rgba(148,163,184,0.12)' }}>
                        <div style={colLabel}>Claim ID</div>
                        <div style={colLabel}>Patient</div>
                        <div style={colLabel}>Date of service</div>
                        <div style={colLabel}>Billed</div>
                        <div style={colLabel}>Status</div>
                        <div style={{ ...colLabel, textAlign: 'right' }}>Actions</div>
                    </div>

                    <div className="flex flex-col">
                        <AnimatePresence initial={false}>
                            {loading && claims.length === 0 ? (
                                [...Array(5)].map((_, i) => (
                                    <div key={`sk-${i}`} className="px-5 py-4 border-b" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
                                        <div className="h-4 w-full rounded animate-pulse" style={{ background: 'rgba(148,163,184,0.10)' }} />
                                    </div>
                                ))
                            ) : claims.length === 0 ? (
                                <div className="flex flex-col items-center gap-3 py-16 text-center">
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.3)' }}>
                                        <FileText size={20} color="#8FF7FF" />
                                    </span>
                                    <div style={{ ...headings, fontWeight: 500 }}>No claims yet</div>
                                    <div className="text-sm" style={{ color: '#94A3B8' }}>Submit your first claim to see it here.</div>
                                </div>
                            ) : (
                                claims.map((claim) => {
                                    const s = statusStyles[claim.status] || statusStyles.Pending;
                                    return (
                                        <motion.div
                                            key={claim._id}
                                            layout
                                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                            whileHover={{ backgroundColor: 'rgba(0,242,254,0.03)' }}
                                            className="grid grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_1fr_0.9fr_1fr] gap-3 lg:gap-4 px-5 py-4 border-b items-center"
                                            style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
                                            <div className="min-w-0">
                                                <div className="lg:hidden text-[10px] mb-1" style={colLabel}>Claim ID</div>
                                                <div className="truncate" style={{ ...mono, color: '#F8FAFC' }}>{claim.claimId}</div>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="lg:hidden text-[10px] mb-1" style={colLabel}>Patient</div>
                                                <div className="truncate" style={{ ...mono, color: '#CBD5E1' }}>{claim.patientId}</div>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="lg:hidden text-[10px] mb-1" style={colLabel}>Date of service</div>
                                                <div style={{ color: '#CBD5E1' }}>{claim.dateOfService ? new Date(claim.dateOfService).toLocaleDateString() : 'N/A'}</div>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="lg:hidden text-[10px] mb-1" style={colLabel}>Billed</div>
                                                <div style={{ ...mono, color: '#F8FAFC' }}>${claim.totalBilledAmount.toLocaleString()}</div>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="lg:hidden text-[10px] mb-1" style={colLabel}>Status</div>
                                                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px]"
                                                    style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, ...mono }}>
                                                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                                                    {claim.status}
                                                </span>
                                            </div>
                                            <div className="col-span-2 lg:col-span-1 flex lg:justify-end items-center gap-2">
                                                {claim.status === 'Pending' ? (
                                                    <>
                                                        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }} onClick={() => navigate(`/edit-claim/${claim._id}`)}
                                                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
                                                            style={{ background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.35)', color: '#8FF7FF' }}>
                                                            <Pencil size={12} /> Edit
                                                        </motion.button>
                                                        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }} onClick={() => handleDelete(claim._id)}
                                                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
                                                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)', color: '#FCA5A5' }}>
                                                            <Trash2 size={12} /> Delete
                                                        </motion.button>
                                                    </>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: '#64748B', ...mono }}>
                                                        <Lock size={12} /> Locked
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <div className="mt-6 grid grid-cols-[auto_1fr_auto] items-center gap-3">
                    <motion.button whileHover={currentPage === 1 ? {} : { y: -1 }} whileTap={currentPage === 1 ? {} : { scale: 0.97 }}
                        disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
                        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: 'rgba(11,15,25,0.6)', border: '1px solid rgba(148,163,184,0.18)', color: '#CBD5E1' }}>
                        <ChevronLeft size={14} /> Previous
                    </motion.button>
                    <div className="text-center text-xs" style={{ color: '#94A3B8', ...mono, letterSpacing: '0.18em' }}>
                        PAGE <span style={{ color: '#F8FAFC' }}>{currentPage}</span> / {totalPages || 1}
                    </div>
                    <motion.button whileHover={(currentPage === totalPages || totalPages === 0) ? {} : { y: -1 }} whileTap={(currentPage === totalPages || totalPages === 0) ? {} : { scale: 0.97 }}
                        disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}
                        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: 'rgba(11,15,25,0.6)', border: '1px solid rgba(148,163,184,0.18)', color: '#CBD5E1' }}>
                        Next <ChevronRight size={14} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default MyClaims;
