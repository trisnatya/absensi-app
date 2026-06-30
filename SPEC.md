# Aplikasi Absensi Karyawan - Full Stack

## 1. Concept & Vision

Aplikasi absensi modern full-stack yang memungkinkan karyawan melakukan check-in dan check-out dengan verifikasi foto via kamera dan validasi lokasi GPS. Built dengan ReactJS untuk frontend yang responsif dan NestJS untuk backend yang scalable, menggunakan SQLite untuk database yang ringan namun powerful.

## 2. Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   ReactJS +     │     │   NestJS        │     │   SQLite        │
│   Vite + TS     │◄───►│   Backend API   │◄───►│   Database      │
│   (Port 5173)   │     │   (Port 3000)    │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 3. Technology Stack

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **React Hook Form** - Form handling
- **Zustand** - State management
- **date-fns** - Date utilities

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **TypeORM** - ORM for SQLite
- **SQLite** - Database
- **JWT** - Authentication
- **Passport** - Auth strategies
- **bcrypt** - Password hashing
- **class-validator** - Validation
- **multer** - File upload

## 4. Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  employee_id TEXT UNIQUE NOT NULL,
  department TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'employee',
  office_latitude REAL DEFAULT -6.2088,
  office_longitude REAL DEFAULT 106.8456,
  work_start TEXT DEFAULT '08:00',
  work_end TEXT DEFAULT '17:00',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Attendance Table
```sql
CREATE TABLE attendances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date DATE NOT NULL,
  check_in_time TIME,
  check_in_photo TEXT,
  check_in_latitude REAL,
  check_in_longitude REAL,
  check_in_status TEXT DEFAULT 'tepat_waktu',
  check_out_time TIME,
  check_out_photo TEXT,
  check_out_latitude REAL,
  check_out_longitude REAL,
  check_out_status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, date)
);
```

## 5. API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login user |
| POST | /auth/logout | Logout user |
| GET | /auth/profile | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | Get all users (admin) |
| GET | /users/:id | Get user by ID |
| PATCH | /users/:id | Update user |
| DELETE | /users/:id | Delete user (admin) |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /attendance/check-in | Check in with photo & location |
| POST | /attendance/check-out | Check out with photo & location |
| GET | /attendance/today | Get today's attendance |
| GET | /attendance/history | Get attendance history |
| GET | /attendance/stats | Get attendance statistics |

## 6. Request/Response Formats

### Check-In Request
```json
{
  "photo": "base64_encoded_image",
  "latitude": -6.2088,
  "longitude": 106.8456
}
```

### Check-In Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "date": "2024-01-15",
    "checkInTime": "08:00",
    "status": "tepat_waktu",
    "message": "Check-in berhasil"
  }
}
```

### Attendance History Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "date": "2024-01-15",
      "checkIn": {
        "time": "08:00",
        "photo": "...",
        "location": { "lat": -6.2088, "lng": 106.8456 },
        "status": "tepat_waktu"
      },
      "checkOut": {
        "time": "17:00",
        "photo": "...",
        "location": { "lat": -6.2088, "lng": 106.8456 },
        "status": "tepat_waktu"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50
  }
}
```

## 7. Frontend Pages

### 1. Login Page
- Email/password form
- Demo login button
- Remember me checkbox
- Error messages

### 2. Dashboard
- Greeting based on time
- Today's attendance status card
- Weekly statistics cards
- Quick action button
- Recent activity feed

### 3. Attendance Page
- Live camera preview
- Capture button with animation
- Photo preview with retake option
- GPS location display
- Distance validation indicator
- Check-in/Check-out button
- Success animation

### 4. History Page
- Date filter (week/month/custom)
- Attendance list grouped by date
- Each item shows:
  - Check-in/out times
  - Photos (thumbnails)
  - Location coordinates
  - Status badges
- Pagination

### 5. Profile Page
- User avatar with edit option
- Personal information
- Office location settings
- Work schedule
- Logout button

## 8. Features

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Token stored in localStorage
- Auto-redirect on token expiry

### Camera Integration
- MediaDevices API for camera access
- Canvas API for photo capture
- Base64 encoding for storage
- Error handling for permission denied

### Location Integration
- Geolocation API for GPS
- Haversine formula for distance
- Office radius validation
- Accuracy indicator

### Attendance Logic
- Auto-detect late arrival (> 08:00)
- Auto-detect early leave (< 17:00)
- One check-in per day
- One check-out per day (after check-in)

## 9. Error Handling

### Frontend
- Toast notifications for success/error
- Form validation with inline errors
- Loading states
- Network error handling

### Backend
- HTTP status codes
- Standardized error response format
- Request validation
- Exception filters

## 10. Security Considerations

- Password hashing (bcrypt)
- JWT token expiration
- CORS configuration
- Input sanitization
- SQL injection prevention (TypeORM)
- XSS prevention (React)

## 11. Project Structure

```
/workspace/project/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Auth module
│   │   ├── users/          # Users module
│   │   ├── attendance/      # Attendance module
│   │   ├── common/         # Shared utilities
│   │   └── main.ts         # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── stores/         # State management
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```
