/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const {
  createNotarizationField,
  getNotarizationField,
  getAllNotarizationFields,
  updateNotarizationField,
  deleteNotarizationField,
} = require('../../../src/controllers/notarizationField.controller');
const { notarizationFieldService } = require('../../../src/services/notarizationField.service');

jest.mock('../services/notarizationField.service');

describe('Notarization Field Controller', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createNotarizationField', () => {
    test('should create a notarization field and send response', async () => {
      const req = httpMocks.createRequest({
        body: { name: 'Field Name', description: 'Field Description' },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockField = { id: 'fieldId123', name: 'Field Name', description: 'Field Description' };
      notarizationFieldService.createNotarizationField.mockResolvedValue(mockField);

      await createNotarizationField(req, res);

      expect(notarizationFieldService.createNotarizationField).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith(mockField);
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        body: { name: 'Field Name', description: 'Field Description' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationFieldService.createNotarizationField.mockRejectedValue(new Error('Service error'));

      await createNotarizationField(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getNotarizationField', () => {
    test('should get notarization field by id and send response', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'fieldId123' },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockField = { id: 'fieldId123', name: 'Field Name', description: 'Field Description' };
      notarizationFieldService.getNotarizationFieldById.mockResolvedValue(mockField);

      await getNotarizationField(req, res);

      expect(notarizationFieldService.getNotarizationFieldById).toHaveBeenCalledWith('fieldId123');
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockField);
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'fieldId123' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationFieldService.getNotarizationFieldById.mockRejectedValue(new Error('Service error'));

      await getNotarizationField(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getAllNotarizationFields', () => {
    test('should get all notarization fields and send response', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockFields = [
        { id: 'fieldId1', name: 'Field 1', description: 'Description 1' },
        { id: 'fieldId2', name: 'Field 2', description: 'Description 2' },
      ];
      notarizationFieldService.getAllNotarizationFields.mockResolvedValue(mockFields);

      await getAllNotarizationFields(req, res);

      expect(notarizationFieldService.getAllNotarizationFields).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockFields);
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationFieldService.getAllNotarizationFields.mockRejectedValue(new Error('Service error'));

      await getAllNotarizationFields(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateNotarizationField', () => {
    test('should update notarization field and send response', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'fieldId123' },
        body: { name: 'Updated Field Name', description: 'Updated Description' },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockField = { id: 'fieldId123', name: 'Updated Field Name', description: 'Updated Description' };
      notarizationFieldService.updateNotarizationFieldById.mockResolvedValue(mockField);

      await updateNotarizationField(req, res);

      expect(notarizationFieldService.updateNotarizationFieldById).toHaveBeenCalledWith('fieldId123', req.body);
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockField);
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'fieldId123' },
        body: { name: 'Updated Field Name', description: 'Updated Description' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationFieldService.updateNotarizationFieldById.mockRejectedValue(new Error('Service error'));

      await updateNotarizationField(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteNotarizationField', () => {
    test('should delete notarization field and send response', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'fieldId123' },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.json = jest.fn();

      notarizationFieldService.deleteNotarizationFieldById.mockResolvedValue();

      await deleteNotarizationField(req, res);

      expect(notarizationFieldService.deleteNotarizationFieldById).toHaveBeenCalledWith('fieldId123');
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ message: 'Notarization field deleted successfully' });
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'fieldId123' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationFieldService.deleteNotarizationFieldById.mockRejectedValue(new Error('Service error'));

      await deleteNotarizationField(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
