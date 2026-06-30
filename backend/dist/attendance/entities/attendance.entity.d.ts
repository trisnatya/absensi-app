import { User } from '../../users/entities/user.entity';
export declare class Attendance {
    id: number;
    user_id: number;
    date: string;
    check_in_time: string;
    check_in_photo: string;
    check_in_latitude: number;
    check_in_longitude: number;
    check_in_status: string;
    check_out_time: string;
    check_out_photo: string;
    check_out_latitude: number;
    check_out_longitude: number;
    check_out_status: string;
    created_at: Date;
    user: User;
}
