const allRoles = {
  admin: ['getUsers', 'manageUsers', 'uploadDocuments', 'viewNotarizationHistory', 'manageRoles'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
