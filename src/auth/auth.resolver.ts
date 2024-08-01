import { Resolver, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserInput } from '../user/dto/create.user.dto';
import { User } from 'src/user/user.schema';
import { Public } from './public.decorator';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(returns => User)
  @Public()
  async register(@Args('input') input: UserInput): Promise<User> {
    return this.authService.register(input);
  }

  @Mutation(returns => AccessTokenResponse)
  @Public()
  async login(@Args('email') email: string, @Args('password') password: string) {
    return this.authService.login(email, password);
  }
}

@ObjectType()
class AccessTokenResponse {
  @Field()
  access_token: string;
}
