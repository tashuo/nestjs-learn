import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('PostController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('获取文章列表', async () => {
        const response = await request(app.getHttpServer()).get('/post');
        expect(response.status).toEqual(200);
        expect(response.body.code).toEqual(200);
        expect(response.body.data).toHaveLength(14);
    });

    it('创建文章', () => {
        return request(app.getHttpServer())
            .post('/post')
            .expect(401)
            .expect('{"statusCode":401,"message":"Unauthorized"}');
    });
});
