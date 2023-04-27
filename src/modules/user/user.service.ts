import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { isNil } from 'lodash';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
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
}
