import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  LineChart,
  ShieldCheck,
  FilePlus,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { TriangulateMark } from './TriangulateMark';

const navItemVariants = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  hover: { x: 4 }
};

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const role = user?.role?.toLowerCase();

  const navLinkBase = "group flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-transparent";
  const navLinkActive = "bg-[#26364C] text-[#F0F9FF] border-[#00F2FE]/30";
  const navLinkInactive = "text-[#94A3B8] hover:bg-[#26364C]/60 hover:text-[#F0F9FF]";

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-[#1E293B] border border-[#00F2FE]/20 text-[#F0F9FF] hover:bg-[#26364C] transition-colors"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      
      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-screen lg:h-auto lg:min-h-screen w-[280px] bg-[#0B0F19] border-r border-[#1E293B] flex flex-col p-6 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="group flex items-center gap-3 mb-8 p-2 -ml-2 rounded-xl transition-colors hover:bg-[#1E293B]/50"
        >
          <TriangulateMark size={36} animate={true} />
          <span className="font-semibold text-lg tracking-tight text-[#F0F9FF]" style={{ fontFamily: '"Clash Display", ui-sans-serif, system-ui, sans-serif' }}>
            Triangulate API
          </span>
        </Link>

        {user && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-[#1E293B] border border-[#00F2FE]/10"
          >
            <p className="font-semibold text-[#F0F9FF] text-sm" style={{ fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' }}>
              {user.name}
            </p>
            <p className="mt-1 text-xs text-[#94A3B8] uppercase tracking-wider" style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
              Portal: {user.role}
            </p>
          </motion.div>
        )}

        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
          {(role === 'adjudicator' || role === 'superadmin') && (
            <>
              <motion.div variants={navItemVariants} initial="initial" animate="animate" whileHover="hover">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className={`${navLinkBase} ${isActive('/') ? navLinkActive : navLinkInactive}`}
                >
                  <LayoutDashboard size={18} className="text-[#00F2FE]" />
                  <span className="text-sm" style={{ fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' }}>Triage Dashboard</span>
                  <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#00F2FE]" />
                </Link>
              </motion.div>

              <motion.div variants={navItemVariants} initial="initial" animate="animate" whileHover="hover">
                <Link
                  to="/insights"
                  onClick={() => setMobileOpen(false)}
                  className={`${navLinkBase} ${isActive('/insights') ? navLinkActive : navLinkInactive}`}
                >
                  <LineChart size={18} className="text-[#00F2FE]" />
                  <span className="text-sm" style={{ fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' }}>Executive Insights</span>
                  <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#00F2FE]" />
                </Link>
              </motion.div>

              {role === 'superadmin' && (
                <motion.div variants={navItemVariants} initial="initial" animate="animate" whileHover="hover">
                  <Link
                    to="/compliance"
                    onClick={() => setMobileOpen(false)}
                    className={`${navLinkBase} ${isActive('/compliance') ? 'bg-[#451A03]/30 text-[#FCD34D] border-[#B45309]/40' : 'text-[#FCD34D] hover:bg-[#451A03]/20 border-transparent'}`}
                  >
                    <ShieldCheck size={18} className="text-[#FCD34D]" />
                    <span className="text-sm" style={{ fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' }}>Audit Ledger</span>
                    <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#FCD34D]" />
                  </Link>
                </motion.div>
              )}
            </>
          )}

          {role === 'hospital' && (
            <>
              <motion.div variants={navItemVariants} initial="initial" animate="animate" whileHover="hover">
                <Link
                  to="/submit"
                  onClick={() => setMobileOpen(false)}
                  className={`${navLinkBase} ${isActive('/submit') ? 'bg-[#064E3B]/40 text-[#34D399] border-[#10B981]/30' : 'text-[#34D399] hover:bg-[#064E3B]/20 border-transparent'}`}
                >
                  <FilePlus size={18} className="text-[#10B981]" />
                  <span className="text-sm" style={{ fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' }}>Submit New Claim</span>
                  <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#10B981]" />
                </Link>
              </motion.div>

              <motion.div variants={navItemVariants} initial="initial" animate="animate" whileHover="hover">
                <Link
                  to="/my-claims"
                  onClick={() => setMobileOpen(false)}
                  className={`${navLinkBase} ${isActive('/my-claims') ? navLinkActive : navLinkInactive}`}
                >
                  <ClipboardList size={18} className="text-[#00F2FE]" />
                  <span className="text-sm" style={{ fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' }}>My Claims</span>
                  <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#00F2FE]" />
                </Link>
              </motion.div>
            </>
          )}
        </nav>

        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 4 }}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-[#F87171] hover:bg-[#7F1D1D]/20 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm" style={{ fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' }}>Logout</span>
        </motion.button>
      
      </aside>
    </>
  );
}
