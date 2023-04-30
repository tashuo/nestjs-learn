import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserTool } from './tools/user';
import { PostTool } from './tools/post';
import { CollectTool } from './tools/collect';

describe('EPostEntityController (e2e)', () => {
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

    it('like', async () => {
        const user = await UserTool.getOrCreateUser();
        const token = await UserTool.login(app, user.username);
        const loginUser = { user, token };
        const post = await PostTool.create(app, loginUser);
        expect(post.like_count).toBe(0);

        const user2 = await UserTool.getOrCreateUser();
        const token2 = await UserTool.login(app, user2.username);
        const loginUser2 = { user: user2, token: token2 };
        await PostTool.like(app, loginUser2, post.id);
        const postNew = await PostTool.info(app, loginUser2, post.id);
        expect(postNew.like_count).toBe(1);
        await PostTool.like(app, loginUser2, post.id);
        const postNew2 = await PostTool.info(app, loginUser2, post.id);
        expect(postNew2.like_count).toBe(1);

        await PostTool.cancelLike(app, loginUser2, post.id);
        const postNew3 = await PostTool.info(app, loginUser2, post.id);
        console.log(postNew3.like_count);
        expect(postNew3.like_count).toBe(0);
        await PostTool.cancelLike(app, loginUser2, post.id);
        const postNew4 = await PostTool.info(app, loginUser2, post.id);
        expect(postNew4.like_count).toBe(0);
    });

    it('collect', async () => {
        const user = await UserTool.getOrCreateUser();
        const token = await UserTool.login(app, user.username);
        const loginUser = { user, token };
        const post = await PostTool.create(app, loginUser);
        expect(post.collect_count).toBe(0);

        const user2 = await UserTool.getOrCreateUser();
        const token2 = await UserTool.login(app, user2.username);
        const loginUser2 = { user: user2, token: token2 };
        const collect = await CollectTool.create(app, loginUser2);
        await PostTool.collect(app, loginUser2, post.id, collect.id);
        const postNew = await PostTool.info(app, loginUser2, post.id);
        expect(postNew.collect_count).toBe(1);
        await PostTool.collect(app, loginUser2, post.id, collect.id);
        const postNew2 = await PostTool.info(app, loginUser2, post.id);
        expect(postNew2.collect_count).toBe(1);

        await PostTool.cancelCollect(app, loginUser2, post.id, collect.id);
        const postNew3 = await PostTool.info(app, loginUser2, post.id);
        expect(postNew3.collect_count).toBe(0);
        await PostTool.cancelCollect(app, loginUser2, post.id, collect.id);
        const postNew4 = await PostTool.info(app, loginUser2, post.id);
        expect(postNew4.collect_count).toBe(0);
    });
});
