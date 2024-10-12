const moment = require('moment');
const { Document, User, Session } = require('../models');

const getToDayDocumentCount = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  // document count today, percentDocumentGrowth
  const toDayDocumentCount = await Document.count({
    createdAt: { $gte: startOfToday, $lte: endOfToday },
  });
  const yesterdayDocumentCount = await Document.count({
    createdAt: { $gte: moment().subtract(1, 'd').startOf('day'), $lte: moment().subtract(1, 'd').endOf('day') },
  });
  const percentDocumentGrowth = yesterdayDocumentCount
    ? (toDayDocumentCount - yesterdayDocumentCount) / yesterdayDocumentCount
    : 100;
  return {
    toDayDocumentCount,
    percentDocumentGrowth,
  };
};

const getToDayUserCount = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const toDayUserCount = await User.count({
    createdAt: { $gte: startOfToday, $lte: endOfToday },
  });
  const yesterdayUserCount = await User.count({
    createdAt: { $gte: moment().subtract(1, 'd').startOf('day'), $lte: moment().subtract(1, 'd').endOf('day') },
  });
  const percentUserGrowth = yesterdayUserCount ? (toDayUserCount - yesterdayUserCount) / yesterdayUserCount : 100;
  return {
    toDayUserCount,
    percentUserGrowth,
  };
};

const getUserMonthly = async () => {
  // user count for this month and last month
  const userThisMonthCount = await User.count({
    createdAt: { $gte: moment().startOf('month'), $lte: moment().endOf('month') },
  });
  const userLastMonthCount = await User.count({
    createdAt: { $gte: moment().subtract(1, 'month').startOf('month'), $lte: moment().subtract(1, 'month').endOf('month') },
  });
  return {
    userThisMonthCount,
    userLastMonthCount,
  };
};

const getTodayDocumentsByNotaryField = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const todayDocumentsByNotaryField = await Document.aggregate([
    { $match: { createdAt: { $gte: startOfToday, $lte: endOfToday } } },
    { $group: { _id: '$notaryField', count: { $sum: 1 } } },
  ]);
  return {
    todayDocumentsByNotaryField,
  };
};

const getMonthDocumentsByNotaryField = async () => {
  // Document count by notaryField for this month
  const monthDocumentsByNotaryField = await Document.aggregate([
    { $match: { createdAt: { $gte: moment().startOf('month').toDate(), $lte: moment().endOf('month').toDate() } } },
    { $group: { _id: '$notaryField', count: { $sum: 1 } } },
  ]);
  return {
    monthDocumentsByNotaryField,
  };
};

const getEmployeeCount = async () => {
  const notaryCount = await User.countDocuments({ role: 'notary' });
  const secretaryCount = await User.countDocuments({ role: 'secretary' });
  return {
    notaryCount,
    secretaryCount,
  };
};

const getEmployeeList = async () => {
  const employeeList = await User.find({ role: { $in: ['notary', 'secretary'] } });
  return employeeList;
};

const getDailySessionCount = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const dailySessionCount = await Session.countDocuments({
    createdAt: { $gte: startOfToday, $lte: endOfToday },
  });
  return dailySessionCount;
};

const getMonthlySessionCount = async () => {
  const startOfMonth = moment().startOf('month').toDate();
  const endOfMonth = moment().endOf('month').toDate();
  const monthlySessionCount = await Session.countDocuments({
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  });
  return monthlySessionCount;
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
};
