
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        example: 'Johnathan Doe',
        description: 'User full name',
        required: false,
      })
      @IsString()
      @IsOptional()
      @MinLength(2)
      @MaxLength(50)
      fullName?: string;
    
      @ApiProperty({
        example: '1234567890',
        description: 'User phone number',
        required: false,
      })
      @IsString()
      @IsOptional()
      phoneNumber?: string;
}
