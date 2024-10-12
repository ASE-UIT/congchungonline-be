const httpStatus = require('http-status');
const { Role } = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');
const roleService = require('../../../src/services/role.service');

jest.mock('../../../src/models');

describe('Role Service', () => {
  describe('createRole', () => {
    test('should throw an error if role name is already taken', async () => {
      Role.isRoleNameTaken.mockResolvedValue(true);

      await expect(roleService.createRole({ name: 'admin' })).rejects.toThrow('Role name already taken');
    });

    test('should create a new role if role name is not taken', async () => {
      Role.isRoleNameTaken.mockResolvedValue(false);
      Role.create.mockResolvedValue({ id: '1', name: 'admin' });

      const result = await roleService.createRole({ name: 'admin' });

      expect(Role.isRoleNameTaken).toHaveBeenCalledWith('admin');
      expect(Role.create).toHaveBeenCalledWith({ name: 'admin' });
      expect(result).toEqual({ id: '1', name: 'admin' });
    });
  });

  describe('getRoles', () => {
    test('should return all roles', async () => {
      const roles = [
        { id: '1', name: 'admin' },
        { id: '2', name: 'user' },
      ];
      Role.find.mockResolvedValue(roles);

      const result = await roleService.getRoles();

      expect(Role.find).toHaveBeenCalled();
      expect(result).toEqual(roles);
    });
  });

  describe('getRole', () => {
    test('should throw an error if role is not found', async () => {
      Role.findById.mockResolvedValue(null);

      await expect(roleService.getRole('1')).rejects.toThrow('Role not found');
    });

    test('should return the role if found', async () => {
      const role = { id: '1', name: 'admin' };
      Role.findById.mockResolvedValue(role);

      const result = await roleService.getRole('1');

      expect(Role.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(role);
    });
  });

  describe('updateRole', () => {
    test('should throw an error if role is not found', async () => {
      Role.findByIdAndUpdate.mockResolvedValue(null);

      await expect(roleService.updateRole('1', { name: 'admin' })).rejects.toThrow('Role not found');
    });

    test('should update the role if found', async () => {
      const role = { id: '1', name: 'admin' };
      Role.findByIdAndUpdate.mockResolvedValue(role);

      const result = await roleService.updateRole('1', { name: 'admin' });

      expect(Role.findByIdAndUpdate).toHaveBeenCalledWith('1', { name: 'admin' }, { new: true });
      expect(result).toEqual(role);
    });
  });

  describe('deleteRole', () => {
    test('should throw an error if role is not found', async () => {
      Role.findByIdAndDelete.mockResolvedValue(null);

      await expect(roleService.deleteRole('1')).rejects.toThrow('Role not found');
    });

    test('should delete the role if found', async () => {
      const role = { id: '1', name: 'admin' };
      Role.findByIdAndDelete.mockResolvedValue(role);

      await roleService.deleteRole('1');

      expect(Role.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});
