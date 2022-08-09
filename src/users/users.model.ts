import { Column, DataType, Model, Table } from "sequelize-typescript";

interface UserCreationAttrs {
  email: string,
  password: string,
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {

  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  // email: string;
}