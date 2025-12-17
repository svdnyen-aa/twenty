import { Inject, Module, type OnModuleDestroy } from '@nestjs/common';

import { RedisPubSub } from 'graphql-redis-subscriptions';

import { RedisClientService } from 'src/engine/core-modules/redis-client/redis-client.service';
import { WorkspaceManyOrAllFlatEntityMapsCacheModule } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module';
import { SubscriptionsService } from 'src/engine/subscriptions/services/subscriptions.service';
import { SubscriptionsResolver } from 'src/engine/subscriptions/subscriptions.resolver';

@Module({
  imports: [WorkspaceManyOrAllFlatEntityMapsCacheModule],
  providers: [
    {
      provide: 'PUB_SUB',
      inject: [RedisClientService],

      useFactory: (redisClientService: RedisClientService) =>
        new RedisPubSub({
          publisher: redisClientService.getClient().duplicate(),
          subscriber: redisClientService.getClient().duplicate(),
        }),
    },
    SubscriptionsResolver,
    SubscriptionsService,
  ],
  exports: ['PUB_SUB', SubscriptionsService],
})
export class SubscriptionsModule implements OnModuleDestroy {
  constructor(@Inject('PUB_SUB') private readonly pubSub: RedisPubSub) {}

  async onModuleDestroy() {
    if (this.pubSub) {
      await this.pubSub.close();
    }
  }
}
