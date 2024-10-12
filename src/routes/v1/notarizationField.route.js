const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const notarizationFieldValidation = require('../../validations/notarizationField.validation');
const notarizationFieldController = require('../../controllers/notarizationField.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: NotarizationFields
 *   description: Notarization field management API
 */

router.post(
  '/create-notarization-field',
  auth('manageNotarizationFields'),
  validate(notarizationFieldValidation.createNotarizationField),
  notarizationFieldController.createNotarizationField
);
router.get(
  '/get-all-notarization-fields',
  auth('getNotarizationFields'),
  notarizationFieldController.getAllNotarizationFields
);
router.get(
  '/get-notarization-field/:fieldId',
  auth('getNotarizationFields'),
  notarizationFieldController.getNotarizationField
);
router.delete(
  '/delete-notarization-field/:fieldId',
  auth('manageNotarizationFields'),
  notarizationFieldController.deleteNotarizationField
);
router.patch(
  '/update-notarization-field/:fieldId',
  auth('manageNotarizationFields'),
  validate(notarizationFieldValidation.updateNotarizationField),
  notarizationFieldController.updateNotarizationField
);

/**
 * @swagger
 * components:
 *   schemas:
 *     NotarizationField:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for a notarization field.
 *         name:
 *           type: string
 *           description: The name of the notarization field.
 *       required:
 *         - id
 *         - name
 *       example:
 *         id: "12345"
 *         name: "Notarization Field Example"
 *
 *   responses:
 *     DuplicateName:
 *       description: A notarization field with the same name already exists.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *             example:
 *               message: "Notarization field name must be unique."
 *     Unauthorized:
 *       description: Unauthorized access.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *             example:
 *               message: "Unauthorized."
 *     Forbidden:
 *       description: Forbidden access.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *             example:
 *               message: "Forbidden."
 *     NotFound:
 *       description: Notarization field not found.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *             example:
 *               message: "Notarization field not found."
 */

/**
 * @swagger
 * /notarization-fields/create-notarization-field:
 *   post:
 *     summary: Create a notarization field
 *     description: Only admins can create notarization fields.
 *     tags: [NotarizationFields]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               name: Notarization Field Example
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotarizationField'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 * /notarization-fields/get-all-notarization-fields:
 *   get:
 *     summary: Get all notarization fields
 *     tags: [NotarizationFields]
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
 *                     $ref: '#/components/schemas/NotarizationField'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 * /notarization-fields/get-notarization-field/{fieldId}:
 *   get:
 *     summary: Get a notarization field
 *     tags: [NotarizationFields]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fieldId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notarization field id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotarizationField'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 * /notarization-fields/delete-notarization-field/{fieldId}:
 *   delete:
 *     summary: Delete a notarization field
 *     description: Only admins can delete notarization fields.
 *     tags: [NotarizationFields]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fieldId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notarization field id
 *     responses:
 *       "200":   # Changed from 204 to 200 to indicate success with a message
 *         description: Successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Notarization field deleted successfully"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 * /notarization-fields/update-notarization-field/{fieldId}:
 *   patch:
 *     summary: Update a notarization field
 *     description: Only admins can update notarization fields.
 *     tags: [NotarizationFields]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fieldId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: Updated Notarization Field
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotarizationField'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

module.exports = router;
