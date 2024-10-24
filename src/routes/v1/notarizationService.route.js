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
  '/create-notarization-service',
  auth('manageNotarizationServices'),
  validate(notarizationServiceValidation.createNotarizationService),
  notarizationServiceController.createNotarizationService
);

router.get(
  '/get-all-notarization-services',
  auth('getNotarizationServices'),
  notarizationServiceController.getAllNotarizationServices
);

router.get(
  '/get-notarization-service/:serviceId',
  auth('getNotarizationServices'),
  notarizationServiceController.getNotarizationService
);

router.delete(
  '/delete-notarization-service/:serviceId',
  auth('manageNotarizationServices'),
  notarizationServiceController.deleteNotarizationService
);

router.patch(
  '/update-notarization-service/:serviceId',
  auth('manageNotarizationServices'),
  validate(notarizationServiceValidation.updateNotarizationService),
  notarizationServiceController.updateNotarizationService
);

router.get(
  '/get-notarization-services-by-field-id/:fieldId',
  auth('getNotarizationServices'),
  notarizationServiceController.getNotarizationServicesByFieldId
);

/**
 * @swagger
 * /notarization-services/create-notarization-service:
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
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               fieldId:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *             example:
 *               name: Notarization Service Example
 *               fieldId: "5f2b2b23c3a2b16f2e143b67"  # example of a NotarizationField ID
 *               description: "This is an example of a notarization service."
 *               price: 10000.00
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
 * /notarization-services/get-all-notarization-services:
 *   get:
 *     summary: Get all notarization services
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
 * /notarization-services/get-notarization-service/{serviceId}:
 *   get:
 *     summary: Get a notarization service
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
 * /notarization-services/update-notarization-service/{serviceId}:
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
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the notarization service.
 *             example:
 *               name: Updated Notarization Service
 *               fieldId: "5f2b2b23c3a2b16f2e143b67"  # example of a NotarizationField ID
 *               description: "This service has been updated with new details."
 *               price: 12000.00
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
 * /notarization-services/delete-notarization-service/{serviceId}:
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
 *       "204":
 *         description: No Content
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
 * /notarization-services/get-notarization-services-by-field-id/{fieldId}:
 *   get:
 *     summary: Get notarization services by field ID
 *     tags: [NotarizationServices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fieldId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notarization field ID
 *     responses:
 *       "200":
 *         description: List of notarization services found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NotarizationService'
 *       "400":
 *         description: Invalid field ID provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Invalid fieldId provided."
 *       "404":
 *         description: No notarization services found for the given field
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "No notarization services found for the given field."
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Error fetching notarization services by field."
 */

module.exports = router;
