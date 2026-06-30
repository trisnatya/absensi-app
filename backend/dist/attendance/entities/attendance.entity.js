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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let Attendance = class Attendance {
};
exports.Attendance = Attendance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Attendance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Attendance.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Attendance.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "check_in_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "check_in_photo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real', nullable: true }),
    __metadata("design:type", Number)
], Attendance.prototype, "check_in_latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real', nullable: true }),
    __metadata("design:type", Number)
], Attendance.prototype, "check_in_longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'tepat_waktu' }),
    __metadata("design:type", String)
], Attendance.prototype, "check_in_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "check_out_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "check_out_photo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real', nullable: true }),
    __metadata("design:type", Number)
], Attendance.prototype, "check_out_latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real', nullable: true }),
    __metadata("design:type", Number)
], Attendance.prototype, "check_out_longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "check_out_status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Attendance.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.attendances),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Attendance.prototype, "user", void 0);
exports.Attendance = Attendance = __decorate([
    (0, typeorm_1.Entity)('attendances')
], Attendance);
//# sourceMappingURL=attendance.entity.js.map