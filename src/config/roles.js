const allRoles = {
  user: ['uploadDocuments', 'viewNotarizationHistory'],
  admin: ['getUsers', 'manageUsers', 'uploadDocuments', 'viewNotarizationHistory'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
