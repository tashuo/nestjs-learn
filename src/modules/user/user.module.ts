import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { jwtConstants } from 'src/constants/jwt';

@Module({
    providers: [UserService, AuthService],
    controllers: [UserController],
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: '1d',
            },
        }),
    ],
    exports: [UserService],
})
export class UserModule {}
