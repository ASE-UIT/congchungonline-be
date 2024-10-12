const { Document, StatusTracking, ApproveHistory, NotarizationService, NotarizationField } = require('../../../src/models');
const notarizationService = require('../../../src/services/notarization.service');
const ApiError = require('../../../src/utils/ApiError');
const httpStatus = require('http-status');
const { bucket } = require('../../../src/config/firebase');
const mockFirebase = require('./firebase.mock');
const setupTestDB = require('../../utils/setupTestDB');

setupTestDB();
mockFirebase();

jest.mock('../../../src/models', () => {
  const actualModels = jest.requireActual('../../../src/models');
  return {
    Document: {
      ...actualModels.Document,
      findById: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      paginate: jest.fn(),
      save: jest.fn().mockImplementation(function () {
        return Promise.resolve(this);
      }),
    },
    StatusTracking: {
      ...actualModels.StatusTracking,
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn().mockImplementation(function () {
        return Promise.resolve(this);
      }),
      updateOne: jest.fn(),
    },
    ApproveHistory: {
      ...actualModels.ApproveHistory,
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn().mockImplementation(function () {
        return Promise.resolve(this);
      }),
    },
    NotarizationService: {
      ...actualModels.NotarizationService,
      findById: jest.fn(),
    },
    NotarizationField: {
      ...actualModels.NotarizationField,
      findById: jest.fn(),
    },
  };
});

jest.mock('../../../src/config/firebase', () => ({
  bucket: {
    file: jest.fn(() => ({
      save: jest.fn().mockResolvedValue(),
    })),
    name: 'test-bucket',
  },
}));

