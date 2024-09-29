const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
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
  const { requesterInfo } = req.body;
  const userId = req.user.id;

  if (typeof requesterInfo === 'string') {
    req.body.requesterInfo = JSON.parse(requesterInfo);
  }

  if (!isValidEmail(req.body.requesterInfo.email)) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Invalid email address' });
  }

  const document = await notarizationService.createDocument({ ...req.body, userId }, req.files);
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

// Controller function to get document status by document ID
const getDocumentStatus = catchAsync(async (req, res) => {
  const { documentId } = req.params;

  const status = await notarizationService.getDocumentStatus(documentId);

  if (!status) {
    return res.status(httpStatus.NOT_FOUND).json({
      code: httpStatus.NOT_FOUND,
      message: 'Notarizations does not exist in document',
    });
  }

  res.status(httpStatus.OK).json(status);
});

module.exports = {
  createDocument,
  getHistoryByUserId,
  getDocumentStatus,
};
