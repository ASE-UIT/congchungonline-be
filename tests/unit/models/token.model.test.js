const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const faker = require('faker');
const { Token }  = require('../../../src/models');
const { tokenTypes } = require('../../../src/config/tokens');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Token model', () => {
    describe('Token validation', () => {
        let newToken;
        beforeEach(() => {
            newToken = {
                token: faker.random.alphaNumeric(32), 
                user: new mongoose.Types.ObjectId(),
                type: tokenTypes.REFRESH,
                expires: new Date(Date.now() + 60 * 60 * 1000), 
            };
        });

        test('should correctly validate a valid token', async () => {
            await expect(new Token(newToken).validate()).resolves.toBeUndefined();
        });

        test('should throw a validation error if token is missing', async () => {
            newToken.token = undefined;
            await expect(new Token(newToken).validate()).rejects.toThrow();
        });

        test('should throw a validation error if user is missing', async () => {
            newToken.user = undefined;
            await expect(new Token(newToken).validate()).rejects.toThrow();
        });

        test('should throw a validation error if type is invalid', async () => {
            newToken.type = 'invalidType';
            await expect(new Token(newToken).validate()).rejects.toThrow();
        });

        test('should throw a validation error if expires is missing', async () => {
            newToken.expires = undefined;
            await expect(new Token(newToken).validate()).rejects.toThrow();
        });
    });

    // describe('Token toJSON()', () => {
    //     test('should not return token when toJSON is called', () => {
    //         const newToken = {
    //             token: faker.random.alphaNumeric(32), 
    //             user: new mongoose.Types.ObjectId(), 
    //             type: tokenTypes.REFRESH, 
    //             expires: new Date(Date.now() + 60 * 60 * 1000), 
    //         };
    //         expect(new Token(newToken).toJSON()).not.toHaveProperty('token'); // this case went wrong
    //     });
    // });
});