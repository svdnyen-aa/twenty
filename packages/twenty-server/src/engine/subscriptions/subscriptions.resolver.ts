import { Inject, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Resolver, Subscription } from '@nestjs/graphql';

import { RedisPubSub } from 'graphql-redis-subscriptions';
import { isDefined } from 'twenty-shared/utils';

import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { ON_DB_EVENT_TRIGGER } from 'src/engine/subscriptions/constants/on-db-event-trigger';
import { OnDbEventDTO } from 'src/engine/subscriptions/dtos/on-db-event.dto';
import { OnDbEventInput } from 'src/engine/subscriptions/dtos/on-db-event.input';
import { SubscriptionMatchesDTO } from 'src/engine/subscriptions/dtos/subscription-matches.dto';
import { SubscriptionInput } from 'src/engine/subscriptions/dtos/subscription.input';
import { SubscriptionsService } from 'src/engine/subscriptions/services/subscriptions.service';

@Resolver()
@UseGuards(WorkspaceAuthGuard, UserAuthGuard, NoPermissionGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
export class SubscriptionsResolver {
  constructor(
    @Inject('PUB_SUB') private readonly pubSub: RedisPubSub,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Subscription(() => OnDbEventDTO, {
    filter: (
      payload: { onDbEvent: OnDbEventDTO },
      variables: { input: OnDbEventInput },
    ) => {
      const isActionMatching =
        !isDefined(variables.input.action) ||
        payload.onDbEvent.action === variables.input.action;

      const isObjectNameSingularMatching =
        !isDefined(variables.input.objectNameSingular) ||
        payload.onDbEvent.objectNameSingular ===
          variables.input.objectNameSingular;

      const isRecordIdMatching =
        !isDefined(variables.input.recordId) ||
        payload.onDbEvent.record.id === variables.input.recordId;

      return (
        isActionMatching && isObjectNameSingularMatching && isRecordIdMatching
      );
    },
  })
  onDbEvent(@Args('input') _: OnDbEventInput) {
    return this.pubSub.asyncIterator(ON_DB_EVENT_TRIGGER);
  }

  @Subscription(() => SubscriptionMatchesDTO, {
    nullable: true,
    resolve: async function (
      this: SubscriptionsResolver,
      payload: { onDbEvent: OnDbEventDTO },
      args: { subscriptions: SubscriptionInput[] },
      context: { req: { workspace: { id: string } } },
    ): Promise<SubscriptionMatchesDTO> {
      const workspaceId = context.req.workspace.id;

      const matchedSubscriptionIds = await Promise.all(
        args.subscriptions.map(async (subscription) => {
          const matches =
            await this.subscriptionsService.isSubscriptionMatchingEvent(
              subscription,
              payload.onDbEvent,
              workspaceId,
            );

          return matches ? subscription.id : null;
        }),
      );

      const filteredIds = matchedSubscriptionIds.filter(
        (id): id is string => id !== null,
      );

      if (filteredIds.length === 0) {
        return { subscriptions: [] };
      }

      return {
        subscriptions: filteredIds.map((id) => ({ id })),
      };
    },
  })
  onSubscriptionMatch(
    @Args('subscriptions', { type: () => [SubscriptionInput] })
    _: SubscriptionInput[],
  ) {
    return this.pubSub.asyncIterator(ON_DB_EVENT_TRIGGER);
  }
}
