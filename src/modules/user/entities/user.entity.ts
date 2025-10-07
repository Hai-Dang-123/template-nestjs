
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserStatus } from '../../../common/enums/user-status.enum';
import * as bcrypt from 'bcrypt';
import { Role } from '../../role/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ select: false })
  passwordHash: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true }) // eager: true to always load the role
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({
    type: 'nvarchar',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  userStatus: UserStatus;

  @Column({ type: 'nvarchar', nullable: true, select: false })
  currentHashedRefreshToken?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.passwordHash) {
      this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
    }
  }
}
