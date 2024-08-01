import { BadRequestException, MiddlewareConsumer, Module, NestModule, UnauthorizedException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { ApolloError } from 'apollo-server-express';
import { GraphQLError } from 'graphql';
import { verify, JwtPayload } from 'jsonwebtoken';
import { UserService } from './user/user.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/ticketing-app'),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      // formatError: (error: GraphQLError) => {
      //   const originalError = error.extensions?.exception;
      //   if (originalError instanceof BadRequestException) {
      //     const response = originalError.getResponse();
      //     const formattedResponse =
      //       typeof response === 'string' ? { message: response } : response;
      //     return new ApolloError('Validation failed', 'BAD_REQUEST', {
      //       validationErrors: formattedResponse['errors'],
      //     } as Record<string, any>);
      //   } else if (originalError instanceof UnauthorizedException) {
      //     return new ApolloError('Unauthorized', 'UNAUTHORIZED', {
      //       message: 'JWT token has expired',
      //     });
      //   }
      //   return error;
      // },
      context: ({ req, res }) => ({ req, res }),
    }),
    BookingModule,
    CategoryModule,
    SubcategoryModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private readonly userService: UserService) { }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(async (req, res, next) => {
        const authHeader = req.headers.authorization || '';
        console.log('Received authorization header:', authHeader); // Log received authorization header
        let user = null;

        if (authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7, authHeader.length); // Remove 'Bearer ' prefix
          console.log('Extracted token:', token); // Log extracted token

          try {
            const decoded = verify(token, process.env.JWT_SECRET) as JwtPayload;
            console.log('Decoded token:', decoded); // Log decoded token
            if (decoded && typeof decoded !== 'string' && 'sub' in decoded) {
              user = await this.userService.findById(decoded.sub);
              console.log('Found user:', user); // Log found user
            }
          } catch (err) {
            console.error('Error verifying token', err);
          }
        }

        req.user = user;
        next();
      })
      .forRoutes('*');
  }
}
