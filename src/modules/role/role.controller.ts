
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ResponseDto } from '../../common/dtos/response.dto';
import { Role } from './entities/role.entity';

@ApiTags('Role')
@ApiBearerAuth('access-token')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Get all roles (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of roles retrieved.' })
  async findAll(): Promise<ResponseDto<Role[]>> {
    const roles = await this.roleService.findAll();
    return ResponseDto.success(roles, 'List of roles retrieved.');
  }
}
