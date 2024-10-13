const httpStatus = require('http-status');
const { NotarizationService, NotarizationField } = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');
const notarizationService = require('../../../src/services/notarizationService.service');

jest.mock('../../../src/models');

describe('NotarizationService Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotarizationService', () => {
    it('should create a new notarization service', async () => {
      const notarizationServiceBody = { name: 'Test Service', fieldId: 'test-field-id' };

      NotarizationService.findOne.mockResolvedValue(null);
      NotarizationField.findById.mockResolvedValue(true);
      NotarizationService.create.mockResolvedValue(notarizationServiceBody);

      const result = await notarizationService.createNotarizationService(notarizationServiceBody);

      expect(NotarizationService.findOne).toHaveBeenCalledWith({ name: notarizationServiceBody.name });
      expect(NotarizationField.findById).toHaveBeenCalledWith(notarizationServiceBody.fieldId);
      expect(NotarizationService.create).toHaveBeenCalledWith(notarizationServiceBody);
      expect(result).toEqual(notarizationServiceBody);
    });

    it('should throw an error if notarization service name already exists', async () => {
      const notarizationServiceBody = { name: 'Test Service', fieldId: 'test-field-id' };

      NotarizationService.findOne.mockResolvedValue(notarizationServiceBody);

      await expect(notarizationService.createNotarizationService(notarizationServiceBody)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Notarization service name already exists')
      );
    });

    it('should throw an error if fieldId is invalid', async () => {
      const notarizationServiceBody = { name: 'Test Service', fieldId: 'test-field-id' };

      NotarizationService.findOne.mockResolvedValue(null);
      NotarizationField.findById.mockResolvedValue(null);

      await expect(notarizationService.createNotarizationService(notarizationServiceBody)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Invalid fieldId provided')
      );
    });

    it('should throw an error if creation fails', async () => {
      const notarizationServiceBody = { name: 'Test Service', fieldId: 'test-field-id' };

      NotarizationService.findOne.mockResolvedValue(null);
      NotarizationField.findById.mockResolvedValue(true);
      NotarizationService.create.mockRejectedValue(new Error('Create failed'));

      await expect(notarizationService.createNotarizationService(notarizationServiceBody)).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating notarization service')
      );
    });
  });

  describe('getAllNotarizationServices', () => {
    it('should return all notarization services', async () => {
      const services = [{ name: 'Service1' }, { name: 'Service2' }];

      NotarizationService.find.mockResolvedValue(services);

      const result = await notarizationService.getAllNotarizationServices();

      expect(NotarizationService.find).toHaveBeenCalled();
      expect(result).toEqual(services);
    });

    it('should throw an error if no notarization services found', async () => {
      NotarizationService.find.mockResolvedValue([]);

      await expect(notarizationService.getAllNotarizationServices()).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'No notarization services found')
      );
    });

    it('should throw an error if fetching fails', async () => {
      NotarizationService.find.mockRejectedValue(new Error('Fetch failed'));

      await expect(notarizationService.getAllNotarizationServices()).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching notarization services')
      );
    });
  });

  describe('getNotarizationServiceById', () => {
    it('should return notarization service by ID', async () => {
      const serviceId = 'test-id';
      const service = { _id: serviceId, name: 'Test Service' };

      NotarizationService.findById.mockResolvedValue(service);

      const result = await notarizationService.getNotarizationServiceById(serviceId);

      expect(NotarizationService.findById).toHaveBeenCalledWith(serviceId);
      expect(result).toEqual(service);
    });

    it('should throw an error if notarization service not found', async () => {
      const serviceId = 'test-id';

      NotarizationService.findById.mockResolvedValue(null);

      await expect(notarizationService.getNotarizationServiceById(serviceId)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Notarization service not found')
      );
    });

    it('should throw an error if fetching fails', async () => {
      const serviceId = 'test-id';

      NotarizationService.findById.mockRejectedValue(new Error('Fetch failed'));

      await expect(notarizationService.getNotarizationServiceById(serviceId)).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching notarization service')
      );
    });
  });

  describe('updateNotarizationServiceById', () => {
    it('should update notarization service by ID', async () => {
      const serviceId = 'test-id';
      const updateBody = { name: 'Updated Service', fieldId: 'updated-field-id' };
      const service = { _id: serviceId, name: 'Test Service', save: jest.fn().mockResolvedValue() };

      notarizationService.getNotarizationServiceById = jest.fn().mockResolvedValue(service);
      NotarizationService.findOne.mockResolvedValue(null);
      NotarizationField.findById.mockResolvedValue(true);

      const result = await notarizationService.updateNotarizationServiceById(serviceId, updateBody);

      expect(notarizationService.getNotarizationServiceById).toHaveBeenCalledWith(serviceId);
      expect(NotarizationService.findOne).toHaveBeenCalledWith({ name: updateBody.name, _id: { $ne: serviceId } });
      expect(NotarizationField.findById).toHaveBeenCalledWith(updateBody.fieldId);
      expect(service.save).toHaveBeenCalled();
      expect(result.name).toBe(updateBody.name);
    });

    it('should throw an error if notarization service not found', async () => {
      const serviceId = 'test-id';
      const updateBody = { name: 'Updated Service' };

      notarizationService.getNotarizationServiceById = jest.fn().mockResolvedValue(null);

      await expect(notarizationService.updateNotarizationServiceById(serviceId, updateBody)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Notarization service not found')
      );
    });

    it('should throw an error if service name already taken', async () => {
      const serviceId = 'test-id';
      const updateBody = { name: 'Updated Service' };
      const service = { _id: serviceId, name: 'Test Service', save: jest.fn().mockResolvedValue() };

      notarizationService.getNotarizationServiceById = jest.fn().mockResolvedValue(service);
      NotarizationService.findOne.mockResolvedValue({ name: 'Updated Service' });

      await expect(notarizationService.updateNotarizationServiceById(serviceId, updateBody)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Service name already taken')
      );
    });

    it('should throw an error if fieldId is invalid', async () => {
      const serviceId = 'test-id';
      const updateBody = { name: 'Updated Service', fieldId: 'invalid-field-id' };
      const service = { _id: serviceId, name: 'Test Service', save: jest.fn().mockResolvedValue() };

      notarizationService.getNotarizationServiceById = jest.fn().mockResolvedValue(service);
      NotarizationService.findOne.mockResolvedValue(null);
      NotarizationField.findById.mockResolvedValue(null);

      await expect(notarizationService.updateNotarizationServiceById(serviceId, updateBody)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Invalid fieldId provided')
      );
    });

    it('should throw an error if update fails', async () => {
      const serviceId = 'test-id';
      const updateBody = { name: 'Updated Service' };
      const service = { _id: serviceId, name: 'Test Service', save: jest.fn().mockRejectedValue(new Error('Save failed')) };

      notarizationService.getNotarizationServiceById = jest.fn().mockResolvedValue(service);
      NotarizationService.findOne.mockResolvedValue(null);

      await expect(notarizationService.updateNotarizationServiceById(serviceId, updateBody)).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating notarization service')
      );
    });
  });

  describe('deleteNotarizationServiceById', () => {
    it('should delete notarization service by ID', async () => {
      const serviceId = 'test-id';
      const service = { _id: serviceId, name: 'Test Service', remove: jest.fn().mockResolvedValue() };

      notarizationService.getNotarizationServiceById = jest.fn().mockResolvedValue(service);

      const result = await notarizationService.deleteNotarizationServiceById(serviceId);

      expect(notarizationService.getNotarizationServiceById).toHaveBeenCalledWith(serviceId);
      expect(service.remove).toHaveBeenCalled();
      expect(result).toEqual(service);
    });

    it('should throw an error if notarization service not found', async () => {
      const serviceId = 'test-id';

      notarizationService.getNotarizationServiceById = jest.fn().mockResolvedValue(null);

      await expect(notarizationService.deleteNotarizationServiceById(serviceId)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Notarization service not found')
      );
    });

    it('should throw an error if deletion fails', async () => {
      const serviceId = 'test-id';
      const service = {
        _id: serviceId,
        name: 'Test Service',
        remove: jest.fn().mockRejectedValue(new Error('Remove failed')),
      };

      notarizationService.getNotarizationServiceById = jest.fn().mockResolvedValue(service);

      await expect(notarizationService.deleteNotarizationServiceById(serviceId)).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting notarization service')
      );
    });
  });
});
