const httpStatus = require('http-status');
const { Document, StatusTracking, ApproveHistory } = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');
const notarizationService = require('../../../src/services/notarization.service');
const { bucket } = require('../../../src/config/firebase');

jest.mock('../../../src/models');
jest.mock('../../../src/config/firebase', () => ({
  bucket: {
    file: jest.fn(() => ({
      save: jest.fn(),
    })),
    name: 'test-bucket',
  },
}));

describe('Notarization Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFileToFirebase', () => {
    it('should upload file to Firebase and return the URL', async () => {
      const file = {
        originalname: 'test.pdf',
        buffer: Buffer.from('test'),
        mimetype: 'application/pdf',
      };
      const folderName = 'test-folder';

      bucket.file().save.mockResolvedValue();

      const result = await notarizationService.uploadFileToFirebase(file, folderName);

      expect(bucket.file).toHaveBeenCalledWith(`${folderName}/${Date.now()}-${file.originalname}`);
      expect(bucket.file().save).toHaveBeenCalledWith(file.buffer, { contentType: file.mimetype });
      expect(result).toBe(`https://storage.googleapis.com/test-bucket/${folderName}/${Date.now()}-${file.originalname}`);
    });

    it('should throw an error if file upload fails', async () => {
      const file = {
        originalname: 'test.pdf',
        buffer: Buffer.from('test'),
        mimetype: 'application/pdf',
      };
      const folderName = 'test-folder';

      bucket.file().save.mockRejectedValue(new Error('Upload failed'));

      await expect(notarizationService.uploadFileToFirebase(file, folderName)).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload file')
      );
    });
  });

  describe('createDocument', () => {
    it('should create a new document and upload files', async () => {
      const documentBody = { title: 'Test Document' };
      const files = [
        { originalname: 'test1.pdf', buffer: Buffer.from('test1'), mimetype: 'application/pdf' },
        { originalname: 'test2.pdf', buffer: Buffer.from('test2'), mimetype: 'application/pdf' },
      ];

      Document.prototype.save = jest.fn().mockResolvedValue();
      bucket.file().save = jest.fn().mockResolvedValue();

      const result = await notarizationService.createDocument(documentBody, files);

      expect(Document.prototype.save).toHaveBeenCalledTimes(2);
      expect(bucket.file().save).toHaveBeenCalledTimes(2);
      expect(result.files.length).toBe(2);
    });

    it('should throw an error if no files are provided', async () => {
      const documentBody = { title: 'Test Document' };

      await expect(notarizationService.createDocument(documentBody, [])).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'No files provided')
      );
    });

    it('should throw an error if document creation fails', async () => {
      const documentBody = { title: 'Test Document' };
      const files = [{ originalname: 'test1.pdf', buffer: Buffer.from('test1'), mimetype: 'application/pdf' }];

      Document.prototype.save = jest.fn().mockRejectedValue(new Error('Save failed'));

      await expect(notarizationService.createDocument(documentBody, files)).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload file')
      );
    });
  });

  describe('createStatusTracking', () => {
    it('should create a new status tracking', async () => {
      const documentId = 'test-document-id';
      const status = 'pending';

      StatusTracking.prototype.save = jest.fn().mockResolvedValue();

      const result = await notarizationService.createStatusTracking(documentId, status);

      expect(StatusTracking.prototype.save).toHaveBeenCalled();
      expect(result.documentId).toBe(documentId);
      expect(result.status).toBe(status);
    });

    it('should throw an error if status tracking creation fails', async () => {
      const documentId = 'test-document-id';
      const status = 'pending';

      StatusTracking.prototype.save = jest.fn().mockRejectedValue(new Error('Save failed'));

      await expect(notarizationService.createStatusTracking(documentId, status)).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create status tracking')
      );
    });
  });

  describe('getHistoryByUserId', () => {
    it('should return documents by user ID', async () => {
      const userId = 'test-user-id';
      const documents = [{ _id: 'doc1' }, { _id: 'doc2' }];

      Document.find = jest.fn().mockResolvedValue(documents);

      const result = await notarizationService.getHistoryByUserId(userId);

      expect(Document.find).toHaveBeenCalledWith({ userId });
      expect(result).toEqual(documents);
    });
  });

  describe('getDocumentStatus', () => {
    it('should return document status by document ID', async () => {
      const documentId = 'test-document-id';
      const statusTracking = { documentId, status: 'pending' };

      StatusTracking.findOne = jest.fn().mockResolvedValue(statusTracking);

      const result = await notarizationService.getDocumentStatus(documentId);

      expect(StatusTracking.findOne).toHaveBeenCalledWith({ documentId });
      expect(result).toEqual(statusTracking);
    });

    it('should throw an error if status tracking retrieval fails', async () => {
      const documentId = 'test-document-id';

      StatusTracking.findOne = jest.fn().mockRejectedValue(new Error('Find failed'));

      await expect(notarizationService.getDocumentStatus(documentId)).rejects.toThrow();
    });
  });

  describe('getDocumentByRole', () => {
    it('should return documents for notary role', async () => {
      const role = 'notary';
      const statusTrackings = [{ documentId: 'doc1', status: 'processing' }];
      const documents = [{ _id: 'doc1', title: 'Test Document' }];

      StatusTracking.find = jest.fn().mockResolvedValue(statusTrackings);
      Document.find = jest.fn().mockResolvedValue(documents);

      const result = await notarizationService.getDocumentByRole(role);

      expect(StatusTracking.find).toHaveBeenCalledWith({ status: { $in: ['processing'] } });
      expect(Document.find).toHaveBeenCalledWith({ _id: { $in: ['doc1'] } });
      expect(result.length).toBe(1);
      expect(result[0].status).toBe('processing');
    });

    it('should throw an error if role is invalid', async () => {
      const role = 'invalid-role';

      await expect(notarizationService.getDocumentByRole(role)).rejects.toThrow(
        new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to access these documents')
      );
    });

    it('should throw an error if document retrieval fails', async () => {
      const role = 'notary';

      StatusTracking.find = jest.fn().mockRejectedValue(new Error('Find failed'));

      await expect(notarizationService.getDocumentByRole(role)).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to retrieve documents')
      );
    });
  });

  describe('forwardDocumentStatus', () => {
    it('should forward document status to the next valid status', async () => {
      const documentId = 'test-document-id';
      const action = 'accept';
      const role = 'notary';
      const userId = 'test-user-id';
      const currentStatus = { documentId, status: 'processing' };

      StatusTracking.findOne = jest.fn().mockResolvedValue(currentStatus);
      ApproveHistory.prototype.save = jest.fn().mockResolvedValue();
      StatusTracking.updateOne = jest.fn().mockResolvedValue({ nModified: 1 });

      const result = await notarizationService.forwardDocumentStatus(documentId, action, role, userId);

      expect(StatusTracking.findOne).toHaveBeenCalledWith({ documentId }, 'status');
      expect(ApproveHistory.prototype.save).toHaveBeenCalled();
      expect(StatusTracking.updateOne).toHaveBeenCalledWith(
        { documentId },
        { status: 'digitalSignature', updatedAt: expect.any(Date) }
      );
      expect(result.message).toBe('Document status updated to digitalSignature');
    });

    it('should throw an error if action is invalid', async () => {
      const documentId = 'test-document-id';
      const action = 'invalid-action';
      const role = 'notary';
      const userId = 'test-user-id';

      await expect(notarizationService.forwardDocumentStatus(documentId, action, role, userId)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Invalid action provided')
      );
    });

    it('should throw an error if document status update fails', async () => {
      const documentId = 'test-document-id';
      const action = 'accept';
      const role = 'notary';
      const userId = 'test-user-id';
      const currentStatus = { documentId, status: 'processing' };

      StatusTracking.findOne = jest.fn().mockResolvedValue(currentStatus);
      ApproveHistory.prototype.save = jest.fn().mockResolvedValue();
      StatusTracking.updateOne = jest.fn().mockResolvedValue({ nModified: 0 });

      await expect(notarizationService.forwardDocumentStatus(documentId, action, role, userId)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'No status found for this document')
      );
    });
  });

  describe('getApproveHistory', () => {
    it('should return approval history by user ID', async () => {
      const userId = 'test-user-id';
      const history = [{ _id: 'history1' }, { _id: 'history2' }];

      ApproveHistory.find = jest.fn().mockResolvedValue(history);

      const result = await notarizationService.getApproveHistory(userId);

      expect(ApproveHistory.find).toHaveBeenCalledWith({ userId });
      expect(result).toEqual(history);
    });

    it('should throw an error if no approval history is found', async () => {
      const userId = 'test-user-id';

      ApproveHistory.find = jest.fn().mockResolvedValue([]);

      await expect(notarizationService.getApproveHistory(userId)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'No approval history found for this user.')
      );
    });

    it('should throw an error if approval history retrieval fails', async () => {
      const userId = 'test-user-id';

      ApproveHistory.find = jest.fn().mockRejectedValue(new Error('Find failed'));

      await expect(notarizationService.getApproveHistory(userId)).rejects.toThrow(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch approve history')
      );
    });
  });

  describe('getAllNotarizations', () => {
    it('should return paginated notarizations', async () => {
      const filter = {};
      const options = { page: 1, limit: 10 };
      const paginatedResult = { docs: [{ _id: 'doc1' }, { _id: 'doc2' }], totalDocs: 2 };

      Document.paginate = jest.fn().mockResolvedValue(paginatedResult);

      const result = await notarizationService.getAllNotarizations(filter, options);

      expect(Document.paginate).toHaveBeenCalledWith(filter, options);
      expect(result).toEqual(paginatedResult);
    });
  });
});
