

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatus } from '../../common/enums/user-status.enum';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // FIX: Map password from DTO to passwordHash on the entity before creation.
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const userToCreate = {
      ...rest,
      passwordHash: password,
    };
    const newUser = this.userRepository.create(userToCreate);
    // Password hashing is handled by the @BeforeInsert hook in the entity
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    // This query needs to select the password for login validation
    return this.userRepository
      .createQueryBuilder('user')
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
