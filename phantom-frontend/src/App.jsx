import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import NotFound from './pages/NotFound';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubmitClaim from './pages/SubmitClaim';
import ClaimDetail from './pages/ClaimDetail';
import MyClaims from './pages/MyClaims';
import EditClaim from './pages/EditClaim';
import Layout from './layouts/Layout';
import Insights from './pages/Insights';
import AuditLogs from './pages/AuditLogs';

const EASE = [0.16, 1, 0.3, 1];

const BootScreen = ({ label = 'Loading Workspace' }) => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B0F19] px-6">
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.35]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 20% 30%, rgba(0,242,254,0.10), transparent 40%), radial-gradient(circle at 80% 70%, rgba(0,242,254,0.06), transparent 45%)',
      }}
    />
    <div className="relative flex flex-col items-center gap-6">
      <motion.svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="28"
          cy="10"
          r="2.5"
          fill="#00F2FE"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 0.4, ease: EASE }}
        />
        <motion.circle
          cx="10"
          cy="42"
          r="2.5"
          fill="#00F2FE"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
        />
        <motion.circle
          cx="46"
          cy="42"
          r="2.5"
          fill="#00F2FE"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
        />
        <motion.path
          d="M28 10 L10 42 L46 42 Z"
          stroke="rgba(0,242,254,0.7)"
          strokeWidth="1.25"
          fill="none"
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
          transition={{ duration: 1.2, ease: EASE, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.circle
          cx="28"
          cy="31"
          r="3"
          fill="#00F2FE"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
        />
      </motion.svg>
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#94A3B8]">
          Triangulating
        </span>
        <span className="font-medium tracking-tight text-[#F8FAFC]" style={{ fontFamily: 'Clash Display, sans-serif' }}>
          {label}
        </span>
      </div>
    </div>
  </div>
);

const DeniedScreen = ({ role }) => (
  <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-24">
    <div
      className="pointer-events-none absolute inset-0 opacity-40"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 0%, rgba(0,242,254,0.08), transparent 55%)',
      }}
    />
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative w-full max-w-md rounded-2xl border border-[rgba(148,163,184,0.14)] bg-[#1E293B] p-8 text-center shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]"
    >
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(0,242,254,0.35)] bg-[rgba(0,242,254,0.08)]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00F2FE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M5.5 5.5l13 13" />
        </svg>
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#94A3B8]">
        Restricted Node
      </div>
      <h2
        className="mt-3 text-2xl font-semibold tracking-tight text-[#F8FAFC]"
        style={{ fontFamily: 'Clash Display, sans-serif' }}
      >
        Access denied
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">
        Your account role
        <span className="mx-1.5 inline-flex items-center rounded-md border border-[rgba(148,163,184,0.2)] bg-[#26364C] px-2 py-0.5 font-mono text-[11px] text-[#F8FAFC]">
          {role}
        </span>
        does not have permission to view this workspace.
      </p>
    </motion.div>
  </div>
);

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <BootScreen />;

  if (!user)
    return <Navigate to="/login" replace />;

  if (!user.role || !allowedRoles.map(r => r.toLowerCase()).includes(user.role.toLowerCase())) {
    return <DeniedScreen role={user.role} />;
  }

  return children;
};

const HomeRouter = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <BootScreen />;
  if (!user) return <Navigate to="/login" replace />;

  if (user.role.toLowerCase() === 'hospital') {
    return <Navigate to="/submit" replace />;
  }

  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: '#1E293B',
              color: '#F8FAFC',
              border: '1px solid rgba(148,163,184,0.14)',
              borderRadius: '12px',
              fontFamily: 'General Sans, sans-serif',
              fontSize: '14px',
              padding: '12px 16px',
              boxShadow: '0 20px 60px -30px rgba(0,0,0,0.6)',
            },
            success: { iconTheme: { primary: '#00F2FE', secondary: '#0B0F19' } },
            error: { iconTheme: { primary: '#F87171', secondary: '#0B0F19' } },
          }}
        />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route
              path="/compliance"
              element={
                <RoleRoute allowedRoles={['superadmin']}>
                  <AuditLogs />
                </RoleRoute>
              }
            />

            <Route path="/" element={<HomeRouter />} />
            <Route
              path="/claims/:id"
              element={
                <RoleRoute allowedRoles={['adjudicator', 'superadmin']}>
                  <ClaimDetail />
                </RoleRoute>
              }
            />
            <Route
              path="/insights"
              element={
                <RoleRoute allowedRoles={['adjudicator', 'superadmin']}>
                  <Insights />
                </RoleRoute>
              }
            />

            <Route
              path="/submit"
              element={
                <RoleRoute allowedRoles={['hospital']}>
                  <SubmitClaim />
                </RoleRoute>
              }
            />
            <Route
              path="/my-claims"
              element={
                <RoleRoute allowedRoles={['hospital']}>
                  <MyClaims />
                </RoleRoute>
              }
            />
            <Route
              path="/edit-claim/:id"
              element={
                <RoleRoute allowedRoles={['hospital']}>
                  <EditClaim />
                </RoleRoute>
              }
            />
          </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
