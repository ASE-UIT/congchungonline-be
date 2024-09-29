const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const roleValidation = require('../../validations/role.validation');
const roleController = require('../../controllers/role.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management API
 */

/**
 * @swagger
 *  /role/createRole:
 *   post:
 *    summary: Create a role
 *    description: Only admins can create other roles.
 *    tags: [Roles]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Role'
 *    responses:
 *      "201":
 *        description: Role created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Role'
 *      "400":
 *        $ref: '#/components/responses/BadRequest'
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *      "403":
 *        $ref: '#/components/responses/Forbidden'
 *      "500":
 *        $ref: '#/components/responses/InternalServerError'
 */
router.post('/createRole', auth('manageRoles'), validate(roleValidation.createRole), roleController.createRole);

/**
 * @swagger
 *  /role/getRoles:
 *   get:
 *    summary: Get all roles
 *    description: Only admins can get all roles.
 *    tags: [Roles]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      "200":
 *        description: Roles retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Role'
 *      "400":
 *        $ref: '#/components/responses/BadRequest'
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *      "403":
 *        $ref: '#/components/responses/Forbidden'
 *      "500":
 *        $ref: '#/components/responses/InternalServerError'
 */
router.get('/getRoles', auth('manageRoles'), roleController.getRoles);

/**
 * @swagger
 *  /role/getRole/{roleId}:
 *   get:
 *    summary: Get a role by ID
 *    description: Only admins can get a role by ID.
 *    tags: [Roles]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: roleId
 *        required: true
 *        schema:
 *          type: string
 *        description: ID of the role to retrieve
 *    responses:
 *      "200":
 *        description: Role retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Role'
 *      "400":
 *        $ref: '#/components/responses/BadRequest'
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *      "403":
 *        $ref: '#/components/responses/Forbidden'
 *      "404":
 *        $ref: '#/components/responses/NotFound'
 *      "500":
 *        $ref: '#/components/responses/InternalServerError'
 */
router.get('/getRole/:roleId', auth('manageRoles'), roleController.getRole);

/**
 * @swagger
 *  /role/updateRole/{roleId}:
 *   patch:
 *    summary: Update a role by ID
 *    description: Only admins can update a role by ID.
 *    tags: [Roles]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: roleId
 *        required: true
 *        schema:
 *          type: string
 *        description: ID of the role to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Role'
 *    responses:
 *      "200":
 *        description: Role updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Role'
 *      "400":
 *        $ref: '#/components/responses/BadRequest'
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *      "403":
 *        $ref: '#/components/responses/Forbidden'
 *      "404":
 *        $ref: '#/components/responses/NotFound'
 *      "500":
 *        $ref: '#/components/responses/InternalServerError'
 */
router.patch('/updateRole/:roleId', auth('manageRoles'), validate(roleValidation.updateRole), roleController.updateRole);

/**
 * @swagger
 *  /role/deleteRole/{roleId}:
 *   delete:
 *    summary: Delete a role by ID
 *    description: Only admins can delete a role by ID.
 *    tags: [Roles]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: roleId
 *        required: true
 *        schema:
 *          type: string
 *        description: ID of the role to delete
 *    responses:
 *      "204":
 *        description: Role deleted successfully
 *      "400":
 *        $ref: '#/components/responses/BadRequest'
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *      "403":
 *        $ref: '#/components/responses/Forbidden'
 *      "404":
 *        $ref: '#/components/responses/NotFound'
 *      "500":
 *        $ref: '#/components/responses/InternalServerError'
 */
router.delete('/deleteRole/:roleId', auth('manageRoles'), roleController.deleteRole);

module.exports = router;
