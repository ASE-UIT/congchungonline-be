const setupTestDB = require('../../utils/setupTestDB');
const mockFirebase = require('./firebase.mock');
mockFirebase();
setupTestDB();
const request = require('supertest');
const express = require('express');
const httpStatus = require('http-status');
const { roleService } = require('../../../src/services');
const roleController = require('../../../src/controllers/role.controller');
const catchAsync = require('../../../src/utils/catchAsync');

jest.mock('../../../src/services/role.service');
jest.mock('../../../src/utils/catchAsync', () => (fn) => (req, res, next) => fn(req, res, next).catch(next));

const app = express();
app.use(express.json());
app.post('/roles', roleController.createRole);
app.get('/roles', roleController.getRoles);
app.get('/roles/:roleId', roleController.getRole);
app.put('/roles/:roleId', roleController.updateRole);
app.delete('/roles/:roleId', roleController.deleteRole);

describe('Role Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /roles', () => {
    it('should create a new role', async () => {
      const roleBody = { name: 'Admin' };
      const role = { id: 'role-id', ...roleBody };

      roleService.createRole.mockResolvedValue(role);

      const res = await request(app).post('/roles').send(roleBody);

      expect(res.status).toBe(httpStatus.CREATED);
      expect(res.body).toEqual(role);
      expect(roleService.createRole).toHaveBeenCalledWith(roleBody);
    });
  });

  describe('GET /roles', () => {
    it('should return a list of roles', async () => {
      const roles = [{ id: 'role-id', name: 'Admin' }];

      roleService.getRoles.mockResolvedValue(roles);

      const res = await request(app).get('/roles').send();

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(roles);
      expect(roleService.getRoles).toHaveBeenCalled();
    });
  });

  describe('GET /roles/:roleId', () => {
    it('should return a role by ID', async () => {
      const roleId = 'role-id';
      const role = { id: roleId, name: 'Admin' };

      roleService.getRole.mockResolvedValue(role);

      const res = await request(app).get(`/roles/${roleId}`).send();

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(role);
      expect(roleService.getRole).toHaveBeenCalledWith(roleId);
    });
  });

  describe('PUT /roles/:roleId', () => {
    it('should update a role by ID', async () => {
      const roleId = 'role-id';
      const updateBody = { name: 'Super Admin' };
      const role = { id: roleId, name: 'Super Admin' };

      roleService.updateRole.mockResolvedValue(role);

      const res = await request(app).put(`/roles/${roleId}`).send(updateBody);

      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toEqual(role);
      expect(roleService.updateRole).toHaveBeenCalledWith(roleId, updateBody);
    });
  });

  describe('DELETE /roles/:roleId', () => {
    it('should delete a role by ID', async () => {
      const roleId = 'role-id';

      roleService.deleteRole.mockResolvedValue();

      const res = await request(app).delete(`/roles/${roleId}`).send();

      expect(res.status).toBe(httpStatus.NO_CONTENT);
      expect(roleService.deleteRole).toHaveBeenCalledWith(roleId);
    });
  });
});
