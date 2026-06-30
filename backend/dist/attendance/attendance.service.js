"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_entity_1 = require("./entities/attendance.entity");
const user_entity_1 = require("../users/entities/user.entity");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let AttendanceService = class AttendanceService {
    constructor(attendanceRepository, usersRepository) {
        this.attendanceRepository = attendanceRepository;
        this.usersRepository = usersRepository;
        this.uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(this.uploadsDir)) {
            fs.mkdirSync(this.uploadsDir, { recursive: true });
        }
    }
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371e3;
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lng2 - lng1) * Math.PI) / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    determineStatus(checkTime, workStart) {
        const [checkHour, checkMin] = checkTime.split(':').map(Number);
        const [startHour, startMin] = workStart.split(':').map(Number);
        const checkMinutes = checkHour * 60 + checkMin;
        const startMinutes = startHour * 60 + startMin;
        return checkMinutes > startMinutes ? 'terlambat' : 'tepat_waktu';
    }
    determineCheckOutStatus(checkOutTime, workEnd) {
        const [checkHour, checkMin] = checkOutTime.split(':').map(Number);
        const [endHour, endMin] = workEnd.split(':').map(Number);
        const checkMinutes = checkHour * 60 + checkMin;
        const endMinutes = endHour * 60 + endMin;
        return checkMinutes < endMinutes ? 'pulang_awal' : 'tepat_waktu';
    }
    savePhoto(base64Data, prefix) {
        const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Image, 'base64');
        const filename = `${prefix}_${Date.now()}.jpg`;
        const filepath = path.join(this.uploadsDir, filename);
        fs.writeFileSync(filepath, buffer);
        return `/uploads/${filename}`;
    }
    async checkIn(userId, checkInDto) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User tidak ditemukan');
        }
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const existingAttendance = await this.attendanceRepository.findOne({
            where: { user_id: userId, date: today },
        });
        if (existingAttendance?.check_in_time) {
            throw new common_1.BadRequestException('Anda sudah check-in hari ini');
        }
        const distance = this.calculateDistance(checkInDto.latitude, checkInDto.longitude, user.office_latitude, user.office_longitude);
        const maxDistance = 5000;
        if (distance > maxDistance) {
            throw new common_1.BadRequestException(`Anda berada di luar jangkauan kantor (${Math.round(distance)}m dari kantor)`);
        }
        const status = this.determineStatus(currentTime, user.work_start);
        const photoUrl = this.savePhoto(checkInDto.photo, `checkin_${userId}`);
        if (existingAttendance) {
            existingAttendance.check_in_time = currentTime;
            existingAttendance.check_in_photo = photoUrl;
            existingAttendance.check_in_latitude = checkInDto.latitude;
            existingAttendance.check_in_longitude = checkInDto.longitude;
            existingAttendance.check_in_status = status;
            return this.attendanceRepository.save(existingAttendance);
        }
        const attendance = this.attendanceRepository.create({
            user_id: userId,
            date: today,
            check_in_time: currentTime,
            check_in_photo: photoUrl,
            check_in_latitude: checkInDto.latitude,
            check_in_longitude: checkInDto.longitude,
            check_in_status: status,
        });
        return this.attendanceRepository.save(attendance);
    }
    async checkOut(userId, checkOutDto) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User tidak ditemukan');
        }
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const attendance = await this.attendanceRepository.findOne({
            where: { user_id: userId, date: today },
        });
        if (!attendance) {
            throw new common_1.BadRequestException('Anda belum check-in hari ini');
        }
        if (attendance.check_out_time) {
            throw new common_1.BadRequestException('Anda sudah check-out hari ini');
        }
        const distance = this.calculateDistance(checkOutDto.latitude, checkOutDto.longitude, user.office_latitude, user.office_longitude);
        const maxDistance = 5000;
        if (distance > maxDistance) {
            throw new common_1.BadRequestException(`Anda berada di luar jangkauan kantor (${Math.round(distance)}m dari kantor)`);
        }
        const status = this.determineCheckOutStatus(currentTime, user.work_end);
        const photoUrl = this.savePhoto(checkOutDto.photo, `checkout_${userId}`);
        attendance.check_out_time = currentTime;
        attendance.check_out_photo = photoUrl;
        attendance.check_out_latitude = checkOutDto.latitude;
        attendance.check_out_longitude = checkOutDto.longitude;
        attendance.check_out_status = status;
        return this.attendanceRepository.save(attendance);
    }
    async getTodayAttendance(userId) {
        const today = new Date().toISOString().split('T')[0];
        return this.attendanceRepository.findOne({
            where: { user_id: userId, date: today },
        });
    }
    async getHistory(userId, page = 1, limit = 20) {
        const [data, total] = await this.attendanceRepository.findAndCount({
            where: { user_id: userId },
            order: { date: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit };
    }
    async getStats(userId) {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const weekStart = startOfWeek.toISOString().split('T')[0];
        const attendances = await this.attendanceRepository.find({
            where: { user_id: userId },
            order: { date: 'DESC' },
        });
        const allTimeAttendances = attendances.filter((a) => a.check_in_time);
        const totalHadir = allTimeAttendances.length;
        const totalTerlambat = allTimeAttendances.filter((a) => a.check_in_status === 'terlambat').length;
        const totalPulangAwal = allTimeAttendances.filter((a) => a.check_out_status === 'pulang_awal').length;
        const weekAttendances = await this.attendanceRepository.find({
            where: { user_id: userId, date: (0, typeorm_2.Between)(weekStart, new Date().toISOString().split('T')[0]) },
            order: { date: 'ASC' },
        });
        const weekStats = weekAttendances.map((a) => ({
            date: a.date,
            status: a.check_in_status || 'unknown',
        }));
        return {
            totalHadir,
            totalTerlambat,
            totalPulangAwal,
            presentDays: totalHadir,
            weekStats,
        };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map