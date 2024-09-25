const httpStatus = require('http-status');
const { app } = require('../config/firebase');
const ApiError = require('../utils/ApiError');

const firebaseAuth = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization.split(' ')[1];
    const decodedToken = await app.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid authentication token'));
  }
};

module.exports = firebaseAuth;
