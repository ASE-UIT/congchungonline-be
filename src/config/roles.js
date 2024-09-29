const allRoles = {
  user: ['uploadDocuments', 'viewNotarizationHistory'],
  admin: ['getUsers', 'manageUsers', 'uploadDocuments', 'viewNotarizationHistory', 'manageRoles'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

const getPermissionsByRoleName = (roleName) => {
  return roleRights.get(roleName);
};

module.exports = {
  roles,
  roleRights,
  getPermissionsByRoleName,
};
