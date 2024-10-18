const httpStatus = require('http-status');
const PayOS = require('@payos/node');
const { Payment } = require('../models');
const ApiError = require('../utils/ApiError');
require('dotenv').config();

// Define the maximum allowable value for the orderCode and reduce the range to avoid edge cases.
const MAX_SAFE_INTEGER = 9007199254740991;
const MAX_ORDER_CODE = Math.floor(MAX_SAFE_INTEGER / 10); // Reduced range

const generateOrderCode = () => {
  // Generate a number less than MAX_ORDER_CODE
  return Math.floor(Math.random() * MAX_ORDER_CODE) + 1;
};

const createPayment = async (paymentData) => {
  try {
    const { amount, description, returnUrl, cancelUrl, userId } = paymentData;
    if (!amount || !description || !returnUrl || !cancelUrl || !userId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Missing required fields');
    }

    // Create payment object with a valid orderCode
    const payment = new Payment({
      orderCode: generateOrderCode(), // Ensuring a valid orderCode
      amount,
      description,
      returnUrl: `${process.env.SERVER_URL}/success.html`,
      cancelUrl: `${process.env.SERVER_URL}/cancel.html`,
      userId,
    });

    console.log('Payment Data:', payment);
    await payment.save();

    // PayOS API integration
    const payOS = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY);

    const paymentLinkResponse = await payOS.createPaymentLink({
      orderCode: payment.orderCode,
      amount: payment.amount,
      description: payment.description,
      returnUrl: payment.returnUrl,
      cancelUrl: payment.cancelUrl,
    });

    payment.checkoutUrl = paymentLinkResponse.checkoutUrl;
    await payment.save();
    console.log('Payment Link Response:', paymentLinkResponse);
    return payment;
  } catch (error) {
    console.error('Error creating payment:', error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create payment');
  }
};

const getPaymentById = async (paymentId) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
    }
    return payment;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error getting payment:', error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get payment');
  }
};

const updatePaymentStatus = async (paymentId, status) => {
  try {
    const payment = await Payment.findByIdAndUpdate(paymentId, { status, updatedAt: new Date() }, { new: true });
    if (!payment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
    }
    return payment;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error updating payment status:', error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update payment status');
  }
};

module.exports = {
  createPayment,
  getPaymentById,
  updatePaymentStatus,
};
