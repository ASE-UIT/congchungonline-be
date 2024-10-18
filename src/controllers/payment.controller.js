const httpStatus = require('http-status');
const paymentService = require('../services/payment.service');
const catchAsync = require('../utils/catchAsync');

const createPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.createPayment(req.body);
  res.status(httpStatus.CREATED).send(payment);
});

const getPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.paymentId);
  res.send(payment);
});

const updatePaymentStatus = catchAsync(async (req, res) => {
  const payment = await paymentService.updatePaymentStatus(req.params.paymentId, req.body.status);
  res.send(payment);
});

module.exports = {
  createPayment,
  getPayment,
  updatePaymentStatus,
};
