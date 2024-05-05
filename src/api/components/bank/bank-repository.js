const { Client } = require('../../../models');

// Menampilkan list clients
async function getClients() {
  return Client.find({});
}

// Menampilkan client berdasarkan id
async function getClient(id) {
  return Client.findById(id);
}

// Membuat akun client baru
async function createClient(name, email, accountNumber, accessCode, pin, balance) {
  return Client.create({
    name,
    email,
    accountNumber,
    accessCode,
    pin,
    balance,
  });
}

// Mengupdate info client
async function updateClient(id, name, email, balance) {
  return Client.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
        balance,
      },
    }
  );
}

// Menghapus akun client
async function deleteClient(id) {
  return Client.deleteOne({ _id: id });
}

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
};
