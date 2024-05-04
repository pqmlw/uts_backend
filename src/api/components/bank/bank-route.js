const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const bankController = require('./bank-controller');
const bankValidator = require('./bank-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/clients', route);

  // Get list of clients
  route.get('/', authenticationMiddleware, bankController.getClients);

  // Create client
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(bankValidator.createClient),
    bankController.createClient
  );

  // Get client detail
  route.get('/:id', authenticationMiddleware, bankController.getClient);

  // Update client
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(bankValidator.updateClient),
    bankController.updateClient
  );

  // Delete client
  route.delete('/:id', authenticationMiddleware, bankController.deleteClient);

  // Change balance
  route.post(
    '/:id/change-balance',
    authenticationMiddleware,
    celebrate(bankValidator.changeBalance),
    bankController.changeBalance
  );
};
