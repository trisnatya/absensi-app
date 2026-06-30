import { Attendance } from '../../attendance/entities/attendance.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    name: string;
    employee_id: string;
    department: string;
    avatar: string;
    role: string;
    office_latitude: number;
    office_longitude: number;
    work_start: string;
    work_end: string;
    created_at: Date;
    updated_at: Date;
    attendances: Attendance[];
}
