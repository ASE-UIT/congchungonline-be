const { NotarizationField } = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');
const httpStatus = require('http-status');
const notarizationFieldService = require('../../../src/services/notarizationField.service');

jest.mock('../../../src/models');

describe('NotarizationField Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotarizationField', () => {
    it('should create a new notarization field', async () => {
      const notarizationFieldBody = { name: 'Test Field' };

      NotarizationField.findOne.mockResolvedValue(null);
      NotarizationField.create.mockResolvedValue(notarizationFieldBody);

      const result = await notarizationFieldService.createNotarizationField(notarizationFieldBody);

      expect(NotarizationField.findOne).toHaveBeenCalledWith({ name: notarizationFieldBody.name });
      expect(NotarizationField.create).toHaveBeenCalledWith(notarizationFieldBody);
      expect(result).toEqual(notarizationFieldBody);
    });

    it('should throw an error if notarization field name already exists', async () => {
      const notarizationFieldBody = { name: 'Test Field' };

      NotarizationField.findOne.mockResolvedValue(notarizationFieldBody);

      await expect(notarizationFieldService.createNotarizationField(notarizationFieldBody)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Notarization field name already exists')
      );
    });

    it('should throw an error if creation fails', async () => {
      const notarizationFieldBody = { name: 'Test Field' };

      NotarizationField.findOne.mockResolvedValue(null);
      NotarizationField.create.mockRejectedValue(new Error('Create failed'));

      await expect(notarizationFieldService.createNotarizationField(notarizationFieldBody)).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating notarization field')
      );
    });
  });

  describe('getAllNotarizationFields', () => {
    it('should return all notarization fields', async () => {
      const notarizationFields = [{ name: 'Field1' }, { name: 'Field2' }];

      NotarizationField.find.mockResolvedValue(notarizationFields);

      const result = await notarizationFieldService.getAllNotarizationFields();

      expect(NotarizationField.find).toHaveBeenCalled();
      expect(result).toEqual(notarizationFields);
    });

    it('should throw an error if no notarization fields found', async () => {
      NotarizationField.find.mockResolvedValue([]);

      await expect(notarizationFieldService.getAllNotarizationFields()).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'No notarization fields found')
      );
    });

    it('should throw an error if fetching fails', async () => {
      NotarizationField.find.mockRejectedValue(new Error('Fetch failed'));

      await expect(notarizationFieldService.getAllNotarizationFields()).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching notarization fields')
      );
    });
  });

  describe('getNotarizationFieldById', () => {
    it('should return notarization field by ID', async () => {
      const notarizationFieldId = 'test-id';
      const notarizationField = { _id: notarizationFieldId, name: 'Test Field' };

      NotarizationField.findById.mockResolvedValue(notarizationField);

      const result = await notarizationFieldService.getNotarizationFieldById(notarizationFieldId);

      expect(NotarizationField.findById).toHaveBeenCalledWith(notarizationFieldId);
      expect(result).toEqual(notarizationField);
    });

    it('should throw an error if notarization field not found', async () => {
      const notarizationFieldId = 'test-id';

      NotarizationField.findById.mockResolvedValue(null);

      await expect(notarizationFieldService.getNotarizationFieldById(notarizationFieldId)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Notarization field not found')
      );
    });

    it('should throw an error if fetching fails', async () => {
      const notarizationFieldId = 'test-id';

      NotarizationField.findById.mockRejectedValue(new Error('Fetch failed'));

      await expect(notarizationFieldService.getNotarizationFieldById(notarizationFieldId)).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching notarization field')
      );
    });
  });

  describe('updateNotarizationFieldById', () => {
    it('should update notarization field by ID', async () => {
      const notarizationFieldId = 'test-id';
      const updateBody = { name: 'Updated Field' };
      const notarizationField = { _id: notarizationFieldId, name: 'Test Field', save: jest.fn().mockResolvedValue() };

      notarizationFieldService.getNotarizationFieldById = jest.fn().mockResolvedValue(notarizationField);
      NotarizationField.findOne.mockResolvedValue(null);

      const result = await notarizationFieldService.updateNotarizationFieldById(notarizationFieldId, updateBody);

      expect(notarizationFieldService.getNotarizationFieldById).toHaveBeenCalledWith(notarizationFieldId);
      expect(NotarizationField.findOne).toHaveBeenCalledWith({ name: updateBody.name, _id: { $ne: notarizationFieldId } });
      expect(notarizationField.save).toHaveBeenCalled();
      expect(result.name).toBe(updateBody.name);
    });

    it('should throw an error if notarization field not found', async () => {
      const notarizationFieldId = 'test-id';
      const updateBody = { name: 'Updated Field' };

      notarizationFieldService.getNotarizationFieldById = jest.fn().mockResolvedValue(null);

      await expect(notarizationFieldService.updateNotarizationFieldById(notarizationFieldId, updateBody)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Notarization field not found')
      );
    });

    it('should throw an error if name already taken', async () => {
      const notarizationFieldId = 'test-id';
      const updateBody = { name: 'Updated Field' };
      const notarizationField = { _id: notarizationFieldId, name: 'Test Field', save: jest.fn().mockResolvedValue() };

      notarizationFieldService.getNotarizationFieldById = jest.fn().mockResolvedValue(notarizationField);
      NotarizationField.findOne.mockResolvedValue({ name: 'Updated Field' });

      await expect(notarizationFieldService.updateNotarizationFieldById(notarizationFieldId, updateBody)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Name already taken')
      );
    });

    it('should throw an error if update fails', async () => {
      const notarizationFieldId = 'test-id';
      const updateBody = { name: 'Updated Field' };
      const notarizationField = { _id: notarizationFieldId, name: 'Test Field', save: jest.fn().mockRejectedValue(new Error('Save failed')) };

      notarizationFieldService.getNotarizationFieldById = jest.fn().mockResolvedValue(notarizationField);
      NotarizationField.findOne.mockResolvedValue(null);

      await expect(notarizationFieldService.updateNotarizationFieldById(notarizationFieldId, updateBody)).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating notarization field')
      );
    });
  });

  describe('deleteNotarizationFieldById', () => {
    it('should delete notarization field by ID', async () => {
      const notarizationFieldId = 'test-id';
      const notarizationField = { _id: notarizationFieldId, name: 'Test Field', remove: jest.fn().mockResolvedValue() };

      notarizationFieldService.getNotarizationFieldById = jest.fn().mockResolvedValue(notarizationField);

      const result = await notarizationFieldService.deleteNotarizationFieldById(notarizationFieldId);

      expect(notarizationFieldService.getNotarizationFieldById).toHaveBeenCalledWith(notarizationFieldId);
      expect(notarizationField.remove).toHaveBeenCalled();
      expect(result).toEqual(notarizationField);
    });

    it('should throw an error if notarization field not found', async () => {
      const notarizationFieldId = 'test-id';

      notarizationFieldService.getNotarizationFieldById = jest.fn().mockResolvedValue(null);

      await expect(notarizationFieldService.deleteNotarizationFieldById(notarizationFieldId)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Notarization field not found')
      );
    });

    it('should throw an error if deletion fails', async () => {
      const notarizationFieldId = 'test-id';
      const notarizationField = { _id: notarizationFieldId, name: 'Test Field', remove: jest.fn().mockRejectedValue(new Error('Remove failed')) };

      notarizationFieldService.getNotarizationFieldById = jest.fn().mockResolvedValue(notarizationField);

      await expect(notarizationFieldService.deleteNotarizationFieldById(notarizationFieldId)).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting notarization field')
      );
    });
  });
});