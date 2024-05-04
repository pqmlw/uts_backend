const logger = require('../src/core/logger')('api');
const { Transfer } = require('../src/models');

const accountNumber = '1234567899';
const accessCode = 'kzhy28'; 
const pin = '123456';

logger.info('Creating client account');

(async () => {
  try {
    const numTransfers = await Transfer.countDocuments({
      accountNumber, 
      accessCode,
      pin,
    });

    if (numTransfers > 0) {
      throw new Error(`Client ${accountNumber} already exists`);
    }

    await Transfer.create({
      accountNumber,
      accessCode,
      pin,
    });
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit(0);
  }
})();
