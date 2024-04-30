const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers({ page_number = 1, page_size = 10, sort, search } = {}) {
  const parsedSort = sort || { email: 'asc' };
  const parsedSearch = search || {};

  // Validate the sort and search fields
  const allowedFields = ['email', 'name'];
  for (const [field, order] of Object.entries(parsedSort)) {
    if (!allowedFields.includes(field)) {
      throw new Error(`Invalid sort field: ${field}`);
    }
  }
  for (const [field, value] of Object.entries(parsedSearch)) {
    if (!allowedFields.includes(field)) {
      throw new Error(`Invalid search field: ${field}`);
    }
  }

  // Build the query and sort objects for the repository
  const query = {};
  if (parsedSearch.email) {
    query.email = { $regex: parsedSearch.email, $options: 'i' };
  }
  if (parsedSearch.name) {
    query.name = { $regex: parsedSearch.name, $options: 'i' };
  }
  const sortObj = {};
  for (const [field, order] of Object.entries(parsedSort)) {
    sortObj[field] = order;
  }

  // Get the users from the repository
  const users = await usersRepository.getUsers({ query, sort: sortObj });

  // Count the number of users that match the query
  const totalUsers = await usersRepository.countUsers(query);

  // Calculate pagination information
  const totalPages = Math.ceil(totalUsers / page_size);
  const hasPreviousPage = page_number > 1;const hasNextPage = page_number < totalPages;

  // Map the user documents to a simpler response object
  const results = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));

  // Return the response object
  return {
    page_number,
    page_size,
    count: results.length,
    total_pages: totalPages,
    has_previous_page: hasPreviousPage,
    has_next_page: hasNextPage,
    data: results,
  };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
