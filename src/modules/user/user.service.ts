import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { isNil } from 'lodash';
import * as bcrypt from 'bcrypt';
import { FollowService } from './follow.service';
import { LikeService } from '../post/like.service';
import { CollectService } from '../collect/collect.service';

@Injectable()
export class UserService {
    constructor(
        private readonly followService: FollowService,
        private readonly likeService: LikeService,
        private readonly collectService: CollectService,
    ) {}

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

    async detail(userId: number, loginUserId: number | null = null): Promise<UserEntity> {
        const user = await UserEntity.findOneBy({ id: userId });
        if (isNil(user)) {
            throw new Error(`userId(${userId}) not exists`);
        }

        user.interactionInfo = {
            isFollowing:
                !isNil(loginUserId) && (await this.followService.isFollowing(loginUserId, userId)),
            followingCount: await this.followService.getFollowingsCount(userId),
            followerCount: await this.followService.getFollowersCount(userId),
            receivedLikeCount: await this.likeService.getUserReceivedLikeCount(userId),
            receivedCollectCount: await this.collectService.getUserReceivedCollectCount(userId),
        };

        return user;
    }
}
