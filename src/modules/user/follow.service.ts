import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserFollowerEntity } from './entities/follow.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FollowEvent } from './events/follow.event';
import { UnfollowEvent } from './events/unfollow.event';

@Injectable()
export class FollowService {
    constructor(protected readonly eventEmitter: EventEmitter2) {}

    async follow(follower: UserEntity, userId: number): Promise<boolean> {
        const user = await UserEntity.findOneBy({ id: userId });
        const result = await UserFollowerEntity.createQueryBuilder()
            .insert()
            .orIgnore()
            .updateEntity(false)
            .values({
                user,
                follower,
                create_time: Date.now() / 1000,
            })
            .execute();
        if (result.raw.affectedRows === 1) {
            this.eventEmitter.emit(
                'user.follow',
                new FollowEvent({
                    userId: follower.id,
                    targetUserId: userId,
                }),
            );
        }

        return result.raw.affectedRows === 1;
    }

    async unfollow(follower: UserEntity, userId: number): Promise<boolean> {
        const result = await UserFollowerEntity.createQueryBuilder()
            .delete()
            .where('followerId = :followerId', { followerId: follower.id })
            .andWhere('userId = :userId', { userId })
            .execute();
        if (result.affected === 1) {
            this.eventEmitter.emit(
                'user.unfollow',
                new UnfollowEvent({
                    userId: follower.id,
                    targetUserId: userId,
                }),
            );
        }

        return result.affected === 1;
    }

    async getFollowings(user: UserEntity, page = 1, limit = 10) {
        const followings = await UserFollowerEntity.createQueryBuilder(UserFollowerEntity.name)
            .leftJoinAndSelect(`${UserFollowerEntity.name}.user`, 'user')
            .where('followerId = :followerId', { followerId: user.id })
            .select(['user.id', 'user.username', 'user.avatar'])
            .orderBy(`${UserFollowerEntity.name}.id`, 'DESC')
            .offset((page - 1) * limit)
            .limit(10)
            .getRawMany();
        return followings;
    }

    async getFollowers(user: UserEntity, page = 1, limit = 10) {
        return await UserFollowerEntity.createQueryBuilder(UserFollowerEntity.name)
            .leftJoinAndSelect(`${UserFollowerEntity.name}.follower`, 'follower')
            .where('userId = :userId', { userId: user.id })
            .select(['follower.id', 'follower.username', 'follower.avatar'])
            .orderBy(`${UserFollowerEntity.name}.id`, 'DESC')
            .offset((page - 1) * limit)
            .limit(10)
            .getRawMany();
    }
}
