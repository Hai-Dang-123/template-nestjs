
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { ResponseDto } from '../../common/dtos/response.dto';

@ApiTags('User')
@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getProfile(@CurrentUser() user: User): ResponseDto<User> {
    // The user object is attached to the request by the AuthGuard('jwt')
    // We already have the user, no need to fetch it again unless we need more data
    return ResponseDto.success(user, 'User profile retrieved successfully.');
  }
  
  @Put('update')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'User updated successfully.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateCurrentUser(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto<User>> {
    const updatedUser = await this.userService.update(user.userId, updateUserDto);
    return ResponseDto.success(updatedUser, 'User updated successfully.');
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete current user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async softDeleteCurrentUser(@CurrentUser() user: User): Promise<ResponseDto<null>> {
    await this.userService.softDelete(user.userId);
    return ResponseDto.success(null, 'User deleted successfully.');
  }

  // --- Admin-only routes ---

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseDto<User>> {
    const newUser = await this.userService.create(createUserDto);
    return ResponseDto.success(newUser, 'User created successfully.', HttpStatus.CREATED);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Get a list of all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of users retrieved.'})
  async findAll(): Promise<ResponseDto<User[]>> {
    const users = await this.userService.findAll();
    return ResponseDto.success(users, 'List of users retrieved.');
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Get a user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User found.'})
  @ApiResponse({ status: 404, description: 'User not found.'})
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseDto<User>> {
    const user = await this.userService.findOneById(id);
    return ResponseDto.success(user, 'User found.');
  }
}
