import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        success: boolean;
        data: Partial<import("./entities/user.entity").User>[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: Partial<import("./entities/user.entity").User>;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        success: boolean;
        data: Partial<import("./entities/user.entity").User>;
    }>;
    delete(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
