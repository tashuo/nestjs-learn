import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Post } from 'src/modules/post/entities/post.entity';
import { getRandomNumber, uniqid } from 'src/utils/tool';

describe('PostController (e2e)', () => {
    let app: INestApplication;

    let TOKEN: string;

    let posts: Array<Post>;

    beforeEach(async () => {
        // todo 自动开启事务
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        // console.log('end');
    });

    it('获取文章列表', async () => {
        const response = await request(app.getHttpServer()).get('/post');
        expect(response.status).toEqual(200);
        expect(response.body.code).toEqual(200);
        posts = response.body.data;
    });

    it('创建文章-未登录', async () => {
        const response = await request(app.getHttpServer())
            .post('/post')
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(response.status).toEqual(401);
    });

    it('登录', async () => {
        const response = await request(app.getHttpServer())
            .post('/user/login')
            .send({ username: 'admin', password: '123456' });
        expect(response.status).toEqual(201);
        TOKEN = response.body.access_token;
    });

    it('创建文章', async () => {
        const post_response = await request(app.getHttpServer())
            .post('/post')
            .send({ title: 'test title 1', content: 'test content 1' })
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(post_response.status).toEqual(201);
        const response = await request(app.getHttpServer()).get('/post');
        expect(response.body.data).toHaveLength(posts.length + 1);
        expect(response.body.data[0].id).toEqual(post_response.body.data.id);
        posts = response.body.data;
    });

    it('删除文章', async () => {
        const delete_post_id = posts[posts.length - 1].id;
        const delete_response = await request(app.getHttpServer())
            .delete(`/post/${delete_post_id}`)
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(delete_response.status).toEqual(200);
        const response = await request(app.getHttpServer()).get('/post');
        expect(response.body.data).toHaveLength(posts.length - 1);
        posts = response.body.data;
    });

    it('创建文章标签', async () => {
        // 同名测试
        const same_tag_name = 'test name ' + uniqid();
        const tag_1_response = await request(app.getHttpServer())
            .post('/tag')
            .send({ name: same_tag_name })
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(tag_1_response.status).toEqual(201);
        const tag_2_response = await request(app.getHttpServer())
            .post('/tag')
            .send({ name: same_tag_name })
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(tag_2_response.status).toEqual(201);
        const tag_3_response = await request(app.getHttpServer())
            .post('/tag')
            .send({ name: 'test name ' + uniqid() + getRandomNumber(1, 10000) })
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(tag_3_response.status).toEqual(201);
        const post_response = await request(app.getHttpServer())
            .post('/post')
            .send({
                title: 'test title',
                content: 'test content',
                tags: [tag_1_response.body.data.id, tag_3_response.body.data.id],
            })
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(post_response.status).toEqual(201);
        expect(post_response.body.data.tags).toHaveLength(2);

        let response = await request(app.getHttpServer()).get('/post');
        expect(response.body.data).toHaveLength(posts.length + 1);
        expect(response.body.data[0].id).toEqual(post_response.body.data.id);
        expect(response.body.data[0].tags).toHaveLength(2);

        // 删除标签
        const delete_response = await request(app.getHttpServer())
            .delete(`/tag/${tag_3_response.body.data.id}`)
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(delete_response.status).toEqual(200);
        response = await request(app.getHttpServer()).get('/post');
        expect(response.body.data[0].tags).toHaveLength(1);
        expect(response.body.data[0].tags[0].id).toEqual(tag_1_response.body.data.id);
    });
});
