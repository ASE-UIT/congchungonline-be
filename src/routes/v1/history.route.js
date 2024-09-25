const express = require('express');
const validate = require('../../middlewares/validate');
const historyValidation = require('../../validations/history.validation');
const historyController = require('../../controllers/history.controller');
const addUUIDToHeader = require('../../middlewares/uuid');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: History
 *   description: History management API
 */

/**
 * @swagger
 * /history/{uuid}:
 *   get:
 *     summary: Retrieve history by UUID
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-request-id
 *         schema:
 *           type: string
 *         required: true
 *         description: The UUID of the notarization record to look up
 *     responses:
 *       "200":
 *         description: Notarization history details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/History'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

router
  .route('/:uuid')
  .get(addUUIDToHeader, validate(historyValidation.getHistoryByUuid), historyController.getHistoryByUuid);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     History:
 *       type: object
 *       required:
 *         - uuid
 *         - notaryService
 *         - notaryField
 *         - requesterInfo
 *       properties:
 *         uuid:
 *           type: string
 *           description: Unique ID of the notarization record
 *           example: "d73c7995-7a94-4b57-926e-299b1d3a6b8c"
 *         notaryService:
 *           type: string
 *           description: Name of the notarization service
 *           example: "Property Transfer Notarization"
 *         notaryField:
 *           type: string
 *           description: Field of notarization
 *           example: "Legal"
 *         requesterInfo:
 *           type: object
 *           description: Information about the person requesting notarization
 *           properties:
 *             citizenId:
 *               type: string
 *               description: The Citizen ID
 *               example: "123456789012"
 *             phoneNumber:
 *               type: string
 *               description: Requester's phone number
 *               example: "0941788455"
 *             email:
 *               type: string
 *               description: Requester's email address
 *               example: "example@gmail.com"
 *         files:
 *           type: array
 *           description: List of files submitted for notarization
 *           items:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *                 description: Name of the file
 *                 example: "file1.pdf"
 *               firebaseUrl:
 *                 type: string
 *                 description: Firebase URL of the file
 *                 example: "https://firebase.storage.com/file1.pdf"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the record was created
 *           example: "2024-09-25T07:32:10.000Z"
 *       example:
 *         uuid: "d73c7995-7a94-4b57-926e-299b1d3a6b8c"
 *         notaryService: "Property Transfer Notarization"
 *         notaryField: "Legal"
 *         requesterInfo:
 *           citizenId: "123456789012"
 *           phoneNumber: "0941788455"
 *           email: "example@gmail.com"
 *         files:
 *           - filename: "file1.pdf"
 *             firebaseUrl: "https://firebase.storage.com/file1.pdf"
 *           - filename: "file2.docx"
 *             firebaseUrl: "https://firebase.storage.com/file2.docx"
 *         createdAt: "2024-09-25T07:32:10.000Z"
 *
 *   responses:
 *     BadRequest:
 *       description: Invalid request parameters
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Error message
 *               code:
 *                 type: integer
 *                 description: HTTP status code
 *             example:
 *               message: "Invalid request parameters"
 *               code: 400
 *     Unauthorized:
 *       description: Unauthorized access
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Error message
 *               code:
 *                 type: integer
 *                 description: HTTP status code
 *             example:
 *               message: "Unauthorized"
 *               code: 401
 */