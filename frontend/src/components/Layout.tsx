import { Outlet, NavLink } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Layout() {
  const { user } = useAuthStore();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Beranda' },
    { path: '/attendance', icon: '🕐', label: 'Absen' },
    { path: '/history', icon: '📜', label: 'Riwayat' },
    { path: '/profile', icon: '👤', label: 'Profil' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">📋 AbsensiKu</h1>
          <NavLink to="/profile" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-semibold text-sm">
              {user ? getInitials(user.name) : 'U'}
            </div>
          </NavLink>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 max-w-lg mx-auto animate-fade-in">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-500 hover:bg-slate-50'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
