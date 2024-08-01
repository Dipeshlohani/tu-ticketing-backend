import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.schema';
import { UserInput } from './dto/create.user.dto';
import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { validationPipeOptions } from 'src/common/validation-exception.factory';
import { Public } from 'src/auth/public.decorator';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Query(returns => User)
  async getUserById(@Args('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Query(returns => [User])
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Mutation(returns => User)
  @UsePipes(new ValidationPipe(validationPipeOptions))
  async createUser(@Args('input') input: UserInput): Promise<User> {
    return this.userService.create(input);
  }

  @Mutation(returns => User)
  async updateUser(@Args('id') id: string, @Args('input') input: UserInput): Promise<User> {
    return this.userService.update(id, input);
  }

  @Mutation(returns => User)
  async deleteUser(@Args('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }

  @Query(() => Counts)
  async getUserCounts() {
    return this.userService.getUserCounts();
  }
}

// Define the Counts type

@ObjectType()
class Counts {
  @Field()
  totalUsers: number;

  @Field()
  staffCount: number;

  @Field()
  directorCount: number;

  @Field()
  adminCount: number;
}
