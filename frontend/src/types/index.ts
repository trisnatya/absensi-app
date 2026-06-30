export interface User {
  id: number;
  email: string;
  name: string;
  employee_id: string;
  department?: string;
  avatar?: string;
  role: string;
  office_latitude: number;
  office_longitude: number;
  work_start: string;
  work_end: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: number;
  user_id: number;
  date: string;
  check_in_time?: string;
  check_in_photo?: string;
  check_in_latitude?: number;
  check_in_longitude?: number;
  check_in_status?: string;
  check_out_time?: string;
  check_out_photo?: string;
  check_out_latitude?: number;
  check_out_longitude?: number;
  check_out_status?: string;
  created_at: string;
  user?: User;
}

export interface Stats {
  totalHadir: number;
  totalTerlambat: number;
  totalPulangAwal: number;
  presentDays: number;
  weekStats: { date: string; status: string }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  department?: string;
}

export interface CheckInRequest {
  photo: string;
  latitude: number;
  longitude: number;
}

export interface CheckOutRequest {
  photo: string;
  latitude: number;
  longitude: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
