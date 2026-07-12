import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, XCircle, Loader2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../utils/api';

const headings = { fontFamily: '"Clash Display", ui-sans-serif, system-ui, sans-serif' };
const body = { fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' };
const mono = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' };

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
    const currentLogs = logs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/api/audit');
                setLogs(response.data);
            } catch (err) {
                setError('Failed to load compliance data. Ensure you have SuperAdmin privileges.');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const labelKicker = { fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#00F2FE', ...mono };
    const colLabel = { fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#64748B', ...mono };

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#0B0F19', color: '#F8FAFC', ...body }}>
                <div className="flex items-center gap-3 text-sm" style={{ color: '#8FF7FF', ...mono, letterSpacing: '0.18em' }}>
                    <Loader2 size={16} className="animate-spin" /> LOADING COMPLIANCE LEDGER…
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center px-4" style={{ background: '#0B0F19', color: '#F8FAFC', ...body }}>
                <div className="max-w-md w-full rounded-2xl p-6 text-center"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)' }}>
                    <ShieldAlert size={28} color="#F87171" className="mx-auto" />
                    <div className="mt-3" style={{ ...headings, fontWeight: 500, color: '#FCA5A5' }}>Access denied</div>
                    <p className="mt-1 text-sm" style={{ color: '#94A3B8' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full" style={{ background: 'radial-gradient(1000px 500px at 15% -10%, rgba(0,242,254,0.06), transparent 60%), #0B0F19', color: '#F8FAFC', ...body }}>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                    <div className="flex items-center gap-2" style={labelKicker}>
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00F2FE] shadow-[0_0_10px_#00F2FE]" />
                        Compliance Layer
                    </div>
                    <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.02em]" style={{ ...headings, fontWeight: 600 }}>
                        Audit ledger
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm sm:text-base" style={{ color: '#94A3B8' }}>
                        Immutable record of every adjudicator action across the network.
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                    className="mt-8 rounded-2xl overflow-hidden"
                    style={{ background: 'linear-gradient(180deg, rgba(30,41,59,0.55), rgba(15,23,42,0.55))', border: '1px solid rgba(148,163,184,0.12)', backdropFilter: 'blur(8px)' }}>

                    <div className="hidden lg:grid grid-cols-[1.2fr_1fr_1.4fr_1.2fr] gap-4 px-5 py-3 border-b" style={{ borderColor: 'rgba(148,163,184,0.12)' }}>
                        <div style={colLabel}>Timestamp</div>
                        <div style={colLabel}>Claim ID</div>
                        <div style={colLabel}>Adjudicator</div>
                        <div style={colLabel}>Action</div>
                    </div>

                    <div className="flex flex-col">
                        <AnimatePresence mode="popLayout">
                            {logs.length === 0 ? (
                                <div className="py-16 text-center text-sm" style={{ color: '#94A3B8' }}>
                                    No audit logs recorded yet.
                                </div>
                            ) : (
                                currentLogs.map((log) => {
                                    const isApproved = log.newStatus === 'Approved';
                                    const color = isApproved ? '#34D399' : '#F87171';
                                    const bg = isApproved ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.10)';
                                    const border = isApproved ? 'rgba(52,211,153,0.35)' : 'rgba(248,113,113,0.35)';
                                    const Icon = isApproved ? CheckCircle2 : XCircle;
                                    return (
                                        <motion.div
                                            key={log._id}
                                            layout
                                            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                            exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)', transition: { duration: 0.15 } }}
                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                            whileHover={{ backgroundColor: 'rgba(0,242,254,0.03)' }}
                                            className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1.4fr_1.2fr] gap-3 lg:gap-4 px-5 py-4 border-b items-center"
                                            style={{ borderColor: 'rgba(148,163,184,0.08)' }}>

                                            <div className="min-w-0">
                                                <div className="lg:hidden text-[10px] mb-1" style={colLabel}>Timestamp</div>
                                                <div className="truncate text-sm" style={{ ...mono, color: '#CBD5E1' }}>
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </div>
                                            </div>

                                            <div className="min-w-0">
                                                <div className="lg:hidden text-[10px] mb-1" style={colLabel}>Claim ID</div>
                                                <div className="truncate" style={{ ...mono, color: '#F8FAFC' }}>
                                                    {log.claimId?.claimId || 'Unknown Claim'}
                                                </div>
                                            </div>

                                            <div className="min-w-0">
                                                <div className="lg:hidden text-[10px] mb-1" style={colLabel}>Adjudicator</div>
                                                <div className="truncate" style={{ ...headings, fontWeight: 500, color: '#F8FAFC' }}>
                                                    {log.adjudicatorId?.name || 'Unknown User'}
                                                </div>
                                                <div className="truncate text-xs" style={{ color: '#64748B', ...mono }}>
                                                    {log.adjudicatorId?.email || 'N/A'}
                                                </div>
                                            </div>

                                            <div className="min-w-0">
                                                <div className="lg:hidden text-[10px] mb-1" style={colLabel}>Action</div>
                                                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px]"
                                                    style={{ background: bg, border: `1px solid ${border}`, color, ...mono }}>
                                                    <Icon size={12} />
                                                    <span style={{ color: '#94A3B8' }}>{log.previousStatus}</span>
                                                    <ArrowRight size={10} style={{ color: '#64748B' }} />
                                                    <span>{log.newStatus}</span>
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
                
                {logs.length > 0 && (
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
                )}
            </div>
        </div>
    );
};

export default AuditLogs;
