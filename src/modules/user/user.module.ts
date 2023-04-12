import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';

@Module({
    providers: [UserService, AuthService],
    controllers: [UserController],
    imports: [TypeOrmModule.forFeature([User])],
    exports: [UserService],
})
export class UserModule {}
