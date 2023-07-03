import { Socket } from 'socket.io';

// 用户信息
export interface SocketWithUserData extends Socket {
    user: {
        id: number;
        lastActiveTime: number;
    };
}

export type UserSocket = Map<number, string>;

// 心跳间隔(ms)
export const HEART_BEAT_INTERVAL = 3000;

// 允许掉线次数
export const HEART_BEAT_ALLOWABLE_DROPED_TIMES = 1;
