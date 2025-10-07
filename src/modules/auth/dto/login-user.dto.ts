

// FIX: Use PickType from @nestjs/swagger to ensure properties and validators are correctly inherited for both validation and API documentation.
// Using PickType from @nestjs/mapped-types was causing type inference issues.
import { PickType } from '@nestjs/swagger';
import { RegisterUserDto } from './register-user.dto';

export class LoginUserDto extends PickType(RegisterUserDto, [
  'email',
  'password',
]) {}
