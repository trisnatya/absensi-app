import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time', nullable: true })
  check_in_time: string;

  @Column({ type: 'text', nullable: true })
  check_in_photo: string;

  @Column({ type: 'real', nullable: true })
  check_in_latitude: number;

  @Column({ type: 'real', nullable: true })
  check_in_longitude: number;

  @Column({ default: 'tepat_waktu' })
  check_in_status: string;

  @Column({ type: 'time', nullable: true })
  check_out_time: string;

  @Column({ type: 'text', nullable: true })
  check_out_photo: string;

  @Column({ type: 'real', nullable: true })
  check_out_latitude: number;

  @Column({ type: 'real', nullable: true })
  check_out_longitude: number;

  @Column({ nullable: true })
  check_out_status: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.attendances)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
