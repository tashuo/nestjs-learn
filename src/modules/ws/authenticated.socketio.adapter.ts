import { INestApplicationContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as SocketIO from 'socket.io';

export class AuthenticatedSocketIoAdapter extends IoAdapter {
    private readonly jwtService: JwtService;
    constructor(private app: INestApplicationContext) {
        super(app);
        this.jwtService = this.app.get(JwtService);
    }

    createIOServer(port: number, options?: SocketIO.ServerOptions): any {
        options.allowRequest = async (request, allowFunction) => {
            try {
                console.log('allowRequest valid');
                const token = request.headers.authorization?.replace('Bearer ', '');
                const verified = token && (await this.jwtService.verify(token));
                console.log(verified);
                if (verified) {
                    return allowFunction(null, true);
                }
            } catch (error) {
                console.log('allowRequest error');
                console.log(error);
                return allowFunction('Unauthorized', false);
            }
            return allowFunction('Unauthorized', false);
        };

        return super.createIOServer(port, options);
    }
}
