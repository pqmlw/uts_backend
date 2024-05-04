const clientsService = require('./bank-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { generateUniqueAccountNumber } = require('./bank-service'); // Import the generateUniqueAccountNumber function

async function getClients(request, response, next) {
  try {
    const clients = await clientsService.getClients();
    return response.status(200).json(clients);
  } catch (error) {
    return next(error);
  }
}

async function getClient(request, response, next) {
  try {
    const client = await clientsService.getClient(request.params.id);

    if (!client) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown client');
    }

    return response.status(200).json(client);
  } catch (error) {
    return next(error);
  }
}

async function createClient(request, response, next) {
  try {
    const { name, email, accessCode, pin, balance } = request.body;

    // Generate unique account number
    const accountNumber = await generateUniqueAccountNumber(); // Await the function call

    // Perform necessary validations

    const success = await clientsService.createClient(name, email, accountNumber, accessCode, pin, balance);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create client'
      );
    }

    return response.status(200).json({ name, email, accountNumber });
  } catch (error) {
    return next(error);
  }
}

async function updateClient(request, response, next) {
  try {
    const id = request.params.id;
    const { name, email, balance } = request.body;

    // Perform necessary validations

    const success = await clientsService.updateClient(id, name, email, balance);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update client'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

async function deleteClient(request, response, next) {
  try {
    const id = request.params.id;

    const success = await clientsService.deleteClient(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete client'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

async function changeBalance(request, response, next) {
  try {
    const id = request.params.id;
    const { balance } = request.body;

    // Perform necessary validations

    const success = await clientsService.changeBalance(id, balance);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change balance'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  changeBalance,
};
