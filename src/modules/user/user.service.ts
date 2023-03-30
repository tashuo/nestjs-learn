import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Md5 } from 'ts-md5';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
    async findByName(username: string) {
        return await User.findBy({ username: username });
    }

    async register(createDto: CreateUserDto): Promise<User> {
        const user = await User.findOneBy({ username: createDto.username });
        console.log(createDto.username, user);
        if (user) {
            throw new BadRequestException('username exists!');
        }
        const new_user = new User();
        new_user.username = createDto.username;
        new_user.password = Md5.hashStr(createDto.password);
        await new_user.save();
        return new_user;
    }

    async login(loginDto: LoginDto) {
        return await User.findOneBy({
            username: loginDto.username,
            password: Md5.hashStr(loginDto.password),
        });
    }

    async detail(user_id: number) {
        return await User.findOne({
            where: { id: user_id },
            relations: ['followers'],
        });
    }

    async follow(user: User, user_id: number) {
        console.log(user, user_id);
        return User.createQueryBuilder(User.name)
            .relation(User, 'following')
            .of(user)
            .add([user_id]);
    }
}
