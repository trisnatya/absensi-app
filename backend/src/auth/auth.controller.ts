import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      success: true,
      message: 'Registrasi berhasil',
      data: result,
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      success: true,
      message: 'Login berhasil',
      data: result,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.authService.getProfile(req.user.sub);
    return {
      success: true,
      data: user,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout() {
    return {
      success: true,
      message: 'Logout berhasil',
    };
  }
}
