import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { attendanceApi } from '../services/api';
import { useToast } from '../hooks/useToast';
import type { Attendance } from '../types';

export default function AttendancePage() {
  const { addToast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'checkin' | 'checkout'>('checkin');
  const [showSuccess, setShowSuccess] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    loadTodayAttendance();
    initCamera();
    getLocation();

    return () => {
      stopCamera();
    };
  }, []);

  const loadTodayAttendance = async () => {
    try {
      const response = await attendanceApi.getToday();
      if (response.data) {
        setTodayAttendance(response.data);
        if (response.data.check_in_time && !response.data.check_out_time) {
          setMode('checkout');
        }
      }
    } catch (error) {
      console.error('Failed to load today attendance:', error);
    }
  };

  const initCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraReady(true);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      addToast('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.', 'error');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation tidak didukung browser ini', 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        console.error('Location error:', error);
        addToast('Tidak dapat mendapatkan lokasi', 'error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const photo = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedPhoto(photo);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    initCamera();
  };

  const handleSubmit = async () => {
    if (!capturedPhoto || !location) {
      addToast('Harap ambil foto dan pastikan lokasi tersedia', 'error');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'checkin') {
        const response = await attendanceApi.checkIn({
          photo: capturedPhoto,
          latitude: location.lat,
          longitude: location.lng,
        });
        
        if (response.success) {
          setShowSuccess(true);
          setTodayAttendance(response.data as Attendance);
          setMode('checkout');
          setTimeout(() => {
            setShowSuccess(false);
            setCapturedPhoto(null);
            initCamera();
          }, 2000);
        }
      } else {
        const response = await attendanceApi.checkOut({
          photo: capturedPhoto,
          latitude: location.lat,
          longitude: location.lng,
        });
        
        if (response.success) {
          setShowSuccess(true);
          setTodayAttendance(response.data as Attendance);
          setTimeout(() => {
            setShowSuccess(false);
          }, 2000);
        }
      }
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Terjadi kesalahan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isValidLocation = () => {
    if (!location) return false;
    // Check if within reasonable accuracy (within 100m)
    return location.accuracy <= 100;
  };

  return (
    <div className="space-y-4">
      {/* Time Display */}
      <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
        <div className="text-4xl font-bold font-mono text-blue-600">
          {format(new Date(), 'HH:mm:ss')}
        </div>
        <div className="text-sm text-slate-500 mt-2">
          {format(new Date(), 'EEEE, d MMMM yyyy')}
        </div>
      </div>

      {/* Camera Section */}
      <div className="bg-slate-900 rounded-2xl p-4 shadow-lg">
        <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden bg-slate-800">
          {/* Camera Frame */}
          <div className="absolute inset-0 border-4 border-dashed border-white/50 rounded-full z-10 pointer-events-none" />
          <div className="absolute top-4 left-4 w-6 h-6 border-l-4 border-t-4 border-white rounded-tl-lg z-20" />
          <div className="absolute top-4 right-4 w-6 h-6 border-r-4 border-t-4 border-white rounded-tr-lg z-20" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-l-4 border-b-4 border-white rounded-bl-lg z-20" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-r-4 border-b-4 border-white rounded-br-lg z-20" />

          {!capturedPhoto ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="animate-spin text-4xl mb-2">⏳</div>
                    <p className="text-sm">Memuat kamera...</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <img
              src={capturedPhoto}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* Camera Controls */}
        <div className="mt-4 flex justify-center gap-4">
          {!capturedPhoto ? (
            <button
              onClick={capturePhoto}
              disabled={!cameraReady}
              className="w-16 h-16 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500" />
            </button>
          ) : (
            <>
              <button
                onClick={retakePhoto}
                className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
              >
                🔄 Ambil Ulang
              </button>
              <button
                onClick={() => setCapturedPhoto(null)}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                ✓ Konfirmasi
              </button>
            </>
          )}
        </div>
      </div>

      {/* Location Section */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
            📍
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Lokasi Anda</h3>
            <p className="text-xs text-slate-500">
              {location ? `${location.accuracy.toFixed(0)}m akurasi` : 'Mendeteksi lokasi...'}
            </p>
          </div>
        </div>

        {location && (
          <div className="bg-slate-50 rounded-xl p-3 font-mono text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Latitude</span>
              <span className="text-slate-800">{location.lat.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Longitude</span>
              <span className="text-slate-800">{location.lng.toFixed(6)}</span>
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          {location ? (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              isValidLocation() 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
              {isValidLocation() ? '✓ Lokasi valid' : '⚠ Akurasi rendah'}
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 animate-pulse">
              ⏳ Mendeteksi...
            </span>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || !capturedPhoto || !location}
        className={`w-full py-4 rounded-2xl text-lg font-bold text-white shadow-lg transition-all ${
          mode === 'checkin'
            ? 'bg-emerald-500 hover:bg-emerald-600'
            : 'bg-red-500 hover:bg-red-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Memproses...
          </span>
        ) : mode === 'checkin' ? (
          '🕐 Check In'
        ) : (
          '🚪 Check Out'
        )}
      </button>

      {/* Today's Attendance Info */}
      {todayAttendance && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-3">📋 Absensi Hari Ini</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-xs text-emerald-600 mb-1">Check In</p>
              <p className="font-mono font-semibold text-emerald-700">
                {todayAttendance.check_in_time || '-'}
              </p>
              <p className="text-xs text-emerald-600 capitalize mt-1">
                {todayAttendance.check_in_status?.replace('_', ' ') || '-'}
              </p>
            </div>
            <div className={`rounded-xl p-3 ${todayAttendance.check_out_time ? 'bg-red-50' : 'bg-slate-50'}`}>
              <p className={`text-xs mb-1 ${todayAttendance.check_out_time ? 'text-red-600' : 'text-slate-500'}`}>
                Check Out
              </p>
              <p className={`font-mono font-semibold ${todayAttendance.check_out_time ? 'text-red-700' : 'text-slate-400'}`}>
                {todayAttendance.check_out_time || '-'}
              </p>
              {todayAttendance.check_out_status && (
                <p className="text-xs text-red-600 capitalize mt-1">
                  {todayAttendance.check_out_status.replace('_', ' ')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-emerald-500 flex items-center justify-center z-50 animate-success">
          <div className="text-center text-white">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 animate-pop">
              <span className="text-5xl text-emerald-500">✓</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {mode === 'checkin' ? 'Check In Berhasil!' : 'Check Out Berhasil!'}
            </h2>
            <p className="text-white/80">
              {format(new Date(), 'HH:mm')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
