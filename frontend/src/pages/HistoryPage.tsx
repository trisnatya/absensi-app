import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { attendanceApi } from '../services/api';
import type { Attendance } from '../types';

type FilterType = 'week' | 'month' | 'all';

export default function HistoryPage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('week');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadHistory();
  }, [filter, page]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const limit = 10;
      const response = await attendanceApi.getHistory(page, limit);
      
      let filteredData = response.data || [];
      
      if (filter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filteredData = filteredData.filter(a => new Date(a.date) >= weekAgo);
      } else if (filter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filteredData = filteredData.filter(a => new Date(a.date) >= monthAgo);
      }
      
      setAttendances(filteredData);
      setTotalPages(Math.ceil((response.pagination?.total || 0) / limit));
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusConfig: Record<string, { class: string; text: string }> = {
      tepat_waktu: { class: 'bg-emerald-100 text-emerald-700', text: 'Tepat Waktu' },
      terlambat: { class: 'bg-amber-100 text-amber-700', text: 'Terlambat' },
      pulang_awal: { class: 'bg-red-100 text-red-700', text: 'Pulang Awal' },
    };
    
    const config = statusConfig[status] || { class: 'bg-slate-100 text-slate-700', text: status };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

  // Group attendances by date
  const groupedAttendances = attendances.reduce((groups, attendance) => {
    const date = attendance.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(attendance);
    return groups;
  }, {} as Record<string, Attendance[]>);

  const sortedDates = Object.keys(groupedAttendances).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">📜 Riwayat Absensi</h2>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm">
        <button
          onClick={() => { setFilter('week'); setPage(1); }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            filter === 'week' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Minggu Ini
        </button>
        <button
          onClick={() => { setFilter('month'); setPage(1); }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            filter === 'month' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Bulan Ini
        </button>
        <button
          onClick={() => { setFilter('all'); setPage(1); }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Semua
        </button>
      </div>

      {/* History List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="h-4 w-32 bg-slate-100 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-12 bg-slate-50 rounded-lg animate-pulse" />
                <div className="h-12 bg-slate-50 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : sortedDates.length > 0 ? (
        <div className="space-y-4">
          {sortedDates.map((date) => (
            <div key={date} className="animate-fade-in">
              {/* Date Header */}
              <div className="sticky top-16 bg-slate-50 py-2 px-1 z-10">
                <h3 className="text-sm font-semibold text-slate-600">
                  {format(new Date(date), 'EEEE, d MMMM yyyy', { locale: id })}
                </h3>
              </div>

              {/* Attendance Cards */}
              {groupedAttendances[date].map((attendance) => (
                <div key={attendance.id} className="bg-white rounded-2xl p-5 shadow-sm mt-2">
                  {/* Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-500">
                      {attendance.id}
                    </span>
                    {getStatusBadge(attendance.check_in_status)}
                  </div>

                  {/* Times Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Check In */}
                    <div className="bg-emerald-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🕐</span>
                        <span className="text-xs font-medium text-emerald-700">Masuk</span>
                      </div>
                      <p className="font-mono text-xl font-bold text-emerald-700">
                        {attendance.check_in_time || '-'}
                      </p>
                      {attendance.check_in_status && (
                        <p className="text-xs text-emerald-600 mt-1 capitalize">
                          {attendance.check_in_status.replace('_', ' ')}
                        </p>
                      )}
                      {attendance.check_in_photo && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-sm">
                            📷
                          </div>
                          <span className="text-xs text-emerald-600">Foto ada</span>
                        </div>
                      )}
                    </div>

                    {/* Check Out */}
                    <div className={`rounded-xl p-4 ${
                      attendance.check_out_time ? 'bg-red-50' : 'bg-slate-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🏁</span>
                        <span className={`text-xs font-medium ${
                          attendance.check_out_time ? 'text-red-700' : 'text-slate-500'
                        }`}>
                          Pulang
                        </span>
                      </div>
                      <p className={`font-mono text-xl font-bold ${
                        attendance.check_out_time ? 'text-red-700' : 'text-slate-400'
                      }`}>
                        {attendance.check_out_time || '-'}
                      </p>
                      {attendance.check_out_status && (
                        <p className="text-xs text-red-600 mt-1 capitalize">
                          {attendance.check_out_status.replace('_', ' ')}
                        </p>
                      )}
                      {attendance.check_out_photo && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-sm">
                            📷
                          </div>
                          <span className="text-xs text-red-600">Foto ada</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location Info */}
                  {(attendance.check_in_latitude || attendance.check_out_latitude) && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-500 mb-2">📍 Lokasi</p>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-600">
                        {attendance.check_in_latitude && (
                          <div>
                            <span className="text-slate-400">Masuk: </span>
                            {attendance.check_in_latitude.toFixed(4)}, {attendance.check_in_longitude?.toFixed(4)}
                          </div>
                        )}
                        {attendance.check_out_latitude && (
                          <div>
                            <span className="text-slate-400">Pulang: </span>
                            {attendance.check_out_latitude.toFixed(4)}, {attendance.check_out_longitude?.toFixed(4)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-6xl mb-4">📋</p>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Belum Ada Riwayat</h3>
          <p className="text-sm text-slate-500">
            Riwayat absensi akan muncul di sini setelah Anda melakukan check-in
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
          <span className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
