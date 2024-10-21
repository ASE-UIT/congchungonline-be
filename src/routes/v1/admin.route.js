const express = require('express');
const auth = require('../../middlewares/auth');
const { adminController } = require('../../controllers');

const router = express.Router();

// Document metrics
router.get('/documents/today', auth('getToDayDocumentCount'), adminController.getToDayDocumentCount);

router.get('/users/today', auth('getToDayUserCount'), adminController.getToDayUserCount);

router.get('/users/monthly', auth('getUserMonthly'), adminController.getUserMonthly);

router.get(
  '/documents/fields/daily',
  auth('getTodayDocumentsByNotaryField'),
  adminController.getTodayDocumentsByNotaryField
);

router.get(
  '/documents/fields/monthly',
  auth('getMonthDocumentsByNotaryField'),
  adminController.getMonthDocumentsByNotaryField
);

// Employee metrics
router.get('/employees/count', auth('getEmployeeCount'), adminController.getEmployeeCount);

router.get('/employees/list', auth('getEmployeeList'), adminController.getEmployeeList);

// Session metrics
router.get('/sessions/daily', auth('getDailySessionCount'), adminController.getDailySessionCount);

router.get('/sessions/monthly', auth('getMonthlySessionCount'), adminController.getMonthlySessionCount);

// Payment metrics
router.get('/payments/daily', auth('getDailyPaymentTotal'), adminController.getDailyPaymentTotal);

router.get('/payments/monthly', auth('getMonthlyPaymentTotal'), adminController.getMonthlyPaymentTotal);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Admin management and retrieval
 */

/**
 * @swagger
 * /admin/metrics/documents/today:
 *   get:
 *     summary: Get today's document count and percent document growth
 *     description: Only admins can retrieve today's document count and growth percentage.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documentCount:
 *                   type: integer
 *                   description: The number of documents created today
 *                   example: 20
 *                 percentGrowth:
 *                   type: number
 *                   description: The percentage growth of documents from previous day
 *                   example: 15.5
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 */

/**
 * @swagger
 * /admin/metrics/users/today:
 *   get:
 *     summary: Get today's user count and percent user growth
 *     description: Only admins can retrieve today's user count and growth percentage.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userCount:
 *                   type: integer
 *                   description: The number of users created today
 *                   example: 20
 *                 percentGrowth:
 *                   type: number
 *                   description: The percentage growth of users from previous day
 *                   example: 15.5
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 */

/**
 * @swagger
 * /admin/metrics/documents/fields/daily:
 *   get:
 *     summary: Get today's document count by notary field
 *     description: Retrieve the number of documents created today, grouped by notary fields. Only admins can access this information.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todayDocumentsByNotaryField:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The name of the notary field
 *                         example: "Example Notary Field"
 *                       count:
 *                         type: integer
 *                         description: The number of documents created today for this notary field
 *                         example: 1
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 */

/**
 * @swagger
 * /admin/metrics/employees/count:
 *   get:
 *     summary: Get the count of employees with role 'notary'
 *     description: Retrieve the total number of employees with the role of 'notary'.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notaryCount:
 *                   type: integer
 *                   description: The number of employees with the role 'notary'
 *                   example: 10
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 */

/**
 * @swagger
 * /admin/metrics/employees/list:
 *   get:
 *     summary: Get the list of employees with role 'notary' and 'secretary'
 *     description: Retrieve a list of employees with the role of 'notary' and 'secretary'.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 *       "500":
 *         description: Internal server error
 */

/**
 * @swagger
 * /admin/metrics/sessions/daily:
 *   get:
 *     summary: Get today's session count
 *     description: Retrieve the number of sessions created today. Only admins can access this information.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *               description: The number of sessions created today
 *               example: 1
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 */

/**
 * @swagger
 * /admin/metrics/sessions/monthly:
 *   get:
 *     summary: Get month's session count
 *     description: Retrieve the number of sessions created this month. Only admins can access this information.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *               description: The number of sessions created this month
 *               example: 1
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 */

/**
 * @swagger
 * /admin/metrics/payments/daily:
 *   get:
 *     summary: Get today's total payment value
 *     description: Retrieve the total value of payments created today. Only admins can access this information.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: number
 *               description: The total value of payments created today
 *               example: 1000
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 */

/**
 * @swagger
 * /admin/metrics/payments/monthly:
 *   get:
 *     summary: Get month's total payment value
 *     description: Retrieve the total value of payments created this month. Only admins can access this information.
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: number
 *               description: The total value of payments created this month
 *               example: 10000
 *       "401":
 *         description: Unauthorized access - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - the user doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not found - endpoint does not exist
 */
