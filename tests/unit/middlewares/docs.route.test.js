// // docs.route.test.js
// const request = require('supertest');
// const express = require('express');
// const swaggerUi = require('swagger-ui-express');
// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerDefinition = require('../../../src/docs/swaggerDef');
// const docsRoutes = require('../../../src/routes/v1/docs.route');

// jest.mock('swagger-ui-express');
// jest.mock('swagger-jsdoc');

// swaggerJsdoc.mockReturnValue({
//   swaggerDefinition,
//   apis: ['src/docs/*.yml', 'src/routes/v1/*.js'],
// });

// swaggerUi.serve.mockReturnValue((req, res, next) => next());
// swaggerUi.setup.mockReturnValue((req, res) => res.send('Swagger UI'));

// const app = express();
// app.use('/v1/docs', docsRoutes);

// describe('Docs Routes', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('GET /v1/docs nên trả về 200 và hiển thị Swagger UI', async () => {
//     const response = await request(app).get('/v1/docs').expect(200);
//     expect(response.text).toBe('Swagger UI');
//   });
// });
