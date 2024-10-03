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
 *                 example: Failed to create session
 */

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Sessions management API
 */

router
  .route('/create-session')
  .post(
    auth('createSession'),
    validate(sessionValidation.createSession),
    sessionController.createSession
  );

/**
 * @swagger
 * /session/create-session:
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
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: The time of session in ISO format
 *                 example: "2024-10-10T20:00:00Z"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The date of session
 *                 example: "2024-10-10"
 *               duration:
 *                 type: number
 *                 description: The duration of the session in minutes
 *                 example: 120
 *             required:
 *               - sessionName
 *               - startTime
 *               - startDate
 *               - duration
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
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-10T20:00:00Z"
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-10-10"
 *                 duration:
 *                   type: number
 *                   example: 120
 *       "400":
 *         description: Bad Request - Invalid input
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
 */

module.exports = router;
