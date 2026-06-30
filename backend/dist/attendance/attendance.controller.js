"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const attendance_service_1 = require("./attendance.service");
const check_in_dto_1 = require("./dto/check-in.dto");
const check_out_dto_1 = require("./dto/check-out.dto");
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async checkIn(req, checkInDto) {
        const attendance = await this.attendanceService.checkIn(req.user.sub, checkInDto);
        return {
            success: true,
            message: 'Check-in berhasil',
            data: {
                id: attendance.id,
                date: attendance.date,
                checkInTime: attendance.check_in_time,
                status: attendance.check_in_status,
            },
        };
    }
    async checkOut(req, checkOutDto) {
        const attendance = await this.attendanceService.checkOut(req.user.sub, checkOutDto);
        return {
            success: true,
            message: 'Check-out berhasil',
            data: {
                id: attendance.id,
                date: attendance.date,
                checkOutTime: attendance.check_out_time,
                status: attendance.check_out_status,
            },
        };
    }
    async getTodayAttendance(req) {
        const attendance = await this.attendanceService.getTodayAttendance(req.user.sub);
        return {
            success: true,
            data: attendance,
        };
    }
    async getHistory(req, page = '1', limit = '20') {
        const result = await this.attendanceService.getHistory(req.user.sub, parseInt(page), parseInt(limit));
        return {
            success: true,
            data: result.data,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
            },
        };
    }
    async getStats(req) {
        const stats = await this.attendanceService.getStats(req.user.sub);
        return {
            success: true,
            data: stats,
        };
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('check-in'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, check_in_dto_1.CheckInDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Post)('check-out'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, check_out_dto_1.CheckOutDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "checkOut", null);
__decorate([
    (0, common_1.Get)('today'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getTodayAttendance", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getStats", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)('attendance'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map