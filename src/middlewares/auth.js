const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Role } = require('../models');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;
  // console.log('User:', user);

  if (requiredRights.length) {
    try {
      console.log('User role:', user.role);

      const role = await Role.findOne({ name: user.role });

      console.log('Fetched role:', role);

      if (!role) {
        console.error('Role not found:', user.role);
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Role not found'));
      }

      const userRights = role.permissions;
      const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      return reject(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching role permissions'));
    }
  }

  resolve();
};

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
