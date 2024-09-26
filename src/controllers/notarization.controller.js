const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { notarizationService } = require('../services');
const { sendEmail } = require('../services/email.service');

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const createDocument = catchAsync(async (req, res) => {
  if (typeof req.body.requesterInfo === 'string') {
    req.body.requesterInfo = JSON.parse(req.body.requesterInfo);
  }

  const userId = req.user.id;

  const document = await notarizationService.createDocument({ ...req.body, userId }, req.files);
  const statusTracking = await notarizationService.createStatusTracking(document._id, 'pending');

  if (!isValidEmail(req.body.requesterInfo.email)) {
    return res.status(400).send({ message: 'Invalid email address' });
  }
  try {
    await sendEmail(
      req.body.requesterInfo.email,
      'Tài liệu đã được tạo',
      `Tài liệu của bạn với ID: ${document._id} đã được tạo thành công.`
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).send({ message: 'Document created, but failed to send email notification.' });
  }

  res.status(httpStatus.CREATED).send(document);
});

const getHistoryByUserId = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const history = await notarizationService.getHistoryByUserId(userId);
  res.send(history);
});

const getDocumentStatus = async (req, res) => {
  try {
    const documentId = req.params['documentId'];
    console.log('documentId:', documentId);
    const status = await notarizationService.getDocumenntStatus(documentId);
    res.json(status);
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  createDocument,
  getHistoryByUserId,
  getDocumentStatus,
};
