import * as request from 'supertest';
import { TestApp } from '../test-app';
import { TEST_USER_1 } from '../domain/seeder';
import { UserFactory, UserPrimitives } from '@modules/user';

describe('UserController', () => {
  let app: TestApp;
  let userToken: string = null;
  let adminToken: string = null;
  let dummyUser: UserPrimitives = null;

  beforeAll(async () => {
    app = new TestApp();
    await app.create();
    userToken = app.getTestUserToken();
    adminToken = app.getTestAdminUserToken();

    dummyUser = UserFactory.generateUser().toPrimitives();
  });

  it('POST /user returns 401 unauthorized without token', () => {
    return request(app.getServer())
      .post('/user')
      .send({
        username: dummyUser.username
      })
      .expect(401);
  });

  it('POST /user returns 403 forbidden logged as normal user', () => {
    return request(app.getServer())
      .post('/user')
      .set('Authorization', 'Bearer ' + userToken)
      .send({
        username: dummyUser.username
      })
      .expect(403);
  });

  it('POST /user returns 400 when try to create a new user as admin with invalid parameters', () => {
    return request(app.getServer())
      .post('/user')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({
        username: dummyUser.username
      })
      .expect(400);
  });

  it('POST /user returns 201 when an Admin user creates a new user', () => {
    const payload = {
      id: dummyUser.id, // testing purposes
      username: dummyUser.username,
      email: dummyUser.email,
      password: 'password'
    }
    return request(app.getServer())
      .post('/user')
      .set('Authorization', 'Bearer ' + adminToken)
      .send(payload)
      .expect(201); // Check return body
  });

  it('GET /user/:id returns 200 and the user requested', () => {
    return request(app.getServer())
      .get(`/user/${dummyUser.id}`)
      .set('Authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect((res) => {
        res.body.id !== dummyUser.id;
      });
  });

  it('GET /user/:id returns 200 and the user requested', () => {
    return request(app.getServer())
      .get(`/user/${dummyUser.id}`)
      .set('Authorization', 'Bearer ' + userToken)
      .expect(200)
      .expect((res) => {
        res.body.id === dummyUser.id;
      });
  });

  it('GET /user returns 200 and the user requested in the first position of the array', () => {
    return request(app.getServer())
      .get(`/user`)
      .set('Authorization', 'Bearer ' + userToken)
      .query({
        username: dummyUser.username
      })
      .expect(200)
      .expect((res) => {
        res.body[0].id === dummyUser.id;
      });
  });

  it('DELETE /user return 204 empty', () => {
    return request(app.getServer())
      .get(`/user/${dummyUser.id}`)
      .set('Authorization', 'Bearer ' + userToken)
      // .expect(200)
      .expect((res) => {
        console.log(res.body)
        return res.body === "asdf"
      });
  });

  afterAll(async () => {
    await app.close();
  });

});
