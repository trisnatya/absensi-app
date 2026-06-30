import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: Partial<import("../users/entities/user.entity").User>;
            token: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: Partial<import("../users/entities/user.entity").User>;
            token: string;
        };
    }>;
    getProfile(req: any): Promise<{
        success: boolean;
        data: Partial<import("../users/entities/user.entity").User>;
    }>;
    logout(): Promise<{
        success: boolean;
        message: string;
    }>;
}
