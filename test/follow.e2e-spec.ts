import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserTool } from './tools/user';
import { User } from './types';

describe('Follow (e2e)', () => {
    let app: INestApplication;

    let loginUser: User;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('关注列表', async () => {
        const user = await UserTool.getOrCreateUser();
        const token = await UserTool.login(app, user.username);
        loginUser = { user, token };
        await UserTool.clearFollowData(user);

        const response = await request(app.getHttpServer())
            .get('/user/followings')
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.status).toEqual(200);
        expect(response.body.code).toEqual(200);
        expect(response.body.data).toHaveLength(0);

        const testUser1 = await UserTool.getOrCreateUser();
        const testUser2 = await UserTool.getOrCreateUser();
        const testUser3 = await UserTool.getOrCreateUser();
        await UserTool.follow(app, loginUser, testUser1);
        await UserTool.follow(app, loginUser, testUser3);
        await UserTool.follow(app, loginUser, testUser2);

        const response4 = await request(app.getHttpServer())
            .get('/user/followings')
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response4.body.code).toEqual(200);
        expect(response4.body.data).toHaveLength(3);
        expect(response4.body.data[0].user_id).toBe(testUser2.id);
        expect(response4.body.data[1].user_id).toBe(testUser3.id);
        expect(response4.body.data[2].user_id).toBe(testUser1.id);

        await UserTool.unfollow(app, loginUser, testUser2);
        const response5 = await request(app.getHttpServer())
            .get('/user/followings')
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response5.body.code).toEqual(200);
        expect(response5.body.data).toHaveLength(2);
        expect(response5.body.data[0].user_id).toBe(testUser3.id);
        expect(response5.body.data[1].user_id).toBe(testUser1.id);
    });
});
