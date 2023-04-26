import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { UserFollowerEntity } from './entities/follow.entity';
import { isNil } from 'lodash';
import * as bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FollowEvent } from './events/follow.event';
import { UnfollowEvent } from './events/unfollow.event';

@Injectable()
export class UserService {
    constructor(protected readonly eventEmitter: EventEmitter2) {}

    async findByName(username: string) {
        return await UserEntity.findBy({ username: username });
    }

    async register(createDto: CreateUserDto): Promise<UserEntity> {
        const user = await UserEntity.findOneBy({ username: createDto.username });
        console.log(createDto.username, user);
        if (user) {
            throw new BadRequestException('username exists!');
        }
        const newUser = new UserEntity();
        newUser.username = createDto.username;
        newUser.password = await bcrypt.hash(createDto.password, 10);
        await newUser.save();
        return newUser;
    }

    async login(loginDto: LoginDto) {
        const user = await UserEntity.findOneBy({
            username: loginDto.username,
        });
        if (!isNil(user) && (await bcrypt.compare(loginDto.password, user.password))) {
            return user;
        }
    }

    async detail(userId: number) {
        return await UserEntity.findOne({
            where: { id: userId },
            relations: ['followers', 'followers_2'],
        });
    }

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
        const followers = await UserFollowerEntity.createQueryBuilder(UserFollowerEntity.name)
            .leftJoinAndSelect(`${UserFollowerEntity.name}.follower`, 'follower')
            .where('userId = :userId', { userId: user.id })
            .select(['follower.id', 'follower.username', 'follower.avatar'])
            .orderBy(`${UserFollowerEntity.name}.id`, 'DESC')
            .offset((page - 1) * limit)
            .limit(10)
            .getRawMany();
        return followers;
    }
}
