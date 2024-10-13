const httpStatus = require('http-status');
const roleService = require('../../../src/services/role.service');
const { Role } = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');
const mongoose = require('mongoose');

// Mock các phương thức của Role model
jest.mock('../../../src/models/role.model');

describe('Role Service', () => {
  beforeAll(async () => {
    // Thiết lập các biến môi trường cần thiết
    process.env.MONGODB_URL = 'mongodb://127.0.0.1:27017/node-boilerplate-test';
    process.env.JWT_SECRET = 'thisisasamplesecret';

    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('createRole', () => {
    test('should create a new role if role name is not taken', async () => {
      const roleBody = { name: 'admin' };

      Role.isRoleNameTaken.mockResolvedValue(false);
      Role.create.mockResolvedValue(roleBody);

      const result = await roleService.createRole(roleBody);

      expect(Role.isRoleNameTaken).toHaveBeenCalledWith(roleBody.name);
      expect(Role.create).toHaveBeenCalledWith(roleBody);
      expect(result).toEqual(roleBody);
    });

    test('should throw an error if role name is already taken', async () => {
      const roleBody = { name: 'admin' };

      Role.isRoleNameTaken.mockResolvedValue(true);

      await expect(roleService.createRole(roleBody)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Role name already taken')
      );
    });
  });

  describe('getRoles', () => {
    test('should return all roles', async () => {
      const roles = [{ name: 'admin' }, { name: 'user' }];

      Role.find.mockResolvedValue(roles);

      const result = await roleService.getRoles();

      expect(Role.find).toHaveBeenCalled();
      expect(result).toEqual(roles);
    });
  });

  describe('getRole', () => {
    test('should return the role if it exists', async () => {
      const roleId = new mongoose.Types.ObjectId();
      const role = { id: roleId, name: 'admin' };

      Role.findById.mockResolvedValue(role);

      const result = await roleService.getRole(roleId);

      expect(Role.findById).toHaveBeenCalledWith(roleId);
      expect(result).toEqual(role);
    });

    test('should throw an error if role does not exist', async () => {
      const roleId = new mongoose.Types.ObjectId();

      Role.findById.mockResolvedValue(null);

      await expect(roleService.getRole(roleId)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Role not found')
      );
    });
  });

  describe('updateRole', () => {
    test('should update the role if it exists', async () => {
      const roleId = new mongoose.Types.ObjectId();
      const updateBody = { name: 'superadmin' };
      const updatedRole = { id: roleId, name: 'superadmin' };

      Role.findByIdAndUpdate.mockResolvedValue(updatedRole);

      const result = await roleService.updateRole(roleId, updateBody);

      expect(Role.findByIdAndUpdate).toHaveBeenCalledWith(roleId, updateBody, { new: true });
      expect(result).toEqual(updatedRole);
    });

    test('should throw an error if role does not exist', async () => {
      const roleId = new mongoose.Types.ObjectId();
      const updateBody = { name: 'superadmin' };

      Role.findByIdAndUpdate.mockResolvedValue(null);

      await expect(roleService.updateRole(roleId, updateBody)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Role not found')
      );
    });
  });

  describe('deleteRole', () => {
    test('should delete the role if it exists', async () => {
      const roleId = new mongoose.Types.ObjectId();
      const role = { id: roleId, name: 'admin' };

      Role.findByIdAndDelete.mockResolvedValue(role);

      await roleService.deleteRole(roleId);

      expect(Role.findByIdAndDelete).toHaveBeenCalledWith(roleId);
    });

    test('should throw an error if role does not exist', async () => {
      const roleId = new mongoose.Types.ObjectId();

      Role.findByIdAndDelete.mockResolvedValue(null);

      await expect(roleService.deleteRole(roleId)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Role not found')
      );
    });
  });
});