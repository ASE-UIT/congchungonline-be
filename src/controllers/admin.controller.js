const httpStatus = require('http-status');
const { adminService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const getToDayDocumentCount = async (req, res) => {
  const result = await adminService.getToDayDocumentCount();
  res.status(httpStatus.OK).send(result);
};

const getToDayUserCount = async (req, res) => {
  const result = await adminService.getToDayUserCount();
  res.status(httpStatus.OK).send(result);
};

const getUserMonthly = async (req, res) => {
  const result = await adminService.getUserMonthly();
  res.status(httpStatus.OK).send(result);
};

const getTodayDocumentsByNotaryField = async (req, res) => {
  const result = await adminService.getTodayDocumentsByNotaryField();
  res.status(httpStatus.OK).send(result);
};

const getMonthDocumentsByNotaryField = async (req, res) => {
  const result = await adminService.getMonthDocumentsByNotaryField();
  res.status(httpStatus.OK).send(result);
};

const getDailySessionCount = async (req, res) => {
  const result = await adminService.getDailySessionCount();
  res.status(httpStatus.OK).send({ dailySessionCount: result });
};

const getMonthlySessionCount = async (req, res) => {
  const result = await adminService.getMonthlySessionCount();
  res.status(httpStatus.OK).send({ monthlySessionCount: result });
};

const getEmployeeCount = catchAsync(async (req, res) => {
  const EmployeeCount = await adminService.getEmployeeCount();
  console.log(EmployeeCount);
  res.send(EmployeeCount);
});

const getEmployeeList = catchAsync(async (req, res) => {
  const EmployeeList = await adminService.getEmployeeList();
  console.log(EmployeeList);
  res.send(EmployeeList);
});

const getDailyPaymentTotal = async (req, res) => {
  const result = await adminService.getDailyPaymentTotal();
  res.status(httpStatus.OK).send({ dailyPaymentTotal: result });
};

const getMonthlyPaymentTotal = async (req, res) => {
  const result = await adminService.getMonthlyPaymentTotal();
  res.status(httpStatus.OK).send({ monthlyPaymentTotal: result });
};

module.exports = {
  getToDayDocumentCount,
  getToDayUserCount,
  getUserMonthly,
  getTodayDocumentsByNotaryField,
  getMonthDocumentsByNotaryField,
  getEmployeeCount,
  getEmployeeList,
  getDailySessionCount,
  getMonthlySessionCount,
  getDailyPaymentTotal,
  getMonthlyPaymentTotal,
};
