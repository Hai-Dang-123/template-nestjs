
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../modules/role/entities/role.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async seed() {
    await this.seedRoles();
    // You can add more seeders here in the future
  }

  private async seedRoles() {
    const rolesToSeed = [
      { name: UserRole.ADMIN, description: 'Administrator with full access' },
      { name: UserRole.USER, description: 'Standard user with limited access' },
    ];

    for (const roleData of rolesToSeed) {
      const roleExists = await this.roleRepository.findOne({ where: { name: roleData.name } });
      if (!roleExists) {
        const newRole = this.roleRepository.create(roleData);
        await this.roleRepository.save(newRole);
        this.logger.log(`Role '${roleData.name}' has been seeded.`);
      }
    }
  }
}
