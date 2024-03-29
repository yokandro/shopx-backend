import { join } from 'path';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';

import { isDevelopment } from 'src/api-modules/common/helpers/common.helpers';

import ApiModules from './api-modules';
import UtilityModules from './utility-modules';
import { ObjectIdScalar } from './app.graphql-scalar';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    GraphQLModule.forRoot({
      // eslint-disable-next-line prettier/prettier
      context: context =>
        context?.extra?.request
          ? {
              req: {
                ...context?.extra?.request,
                headers: {
                  ...context?.extra?.request?.headers,
                  ...context?.connectionParams,
                },
              },
            }
          : { req: context?.req },

      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      driver: ApolloDriver,
      sortSchema: true,
      playground: isDevelopment()
        ? { subscriptionEndpoint: 'ws://localhost:3000/graphql/subscriptions' }
        : true,
      debug: false,
      cors: { origin: '*', credentials: true },
    }),
    ...UtilityModules,
    ...ApiModules,
  ],
  providers: [ObjectIdScalar],
})
export class AppModule {}
