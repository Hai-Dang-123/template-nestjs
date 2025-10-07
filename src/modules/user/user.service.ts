

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatus } from '../../common/enums/user-status.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../role/entities/role.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, role: roleName, ...rest } = createUserDto;

    let userRole: Role;
    // If a role is provided (by an admin), find it. Otherwise, use the default 'USER' role.
    if (roleName) {
        userRole = await this.roleRepository.findOne({ where: { name: roleName } });
    } else {
        userRole = await this.roleRepository.findOne({ where: { name: UserRole.USER } });
    }

    if (!userRole) {
        throw new InternalServerErrorException(`Role '${roleName || UserRole.USER}' not found. Please make sure to seed the roles.`);
    }

    const userToCreate = {
      ...rest,
      passwordHash: password,
      role: userRole,
    };

    const newUser = this.userRepository.create(userToCreate);
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['role'] });
  }

  async findOneById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId }, relations: ['role'] });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email })
      .addSelect('user.passwordHash')
      .addSelect('user.currentHashedRefreshToken')
      .getOne();
  }
  
  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(userId);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async softDelete(userId: string): Promise<void> {
    const user = await this.findOneById(userId);
    user.userStatus = UserStatus.DELETED;
    await this.userRepository.save(user);
    await this.userRepository.softDelete(userId);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    await this.userRepository.update(userId, {
      currentHashedRefreshToken: refreshToken,
    });
  }

  async removeRefreshToken(userId: string) {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
