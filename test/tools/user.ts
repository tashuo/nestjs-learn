import { INestApplication } from '@nestjs/common';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { UserFollowerEntity } from 'src/modules/user/entities/follow.entity';
import { FeedEntity } from 'src/modules/feed/entities/feed.entity';
import { getRandomNumber, uniqid } from 'src/utils/tool';
import { FeedConsumer } from 'src/jobs';
import { FollowEvent } from 'src/modules/user/events/follow.event';
import { User } from 'test/types';
import { Job } from 'bull';
import { FeedService } from 'src/modules/feed/feed.service';
import { UnfollowEvent } from 'src/modules/user/events/unfollow.event';

export class UserTool {
    static getOrCreateUser = async (name?: string, password = '123456'): Promise<UserEntity> => {
        const username = name ? name : `test-${uniqid()}`;
        const encryptPassword = await bcrypt.hash(password, 10);
        await UserEntity.createQueryBuilder()
            .insert()
            .orIgnore()
            .updateEntity(false)
            .values({ username, password: encryptPassword } as any)
            .execute();

        return UserEntity.findOneBy({ username });
    };

    static login = async (
        app: INestApplication,
        username: string,
        password = '123456',
    ): Promise<string> => {
        const response = await request(app.getHttpServer())
            .post('/user/login')
            .send({ username: username, password });
        expect(response.status).toEqual(201);
        return response.body.data.access_token;
    };

    static follow = async (app: INestApplication, loginUser: User, targetUser: UserEntity) => {
        const response = await request(app.getHttpServer())
            .post('/user/follow')
            .send({ userId: targetUser.id })
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.status).toEqual(201);
        // 模拟异步任务
        await new FeedConsumer(app.get(FeedService)).handle({
            id: getRandomNumber(1, 1000),
            data: {
                ...new FollowEvent({ userId: loginUser.user.id, targetUserId: targetUser.id }),
                jobType: FollowEvent.name,
            },
        } as Job);
    };

    static unfollow = async (app: INestApplication, loginUser: User, targetUser: UserEntity) => {
        const response = await request(app.getHttpServer())
            .post('/user/unfollow')
            .send({ userId: targetUser.id })
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.status).toEqual(201);

        // 模拟异步任务
        await new FeedConsumer(app.get(FeedService)).handle({
            id: getRandomNumber(1, 1000),
            data: {
                ...new UnfollowEvent({ userId: loginUser.user.id, targetUserId: targetUser.id }),
                jobType: UnfollowEvent.name,
            },
        } as Job);
    };

    static clearFollowData = async (user: UserEntity) => {
        UserFollowerEntity.createQueryBuilder()
            .delete()
            .where('userId = :userId', { userId: user.id })
            .orWhere('followerId = :followerId', { followerId: user.id })
            .execute();
    };

    static clearFeeds = async (user: UserEntity) => {
        FeedEntity.createQueryBuilder()
            .delete()
            .where('user_id = :user_id', { user_id: user.id })
            .execute();
    };
}
