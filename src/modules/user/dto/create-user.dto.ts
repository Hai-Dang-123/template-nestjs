

import { ApiProperty } from '@nestjs/swagger';
import { RegisterUserDto } from '../../auth/dto/register-user.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

// FIX: Changed to extend RegisterUserDto directly. Using PickType to select all properties of the base DTO
// was redundant and causing type inference errors. This approach is cleaner and resolves the errors.
export class CreateUserDto extends RegisterUserDto {
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
