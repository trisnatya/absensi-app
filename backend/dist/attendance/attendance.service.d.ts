import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { User } from '../users/entities/user.entity';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
export declare class AttendanceService {
    private attendanceRepository;
    private usersRepository;
    private uploadsDir;
    constructor(attendanceRepository: Repository<Attendance>, usersRepository: Repository<User>);
    private calculateDistance;
    private determineStatus;
    private determineCheckOutStatus;
    private savePhoto;
    checkIn(userId: number, checkInDto: CheckInDto): Promise<Attendance>;
    checkOut(userId: number, checkOutDto: CheckOutDto): Promise<Attendance>;
    getTodayAttendance(userId: number): Promise<Attendance | null>;
    getHistory(userId: number, page?: number, limit?: number): Promise<{
        data: Attendance[];
        total: number;
        page: number;
        limit: number;
    }>;
    getStats(userId: number): Promise<{
        totalHadir: number;
        totalTerlambat: number;
        totalPulangAwal: number;
        presentDays: number;
        weekStats: {
            date: string;
            status: string;
        }[];
    }>;
}
