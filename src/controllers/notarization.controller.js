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

    // Gọi service để lấy trạng thái của document
    const status = await notarizationService.getDocumenntStatus(documentId);

    // Kiểm tra nếu document không tồn tại
    if (!status) {
      return res.status(404).json({ code: 404, message: "Notarizations does not exist in document" });
    }

    // Trả về dữ liệu nếu document tồn tại
    res.json(status);
  } catch (error) {
    console.log(error);
    // Trả về mã lỗi 500 nếu có lỗi xảy ra
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
}

module.exports = {
  createDocument,
  getHistoryByUserId,
  getDocumentStatus,
};
