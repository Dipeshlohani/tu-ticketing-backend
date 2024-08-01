import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role, Status } from '../../enums';

@InputType()
export class UserInput {
  @Field()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @Field()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Field()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Field(() => Role)
  @IsEnum(Role)
  role: Role;
}
