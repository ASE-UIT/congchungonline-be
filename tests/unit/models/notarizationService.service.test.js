const { NotarizationService, NotarizationField } = require('../../../src/models');
const notarizationService = require('../../../src/services/notarizationService.service');
const ApiError = require('../../../src/utils/ApiError');
const httpStatus = require('http-status');

// Mock các model bằng cách sử dụng factory argument để tránh mock Map class
jest.mock('../../../src/models', () => {
  const actualModels = jest.requireActual('../../../src/models');
  return {
    NotarizationService: {
      ...actualModels.NotarizationService,
      findById: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
    },
    NotarizationField: {
      ...actualModels.NotarizationField,
      findById: jest.fn(),
    },
  };
});

describe('Notarization Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotarizationService', () => {
    it('should throw an error if notarization service name already exists', async () => {
      const notarizationServiceBody = { name: 'Service Name', fieldId: 'fieldId' };

      NotarizationService.findOne.mockResolvedValue(true);

      await expect(notarizationService.createNotarizationService(notarizationServiceBody)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Notarization service name already exists')
      );
    });

    it('should throw an error if fieldId is invalid', async () => {
      const notarizationServiceBody = { name: 'Service Name', fieldId: 'invalidFieldId' };

      NotarizationService.findOne.mockResolvedValue(null);
      NotarizationField.findById.mockResolvedValue(null);

      await expect(notarizationService.createNotarizationService(notarizationServiceBody)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Invalid fieldId provided')
      );
    });

    it('should create a new notarization service successfully', async () => {
      const notarizationServiceBody = { name: 'Service Name', fieldId: 'fieldId', description: 'Description', price: 100 };

      NotarizationService.findOne.mockResolvedValue(null);
      NotarizationField.findById.mockResolvedValue(true);
      NotarizationService.create.mockResolvedValue({ id: 'serviceId', ...notarizationServiceBody });

      const result = await notarizationService.createNotarizationService(notarizationServiceBody);

      expect(result).toHaveProperty('id', 'serviceId');
      expect(NotarizationService.create).toHaveBeenCalledWith(notarizationServiceBody);
    });
  });

  describe('getAllNotarizationServices', () => {
    it('should return all notarization services', async () => {
      const services = [
        { id: 'serviceId', name: 'Service Name', fieldId: 'fieldId', description: 'Description', price: 100 },
      ];

      NotarizationService.find.mockResolvedValue(services);

      const result = await notarizationService.getAllNotarizationServices();

      expect(result).toEqual(services);
      expect(NotarizationService.find).toHaveBeenCalled();
    });

    it('should throw an error if no services are found', async () => {
      NotarizationService.find.mockResolvedValue([]);

      await expect(notarizationService.getAllNotarizationServices()).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'No notarization services found')
      );
    });
  });

  describe('getNotarizationServiceById', () => {
    it('should return a notarization service by ID', async () => {
      const service = { id: 'serviceId', name: 'Service Name', fieldId: 'fieldId', description: 'Description', price: 100 };

      NotarizationService.findById.mockResolvedValue(service);

      const result = await notarizationService.getNotarizationServiceById('serviceId');

      expect(result).toEqual(service);
      expect(NotarizationService.findById).toHaveBeenCalledWith('serviceId');
    });

    it('should throw an error if service is not found', async () => {
      NotarizationService.findById.mockResolvedValue(null);

      await expect(notarizationService.getNotarizationServiceById('serviceId')).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Notarization service not found')
      );
    });
  });

  describe('updateNotarizationServiceById', () => {
    it('should throw an error if service is not found', async () => {
      const updateBody = { name: 'Updated Service Name' };

      NotarizationService.findById.mockResolvedValue(null);

      await expect(notarizationService.updateNotarizationServiceById('serviceId', updateBody)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Notarization service not found')
      );
    });

    it('should throw an error if service name is already taken', async () => {
      const updateBody = { name: 'Updated Service Name' };
      const service = { id: 'serviceId', name: 'Service Name', fieldId: 'fieldId', description: 'Description', price: 100 };

      NotarizationService.findById.mockResolvedValue(service);
      NotarizationService.findOne.mockResolvedValue(true);

      await expect(notarizationService.updateNotarizationServiceById('serviceId', updateBody)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Service name already taken')
      );
    });

    it('should update and return the notarization service if data is valid', async () => {
      const updateBody = { name: 'Updated Service Name' };
      const service = {
        id: 'serviceId',
        name: 'Service Name',
        fieldId: 'fieldId',
        description: 'Description',
        price: 100,
        save: jest.fn().mockResolvedValue(true),
      };

      NotarizationService.findById.mockResolvedValue(service);
      NotarizationService.findOne.mockResolvedValue(null);

      const result = await notarizationService.updateNotarizationServiceById('serviceId', updateBody);

      expect(result).toEqual(service);
      expect(service.save).toHaveBeenCalled();
    });
  });

  describe('deleteNotarizationServiceById', () => {
    it('should throw an error if service is not found', async () => {
      NotarizationService.findById.mockResolvedValue(null);

      await expect(notarizationService.deleteNotarizationServiceById('serviceId')).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Notarization service not found')
      );
    });

    it('should delete and return the notarization service if found', async () => {
      const service = {
        id: 'serviceId',
        name: 'Service Name',
        fieldId: 'fieldId',
        description: 'Description',
        price: 100,
        remove: jest.fn().mockResolvedValue(true),
      };

      NotarizationService.findById.mockResolvedValue(service);

      const result = await notarizationService.deleteNotarizationServiceById('serviceId');

      expect(result).toEqual(service);
      expect(service.remove).toHaveBeenCalled();
    });
  });

  describe('getNotarizationServicesByFieldId', () => {
    it('should throw an error if fieldId is invalid', async () => {
      NotarizationField.findById.mockResolvedValue(null);

      await expect(notarizationService.getNotarizationServicesByFieldId('invalidFieldId')).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Invalid fieldId provided')
      );
    });

    it('should return notarization services by fieldId', async () => {
      const services = [
        { id: 'serviceId', name: 'Service Name', fieldId: 'fieldId', description: 'Description', price: 100 },
      ];

      NotarizationField.findById.mockResolvedValue(true);
      NotarizationService.find.mockResolvedValue(services);

      const result = await notarizationService.getNotarizationServicesByFieldId('fieldId');

      expect(result).toEqual(services);
      expect(NotarizationService.find).toHaveBeenCalledWith({ fieldId: 'fieldId' });
    });

    it('should throw an error if no services are found for the given field', async () => {
      NotarizationField.findById.mockResolvedValue(true);
      NotarizationService.find.mockResolvedValue([]);

      await expect(notarizationService.getNotarizationServicesByFieldId('fieldId')).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'No notarization services found for the given field')
      );
    });
  });
});
