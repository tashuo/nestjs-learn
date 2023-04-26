import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { clearFollowData, getOrCreateUser } from './helper';
import { UserEntity } from 'src/modules/user/entities/user.entity';

describe('Follow (e2e)', () => {
    let app: INestApplication;

    let TOKEN: string;

    let user: UserEntity;

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

    beforeEach(async () => {
        // console.log('start');
    });

    afterEach(async () => {
        // console.log('end');
    });

    it('登录', async () => {
        user = await getOrCreateUser('', '123456');
        const response = await request(app.getHttpServer())
            .post('/user/login')
            .send({ username: user.username, password: '123456' });
        expect(response.status).toEqual(201);
        TOKEN = response.body.data.access_token;
    });

    it('关注列表', async () => {
        await clearFollowData(user);

        const response = await request(app.getHttpServer())
            .get('/user/followings')
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(response.status).toEqual(200);
        expect(response.body.code).toEqual(200);
        expect(response.body.data).toHaveLength(0);

        const testUser1 = await getOrCreateUser();
        const testUser2 = await getOrCreateUser();
        const testUser3 = await getOrCreateUser();
        const response1 = await request(app.getHttpServer())
            .post('/user/follow')
            .send({ userId: testUser1.id })
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(response1.body.code).toEqual(200);

        const response3 = await request(app.getHttpServer())
            .post('/user/follow')
            .send({ userId: testUser3.id })
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(response3.body.code).toEqual(200);

        const response2 = await request(app.getHttpServer())
            .post('/user/follow')
            .send({ userId: testUser2.id })
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(response2.body.code).toEqual(200);

        const response4 = await request(app.getHttpServer())
            .get('/user/followings')
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(response4.body.code).toEqual(200);
        expect(response4.body.data).toHaveLength(3);
        expect(response4.body.data[0].user_id).toBe(testUser2.id);
        expect(response4.body.data[1].user_id).toBe(testUser3.id);
        expect(response4.body.data[2].user_id).toBe(testUser1.id);

        await request(app.getHttpServer())
            .post('/user/unfollow')
            .send({ userId: testUser2.id })
            .set('Authorization', `Bearer ${TOKEN}`);
        const response5 = await request(app.getHttpServer())
            .get('/user/followings')
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(response5.body.code).toEqual(200);
        expect(response5.body.data).toHaveLength(2);
        expect(response5.body.data[0].user_id).toBe(testUser3.id);
        expect(response5.body.data[1].user_id).toBe(testUser1.id);
    });
});