describe('Notarization Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createDocument', () => {
    it('should throw an error if no files are provided', async () => {
      const documentBody = { notarizationFieldId: 'fieldId', notarizationServiceId: 'serviceId' };

      await expect(notarizationService.createDocument(documentBody, [])).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'No files provided')
      );
    });

    it('should throw an error if fieldId is invalid', async () => {
      const documentBody = { notarizationFieldId: 'invalidFieldId', notarizationServiceId: 'serviceId' };
      const files = [{ originalname: 'file.pdf', buffer: Buffer.from('file content'), mimetype: 'application/pdf' }];

      NotarizationField.findById.mockResolvedValue(null);

      await expect(notarizationService.createDocument(documentBody, files)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Invalid fieldId provided')
      );
    });

    it('should throw an error if serviceId is invalid', async () => {
      const documentBody = { notarizationFieldId: 'fieldId', notarizationServiceId: 'invalidServiceId' };
      const files = [{ originalname: 'file.pdf', buffer: Buffer.from('file content'), mimetype: 'application/pdf' }];

      NotarizationField.findById.mockResolvedValue(true);
      NotarizationService.findById.mockResolvedValue(null);

      await expect(notarizationService.createDocument(documentBody, files)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Invalid serviceId provided')
      );
    });

    // it('should create a new document and upload files successfully', async () => {
    //   const documentBody = { notarizationFieldId: 'fieldId', notarizationServiceId: 'serviceId' };
    //   const files = [{ originalname: 'file.pdf', buffer: Buffer.from('file content'), mimetype: 'application/pdf' }];

    //   NotarizationField.findById.mockResolvedValue(true);
    //   NotarizationService.findById.mockResolvedValue(true);
    //   Document.create.mockResolvedValue({ _id: 'documentId', ...documentBody });

    //   const result = await notarizationService.createDocument(documentBody, files);

    //   expect(result).toHaveProperty('_id', 'documentId');
    //   expect(Document.create).toHaveBeenCalledWith(expect.objectContaining(documentBody));
    //   expect(bucket.file().save).toHaveBeenCalled();
    // });
  });

  // describe('createStatusTracking', () => {
  //   it('should create a new status tracking successfully', async () => {
  //     const documentId = 'documentId';
  //     const status = 'pending';

  //     StatusTracking.create.mockResolvedValue({ documentId, status, updatedAt: new Date() });

  //     const result = await notarizationService.createStatusTracking(documentId, status);

  //     expect(result).toHaveProperty('documentId', documentId);
  //     expect(StatusTracking.create).toHaveBeenCalledWith(expect.objectContaining({ documentId, status }));
  //   });
  // });

  describe('getHistoryByUserId', () => {
    it('should return documents by user ID', async () => {
      const userId = 'userId';
      const documents = [{ _id: 'documentId', userId }];

      Document.find.mockResolvedValue(documents);

      const result = await notarizationService.getHistoryByUserId(userId);

      expect(result).toEqual(documents);
      expect(Document.find).toHaveBeenCalledWith({ userId });
    });
  });

  describe('getDocumentStatus', () => {
    it('should return the status tracking of a document', async () => {
      const documentId = 'documentId';
      const statusTracking = { documentId, status: 'pending' };

      StatusTracking.findOne.mockResolvedValue(statusTracking);

      const result = await notarizationService.getDocumentStatus(documentId);

      expect(result).toEqual(statusTracking);
      expect(StatusTracking.findOne).toHaveBeenCalledWith({ documentId });
    });
  });

  describe('getDocumentByRole', () => {
    // it('should return documents for notary role', async () => {
    //   const role = 'notary';
    //   const statusTrackings = [{ documentId: 'documentId', status: 'processing' }];
    //   const documents = [{ _id: 'documentId', name: 'Document Name' }];

    //   StatusTracking.find.mockResolvedValue(statusTrackings);
    //   Document.find.mockResolvedValue(documents);

    //   const result = await notarizationService.getDocumentByRole(role);

    //   expect(result).toEqual(expect.arrayContaining([expect.objectContaining({ _id: 'documentId', status: 'processing' })]));
    //   expect(StatusTracking.find).toHaveBeenCalledWith({ status: { $in: ['processing'] } });
    //   expect(Document.find).toHaveBeenCalledWith({ _id: { $in: ['documentId'] } });
    // });

    it('should throw an error if role is invalid', async () => {
      const role = 'invalidRole';

      await expect(notarizationService.getDocumentByRole(role)).rejects.toThrow(
        new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to access these documents')
      );
    });
  });

  describe('forwardDocumentStatus', () => {
    // it('should forward document status to the next valid status', async () => {
    //   const documentId = 'documentId';
    //   const action = 'accept';
    //   const role = 'notary';
    //   const userId = 'userId';
    //   const currentStatus = { documentId, status: 'processing' };

    //   StatusTracking.findOne.mockResolvedValue(currentStatus);
    //   ApproveHistory.create.mockResolvedValue(true);
    //   StatusTracking.updateOne.mockResolvedValue({ nModified: 1 });

    //   const result = await notarizationService.forwardDocumentStatus(documentId, action, role, userId);

    //   expect(result).toHaveProperty('message', 'Document status updated to digitalSignature');
    //   expect(StatusTracking.findOne).toHaveBeenCalledWith({ documentId }, 'status');
    //   expect(ApproveHistory.create).toHaveBeenCalledWith(
    //     expect.objectContaining({ userId, documentId, beforeStatus: 'processing', afterStatus: 'digitalSignature' })
    //   );
    //   expect(StatusTracking.updateOne).toHaveBeenCalledWith(
    //     { documentId },
    //     expect.objectContaining({ status: 'digitalSignature' })
    //   );
    // });

    it('should throw an error if action is invalid', async () => {
      const documentId = 'documentId';
      const action = 'invalidAction';
      const role = 'notary';
      const userId = 'userId';

      await expect(notarizationService.forwardDocumentStatus(documentId, action, role, userId)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Invalid action provided')
      );
    });
  });

  describe('getApproveHistory', () => {
    it('should return approval history for a user', async () => {
      const userId = 'userId';
      const history = [{ userId, documentId: 'documentId', beforeStatus: 'pending', afterStatus: 'approved' }];

      ApproveHistory.find.mockResolvedValue(history);

      const result = await notarizationService.getApproveHistory(userId);

      expect(result).toEqual(history);
      expect(ApproveHistory.find).toHaveBeenCalledWith({ userId });
    });

    it('should throw an error if no approval history is found', async () => {
      const userId = 'userId';

      ApproveHistory.find.mockResolvedValue([]);

      await expect(notarizationService.getApproveHistory(userId)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'No approval history found for this user.')
      );
    });
  });

  describe('getAllNotarizations', () => {
    it('should return paginated notarizations', async () => {
      const filter = {};
      const options = { page: 1, limit: 10 };
      const paginatedResult = {
        docs: [{ _id: 'documentId', name: 'Document Name' }],
        totalDocs: 1,
        limit: 10,
        page: 1,
        totalPages: 1,
      };

      Document.paginate.mockResolvedValue(paginatedResult);

      const result = await notarizationService.getAllNotarizations(filter, options);

      expect(result).toEqual(paginatedResult);
      expect(Document.paginate).toHaveBeenCalledWith(filter, options);
    });
  });
});
