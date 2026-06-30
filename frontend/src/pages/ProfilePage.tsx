import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../services/api';
import { useToast } from '../hooks/useToast';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuthStore();
  const { addToast } = useToast();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      addToast('Anda telah keluar', 'info');
      navigate('/login');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl text-white font-bold">
          {user ? getInitials(user.name) : 'U'}
        </div>
        <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
        <p className="text-slate-500">{user?.department || 'Karyawan'}</p>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">📋 Informasi Akun</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                👤
              </div>
              <div>
                <p className="text-xs text-slate-500">ID Karyawan</p>
                <p className="font-mono font-medium text-slate-800">{user?.employee_id || '-'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                📧
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="font-medium text-slate-800">{user?.email || '-'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                🏢
              </div>
              <div>
                <p className="text-xs text-slate-500">Departemen</p>
                <p className="font-medium text-slate-800">{user?.department || '-'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                🎭
              </div>
              <div>
                <p className="text-xs text-slate-500">Role</p>
                <p className="font-medium text-slate-800 capitalize">{user?.role || 'employee'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Work Settings */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">⚙️ Pengaturan Kerja</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                📍
              </div>
              <div>
                <p className="text-xs text-slate-500">Lokasi Kantor</p>
                <p className="font-medium text-slate-800">
                  {user?.office_latitude?.toFixed(4)}, {user?.office_longitude?.toFixed(4)}
                </p>
              </div>
            </div>
            <span className="text-slate-400">→</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                🕐
              </div>
              <div>
                <p className="text-xs text-slate-500">Jam Masuk</p>
                <p className="font-mono font-medium text-slate-800">{user?.work_start || '08:00'}</p>
              </div>
            </div>
            <span className="text-slate-400">→</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                🏁
              </div>
              <div>
                <p className="text-xs text-slate-500">Jam Pulang</p>
                <p className="font-mono font-medium text-slate-800">{user?.work_end || '17:00'}</p>
              </div>
            </div>
            <span className="text-slate-400">→</span>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">ℹ️ Tentang Aplikasi</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Versi</span>
            <span className="text-sm text-slate-800">1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Build</span>
            <span className="text-sm text-slate-800">2024.01</span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full py-4 bg-red-50 text-red-600 font-semibold rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
      >
        🚪 Keluar
      </button>
    </div>
  );
}
