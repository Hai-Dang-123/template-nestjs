
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { User } from '../modules/user/entities/user.entity';
import { Role } from '../modules/role/entities/role.entity';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Role],
  synchronize: false, // Never use TRUE in production! Use migrations instead.
  logging: process.env.DB_LOGGING === 'true',
  options: {
    encrypt: false, // Use true for Azure SQL Database, or if you have SSL configured
  },
};
