const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const notarizationServiceValidation = require('../../validations/notarizationService.validation');
const notarizationServiceController = require('../../controllers/notarizationService.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: NotarizationServices
 *   description: Notarization service management API
 */

router.post(
  '/createNotarizationService',
  auth('manageNotarizationServices'),
  validate(notarizationServiceValidation.createNotarizationService),
  notarizationServiceController.createNotarizationService
);

router.get(
  '/getAllNotarizationServices',
  auth('manageNotarizationServices'),
  notarizationServiceController.getAllNotarizationServices
);

router.get(
  '/getNotarizationService/:serviceId',
  auth('manageNotarizationServices'),
  notarizationServiceController.getNotarizationService
);

router.delete(
  '/deleteNotarizationService/:serviceId',
  auth('manageNotarizationServices'),
  notarizationServiceController.deleteNotarizationService
);

router.patch(
  '/updateNotarizationService/:serviceId',
  auth('manageNotarizationServices'),
  validate(notarizationServiceValidation.updateNotarizationService),
  notarizationServiceController.updateNotarizationService
);

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     NotarizationService:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the notarization service
 *         name:
 *           type: string
 *           description: Name of the notarization service
 *         fieldId:
 *           type: string
 *           description: ID of the associated notarization field
 *           example: "5f2b2b23c3a2b16f2e143b67"  # example of a NotarizationField ID
 *         description:
 *           type: string
 *           description: Description of the notarization service
 *       required:
 *         - name
 *         - fieldId
 *         - description
 *       example:
 *         id: "12345"
 *         name: "Notarization Service Example"
 *         fieldId: "5f2b2b23c3a2b16f2e143b67"
 *         description: "This is an example of a notarization service."
 */

/**
 * @swagger
 * /notarizationServices/createNotarizationService:
 *   post:
 *     summary: Create a notarization service
 *     description: Only admins can create notarization services.
 *     tags: [NotarizationServices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - fieldId
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               fieldId:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               name: Notarization Service Example
 *               fieldId: "5f2b2b23c3a2b16f2e143b67"  # example of a NotarizationField ID
 *               description: "This is an example of a notarization service."
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotarizationService'
 *       "400":
 *         description: A notarization service with the same name already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Notarization service name must be unique."
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /notarizationServices/getAllNotarizationServices:
 *   get:
 *     summary: Get all notarization services
 *     description: Only admins can retrieve all notarization services.
 *     tags: [NotarizationServices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/NotarizationService'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /notarizationServices/getNotarizationService/{serviceId}:
 *   get:
 *     summary: Get a notarization service
 *     description: Only admins can fetch notarization service details.
 *     tags: [NotarizationServices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notarization service ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotarizationService'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Notarization service not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Notarization service not found."
 */

/**
 * @swagger
 * /notarizationServices/updateNotarizationService/{serviceId}:
 *   patch:
 *     summary: Update a notarization service
 *     description: Only admins can update notarization services.
 *     tags: [NotarizationServices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notarization service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the notarization service.
 *               fieldId:
 *                 type: string
 *                 description: ID of the associated notarization field.
 *               description:
 *                 type: string
 *                 description: Detailed description of the notarization service.
 *             example:
 *               name: Updated Notarization Service
 *               fieldId: "5f2b2b23c3a2b16f2e143b67"  # example of a NotarizationField ID
 *               description: "This service has been updated with new details."
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotarizationService'
 *       "400":
 *         description: A notarization service with the same name already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Notarization service name must be unique."
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /notarizationServices/deleteNotarizationService/{serviceId}:
 *   delete:
 *     summary: Delete a notarization service
 *     description: Only admins can delete notarization services.
 *     tags: [NotarizationServices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notarization service ID
 *     responses:
 *       "200":
 *         description: Successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Notarization service deleted successfully."
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Notarization service not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Notarization service not found."
 */

module.exports = router;
