

// FIX: Use PickType from @nestjs/mapped-types to correctly inherit properties and validators.
import { PickType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user.dto';

export class LoginUserDto extends PickType(RegisterUserDto, [
  'email',
  'password',
] as const) {}
