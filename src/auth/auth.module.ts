import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
    providers: [AuthService, LocalStrategy, JwtStrategy, JwtService],
    imports: [UserModule, PassportModule], // notice: 此处引入LocalStrategy + PassportModule才能使用local strategy
    exports: [AuthService],
})
export class AuthModule {}
