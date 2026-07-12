import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { ShieldCheck, Flag, TrendingUp, Building2, Loader2 } from 'lucide-react';
import api from '../utils/api';

const headings = { fontFamily: '"Clash Display", ui-sans-serif, system-ui, sans-serif' };
const body = { fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' };
const mono = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' };

const chartTooltipStyle = {
    contentStyle: { background: 'rgba(11,15,25,0.95)', border: '1px solid rgba(0,242,254,0.35)', borderRadius: 10, color: '#F8FAFC', fontFamily: '"JetBrains Mono", monospace', fontSize: 12 },
    labelStyle: { color: '#8FF7FF', fontFamily: '"JetBrains Mono", monospace' },
    itemStyle: { color: '#F8FAFC' },
};

const Insights = () => {
    const [data, setData] = useState({ kpi: { totalIntercepted: 0, totalFlaggedClaims: 0 }, trend: [], topHospitals: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/api/analytics');
                setData(response.data);
            } catch (error) {} finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const labelKicker = { fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#00F2FE', ...mono };
    const colLabel = { fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#64748B', ...mono };

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#0B0F19', color: '#F8FAFC', ...body }}>
                <div className="flex items-center gap-3 text-sm" style={{ color: '#8FF7FF', ...mono, letterSpacing: '0.18em' }}>
                    <Loader2 size={16} className="animate-spin" /> COMPILING RECORDS…
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full" style={{ background: 'radial-gradient(1200px 600px at 90% -10%, rgba(0,242,254,0.06), transparent 60%), #0B0F19', color: '#F8FAFC', ...body }}>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                      <div className="flex items-center gap-2" style={labelKicker}>
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00F2FE] shadow-[0_0_10px_#00F2FE]" />
                          Executive Dashboard
                      </div>
                      <h1 className="mt-2 pb-1 text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-[-0.02em]" style={{ ...headings, fontWeight: 600 }}>
                          Claims Intelligence Network
                      </h1>
                      <p className="mt-2 text-sm sm:text-base max-w-2xl" style={{ color: '#94A3B8' }}>
                          Live aggregation of triangulated fraud vectors across all submitted claims.
                      </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                    className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="rounded-2xl p-6 relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, rgba(0,242,254,0.10), rgba(15,23,42,0.6))', border: '1px solid rgba(0,242,254,0.25)', backdropFilter: 'blur(8px)' }}>
                        <div className="flex items-center justify-between">
                            <div style={colLabel}>Capital Protected</div>
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'rgba(0,242,254,0.10)', border: '1px solid rgba(0,242,254,0.3)' }}>
                                <ShieldCheck size={16} color="#8FF7FF" />
                            </span>
                        </div>
                        <div className="mt-4 text-3xl sm:text-4xl lg:text-5xl tracking-[-0.02em]" style={{ ...headings, fontWeight: 600, color: '#F8FAFC' }}>
                            ${data.kpi.totalIntercepted.toLocaleString()}
                        </div>
                        <div className="mt-1 text-xs" style={{ color: '#8FF7FF', ...mono }}>Intercepted before payout</div>
                    </div>

                    <div className="rounded-2xl p-6"
                        style={{ background: 'linear-gradient(180deg, rgba(30,41,59,0.55), rgba(15,23,42,0.55))', border: '1px solid rgba(148,163,184,0.12)', backdropFilter: 'blur(8px)' }}>
                        <div className="flex items-center justify-between">
                            <div style={colLabel}>Total Flagged Claims</div>
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'rgba(251,191,36,0.10)', border: '1px solid rgba(251,191,36,0.3)' }}>
                                <Flag size={16} color="#FBBF24" />
                            </span>
                        </div>
                        <div className="mt-4 text-3xl sm:text-4xl lg:text-5xl tracking-[-0.02em]" style={{ ...headings, fontWeight: 600 }}>
                            {data.kpi.totalFlaggedClaims.toLocaleString()}
                        </div>
                        <div className="mt-1 text-xs" style={{ color: '#94A3B8', ...mono }}>Across the observed period</div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    className="mt-6 rounded-2xl p-5 sm:p-7"
                    style={{ background: 'linear-gradient(180deg, rgba(30,41,59,0.55), rgba(15,23,42,0.55))', border: '1px solid rgba(148,163,184,0.12)', backdropFilter: 'blur(8px)' }}>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                        <div className="min-w-0">
                            <div style={colLabel}>Signal</div>
                            <h3 className="mt-1 truncate text-lg sm:text-xl" style={{ ...headings, fontWeight: 500 }}>30-day fraud detection trend</h3>
                        </div>
                        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px]"
                            style={{ background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.3)', color: '#8FF7FF', ...mono }}>
                            <TrendingUp size={12} /> LIVE
                        </span>
                    </div>
                    <div className="mt-5 h-[280px] sm:h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="lineCyan" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#00F2FE" />
                                        <stop offset="100%" stopColor="#8FF7FF" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
                                <XAxis dataKey="_id" stroke="#64748B" tick={{ fill: '#94A3B8', fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }} />
                                <YAxis stroke="#64748B" tick={{ fill: '#94A3B8', fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }} />
                                <Tooltip {...chartTooltipStyle} />
                                <Legend wrapperStyle={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#94A3B8' }} />
                                <Line type="monotone" dataKey="totalClaims" stroke="#64748B" strokeWidth={1.5} dot={false} name="Total Volume" />
                                <Line type="monotone" dataKey="flaggedClaims" stroke="url(#lineCyan)" strokeWidth={2.5} dot={{ r: 3, fill: '#00F2FE' }} name="Fraud Caught" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                    className="mt-6 rounded-2xl p-5 sm:p-7"
                    style={{ background: 'linear-gradient(180deg, rgba(30,41,59,0.55), rgba(15,23,42,0.55))', border: '1px solid rgba(148,163,184,0.12)', backdropFilter: 'blur(8px)' }}>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                        <div className="min-w-0">
                            <div style={colLabel}>Providers</div>
                            <h3 className="mt-1 truncate text-lg sm:text-xl" style={{ ...headings, fontWeight: 500 }}>Top 5 high-risk providers (NPI)</h3>
                        </div>
                        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px]"
                            style={{ background: 'rgba(251,191,36,0.10)', border: '1px solid rgba(251,191,36,0.3)', color: '#FBBF24', ...mono }}>
                            <Building2 size={12} /> RISK
                        </span>
                    </div>
                    <div className="mt-5 h-[280px] sm:h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.topHospitals} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="barCyan" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#00F2FE" />
                                        <stop offset="100%" stopColor="rgba(0,242,254,0.25)" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
                                <XAxis dataKey="_id" stroke="#64748B" tick={{ fill: '#94A3B8', fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }} />
                                <YAxis stroke="#64748B" tick={{ fill: '#94A3B8', fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }} />
                                <Tooltip {...chartTooltipStyle} cursor={{ fill: 'rgba(0,242,254,0.05)' }} />
                                <Legend wrapperStyle={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#94A3B8' }} />
                                <Bar dataKey="flagCount" fill="url(#barCyan)" name="Number of Flags" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Insights;
