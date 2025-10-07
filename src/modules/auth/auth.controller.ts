
import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ResponseDto } from '../../common/dtos/response.dto';
import { TokenDto } from './dto/token.dto';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request (e.g., email already exists).' })
  async register(@Body() registerUserDto: RegisterUserDto): Promise<ResponseDto<null>> {
    await this.authService.register(registerUserDto);
    return ResponseDto.success(null, 'User registered successfully.', HttpStatus.CREATED);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'Login successful.', type: TokenDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() loginUserDto: LoginUserDto): Promise<ResponseDto<TokenDto>> {
    const tokens = await this.authService.login(loginUserDto);
    return ResponseDto.success(tokens, 'Login successful.');
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth('access-token') // Although it uses a refresh token, Swagger UI uses the same mechanism
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a new access token using a refresh token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully.', type: TokenDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async refreshTokens(@Req() req: Request): Promise<ResponseDto<TokenDto>> {
    const user = req.user;
    const tokens = await this.authService.refreshTokens(user['userId'], user['refreshToken']);
    return ResponseDto.success(tokens, 'Tokens refreshed successfully.');
  }
}
