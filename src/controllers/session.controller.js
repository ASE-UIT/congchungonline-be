const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { sessionService } = require('../services');

const createSession = catchAsync(async (req, res) => {
  const { sessionName, startTime, startDate, duration, email} = req.body;
  const createdBy = req.user.id;
  const checkemail = await sessionService.validateEmails(email);
  const session = await sessionService.createSession({
    sessionName,
    startTime: new Date(startTime),
    startDate: new Date(startDate),
    duration,
    email,  
    createdBy,  
  });
  res.status(httpStatus.CREATED).send(session);
});


const addUserToSession = catchAsync(async (req, res) => {
    const sessionId = req.params.sessionId;
    const { email } = req.body;
    const session = await sessionService.findBySessionId(sessionId);
    const checkemail = await sessionService.validateEmails(email);
    const updatedSession = await sessionService.addUserToSession({
      sessionId,
      email,
    });
    res.status(httpStatus.OK).send(updatedSession);
});


const deleteUserOutOfSession = catchAsync(async (req, res) => {
    const sessionId = req.params.sessionId;
    const { email } = req.body;
    const session = await sessionService.findBySessionId(sessionId);
    const checkemail = await sessionService.validateEmails(email);
    const updatedSession = await sessionService.deleteUserOutOfSession({
      sessionId,
      email,
    });
    res.status(httpStatus.OK).send(updatedSession);
});
  
module.exports = {
  createSession,
  addUserToSession,
  deleteUserOutOfSession,
};
