import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../services/api';
import { useToast } from '../hooks/useToast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { addToast } = useToast();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authApi.login({ email, password });
        if (response.success) {
          setAuth(response.data.user, response.data.token);
          addToast('Login berhasil!', 'success');
          navigate('/');
        }
      } else {
        const response = await authApi.register({ email, password, name, department });
        if (response.success) {
          setAuth(response.data.user, response.data.token);
          addToast('Registrasi berhasil!', 'success');
          navigate('/');
        }
      }
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Terjadi kesalahan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const response = await authApi.login({ email: 'demo@example.com', password: 'demo123' });
      if (response.success) {
        setAuth(response.data.user, response.data.token);
        addToast('Login demo berhasil!', 'success');
        navigate('/');
      }
    } catch (error: any) {
      // Register demo user if not exists
      try {
        await authApi.register({
          email: 'demo@example.com',
          password: 'demo123',
          name: 'Demo User',
          department: 'Teknologi Informasi',
        });
        const response = await authApi.login({ email: 'demo@example.com', password: 'demo123' });
        if (response.success) {
          setAuth(response.data.user, response.data.token);
          addToast('Login demo berhasil!', 'success');
          navigate('/');
        }
      } catch (err: any) {
        addToast(err.response?.data?.message || 'Terjadi kesalahan', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">
          📋
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
          AbsensiKu
        </h2>
        <p className="text-center text-slate-500 mb-8">
          {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Masukkan nama lengkap"
                  required={!isLogin}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Departemen
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Contoh: IT, Marketing, HRD"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="nama@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Minimal 6 karakter"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {isLogin ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">atau</span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full mt-4 h-12 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition disabled:opacity-50"
          >
            🚀 Masuk sebagai Demo
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isLogin ? 'Daftar sekarang' : 'Masuk'}
          </button>
        </p>
      </div>
    </div>
  );
}
