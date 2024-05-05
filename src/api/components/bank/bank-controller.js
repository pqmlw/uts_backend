const clientsService = require('./bank-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { generateUniqueAccountNumber } = require('./bank-service');

// Fungsi untuk menampilkan list clients
async function getClients(request, response, next) {
  try {
    const clients = await clientsService.getClients();
    return response.status(200).json(clients);
  } catch (error) {
    return next(error);
  }
}

// Fungsi untuk menampilkan client berdasarkan id
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

// Fungsi untuk membuat akun client
async function createClient(request, response, next) {
  try {
    const { name, email, accessCode, pin, balance } = request.body;

    // Angka random untuk account number
    const accountNumber = await generateUniqueAccountNumber(); 

    const success = await clientsService.createClient(name, email, accountNumber, accessCode, pin, balance);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create client'
      );
    }

    return response.status(200).json({ 
      message: 'Account created successfully',
      data: {
        name,
        email,
        accountNumber,
        accessCode,
        pin,
        balance,
      }
    });
  } catch (error) {
    return next(error);
  }
}

// Fungsi untuk update data client
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

    return response.status(200).json({ 
      message: 'Account updated successfully',
      data: {
        id,
        name,
        email,
        balance,
      }
    });
  } catch (error) {
    return next(error);
  }
}

// Fungsi untuk menghapus akun client
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

    return response.status(200).json({ 
      id,
      message: 'Account deleted successfully'
    });
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
};
