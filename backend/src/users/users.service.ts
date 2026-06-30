import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.usersRepository.find();
    return users.map(({ password, ...user }) => user);
  }

  async findOne(id: number): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    Object.assign(user, updateUserDto);
    await this.usersRepository.save(user);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async delete(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User tidak ditemukan');
    }
  }
}
