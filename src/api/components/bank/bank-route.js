const express = require('express');

const bankMiddleware = require('../../middlewares/bank-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const bankController = require('./bank-controller');
const bankValidator = require('./bank-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/bank', route);

  // Get list of transfers
  route.get('/', bankMiddleware, bankController.getTransferHistory);

  // Login 
  route.post(
    '/login',
    celebrate(bankValidator.login),
    bankController.login
  );

  // Create transfer
  route.post(
    '/',
    bankMiddleware,
    celebrate(bankValidator.createTransfer),
    bankController.createTransfer
  );

  // Update transfer pin
  route.put(
    '/:pin',
    bankMiddleware,
    celebrate(bankValidator.updateTransferPin),
    bankController.updateTransferPin
  );

  // Delete account
  route.delete(
    '/:account',
    bankMiddleware,
    bankController.deleteAccount
  );

  // Get transfer history
  route.get(
    '/history',
    bankMiddleware,
    bankController.getTransferHistory
  );
};
