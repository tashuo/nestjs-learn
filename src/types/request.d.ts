import 'express';
import { IAuthUser } from './auth';

declare module 'express' {
    interface Request {
        user?: IAuthUser;
    }
}
