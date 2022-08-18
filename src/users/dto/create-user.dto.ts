import { IsEmail, Length } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';


@Exclude()
export class CreateUserDto {

  @Expose()
  readonly id: number;

  @Expose()
  @IsEmail({},{message: 'incorrect email'})
  readonly email: string;

  @Expose()
  @Length(4, 20, { message: 'Not less than 4 and not more than 20' })
  readonly password: string;

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }
}