import { INestApplication } from '@nestjs/common';
import { User } from 'test/types';
import * as request from 'supertest';
import { CollectEntity } from 'src/modules/collect/entities/collect.entity';
import { uniqid } from 'src/utils/helper';

export class CollectTool {
    static info = async (app: INestApplication, loginUser: User, collectId: number) => {
        const response = await request(app.getHttpServer())
            .get(`/collect/${collectId}`)
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.body.code).toEqual(200);
        return response.body.data;
    };

    static create = async (
        app: INestApplication,
        loginUser: User,
        title?: string,
    ): Promise<CollectEntity> => {
        const response = await request(app.getHttpServer())
            .post('/collect')
            .send({
                title: title ? title : `test title ${uniqid()}`,
            })
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.status).toEqual(201);
        return response.body.data;
    };

    static delete = async (app: INestApplication, loginUser: User, collectId: number) => {
        const response = await request(app.getHttpServer())
            .delete(`/collect/${collectId}`)
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.body.code).toEqual(200);
    };
}
