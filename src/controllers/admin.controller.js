const httpStatus = require('http-status');
const { adminService } = require('../services');

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
  res.status(httpStatus.OK).send({ dailySessionCount: result }); // Wrap the result in an object
};

const getMonthlySessionCount = async (req, res) => {
  const result = await adminService.getMonthlySessionCount();
  res.status(httpStatus.OK).send({ monthlySessionCount: result }); // Wrap the result in an object
};

module.exports = {
  getToDayDocumentCount,
  getToDayUserCount,
  getUserMonthly,
  getTodayDocumentsByNotaryField,
  getMonthDocumentsByNotaryField,
  getDailySessionCount,
  getMonthlySessionCount,
};
