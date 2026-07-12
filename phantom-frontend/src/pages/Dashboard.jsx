import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronLeft, ChevronRight, ShieldCheck, AlertTriangle, Inbox } from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = sessionStorage.getItem('dashboard_page');
        return savedPage ? parseInt(savedPage) : 1;
    });
    const [totalPages, setTotalPages] = useState(1);
    const [showOnlyFlagged, setShowOnlyFlagged] = useState(() => {
        const savedFlagged = sessionStorage.getItem('dashboard_flagged');
        return savedFlagged === 'true';
    });

    useEffect(() => {
        sessionStorage.setItem('dashboard_page', currentPage);
        sessionStorage.setItem('dashboard_flagged', showOnlyFlagged);
    }, [currentPage, showOnlyFlagged]);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchClaims = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/claims', {
                params: { page: currentPage, limit: 10, flagged: showOnlyFlagged }
            });
            setClaims(response.data.docs);
            setTotalPages(response.data.totalPages);
        } catch (error) {} finally {
            setLoading(false);
        }
    }, [currentPage, showOnlyFlagged]);

    useEffect(() => { fetchClaims(); }, [fetchClaims, refreshTrigger]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const socket = io(socketUrl, { auth: { token } });
        socket.on('fraudAlert', (alertData) => {
            toast.error(
                `🚨 HIGH RISK DETECTED!\nClaim: ${alertData.claimId}\nAmount: $${alertData.amount.toLocaleString()}\nScore: ${alertData.riskScore}%`,
                { duration: 8000, position: 'top-right', style: { border: '2px solid #ef4444', padding: '16px', fontWeight: 'bold' } }
            );
            setRefreshTrigger(prev => prev + 1);
        });
        return () => { socket.disconnect(); };
    }, []);

    const headings = { fontFamily: '"Clash Display", ui-sans-serif, system-ui, sans-serif' };
    const body = { fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' };
    const mono = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' };

    return (
        <div className="min-h-screen w-full" style={{ background: 'radial-gradient(1200px 600px at 20% -10%, rgba(0,242,254,0.06), transparent 60%), #0B0F19', color: '#F8FAFC', ...body }}>
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between"
                >
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em]" style={{ color: '#00F2FE', ...mono }}>
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00F2FE] shadow-[0_0_10px_#00F2FE]" />
                            Adjudicator Workspace
                        </div>
                        <h1 className="mt-2 pb-1 text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-[-0.02em]" style={{ ...headings, fontWeight: 600 }}>
                            Live Triage Stream
                        </h1>
                        <p className="mt-2 text-sm sm:text-base" style={{ color: '#94A3B8' }}>
                            Real-time triangulation across providers, patients, and procedure codes.
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowOnlyFlagged(!showOnlyFlagged); setCurrentPage(1); }}
                        className="shrink-0 inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2.5 text-sm transition-colors"
                        style={{
                            border: showOnlyFlagged ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(0,242,254,0.35)',
                            background: showOnlyFlagged ? 'rgba(239,68,68,0.08)' : 'rgba(0,242,254,0.06)',
                            color: showOnlyFlagged ? '#FCA5A5' : '#8FF7FF',
                            fontWeight: 500,
                        }}
                    >
                        <Filter size={15} />
                        {showOnlyFlagged ? 'Flagged only · clear' : 'Filter · flagged claims'}
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                    className="mt-8 overflow-hidden rounded-2xl"
                    style={{ background: 'linear-gradient(180deg, rgba(30,41,59,0.55), rgba(15,23,42,0.55))', border: '1px solid rgba(148,163,184,0.12)', backdropFilter: 'blur(8px)' }}
                >
                    <div className="hidden md:grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 text-[11px] uppercase tracking-[0.22em]" style={{ color: '#64748B', borderBottom: '1px solid rgba(148,163,184,0.1)', ...mono }}>
                        <div>Claim ID</div><div>Provider NPI</div><div>Billed Amount</div><div>Risk Score</div><div>Status</div>
                    </div>

                    <div>
                        <AnimatePresence mode="popLayout">
                            {loading && claims.length === 0 ? (
                                [...Array(5)].map((_, i) => (
                                    <div key={`sk-${i}`} className="grid grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4" style={{ borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
                                        {[80, 60, 70, 50, 90].map((w, j) => (
                                            <div key={j} className="h-4 rounded animate-pulse" style={{ width: `${w}%`, background: 'linear-gradient(90deg, rgba(148,163,184,0.08), rgba(148,163,184,0.16), rgba(148,163,184,0.08))' }} />
                                        ))}
                                    </div>
                                ))
                            ) : claims.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center"
                                    style={{ color: '#94A3B8' }}
                                >
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'rgba(0,242,254,0.06)', border: '1px solid rgba(0,242,254,0.2)' }}>
                                        <Inbox size={20} color="#8FF7FF" />
                                    </span>
                                    <div style={{ ...headings, fontWeight: 500, color: '#F8FAFC' }}>No signal yet</div>
                                    <div className="text-sm">No claims match your current filter.</div>
                                </motion.div>
                            ) : (
                                claims.map((claim, idx) => {
                                    const flagged = claim.riskScore > 0;
                                    return (
                                        <motion.div
                                            key={claim._id}
                                            layout
                                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: idx * 0.02 }}
                                            whileHover={{ backgroundColor: 'rgba(0,242,254,0.04)' }}
                                            onClick={() => navigate(`/claims/${claim._id}`)}
                                            className="group grid grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 cursor-pointer items-center"
                                            style={{ borderBottom: '1px solid rgba(148,163,184,0.06)' }}
                                        >
                                            <div className="md:hidden text-[10px] uppercase tracking-[0.2em]" style={{ color: '#64748B', ...mono }}>Claim</div>
                                            <div className="truncate" style={{ ...mono, color: '#F8FAFC' }}>{claim.claimId}</div>

                                            <div className="md:hidden text-[10px] uppercase tracking-[0.2em]" style={{ color: '#64748B', ...mono }}>Provider</div>
                                            <div className="truncate" style={{ ...mono, color: '#CBD5E1' }}>{claim.providerId}</div>

                                            <div className="md:hidden text-[10px] uppercase tracking-[0.2em]" style={{ color: '#64748B', ...mono }}>Billed</div>
                                            <div style={{ color: '#F8FAFC', fontWeight: 500 }}>${claim.totalBilledAmount.toLocaleString()}</div>

                                            <div className="md:hidden text-[10px] uppercase tracking-[0.2em]" style={{ color: '#64748B', ...mono }}>Risk</div>
                                            <div>
                                                <span
                                                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
                                                    style={{
                                                        background: flagged ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.08)',
                                                        border: flagged ? '1px solid rgba(239,68,68,0.35)' : '1px solid rgba(34,197,94,0.3)',
                                                        color: flagged ? '#FCA5A5' : '#86EFAC',
                                                        ...mono, fontWeight: 500,
                                                    }}
                                                >
                                                    {flagged ? <AlertTriangle size={12} /> : <ShieldCheck size={12} />}
                                                    {flagged ? `${claim.riskScore}% RISK` : 'CLEAN'}
                                                </span>
                                            </div>

                                            <div className="md:hidden text-[10px] uppercase tracking-[0.2em]" style={{ color: '#64748B', ...mono }}>Status</div>
                                            <div className="truncate text-sm" style={{ color: '#CBD5E1' }}>{claim.status}</div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <div className="mt-6 grid grid-cols-[auto_1fr_auto] items-center gap-4">
                    <motion.button
                        whileHover={{ x: -2 }} whileTap={{ scale: 0.97 }}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        style={{ border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(15,23,42,0.6)', color: '#CBD5E1' }}
                    >
                        <ChevronLeft size={15} /> Previous
                    </motion.button>

                    <div className="text-center text-xs uppercase tracking-[0.22em]" style={{ color: '#64748B', ...mono }}>
                        Page <span style={{ color: '#F8FAFC' }}>{currentPage}</span> / {totalPages}
                    </div>

                    <motion.button
                        whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        style={{ border: '1px solid rgba(0,242,254,0.35)', background: 'rgba(0,242,254,0.06)', color: '#8FF7FF' }}
                    >
                        Next <ChevronRight size={15} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
