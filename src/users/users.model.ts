import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';

import { UserRoles } from '../intermediate-tables/user-roles.model';
import { Role } from '../roles/roles.model';


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

  @Column({ type: DataType.STRING, defaultValue: null })
  name: string;

  @Column({ type: DataType.STRING,  defaultValue: null })
  lastName: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
}
