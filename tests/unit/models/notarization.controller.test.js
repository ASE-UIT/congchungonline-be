/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const {
  createDocument,
  getHistoryByUserId,
  getDocumentStatus,
  getDocumentByRole,
  forwardDocumentStatus,
  getApproveHistory,
  getAllNotarizations,
} = require('../../../src/controllers/notarization.controller');
const { notarizationService, emailService } = require('../../../src/services');
// const ApiError = require('../utils/ApiError');

jest.mock('../services/email.service');
jest.mock('../services/notarization.service');

describe('Notarization Controller', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createDocument', () => {
    test('should create a document and send email notification', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
        body: {
          requesterInfo: {
            email: 'user@example.com',
          },
          otherData: 'some data',
        },
        files: {},
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockDocument = { _id: 'documentId123', data: 'document data' };
      notarizationService.createDocument.mockResolvedValue(mockDocument);
      notarizationService.createStatusTracking.mockResolvedValue();
      emailService.sendEmail.mockResolvedValue();
      await createDocument(req, res);
      expect(notarizationService.createDocument).toHaveBeenCalledWith({ ...req.body, userId: 'userId123' }, req.files);
      expect(notarizationService.createStatusTracking).toHaveBeenCalledWith('documentId123', 'pending');
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        'user@example.com',
        'Tài liệu đã được tạo',
        `Tài liệu của bạn với ID: documentId123 đã được tạo thành công.`
      );
      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith(mockDocument);
    });
    test('should handle invalid email format', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
        body: {
          requesterInfo: {
            email: 'invalid-email',
          },
          otherData: 'some data',
        },
        files: {},
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      await createDocument(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith({ message: 'Invalid email address' });
    });

    test('should handle email sending failure', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
        body: {
          requesterInfo: {
            email: 'user@example.com',
          },
          otherData: 'some data',
        },
        files: {},
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockDocument = { _id: 'documentId123', data: 'document data' };
      notarizationService.createDocument.mockResolvedValue(mockDocument);
      notarizationService.createStatusTracking.mockResolvedValue();
      emailService.sendEmail.mockRejectedValue(new Error('Email service error'));

      await createDocument(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Document created, but failed to send email notification.',
      });
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
        body: {
          requesterInfo: {
            email: 'user@example.com',
          },
          otherData: 'some data',
        },
        files: {},
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationService.createDocument.mockRejectedValue(new Error('Service error'));

      await createDocument(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getHistoryByUserId', () => {
    test('should get user history and send response', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockHistory = [{ id: 'doc1' }, { id: 'doc2' }];
      notarizationService.getHistoryByUserId.mockResolvedValue(mockHistory);

      await getHistoryByUserId(req, res);

      expect(notarizationService.getHistoryByUserId).toHaveBeenCalledWith('userId123');
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockHistory);
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationService.getHistoryByUserId.mockRejectedValue(new Error('Service error'));

      await getHistoryByUserId(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getDocumentStatus', () => {
    test('should get document status and send response', async () => {
      const req = httpMocks.createRequest({
        params: { documentId: 'docId123' },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.json = jest.fn();

      const mockStatus = { status: 'pending' };
      notarizationService.getDocumentStatus.mockResolvedValue(mockStatus);

      await getDocumentStatus(req, res);

      expect(notarizationService.getDocumentStatus).toHaveBeenCalledWith('docId123');
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(mockStatus);
    });

    test('should return NOT_FOUND when status is not found', async () => {
      const req = httpMocks.createRequest({
        params: { documentId: 'docId123' },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.json = jest.fn();

      notarizationService.getDocumentStatus.mockResolvedValue(null);

      await getDocumentStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        code: httpStatus.NOT_FOUND,
        message: 'Notarizations does not exist in document',
      });
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        params: { documentId: 'docId123' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationService.getDocumentStatus.mockRejectedValue(new Error('Service error'));

      await getDocumentStatus(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // Các hàm điều khiển khác bạn có thể viết tương tự như trên:

  describe('getDocumentByRole', () => {
    test('should get documents by role and send response', async () => {
      const req = httpMocks.createRequest({
        user: { role: 'user' },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockDocuments = [{ id: 'doc1' }, { id: 'doc2' }];
      notarizationService.getDocumentByRole.mockResolvedValue(mockDocuments);

      await getDocumentByRole(req, res);

      expect(notarizationService.getDocumentByRole).toHaveBeenCalledWith('user');
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockDocuments);
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        user: { role: 'user' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationService.getDocumentByRole.mockRejectedValue(new Error('Service error'));

      await getDocumentByRole(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('forwardDocumentStatus', () => {
    test('should forward document status and send response', async () => {
      const req = httpMocks.createRequest({
        params: { documentId: 'docId123' },
        body: { action: 'approve' },
        user: { role: 'notary', id: 'userId123' },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockStatus = { status: 'approved' };
      notarizationService.forwardDocumentStatus.mockResolvedValue(mockStatus);

      await forwardDocumentStatus(req, res);

      expect(notarizationService.forwardDocumentStatus).toHaveBeenCalledWith('docId123', 'approve', 'notary', 'userId123');
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockStatus);
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        params: { documentId: 'docId123' },
        body: { action: 'approve' },
        user: { role: 'notary', id: 'userId123' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationService.forwardDocumentStatus.mockRejectedValue(new Error('Service error'));

      await forwardDocumentStatus(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getApproveHistory', () => {
    test('should get approval history and send response', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn(() => res);
      res.send = jest.fn();

      const mockHistory = [{ id: 'history1' }, { id: 'history2' }];
      notarizationService.getApproveHistory.mockResolvedValue(mockHistory);

      await getApproveHistory(req, res);

      expect(notarizationService.getApproveHistory).toHaveBeenCalledWith('userId123');
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(mockHistory);
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        user: { id: 'userId123' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationService.getApproveHistory.mockRejectedValue(new Error('Service error'));

      await getApproveHistory(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getAllNotarizations', () => {
    test('should get all notarizations and send response', async () => {
      const req = httpMocks.createRequest({
        query: {
          sortBy: 'createdAt',
          limit: '10',
          page: '1',
        },
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const options = {
        sortBy: 'createdAt',
        limit: '10',
        page: '1',
      };

      const mockNotarizations = [{ id: 'notarization1' }, { id: 'notarization2' }];
      notarizationService.getAllNotarizations.mockResolvedValue(mockNotarizations);

      await getAllNotarizations(req, res);

      expect(notarizationService.getAllNotarizations).toHaveBeenCalledWith({}, options);
      expect(res.send).toHaveBeenCalledWith(mockNotarizations);
    });

    test('should handle service errors', async () => {
      const req = httpMocks.createRequest({
        query: {
          sortBy: 'createdAt',
          limit: '10',
          page: '1',
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      notarizationService.getAllNotarizations.mockRejectedValue(new Error('Service error'));

      await getAllNotarizations(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
