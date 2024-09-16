const express = require('express');
const validate = require('../../middlewares/validate');
const chatbotValidation = require('../../validations/chatbot.validation');
const chatbotController = require('../../controllers/chatbot.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chatbot
 *   description: Chatbot API
 */

router.post('/', validate(chatbotValidation.chatbot), chatbotController.chatbot);
router.post('/chatbot', validate(chatbotValidation.chatbot), chatbotController.chatbot);

module.exports = router;

/**
 * @swagger
 * /chatbot:
 *   post:
 *     summary: Chat with chatbot
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The message to send to the chatbot
 *             example:
 *               prompt: Hello, how are you?
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prompt:
 *                   type: string
 *                   description: The chatbot's response
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */
