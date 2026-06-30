# Aplikasi Absensi Karyawan

Aplikasi absensi full-stack dengan ReactJS + NestJS + SQLite.

## 🚀 Fitur

### Frontend (React + TypeScript + TailwindCSS)
- **Halaman Login/Register** - Autentikasi dengan JWT
- **Dashboard** - Status absensi, statistik, aktivitas terbaru
- **Absensi** - Check-in/Check-out dengan kamera & lokasi GPS
- **Riwayat** - Lihat history absensi dengan filter
- **Profil** - Informasi akun dan pengaturan

### Backend (NestJS + TypeScript)
- RESTful API dengan autentikasi JWT
- Database SQLite dengan TypeORM
- Validasi input dengan class-validator
- CRUD untuk user dan attendance

## 📁 Struktur Proyek

```
/workspace/project/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Module autentikasi
│   │   ├── users/          # Module users
│   │   ├── attendance/     # Module absensi
│   │   ├── entities/       # TypeORM entities
│   │   └── main.ts         # Entry point
│   ├── dist/               # Compiled JS
│   └── package.json
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Komponen reusable
│   │   ├── pages/          # Halaman aplikasi
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── stores/         # Zustand state
│   │   └── types/          # TypeScript types
│   ├── dist/               # Built files
│   └── package.json
│
└── README.md
```

## 🛠️ Cara Menjalankan

### 1. Jalankan Backend

```bash
cd /workspace/project/backend

# Install dependencies (jika belum)
npm install

# Build
npm run build

# Jalankan
npm start
```

Backend akan berjalan di `http://localhost:3000`

### 2. Jalankan Frontend

```bash
cd /workspace/project/frontend

# Install dependencies (jika belum)
npm install

# Development mode
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

### 3. Login Demo

Klik tombol **"Masuk sebagai Demo"** untuk login dengan akun demo.
Atau register akun baru melalui form register.

## 📝 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user baru |
| POST | /api/auth/login | Login user |
| POST | /api/auth/logout | Logout user |
| GET | /api/auth/profile | Get profile user |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/attendance/check-in | Check in |
| POST | /api/attendance/check-out | Check out |
| GET | /api/attendance/today | Get absensi hari ini |
| GET | /api/attendance/history | Get history absensi |
| GET | /api/attendance/stats | Get statistik |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get semua user |
| GET | /api/users/:id | Get user by ID |
| PATCH | /api/users/:id | Update user |

## 🔧 Konfigurasi

### Backend Environment
```env
JWT_SECRET=absensi_secret_key_2024
PORT=3000
```

### Office Location
Lokasi kantor default: Jakarta (-6.2088, 106.8456)
Bisa diubah di database atau saat registrasi.

### Work Schedule
Jam kerja default: 08:00 - 17:00
Bisa disesuaikan per user.

## 📱 Fitur Kamera & Lokasi

### Kamera
- Menggunakan MediaDevices API
- Capture foto dengan Canvas API
- Simpan sebagai Base64

### Lokasi
- Menggunakan Geolocation API
- Validasi jarak dari kantor (max 5km)
- Akurasi GPS ditampilkan

## 🗄️ Database Schema

### Users Table
```sql
- id (PK)
- email (UNIQUE)
- password (hashed)
- name
- employee_id (UNIQUE)
- department
- avatar
- role
- office_latitude
- office_longitude
- work_start
- work_end
```

### Attendance Table
```sql
- id (PK)
- user_id (FK)
- date
- check_in_time
- check_in_photo
- check_in_latitude
- check_in_longitude
- check_in_status
- check_out_time
- check_out_photo
- check_out_latitude
- check_out_longitude
- check_out_status
```

## 📦 Tech Stack

### Backend
- NestJS 11
- TypeORM 0.3
- SQLite
- JWT Authentication
- bcrypt password hashing
- class-validator

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS 4
- React Router 7
- Zustand
- Axios
- date-fns

## ⚠️ Catatan

- Aplikasi ini menggunakan SQLite untuk simplicity. Untuk production, pertimbangkan PostgreSQL atau MySQL.
- Camera dan Geolocation memerlukan HTTPS atau localhost untuk berfungsi.
- Data sensitif (password) di-hash dengan bcrypt.
