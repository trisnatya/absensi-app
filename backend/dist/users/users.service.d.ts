import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<Partial<User>[]>;
    findOne(id: number): Promise<Partial<User>>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<Partial<User>>;
    delete(id: number): Promise<void>;
}
