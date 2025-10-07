
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../../common/enums/user-role.enum';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column({
    type: 'nvarchar',
    enum: UserRole,
    unique: true,
  })
  name: UserRole;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
