import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';

import { UserRoles } from '../intermediate-tables/user-roles.model';
import { Role } from '../roles/roles.model';
import { Token } from '../auth/auth.model';


interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {

  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  name: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  lastName: string;


  @HasMany(() => Token)
  tokens: Token[];

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
}
