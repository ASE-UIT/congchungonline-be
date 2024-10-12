const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const faker = require('faker');
const Role = require('../../../src/models/role.model');

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

describe('Role model', () => {
  describe('Role validation', () => {
    let newRole;
    beforeEach(() => {
      newRole = {
        name: faker.name.jobType(),
        permissions: [faker.random.word(), faker.random.word()],
      };
    });

    test('should correctly validate a valid role', async () => {
      await expect(new Role(newRole).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if name is missing', async () => {
      newRole.name = undefined;
      await expect(new Role(newRole).validate()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    // test('should throw a validation error if permissions are missing', async () => {
    //   newRole.permissions = undefined;
    //   await expect(new Role(newRole).validate()).rejects.toThrow(mongoose.Error.ValidationError);
    // });

    // test('should throw a validation error if permissions are not an array', async () => {
    //   newRole.permissions = 'notAnArray';
    //   await expect(new Role(newRole).validate()).rejects.toThrow(mongoose.Error.ValidationError);
    // });
  });

  describe('Role statics', () => {
    let newRole;
    beforeEach(() => {
      newRole = {
        name: faker.name.jobType(),
        permissions: [faker.random.word(), faker.random.word()],
      };
    });

    test('should return false if role name is not taken', async () => {
      await expect(Role.isRoleNameTaken(newRole.name)).resolves.toBe(false);
    });

    test('should return true if role name is already taken', async () => {
      await new Role(newRole).save();
      await expect(Role.isRoleNameTaken(newRole.name)).resolves.toBe(true);
    });

    test('should return false if role name is taken but excluded role id is provided', async () => {
      const role = await new Role(newRole).save();
      await expect(Role.isRoleNameTaken(newRole.name, role._id)).resolves.toBe(false);
    });
  });
});
