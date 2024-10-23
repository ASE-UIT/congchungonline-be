const httpStatus = require('http-status');
const ms = require('ms');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const { auth, db } = require('../config/firebase');

const register = catchAsync(async (req, res) => {
  // Create user in Firebase
  // const { email, password, name } = req.body;
  // const firebaseUser = await auth.createUser({
  //   email,
  //   password,
  // });
  // db.ref(`users/${firebaseUser.uid}`).set({
  //   role: 'user',
  //   name,
  //   email,
  //   password,
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // });
  // Create user in MongoDB
  console.log('register------------');
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  await emailService.sendEmail(user.email, 'Hi', '123');
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  // res.cookie('refreshToken', tokens.refresh.token, {
  //   secure: process.env.NODE_ENV === 'production',
  //   httpOnly: true,
  //   sameSite: 'Lax',
  //   maxAge: ms('14 days'),
  // });

  // res.cookie('accessToken', tokens.access.token, {
  //   secure: process.env.NODE_ENV === 'production',
  //   httpOnly: true,
  //   sameSite: 'Lax',
  //   maxAge: ms('14 days'),
  // });

  res.status(httpStatus.OK).send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  // res.clearCookie('refreshToken');
  // res.clearCookie('accessToken');
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  // res.cookie('accessToken', tokens.access.token, {
  //   secure: true,
  //   sameSite: 'none',
  //   maxAge: ms('14 days'),
  // });
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const loginWithGoogle = catchAsync(async (req, res) => {
  const { user } = req;
  const tokens = await tokenService.generateAuthTokens(user);

  let firebaseUser;
  try {
    firebaseUser = await auth.getUserByEmail(user.email);
    console.log('User already exists in Firebase:', firebaseUser.uid);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      firebaseUser = await auth.createUser({
        email: user.email,
        password: user.password,
      });
      console.log('User created in Firebase:', firebaseUser.uid);

      await db.ref(`users/${firebaseUser.uid}`).set({
        role: 'user',
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      throw error;
    }
  }

  await userService.updateUserById(user.id, { isEmailVerified: true });

  res.redirect(`${process.env.CLIENT_URL}?token=${tokens.access.token}&refreshToken=${tokens.refresh.token}`);
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  loginWithGoogle,
};
