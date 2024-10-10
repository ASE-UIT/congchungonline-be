/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const {
  createNotarizationService,
  getNotarizationService,
  getAllNotarizationServices,
  updateNotarizationService,
  deleteNotarizationService,
} = require('../../../src/controllers/notarizationService.controller');
const { notarizationServiceService } = require('../../../src/services/notarizationService.service');

jest.mock('../services/notarizationService.service');

describe('Notarization Service Controller', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createNotarizationService', () => {
    test('should create a notarization service and send response', async () => {
      const req = httpMocks.createRequest({
        body: { name: 'Service Name', description: 'Service Description', price: 100 },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockService = { id: 'serviceId123', name: 'Service Name', description: 'Service Description', price: 100 };
      notarizationServiceService.createNotarizationService.mockResolvedValue(mockService);

      await createNotarizationService(req, res);

      expect(notarizationServiceService.createNotarizationService).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith(mockService);
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        body: { name: 'Service Name', description: 'Service Description', price: 100 },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationServiceService.createNotarizationService.mockRejectedValue(new Error('Service error'));

      await createNotarizationService(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getNotarizationService', () => {
    test('should get notarization service by id and send response', async () => {
      const req = httpMocks.createRequest({
        params: { serviceId: 'serviceId123' },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockService = { id: 'serviceId123', name: 'Service Name', description: 'Service Description', price: 100 };
      notarizationServiceService.getNotarizationServiceById.mockResolvedValue(mockService);

      await getNotarizationService(req, res);

      expect(notarizationServiceService.getNotarizationServiceById).toHaveBeenCalledWith('serviceId123');
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockService);
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        params: { serviceId: 'serviceId123' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationServiceService.getNotarizationServiceById.mockRejectedValue(new Error('Service error'));

      await getNotarizationService(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getAllNotarizationServices', () => {
    test('should get all notarization services and send response', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockServices = [
        { id: 'serviceId1', name: 'Service 1', description: 'Description 1', price: 100 },
        { id: 'serviceId2', name: 'Service 2', description: 'Description 2', price: 200 },
      ];
      notarizationServiceService.getAllNotarizationServices.mockResolvedValue(mockServices);

      await getAllNotarizationServices(req, res);

      expect(notarizationServiceService.getAllNotarizationServices).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockServices);
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationServiceService.getAllNotarizationServices.mockRejectedValue(new Error('Service error'));

      await getAllNotarizationServices(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateNotarizationService', () => {
    test('should update notarization service and send response', async () => {
      const req = httpMocks.createRequest({
        params: { serviceId: 'serviceId123' },
        body: { name: 'Updated Service Name', description: 'Updated Description', price: 150 },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockService = {
        id: 'serviceId123',
        name: 'Updated Service Name',
        description: 'Updated Description',
        price: 150,
      };
      notarizationServiceService.updateNotarizationServiceById.mockResolvedValue(mockService);

      await updateNotarizationService(req, res);

      expect(notarizationServiceService.updateNotarizationServiceById).toHaveBeenCalledWith('serviceId123', req.body);
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockService);
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        params: { serviceId: 'serviceId123' },
        body: { name: 'Updated Service Name', description: 'Updated Description', price: 150 },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationServiceService.updateNotarizationServiceById.mockRejectedValue(new Error('Service error'));

      await updateNotarizationService(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteNotarizationService', () => {
    test('should delete notarization service and send response', async () => {
      const req = httpMocks.createRequest({
        params: { serviceId: 'serviceId123' },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.json = jest.fn();

      notarizationServiceService.deleteNotarizationServiceById.mockResolvedValue();

      await deleteNotarizationService(req, res);

      expect(notarizationServiceService.deleteNotarizationServiceById).toHaveBeenCalledWith('serviceId123');
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ message: 'Notarization service deleted successfully' });
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        params: { serviceId: 'serviceId123' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationServiceService.deleteNotarizationServiceById.mockRejectedValue(new Error('Service error'));

      await deleteNotarizationService(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
