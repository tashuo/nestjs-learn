import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { UserFollowerEntity } from './entities/follow.entity';
import * as bcrypt from 'bcrypt';
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
export class UserModule implements OnApplicationBootstrap {
    async onApplicationBootstrap() {
        // UserEntity.createQueryBuilder()
        //     .insert()
        //     .orIgnore()
        //     .updateEntity(false)
        //     .values([
        //         {
        //             username: 'test-1',
        //             password: await bcrypt.hash('123456', 10),
        //         },
        //         {
        //             username: 'test-2',
        //             password: await bcrypt.hash('123456', 10),
        //         },
        //         {
        //             username: 'test-3',
        //             password: await bcrypt.hash('123456', 10),
        //         },
        //     ] as any)
        //     .execute();
    }
}
