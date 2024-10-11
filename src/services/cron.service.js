const cron = require('node-cron');
const { Token } = require('../models');

const deleteExpiredTokens = async () => {
  try {
    const expiredTokens = await Token.find({
      expires: { $lt: new Date() },
    });

    if (expiredTokens.length > 0) {
      await Token.deleteMany({
        _id: { $in: expiredTokens.map((token) => token._id) },
      });
      console.log(`Deleted ${expiredTokens.length} expired tokens.`);
    } else {
      console.log('No expired tokens found.');
    }
  } catch (error) {
    console.error('Error deleting expired tokens:', error);
  }
};

const startCronJob = () => {
  cron.schedule('0 0 * * *', deleteExpiredTokens);
};

module.exports = { startCronJob };
