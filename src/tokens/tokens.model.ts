import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { User } from '../users/users.model';


interface TokenCreationAttrs {
  accessToken: string;
  refreshToken: string;
  userId: number;
  ip: string;
  platform: string;
  lat: string;
  lon: string;
}

@Table({ tableName: 'tokens' })
export class Token extends Model<Token, TokenCreationAttrs> {

  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  refreshToken: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  ip: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  device: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  lat: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  lon: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
