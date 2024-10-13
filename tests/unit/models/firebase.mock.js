const admin = require('firebase-admin');

const mockFirebase = () => {
  jest.mock('firebase-admin', () => {
    const actualFirebaseAdmin = jest.requireActual('firebase-admin');
    return {
      ...actualFirebaseAdmin,
      initializeApp: jest.fn(),
      credential: {
        cert: jest.fn(),
      },
      database: jest.fn().mockReturnValue({
        ref: jest.fn().mockReturnThis(),
        set: jest.fn().mockResolvedValue(),
        get: jest.fn().mockResolvedValue({ exists: true, val: () => ({}) }),
      }),
      auth: jest.fn().mockReturnValue({
        verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-uid' }),
      }),
      storage: jest.fn().mockReturnValue({
        bucket: jest.fn().mockReturnThis(),
        file: jest.fn().mockReturnThis(),
        save: jest.fn().mockResolvedValue(),
      }),
    };
  });
};

module.exports = mockFirebase;
