const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const chatbotRoute = require('./chatbot.route');
const notarizationRoute = require('./notarization.route');
const roleRoute = require('./role.route');
const sessionRoute = require('./session.route');
const notarizationFieldRoute = require('./notarizationField.route');
const notarizationServiceRoute = require('./notarizationService.route');
const config = require('../../config/config');
const adminRoute = require('./admin.route');
// const { path } = require('../../app');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },

  {
    path: '/chatbot',
    route: chatbotRoute,
  },
  {
    path: '/notarization',
    route: notarizationRoute,
  },
  {
    path: '/role',
    route: roleRoute,
  },
  {
    path: '/notarization-fields',
    route: notarizationFieldRoute,
  },
  {
    path: '/notarization-services',
    route: notarizationServiceRoute,
  },
  {
    path: '/admin/metrics',
    route: adminRoute,
  },
  {
    path: '/session',
    route: sessionRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
