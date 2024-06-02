import * as request from 'supertest';
import { TestApp } from '../test-app';

describe('AuthController', () => {
  let app: TestApp;
  let userToken: string = null;
  let adminToken: string = null;

  beforeAll(async () => {
    app = new TestApp();
    await app.create();
    userToken = app.getTestUserToken();
    adminToken = app.getTestAdminUserToken();
  });

  it('POST /user returns 401 unauthorized without token', () => {
    return request(app.getServer())
      .post('/user')
      .send({
        username: "user1"
      })
      .expect(401);
  });

  it('POST /user returns 403 forbidden logged as normal user', () => {
    return request(app.getServer())
      .post('/user')
      .set('Authorization', 'Bearer ' + userToken)
      .send({
        username: "user1"
      })
      .expect(403);
  });

  it('POST /user returns 400 when try to create a new user as admin with invalid parameters', () => {
    return request(app.getServer())
      .post('/user')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({
        username: "user1"
      })
      .expect(400);
  });

  it('POST /user returns 201 when an admin user creates a new user', () => {
    return request(app.getServer())
      .post('/user')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({
        username: 'test',
        email: 'test@email.com',
        password: 'password'
      })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
