import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AttendanceModule } from './attendance/attendance.module';
import { User } from './users/entities/user.entity';
import { Attendance } from './attendance/entities/attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Attendance],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UsersModule,
    AttendanceModule,
  ],
})
export class AppModule {}
