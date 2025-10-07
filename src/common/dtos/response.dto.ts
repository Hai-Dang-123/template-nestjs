
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({ example: true })
  readonly success: boolean;

  @ApiProperty({ example: HttpStatus.OK })
  readonly statusCode: number;

  @ApiProperty({ example: 'Operation successful' })
  readonly message: string;

  readonly data: T;

  constructor(success: boolean, statusCode: number, message: string, data: T) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static success<T>(
    data: T,
    message = 'Operation successful',
    statusCode = HttpStatus.OK,
  ): ResponseDto<T> {
    return new ResponseDto(true, statusCode, message, data);
  }
}
