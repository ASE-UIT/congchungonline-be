const catchAsync = require('../utils/catchAsync');
const { adminService } = require('../services');

const getToDayDocumentCount = catchAsync(async (req, res) => {
  const ToDayDocumentCount = await adminService.getToDayDocumentCount();
  console.log(ToDayDocumentCount);
  res.send(ToDayDocumentCount);
});
const getToDayUserCount = catchAsync(async (req, res) => {
  const ToDayUserCount = await adminService.getToDayUserCount();
  console.log(ToDayUserCount);
  res.send(ToDayUserCount);
});

const getUserMonthly = catchAsync(async (req, res) => {
  const UserMonthly = await adminService.getUserMonthly();
  console.log(UserMonthly);
  res.send(UserMonthly);
});
const getTodayDocumentsByNotaryField = catchAsync(async (req, res) => {
  const TodayDocumentsByNotaryField = await adminService.getTodayDocumentsByNotaryField();
  console.log(TodayDocumentsByNotaryField);
  res.send(TodayDocumentsByNotaryField);
});

const getMonthDocumentsByNotaryField = catchAsync(async (req, res) => {
  const MonthDocumentsByNotaryField = await adminService.getMonthDocumentsByNotaryField();
  console.log(MonthDocumentsByNotaryField);
  res.send(MonthDocumentsByNotaryField);
});

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

module.exports = {
  getToDayDocumentCount,
  getToDayUserCount,
  getUserMonthly,
  getTodayDocumentsByNotaryField,
  getMonthDocumentsByNotaryField,
  getEmployeeCount,
  getEmployeeList,
};
