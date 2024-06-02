export class ConnectionMock {
  startSession: jest.MockedFunction<any>;

  constructor() {
    this.startSession = () => {
      return new SessionMock;
    }
  }
}

export class SessionMock {
  withTransaction = async (cb) => {
    await cb();
  }

  endSession = jest.fn()
}