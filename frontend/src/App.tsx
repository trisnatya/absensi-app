import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AttendancePage from './pages/AttendancePage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/Layout';
import Toast from './components/Toast';
import { ToastProvider } from './hooks/useToast';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toast />
    </ToastProvider>
  );
}

export default App;
