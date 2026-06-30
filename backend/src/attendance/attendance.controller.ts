import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';

@Controller('attendance')
@UseGuards(AuthGuard('jwt'))
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('check-in')
  async checkIn(@Request() req, @Body() checkInDto: CheckInDto) {
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

  @Post('check-out')
  async checkOut(@Request() req, @Body() checkOutDto: CheckOutDto) {
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

  @Get('today')
  async getTodayAttendance(@Request() req) {
    const attendance = await this.attendanceService.getTodayAttendance(req.user.sub);
    return {
      success: true,
      data: attendance,
    };
  }

  @Get('history')
  async getHistory(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const result = await this.attendanceService.getHistory(
      req.user.sub,
      parseInt(page),
      parseInt(limit),
    );
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

  @Get('stats')
  async getStats(@Request() req) {
    const stats = await this.attendanceService.getStats(req.user.sub);
    return {
      success: true,
      data: stats,
    };
  }
}
