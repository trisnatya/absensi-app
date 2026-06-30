import axios from 'axios';
import type {
  ApiResponse,
  AuthResponse,
  Attendance,
  Stats,
  User,
  LoginRequest,
  RegisterRequest,
  CheckInRequest,
  CheckOutRequest,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data).then((res) => res.data),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', data).then((res) => res.data),

  getProfile: () =>
    api.get<ApiResponse<User>>('/auth/profile').then((res) => res.data),

  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout').then((res) => res.data),
};

// Attendance API
export const attendanceApi = {
  checkIn: (data: CheckInRequest) =>
    api.post<ApiResponse<Attendance>>('/attendance/check-in', data).then((res) => res.data),

  checkOut: (data: CheckOutRequest) =>
    api.post<ApiResponse<Attendance>>('/attendance/check-out', data).then((res) => res.data),

  getToday: () =>
    api.get<ApiResponse<Attendance | null>>('/attendance/today').then((res) => res.data),

  getHistory: (page = 1, limit = 20) =>
    api
      .get<ApiResponse<Attendance[]> & { pagination: { page: number; limit: number; total: number } }>(
        `/attendance/history?page=${page}&limit=${limit}`
      )
      .then((res) => res.data),

  getStats: () =>
    api.get<ApiResponse<Stats>>('/attendance/stats').then((res) => res.data),
};

// Users API
export const usersApi = {
  getAll: () =>
    api.get<ApiResponse<User[]>>('/users').then((res) => res.data),

  getOne: (id: number) =>
    api.get<ApiResponse<User>>(`/users/${id}`).then((res) => res.data),

  update: (id: number, data: Partial<User>) =>
    api.patch<ApiResponse<User>>(`/users/${id}`, data).then((res) => res.data),
};

export default api;
