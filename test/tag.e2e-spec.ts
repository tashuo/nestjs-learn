import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { EntityManager, QueryRunner, DataSource as DS } from 'typeorm';
import dataSource from 'src/database/typeorm.config';

class A extends EntityManager {
    constructor(connection: DS, queryRunner?: QueryRunner) {
        queryRunner = connection.createQueryRunner();
        super(connection, queryRunner);
    }
}

describe('TagController (e2e)', () => {
    let app: INestApplication;

    let TOKEN: string;

    let queryRunner: QueryRunner;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        const entityManager = moduleFixture.get(EntityManager);
        // queryRunner = entityManager.queryRunner = dataSource.createQueryRunner();
    });

    it('GET /tag', () => {
        return request(app.getHttpServer())
            .get('/tag')
            .expect(404)
            .expect('{"statusCode":404,"message":"Cannot GET /","error":"Not Found"}');
    });
});
