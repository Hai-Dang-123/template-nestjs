

import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const existingUser = await this.userService.findOneByEmail(registerUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // FIX: Pass the DTO directly. The user service now handles mapping password to passwordHash.
    // This resolves the error where 'passwordHash' was passed instead of 'password'.
    await this.userService.create(registerUserDto);
  }

  async login(loginUserDto: LoginUserDto): Promise<TokenDto> {
    // FIX: The errors regarding 'email' and 'password' not existing on LoginUserDto
    // are resolved by fixing the LoginUserDto definition to use PickType from '@nestjs/mapped-types'.
    const user = await this.userService.findOneByEmail(loginUserDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(
      loginUserDto.password,
      user.passwordHash,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.userId, user.email);
    await this.updateRefreshTokenHash(user.userId, tokens.refreshToken);
    return tokens;
  }
  
  async refreshTokens(userId: string, refreshToken: string): Promise<TokenDto> {
    const user = await this.userService.findOneById(userId);
    if (!user || !user.currentHashedRefreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(user.userId, user.email);
    await this.updateRefreshTokenHash(user.userId, tokens.refreshToken);
    return tokens;
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.setCurrentRefreshToken(hashedRefreshToken, userId);
  }

  private async getTokens(userId: string, email: string): Promise<TokenDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, email },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        { userId },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
        },
      ),
    ]);

    return new TokenDto(accessToken, refreshToken);
  }
}
