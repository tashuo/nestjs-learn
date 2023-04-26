import { UserEntity } from 'src/modules/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserFollowerEntity } from 'src/modules/user/entities/follow.entity';

export const getOrCreateUser = async (name?: string, password = '123456'): Promise<UserEntity> => {
    const username = name ? name : `test-${Date.now()}`;
    const encryptPassword = await bcrypt.hash(password, 10);
    await UserEntity.createQueryBuilder()
        .insert()
        .orIgnore()
        .updateEntity(false)
        .values({ username, password: encryptPassword } as any)
        .execute();

    return UserEntity.findOneBy({ username });
};

export const clearFollowData = async (user: UserEntity) => {
    UserFollowerEntity.createQueryBuilder()
        .delete()
        .where('userId = :userId', { userId: user.id })
        .orWhere('followerId = :followerId', { followerId: user.id })
        .execute();
};
