
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Role } from '../../modules/role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
