const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { sessionService, emailService } = require('../services');
const { addUserToSession: addUserToSessionValidation } = require('../validations/session.validation');

const createSession = catchAsync(async (req, res) => {
  const { sessionName, notaryField, notaryService, startTime, startDate, endTime, endDate, users } = req.body;
  const createdBy = req.user.id;
  await sessionService.validateEmails(users.map((u) => u.email));
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDateTime = new Date(startDate);
  startDateTime.setUTCHours(hours, minutes, 0, 0);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const endDateTime = new Date(endDate);
  endDateTime.setUTCHours(endHours, endMinutes, 0, 0);
  const session = await sessionService.createSession({
    sessionName,
    notaryField,
    notaryService,
    startTime,
    startDate: startDateTime,
    endTime,
    endDate: endDateTime,
    users,
    createdBy,
  });
  await Promise.all(session.users.map((userItem) => emailService.sendInvitationEmail(userItem.email, session._id)));
  res.status(httpStatus.CREATED).send(session);
});

const addUserToSession = catchAsync(async (req, res) => {
  const { sessionId } = req.params;
  const { emails } = req.body;

  await addUserToSessionValidation.body.validateAsync(req.body);

  const updatedSession = await sessionService.addUserToSession(sessionId, emails);
  await Promise.all(emails.map((email) => emailService.sendInvitationEmail(email, sessionId)));
  res.status(httpStatus.OK).send(updatedSession);
});

const deleteUserOutOfSession = catchAsync(async (req, res) => {
  const { sessionId } = req.params;
  const { email } = req.body; // Changed to receive a single email
  const userId = req.user.id;
  const updatedSession = await sessionService.deleteUserOutOfSession(sessionId, email, userId); // Pass single email
  res.status(httpStatus.OK).send(updatedSession);
});

const joinSession = catchAsync(async (req, res) => {
  const { sessionId } = req.params;
  const { action } = req.body;
  const userId = req.user.id;

  const updatedSession = await sessionService.joinSession(sessionId, action, userId);
  res.status(httpStatus.OK).send(updatedSession);
});

const getAllSessions = catchAsync(async (req, res) => {
  const getSessions = await sessionService.getAllSessions();
  res.status(httpStatus.OK).send(getSessions);
});

const getSessionsByDate = catchAsync(async (req, res) => {
  const { date } = req.query;
  const sessions = await sessionService.getSessionsByDate(date);
  res.status(httpStatus.OK).send(sessions);
});

const getSessionsByMonth = catchAsync(async (req, res) => {
  const { date } = req.query;
  const sessions = await sessionService.getSessionsByMonth(date);
  res.status(httpStatus.OK).send(sessions);
});

const getActiveSessions = catchAsync(async (req, res) => {
  const sessions = await sessionService.getActiveSessions();
  res.status(httpStatus.OK).send(sessions);
});

module.exports = {
  createSession,
  addUserToSession,
  deleteUserOutOfSession,
  joinSession,
  getAllSessions,
  getSessionsByDate,
  getSessionsByMonth,
  getActiveSessions,
};
