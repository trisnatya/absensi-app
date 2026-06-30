import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
export declare class AttendanceController {
    private attendanceService;
    constructor(attendanceService: AttendanceService);
    checkIn(req: any, checkInDto: CheckInDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            date: string;
            checkInTime: string;
            status: string;
        };
    }>;
    checkOut(req: any, checkOutDto: CheckOutDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            date: string;
            checkOutTime: string;
            status: string;
        };
    }>;
    getTodayAttendance(req: any): Promise<{
        success: boolean;
        data: import("./entities/attendance.entity").Attendance;
    }>;
    getHistory(req: any, page?: string, limit?: string): Promise<{
        success: boolean;
        data: import("./entities/attendance.entity").Attendance[];
        pagination: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getStats(req: any): Promise<{
        success: boolean;
        data: {
            totalHadir: number;
            totalTerlambat: number;
            totalPulangAwal: number;
            presentDays: number;
            weekStats: {
                date: string;
                status: string;
            }[];
        };
    }>;
}
