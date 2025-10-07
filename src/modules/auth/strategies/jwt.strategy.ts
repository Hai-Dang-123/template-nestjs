
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../../common/enums/user-role.enum';

interface JwtPayload {
    userId: string;
    email: string;
    role: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    if (!payload || !payload.userId) {
      throw new UnauthorizedException();
    }
    // We can trust the payload from a valid JWT, but fetching user ensures it hasn't been deleted/banned
    const user = await this.userService.findOneById(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    // The user object (including the role from the database) will be attached to the request object
    return user;
  }
}
