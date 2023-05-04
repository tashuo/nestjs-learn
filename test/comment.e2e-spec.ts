import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { UserTool } from './tools/user';
import { PostTool } from './tools/post';

describe('Comment (e2e)', () => {
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

    it('create && list', async () => {
        const user = await UserTool.getOrCreateUser();
        const token = await UserTool.login(app, user.username);
        const loginUser = { user, token };
        const post = await PostTool.create(app, loginUser);
        const comment1 = await PostTool.createComment(app, loginUser, post.id);
        const comment2 = await PostTool.createComment(app, loginUser, post.id);
        const comment3 = await PostTool.createComment(app, loginUser, post.id, comment1);
        const comment4 = await PostTool.createComment(app, loginUser, post.id, comment1);
        const comment5 = await PostTool.createComment(app, loginUser, post.id, comment3);
        const comment6 = await PostTool.createComment(app, loginUser, post.id, comment1);
        const comment7 = await PostTool.createComment(app, loginUser, post.id, comment1);
        const comment8 = await PostTool.createComment(app, loginUser, post.id, comment1);
        const response = await PostTool.getComments(app, loginUser, post.id);
        const response2 = await PostTool.getChildrenComments(app, loginUser, comment1.id, 1, 4);
        const response3 = await PostTool.getChildrenComments(app, loginUser, comment1.id, 2, 4);
        expect(response).toHaveLength(2);
        expect(response2).toHaveLength(4);
        expect(response3).toHaveLength(3);
        expect(response[0].id).toBe(comment2.id);
        expect(response[1].id).toBe(comment1.id);
        expect(response2[0].id).toBe(comment8.id);
        expect(response2[1].id).toBe(comment7.id);
        expect(response2[2].id).toBe(comment6.id);
        expect(response2[3].id).toBe(comment5.id);
        expect(response3[0].id).toBe(comment4.id);
        expect(response3[1].id).toBe(comment3.id);
        expect(response3[2].id).toBe(comment1.id);
        expect(response3[1].deleted_at).toBeNull();

        const postInfo = await PostTool.info(app, loginUser, post.id);
        expect(postInfo.comment_count).toBe(8);

        await PostTool.deleteComment(app, loginUser, comment3.id);
        const response4 = await PostTool.getChildrenComments(app, loginUser, comment1.id, 2, 4);
        expect(response4).toHaveLength(3);
        // console.log(response4[1].deleted_at);
    });
});
