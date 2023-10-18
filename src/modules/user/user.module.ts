import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { UserFollowerEntity } from './entities/follow.entity';
import { FollowService } from './follow.service';
import { UserCommand } from './user.command';
import { TestCommand } from './test.command';
import { LikeService } from '../post/like.service';
import { CollectService } from '../collect/collect.service';

@Module({
    providers: [
        UserService,
        AuthService,
        FollowService,
        UserCommand,
        TestCommand,
        LikeService,
        CollectService,
    ],
    controllers: [UserController],
    imports: [TypeOrmModule.forFeature([UserEntity, UserFollowerEntity])],
    exports: [UserService, FollowService],
})
export class UserModule {}
