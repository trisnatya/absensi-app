import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { User } from '../users/entities/user.entity';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private determineStatus(checkTime: string, workStart: string): string {
    const [checkHour, checkMin] = checkTime.split(':').map(Number);
    const [startHour, startMin] = workStart.split(':').map(Number);

    const checkMinutes = checkHour * 60 + checkMin;
    const startMinutes = startHour * 60 + startMin;

    return checkMinutes > startMinutes ? 'terlambat' : 'tepat_waktu';
  }

  private determineCheckOutStatus(checkOutTime: string, workEnd: string): string {
    const [checkHour, checkMin] = checkOutTime.split(':').map(Number);
    const [endHour, endMin] = workEnd.split(':').map(Number);

    const checkMinutes = checkHour * 60 + checkMin;
    const endMinutes = endHour * 60 + endMin;

    return checkMinutes < endMinutes ? 'pulang_awal' : 'tepat_waktu';
  }

  async checkIn(userId: number, checkInDto: CheckInDto): Promise<Attendance> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const existingAttendance = await this.attendanceRepository.findOne({
      where: { user_id: userId, date: today },
    });

    if (existingAttendance?.check_in_time) {
      throw new BadRequestException('Anda sudah check-in hari ini');
    }

    const distance = this.calculateDistance(
      checkInDto.latitude,
      checkInDto.longitude,
      user.office_latitude,
      user.office_longitude,
    );

    const maxDistance = 5000;
    if (distance > maxDistance) {
      throw new BadRequestException(`Anda berada di luar jangkauan kantor (${Math.round(distance)}m dari kantor)`);
    }

    const status = this.determineStatus(currentTime, user.work_start);

    if (existingAttendance) {
      existingAttendance.check_in_time = currentTime;
      existingAttendance.check_in_photo = checkInDto.photo;
      existingAttendance.check_in_latitude = checkInDto.latitude;
      existingAttendance.check_in_longitude = checkInDto.longitude;
      existingAttendance.check_in_status = status;
      return this.attendanceRepository.save(existingAttendance);
    }

    const attendance = this.attendanceRepository.create({
      user_id: userId,
      date: today,
      check_in_time: currentTime,
      check_in_photo: checkInDto.photo,
      check_in_latitude: checkInDto.latitude,
      check_in_longitude: checkInDto.longitude,
      check_in_status: status,
    });

    return this.attendanceRepository.save(attendance);
  }

  async checkOut(userId: number, checkOutDto: CheckOutDto): Promise<Attendance> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const attendance = await this.attendanceRepository.findOne({
      where: { user_id: userId, date: today },
    });

    if (!attendance) {
      throw new BadRequestException('Anda belum check-in hari ini');
    }

    if (attendance.check_out_time) {
      throw new BadRequestException('Anda sudah check-out hari ini');
    }

    const distance = this.calculateDistance(
      checkOutDto.latitude,
      checkOutDto.longitude,
      user.office_latitude,
      user.office_longitude,
    );

    const maxDistance = 5000;
    if (distance > maxDistance) {
      throw new BadRequestException(`Anda berada di luar jangkauan kantor (${Math.round(distance)}m dari kantor)`);
    }

    const status = this.determineCheckOutStatus(currentTime, user.work_end);

    attendance.check_out_time = currentTime;
    attendance.check_out_photo = checkOutDto.photo;
    attendance.check_out_latitude = checkOutDto.latitude;
    attendance.check_out_longitude = checkOutDto.longitude;
    attendance.check_out_status = status;

    return this.attendanceRepository.save(attendance);
  }

  async getTodayAttendance(userId: number): Promise<Attendance | null> {
    const today = new Date().toISOString().split('T')[0];
    return this.attendanceRepository.findOne({
      where: { user_id: userId, date: today },
    });
  }

  async getHistory(
    userId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Attendance[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.attendanceRepository.findAndCount({
      where: { user_id: userId },
      order: { date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async getStats(userId: number): Promise<{
    totalHadir: number;
    totalTerlambat: number;
    totalPulangAwal: number;
    presentDays: number;
    weekStats: { date: string; status: string }[];
  }> {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const weekStart = startOfWeek.toISOString().split('T')[0];

    const attendances = await this.attendanceRepository.find({
      where: { user_id: userId },
      order: { date: 'DESC' },
    });

    const allTimeAttendances = attendances.filter((a) => a.check_in_time);
    const totalHadir = allTimeAttendances.length;
    const totalTerlambat = allTimeAttendances.filter((a) => a.check_in_status === 'terlambat').length;
    const totalPulangAwal = allTimeAttendances.filter((a) => a.check_out_status === 'pulang_awal').length;

    const weekAttendances = await this.attendanceRepository.find({
      where: { user_id: userId, date: Between(weekStart, new Date().toISOString().split('T')[0]) },
      order: { date: 'ASC' },
    });

    const weekStats = weekAttendances.map((a) => ({
      date: a.date,
      status: a.check_in_status || 'unknown',
    }));

    return {
      totalHadir,
      totalTerlambat,
      totalPulangAwal,
      presentDays: totalHadir,
      weekStats,
    };
  }
}
