

import { ApiProperty } from '@nestjs/swagger';
// FIX: Use PickType from @nestjs/mapped-types to correctly inherit properties and validators.
import { PickType } from '@nestjs/mapped-types';
import { RegisterUserDto } from '../../auth/dto/register-user.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class CreateUserDto extends PickType(RegisterUserDto, [
  'email',
  'password',
  'fullName',
  'phoneNumber',
] as const) {
  @ApiProperty({
    enum: UserRole,
    default: UserRole.USER,
    required: false,
    description: 'The role of the user (Admin only can set this)',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
