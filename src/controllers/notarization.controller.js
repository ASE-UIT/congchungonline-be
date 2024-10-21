const httpStatus = require('http-status');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pick = require('lodash/pick');
const { notarizationService, emailService } = require('../services');

// Utility function to validate email format
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Helper function to handle email sending logic
const sendDocumentCreationEmail = async (email, documentId) => {
  const subject = 'Tài liệu đã được tạo';
  const message = `Tài liệu của bạn với ID: ${documentId} đã được tạo thành công.`;

  try {
    await emailService.sendEmail(email, subject, message);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email notification.');
  }
};

// Controller function to create a document
const createDocument = catchAsync(async (req, res) => {
  const userId = req.user.id;

  if (!isValidEmail(req.body.requesterInfo.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email address');
  }

  const document = await notarizationService.createDocument({ ...req.body }, req.files, userId);

  await notarizationService.createStatusTracking(document._id, 'pending');

  try {
    await sendDocumentCreationEmail(req.body.requesterInfo.email, document._id);
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Document created, but failed to send email notification.',
    });
  }

  res.status(httpStatus.CREATED).send(document);
});

// Controller function to get history by user ID
const getHistoryByUserId = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const history = await notarizationService.getHistoryByUserId(userId);
  res.status(httpStatus.OK).send(history);
});

const getHistoryWithStatus = catchAsync(async (req, res) => {
  const { userId } = req.query;
  const history = await notarizationService.getHistoryWithStatus(userId);
  res.status(httpStatus.OK).send(history);
});

// Controller function to get document status by document ID
const getDocumentStatus = catchAsync(async (req, res) => {
  const { documentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(documentId) || !(await notarizationService.getDocumentStatus(documentId))) {
    return res.status(httpStatus.NOT_FOUND).json({
      code: httpStatus.NOT_FOUND,
      message: 'Document not found or does not have notarization status',
    });
  }

  const status = await notarizationService.getDocumentStatus(documentId);

  res.status(httpStatus.OK).json(status);
});

const getDocumentByRole = catchAsync(async (req, res) => {
  const { user } = req;
  const documents = await notarizationService.getDocumentByRole(user.role);
  res.status(httpStatus.OK).send(documents);
});

const forwardDocumentStatus = catchAsync(async (req, res) => {
  const { documentId } = req.params;
  const { action } = req.body;
  const { role } = req.user;
  const userId = req.user.id;
  const updatedStatus = await notarizationService.forwardDocumentStatus(documentId, action, role, userId);
  res.status(httpStatus.OK).send(updatedStatus);
});

const getApproveHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const approveHistory = await notarizationService.getApproveHistory(userId);
  res.status(httpStatus.OK).send(approveHistory);
});

const getAllNotarizations = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const notarizations = await notarizationService.getAllNotarizations({}, options);
  res.send(notarizations);
});

module.exports = {
  createDocument,
  getHistoryByUserId,
  getDocumentStatus,
  getDocumentByRole,
  forwardDocumentStatus,
  getApproveHistory,
  getAllNotarizations,
  getHistoryWithStatus,
};
