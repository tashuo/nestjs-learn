import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserTool } from './tools/user';
import { PostTool } from './tools/post';

describe('Feed (e2e)', () => {
    let app: INestApplication;

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

    it('follow && unfollow', async () => {
        const user = await UserTool.getOrCreateUser();
        const token = await UserTool.login(app, user.username);
        const loginUser = { user, token };
        await UserTool.clearFeeds(user);

        const response = await request(app.getHttpServer())
            .get('/feed/list')
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.status).toEqual(200);
        expect(response.body.code).toEqual(200);
        expect(response.body.data).toHaveLength(0);

        const testUser = await UserTool.getOrCreateUser();
        const testToken = await UserTool.login(app, testUser.username);
        const testLoginUser = { user: testUser, token: testToken };
        const post1 = await PostTool.create(app, testLoginUser);
        const post2 = await PostTool.create(app, testLoginUser);
        const post3 = await PostTool.create(app, testLoginUser);
        await UserTool.follow(app, loginUser, testUser);
        const response2 = await request(app.getHttpServer())
            .get('/feed/list')
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response2.status).toEqual(200);
        expect(response2.body.code).toEqual(200);
        expect(response2.body.data).toHaveLength(3);
        expect(response2.body.data[0].id).toBe(post3.id);
        expect(response2.body.data[1].id).toBe(post2.id);
        expect(response2.body.data[2].id).toBe(post1.id);

        await UserTool.unfollow(app, loginUser, testUser);
        const response3 = await request(app.getHttpServer())
            .get('/feed/list')
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response3.body.data).toHaveLength(0);
    });

    it('publish && delete', async () => {
        const user = await UserTool.getOrCreateUser();
        const token = await UserTool.login(app, user.username);
        const loginUser = { user, token };
        await UserTool.clearFeeds(user);

        const testUser = await UserTool.getOrCreateUser();
        const testToken = await UserTool.login(app, testUser.username);
        const testLoginUser = { user: testUser, token: testToken };
        await UserTool.follow(app, loginUser, testUser);
        const response = await request(app.getHttpServer())
            .get('/feed/list')
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.body.data).toHaveLength(0);

        const post1 = await PostTool.create(app, testLoginUser);
        const post2 = await PostTool.create(app, testLoginUser);
        const response2 = await request(app.getHttpServer())
            .get('/feed/list')
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response2.body.data).toHaveLength(2);
        expect(response2.body.data[0].id).toBe(post2.id);
        expect(response2.body.data[1].id).toBe(post1.id);

        await PostTool.delete(app, testLoginUser, post2.id);
        const response3 = await request(app.getHttpServer())
            .get('/feed/list')
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response3.body.data).toHaveLength(1);
        expect(response3.body.data[0].id).toBe(post1.id);
    });
});
