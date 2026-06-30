import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Attendance } from '../../attendance/entities/attendance.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ unique: true })
  employee_id: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 'employee' })
  role: string;

  @Column({ type: 'real', default: -6.2088 })
  office_latitude: number;

  @Column({ type: 'real', default: 106.8456 })
  office_longitude: number;

  @Column({ default: '08:00' })
  work_start: string;

  @Column({ default: '17:00' })
  work_end: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendances: Attendance[];
}
