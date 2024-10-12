const { NotarizationField } = require('../../../src/models');
const notarizationFieldService = require('../../../src/services/notarizationField.service');
const ApiError = require('../../../src/utils/ApiError');
const httpStatus = require('http-status');
const setupTestDB = require('../../utils/setupTestDB');

setupTestDB();
jest.mock('../../../src/models', () => {
  const actualModels = jest.requireActual('../../../src/models');
  return {
    NotarizationField: {
      ...actualModels.NotarizationField,
      findById: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
    },
  };
});

describe('NotarizationField Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotarizationField', () => {
    it('should throw an error if notarization field name already exists', async () => {
      const notarizationFieldBody = { name: 'Field Name' };

      NotarizationField.findOne.mockResolvedValue(true);

      await expect(notarizationFieldService.createNotarizationField(notarizationFieldBody)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Notarization field name already exists')
      );
    });

    it('should create a new notarization field successfully', async () => {
      const notarizationFieldBody = { name: 'Field Name' };

      NotarizationField.findOne.mockResolvedValue(null);
      NotarizationField.create.mockResolvedValue({ id: 'fieldId', ...notarizationFieldBody });

      const result = await notarizationFieldService.createNotarizationField(notarizationFieldBody);

      expect(result).toHaveProperty('id', 'fieldId');
      expect(NotarizationField.create).toHaveBeenCalledWith(notarizationFieldBody);
    });
  });

  describe('getAllNotarizationFields', () => {
    it('should return all notarization fields', async () => {
      const fields = [{ id: 'fieldId', name: 'Field Name' }];

      NotarizationField.find.mockResolvedValue(fields);

      const result = await notarizationFieldService.getAllNotarizationFields();

      expect(result).toEqual(fields);
      expect(NotarizationField.find).toHaveBeenCalled();
    });

    it('should throw an error if no fields are found', async () => {
      NotarizationField.find.mockResolvedValue([]);

      await expect(notarizationFieldService.getAllNotarizationFields()).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'No notarization fields found')
      );
    });
  });

  describe('getNotarizationFieldById', () => {
    it('should return a notarization field by ID', async () => {
      const field = { id: 'fieldId', name: 'Field Name' };

      NotarizationField.findById.mockResolvedValue(field);

      const result = await notarizationFieldService.getNotarizationFieldById('fieldId');

      expect(result).toEqual(field);
      expect(NotarizationField.findById).toHaveBeenCalledWith('fieldId');
    });

    it('should throw an error if field is not found', async () => {
      NotarizationField.findById.mockResolvedValue(null);

      await expect(notarizationFieldService.getNotarizationFieldById('fieldId')).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Notarization field not found')
      );
    });
  });

  describe('updateNotarizationFieldById', () => {
    it('should throw an error if field is not found', async () => {
      const updateBody = { name: 'Updated Field Name' };

      NotarizationField.findById.mockResolvedValue(null);

      await expect(notarizationFieldService.updateNotarizationFieldById('fieldId', updateBody)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Notarization field not found')
      );
    });

    it('should throw an error if field name is already taken', async () => {
      const updateBody = { name: 'Updated Field Name' };
      const field = { id: 'fieldId', name: 'Field Name', save: jest.fn().mockResolvedValue(true) };

      NotarizationField.findById.mockResolvedValue(field);
      NotarizationField.findOne.mockResolvedValue(true);

      await expect(notarizationFieldService.updateNotarizationFieldById('fieldId', updateBody)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Name already taken')
      );
    });

    it('should update and return the notarization field if data is valid', async () => {
      const updateBody = { name: 'Updated Field Name' };
      const field = { id: 'fieldId', name: 'Field Name', save: jest.fn().mockResolvedValue(true) };

      NotarizationField.findById.mockResolvedValue(field);
      NotarizationField.findOne.mockResolvedValue(null);

      const result = await notarizationFieldService.updateNotarizationFieldById('fieldId', updateBody);

      expect(result).toEqual(field);
      expect(field.save).toHaveBeenCalled();
    });
  });

  describe('deleteNotarizationFieldById', () => {
    it('should throw an error if field is not found', async () => {
      NotarizationField.findById.mockResolvedValue(null);

      await expect(notarizationFieldService.deleteNotarizationFieldById('fieldId')).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Notarization field not found')
      );
    });

    it('should delete and return the notarization field if found', async () => {
      const field = { id: 'fieldId', name: 'Field Name', remove: jest.fn().mockResolvedValue(true) };

      NotarizationField.findById.mockResolvedValue(field);

      const result = await notarizationFieldService.deleteNotarizationFieldById('fieldId');

      expect(result).toEqual(field);
      expect(field.remove).toHaveBeenCalled();
    });
  });
});
