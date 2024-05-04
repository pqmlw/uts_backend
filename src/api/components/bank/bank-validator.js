const joi = require('joi');

module.exports = {
  login: {
    body: {
      accountNumber: joi.string().required().label('Nomor rekening'),
      accessCode: joi.string().required().label('Access code'),
    },
  },

  createTransfer: {
    body: {
      accountNumber: joi.string().required().label('Account number'),
      accessCode: joi.string().required().label('Access code'),
      pin: joi.number().required().label('PIN'),
    },
  },

  updateTransferPin: {
    body: {
      pin: joi.string().required().label('Pin'),
    },
  },

  deleteAccount: {
    body: {
      accountNumber: joi.string().required().label('Nomor rekening tujuan'),
    },
  },
};