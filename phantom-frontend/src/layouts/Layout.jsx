import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Layout() {
    const headings = { fontFamily: '"Clash Display", ui-sans-serif, system-ui, sans-serif' };
    const body = { fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' };
    const mono = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' };
    return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <Sidebar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
}