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

router.post('/createNotarizationField', auth('manageNotarizationFields'), validate(notarizationFieldValidation.createNotarizationField), notarizationFieldController.createNotarizationField);
router.get('/getAllNotarizationFields', auth('manageNotarizationFields'), notarizationFieldController.getAllNotarizationFields);
router.get('/getNotarizationField/:id', auth('manageNotarizationFields'), notarizationFieldController.getNotarizationField);
router.delete('/deleteNotarizationField/:id', auth('manageNotarizationFields'), notarizationFieldController.deleteNotarizationField);
router.patch('/updateNotarizationField/:id', auth('manageNotarizationFields'), validate(notarizationFieldValidation.updateNotarizationField), notarizationFieldController.updateNotarizationField);

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
 * /notarizationFields/createNotarizationField:
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
 * /notarizationFields/getAllNotarizationFields:
 *   get:
 *     summary: Get all notarization fields
 *     description: Only admins can retrieve all notarization fields.
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
 * /notarizationFields/getNotarizationField/{notarizationFieldId}:
 *   get:
 *     summary: Get a notarization field
 *     description: Only admins can fetch notarization field details.
 *     tags: [NotarizationFields]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notarizationFieldId
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
  * /notarizationFields/deleteNotarizationField/{notarizationFieldId}:
 *   delete:
 *     summary: Delete a notarization field
 *     description: Only admins can delete notarization fields.
 *     tags: [NotarizationFields]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notarizationFieldId
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
 * /notarizationFields/updateNotarizationField/{notarizationFieldId}:
 *   patch:
 *     summary: Update a notarization field
 *     description: Only admins can update notarization fields.
 *     tags: [NotarizationFields]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notarizationFieldId
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