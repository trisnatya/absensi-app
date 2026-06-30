import { Controller, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      success: true,
      data: users,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return {
      success: true,
      data: user,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(+id, updateUserDto);
    return {
      success: true,
      data: user,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.usersService.delete(+id);
    return {
      success: true,
      message: 'User berhasil dihapus',
    };
  }
}
