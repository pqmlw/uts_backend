const joi = require('joi');

module.exports = {
  createClient: {
    body: {
      name: joi.string().required().label('Name'),
      email: joi.string().email().required().label('Email'),
      accessCode: joi.string().required().label('Access Code'),
      pin: joi.number().required().label('PIN'),
      balance: joi.number().required().label('Balance'),
    },
  },

  updateClient: {
    body: {
      name: joi.string().required().label('Name'),
      email: joi.string().email().required().label('Email'),
      accessCode: joi.string().required().label('Access Code'),
      pin: joi.number().required().label('PIN'),
      balance: joi.number().required().label('Balance'),
    },
  },

  deleteClient: {
    body: {
      clientId: joi.number().required().label('Client ID'),
    },
  },

  changeBalance: {
    body: {
      balance: joi.number().required().label('Balance')
    }
  }
};
