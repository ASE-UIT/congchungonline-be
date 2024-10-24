const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Notarization Platform API',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/ASE-UIT/03.-Online-Notarization-Management-System-BE/blob/main/LICENSE',
    },
  },
  servers: [
    {
      url: `${config.host}/v1`,
    },
  ],
};

module.exports = swaggerDef;
