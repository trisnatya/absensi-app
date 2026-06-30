import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useAuthStore } from '../stores/authStore';
import { attendanceApi } from '../services/api';
import type { Attendance, Stats } from '../types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [todayRes, statsRes] = await Promise.all([
        attendanceApi.getToday(),
        attendanceApi.getStats(),
      ]);
      setTodayAttendance(todayRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const getStatusInfo = () => {
    if (!todayAttendance?.check_in_time) {
      return {
        icon: '⏳',
        title: 'Belum Absen',
        subtitle: 'Silakan lakukan check-in',
        bgClass: 'bg-amber-50',
        iconClass: 'bg-amber-100',
        btnClass: 'bg-emerald-500 hover:bg-emerald-600',
        btnText: '🕐 Mulai Absensi',
      };
    }
    if (todayAttendance.check_out_time) {
      return {
        icon: '🏁',
        title: 'Selesai',
        subtitle: `Pulang ${todayAttendance.check_out_time}`,
        bgClass: 'bg-slate-50',
        iconClass: 'bg-slate-100',
        btnClass: 'bg-slate-200 text-slate-500 cursor-not-allowed',
        btnText: '✓ Sudah Absen',
      };
    }
    return {
      icon: '✅',
      title: 'Sudah Check In',
      subtitle: `Masuk ${todayAttendance.check_in_time}`,
      bgClass: 'bg-emerald-50',
      iconClass: 'bg-emerald-100',
      btnClass: 'bg-red-500 hover:bg-red-600',
      btnText: '🚪 Check Out',
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="animate-fade-in">
        <p className="text-slate-500 text-sm">{getGreeting()}</p>
        <h2 className="text-2xl font-bold text-slate-800">{user?.name}</h2>
        <p className="text-slate-500 text-sm">{user?.department || 'Karyawan'}</p>
      </div>

      {/* Today's Status Card */}
      <div className={`${statusInfo.bgClass} rounded-2xl p-6 text-center animate-fade-in`}>
        <div className={`w-16 h-16 ${statusInfo.iconClass} rounded-full flex items-center justify-center text-3xl mx-auto mb-4`}>
          {statusInfo.icon}
        </div>
        <h3 className="text-lg font-semibold text-slate-800">{statusInfo.title}</h3>
        <p className="text-sm text-slate-500 mt-1">{statusInfo.subtitle}</p>
        
        <Link
          to="/attendance"
          className={`mt-6 inline-block px-8 py-3 ${statusInfo.btnClass} text-white font-semibold rounded-xl transition-colors`}
        >
          {statusInfo.btnText}
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{stats?.presentDays || 0}</div>
          <div className="text-xs text-slate-500 mt-1">Hadir</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-amber-600">{stats?.totalTerlambat || 0}</div>
          <div className="text-xs text-slate-500 mt-1">Terlambat</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-red-600">{stats?.totalPulangAwal || 0}</div>
          <div className="text-xs text-slate-500 mt-1">Pulang Awal</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-5 shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
        <h3 className="font-semibold text-slate-800 mb-4">📋 Aktivitas Terakhir</h3>
        
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : stats?.weekStats && stats.weekStats.length > 0 ? (
          <div className="space-y-3">
            {stats.weekStats.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                    item.status === 'tepat_waktu' ? 'bg-emerald-100 text-emerald-600' :
                    item.status === 'terlambat' ? 'bg-amber-100 text-amber-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {item.status === 'tepat_waktu' ? '✓' : item.status === 'terlambat' ? '⚠' : '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {format(new Date(item.date), 'EEEE, d MMMM', { locale: id })}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">{item.status.replace('_', ' ')}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {format(new Date(item.date), 'd/MM')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-sm">Belum ada aktivitas</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <Link
          to="/attendance"
          className="bg-blue-50 rounded-xl p-4 flex items-center gap-3 hover:bg-blue-100 transition-colors"
        >
          <span className="text-2xl">📷</span>
          <div>
            <p className="font-medium text-slate-800 text-sm">Absensi</p>
            <p className="text-xs text-slate-500">Check in/out</p>
          </div>
        </Link>
        <Link
          to="/history"
          className="bg-purple-50 rounded-xl p-4 flex items-center gap-3 hover:bg-purple-100 transition-colors"
        >
          <span className="text-2xl">📊</span>
          <div>
            <p className="font-medium text-slate-800 text-sm">Riwayat</p>
            <p className="text-xs text-slate-500">Lihat history</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
