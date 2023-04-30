import { UserEntity } from 'src/modules/user/entities/user.entity';

export interface User {
    user: UserEntity;
    token: string;
}
