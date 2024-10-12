const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const sessionValidation = require('../../validations/session.validation');
const sessionController = require('../../controllers/session.controller');

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: 'JWT authorization header. Use `Bearer <token>` format.'
 *
 *   responses:
 *     BadRequest:
 *       description: Bad Request
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Invalid request parameters
 *     Unauthorized:
 *       description: Unauthorized access
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Unauthorized
 *     InternalServerError:
 *       description: Internal Server Error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 */

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Sessions management API
 */

router
  .route('/createSession')
  .post(auth('createSession'), validate(sessionValidation.createSession), sessionController.createSession);

router
  .route('/addUser/:sessionId')
  .patch(auth('addUserToSession'), validate(sessionValidation.addUserToSession), sessionController.addUserToSession);

router
  .route('/deleteUser/:sessionId')
  .patch(
    auth('deleteUserOutOfSession'),
    validate(sessionValidation.deleteUserOutOfSession),
    sessionController.deleteUserOutOfSession
  );

router
  .route('/joinSession/:sessionId')
  .post(auth('joinSession'), validate(sessionValidation.joinSession), sessionController.joinSession);

router.route('/getAllSessions').get(auth('getSessions'), sessionController.getAllSessions);

router
  .route('/getSessionsByDate')
  .get(auth('getSessions'), validate(sessionValidation.getSessionsByDate), sessionController.getSessionsByDate);

router
  .route('/getSessionsByMonth')
  .get(auth('getSessions'), validate(sessionValidation.getSessionsByMonth), sessionController.getSessionsByMonth);

router.route('/getActiveSessions').get(auth('getSessions'), sessionController.getActiveSessions);
/**
 * @swagger
 * /session/createSession:
 *   post:
 *     summary: Create session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionName:
 *                 type: string
 *                 description: The name of the session
 *                 example: "Notarization Session"
 *               notaryField:
 *                 type: object
 *                 description: The field of the notary
 *                 example: {"name": "Notary Field"}
 *               notaryService:
 *                 type: object
 *                 description: The Service of the notary
 *                 example: {"name": "Notary Service"}
 *               startTime:
 *                 type: string
 *                 format: time
 *                 description: The time of session
 *                 example: "14:00"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The date of session
 *                 example: "2024-10-10"
 *               endTime:
 *                 type: string
 *                 format: time
 *                 description: The time of session
 *                 example: "15:00"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The date of session
 *                 example: "2024-10-10"
 *               users:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                 description: List of users related to the session
 *                 example: [{email: "abc@gmail.com"}, {email: "def@gmail.com"}]
 *             required:
 *               - sessionName
 *               - startTime
 *               - startDate
 *               - endTime
 *               - endDate
 *               - users
 *               - notaryField
 *               - notaryService
 *     responses:
 *       "201":
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionName:
 *                   type: string
 *                   example: "Notarization Session"
 *                 notaryField:
 *                    type: string
 *                    example: "Notary Field"
 *                 notaryService:
 *                    type: string
 *                    example: "Notary Service"
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-10T20:00:00Z"
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-10-10"
 *                 endTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-10T21:00:00Z"
 *                 endDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-10-10"
 *                 users:
 *                   type: array
 *                   items:
 *                      type: object
 *                      properties:
 *                        email:
 *                          type: string
 *                   example: "abc@gmail.com"
 *                 createdBy:
 *                   type: string
 *
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to create session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to create session"
 * */
/**
 * @swagger
 * /session/addUser/{sessionId}:
 *   patch:
 *     summary: Add user to session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of email addresses add to the session
 *                 example: ["abc@gmail.com", "def@gmail.com"]
 *             required:
 *               - emails
 *     responses:
 *       "201":
 *         description: User was added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                   example: "66fe4c6b76f99374f4c87165"
 *                 emails:
 *                   type: array
 *                   items:
 *                      type: string
 *                   example: "abc@gmail.com"
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to add user to session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to add user to session"
 * */
/**
 * @swagger
 * /session/deleteUser/{sessionId}:
 *   patch:
 *     summary: Delete user from session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of email addresses to delete from the session
 *                 example: ["abc@gmail.com", "def@gmail.com"]
 *             required:
 *               - emails
 *     responses:
 *       "200":
 *         description: User was deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                   example: "66fe4c6b76f99374f4c87165"
 *                 emails:
 *                   type: array
 *                   items:
 *                      type: string
 *                   example: "abc@gmail.com"
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to delete user from session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to delete user from session"
 * */
/**
 * @swagger
 * /session/joinSession/{sessionId}:
 *   post:
 *     summary: Join session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session
 *     requestBody:
 *       action: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 description: The action of the session
 *                 example: "accept"
 *             required:
 *               - action
 *     responses:
 *       "200":
 *         description: Session joined successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                   example: "66fe4c6b76f99374f4c87165"
 *                 email:
 *                   type: array
 *                   items:
 *                      type: string
 *                   example: "abc@gmail.com"
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to join session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to join session"
 * */
/**
 * @swagger
 * /session/getAllSessions:
 *   get:
 *     summary: Get all sessions
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: All sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sessionName:
 *                     type: string
 *                     example: "Notarization Session"
 *                   notaryField:
 *                      type: string
 *                      example: "Notary Field"
 *                   notaryService:
 *                      type: string
 *                      example: "Notary Service"
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T20:00:00Z"
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T21:00:00Z"
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   email:
 *                     type: array
 *                     items:
 *                        type: string
 *                     example: "abc@gmail.com"
 *                   createdBy:
 *                     type: string
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to retrieve sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve sessions"
 * */
/**
 * @swagger
 * /session/getSessionsByDate:
 *   get:
 *     summary: Get sessions by date
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date of the sessions
 *         example: "2024-10-10"
 *     responses:
 *       "200":
 *         description: Sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sessionName:
 *                     type: string
 *                     example: "Notarization Session"
 *                   notaryField:
 *                      type: string
 *                      example: "Notary Field"
 *                   notaryService:
 *                      type: string
 *                      example: "Notary Service"
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T20:00:00Z"
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T21:00:00Z"
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   email:
 *                     type: array
 *                     items:
 *                        type: string
 *                     example: "abc@gmail.com"
 *                   createdBy:
 *                     type: string
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to retrieve sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve sessions"
 * */
/**
 * @swagger
 * /session/getSessionsByMonth:
 *   get:
 *     summary: Get sessions by month
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The month of the sessions
 *         example: "2024-10"
 *     responses:
 *       "200":
 *         description: Sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sessionName:
 *                     type: string
 *                     example: "Notarization Session"
 *                   notaryField:
 *                      type: string
 *                      example: "Notary Field"
 *                   notaryService:
 *                      type: string
 *                      example: "Notary Service"
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T20:00:00Z"
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T21:00:00Z"
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   email:
 *                     type: array
 *                     items:
 *                        type: string
 *                     example: "abc@gmail.com"
 *                   createdBy:
 *                     type: string
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to retrieve sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve sessions"
 * */
/**
 * @swagger
 * /session/getActiveSessions:
 *   get:
 *     summary: Get active sessions
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Active sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sessionName:
 *                     type: string
 *                     example: "Notarization Session"
 *                   notaryField:
 *                      type: string
 *                      example: "Notary Field"
 *                   notaryService:
 *                      type: string
 *                      example: "Notary Service"
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T20:00:00Z"
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-10T21:00:00Z"
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   email:
 *                     type: array
 *                     items:
 *                        type: string
 *                     example: "abc@gmail.com"
 *                   createdBy:
 *                     type: string
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       "500":
 *         description: Internal Server Error - Failed to retrieve sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve sessions"
 * */
module.exports = router;
