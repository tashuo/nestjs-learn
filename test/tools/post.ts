import { INestApplication } from '@nestjs/common';
import { User } from 'test/types';
import * as request from 'supertest';
import { getRandomNumber, uniqid } from 'src/utils/tool';
import { FeedConsumer } from 'src/jobs';
import { FeedService } from 'src/modules/feed/feed.service';
import { PostPublishedEvent } from 'src/modules/post/events/postPublished.event';
import { Job } from 'bull';
import { PostDeletedEvent } from 'src/modules/post/events/postDeleted.event';
import { PostEntity } from 'src/modules/post/entities/post.entity';
import { CommentEntity } from 'src/modules/comment/entities/comment.entity';

export class PostTool {
    static info = async (app: INestApplication, loginUser: User, postId: number) => {
        const response = await request(app.getHttpServer())
            .get(`/post/${postId}`)
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.body.code).toEqual(200);
        return response.body.data;
    };

    static create = async (
        app: INestApplication,
        loginUser: User,
        title?: string,
        content?: string,
    ): Promise<PostEntity> => {
        const response = await request(app.getHttpServer())
            .post('/post')
            .send({
                title: title ? title : `test title ${uniqid()}`,
                content: content ? content : `test content ${uniqid()}`,
            })
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.status).toEqual(201);
        const post = response.body.data;
        // 模拟异步任务
        await new FeedConsumer(app.get(FeedService)).handle({
            id: getRandomNumber(1, 1000),
            data: {
                ...new PostPublishedEvent({
                    postId: post.id,
                    userId: loginUser.user.id,
                    publishTime: Date.now(),
                }),
                jobType: PostPublishedEvent.name,
            },
        } as Job);
        return post;
    };

    static delete = async (app: INestApplication, loginUser: User, postId: number) => {
        const response = await request(app.getHttpServer())
            .delete(`/post/${postId}`)
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.body.code).toEqual(200);
        // 模拟异步任务
        await new FeedConsumer(app.get(FeedService)).handle({
            id: getRandomNumber(1, 1000),
            data: {
                ...new PostDeletedEvent({
                    postId,
                    userId: loginUser.user.id,
                }),
                jobType: PostDeletedEvent.name,
            },
        } as Job);
    };

    static like = async (app: INestApplication, loginUser: User, postId: number) => {
        const response = await request(app.getHttpServer())
            .post('/post/like')
            .send({ post: postId })
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.body.code).toEqual(200);
    };

    static cancelLike = async (app: INestApplication, loginUser: User, postId: number) => {
        const response = await request(app.getHttpServer())
            .post('/post/cancelLike')
            .send({ post: postId })
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.body.code).toEqual(200);
    };

    static collect = async (
        app: INestApplication,
        loginUser: User,
        postId: number,
        collectId: number,
    ) => {
        const response = await request(app.getHttpServer())
            .post('/post/collect')
            .send({ post: postId, collect: collectId })
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.body.code).toEqual(200);
    };

    static cancelCollect = async (
        app: INestApplication,
        loginUser: User,
        postId: number,
        collectId: number,
    ) => {
        const response = await request(app.getHttpServer())
            .post('/post/cancelCollect')
            .send({ post: postId, collect: collectId })
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.body.code).toEqual(200);
    };

    static createComment = async (
        app: INestApplication,
        loginUser: User,
        postId: number,
        parent?: CommentEntity,
    ) => {
        const response = await request(app.getHttpServer())
            .post('/comment')
            .send({
                post: postId,
                content: `test conente ${uniqid()}`,
                parent: parent ? parent.id : null,
            })
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.body.code).toEqual(200);
        return response.body.data;
    };

    static getComments = async (
        app: INestApplication,
        loginUser: User,
        postId: number,
        page = 1,
        limit = 10,
    ) => {
        const response = await request(app.getHttpServer())
            .get('/comment')
            .query({
                post: postId,
                page,
                limit,
            })
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.body.code).toEqual(200);
        return response.body.data;
    };

    static getChildrenComments = async (
        app: INestApplication,
        loginUser: User,
        parent: number,
        page = 1,
        limit = 10,
    ) => {
        const response = await request(app.getHttpServer())
            .get('/comment/children')
            .query({
                parent,
                page,
                limit,
            })
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.body.code).toEqual(200);
        return response.body.data;
    };

    static deleteComment = async (app: INestApplication, loginUser: User, id: number) => {
        const response = await request(app.getHttpServer())
            .delete(`/comment/${id}`)
            .set('Authorization', `Bearer ${loginUser.token}`);
        expect(response.body.code).toEqual(200);
        return response.body.data;
    };
}
