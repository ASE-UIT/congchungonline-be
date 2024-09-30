const allRoles = {
  user: ['uploadDocuments', 'viewNotarizationHistory' ,'getDocumentsByUserId'],
  admin: ['getUsers', 'manageUsers', 'uploadDocuments', 'viewNotarizationHistory', 'manageRoles', 'getDocumentsByUserId'],
  notary: ['getDocumentsByRole', 'forwardDocumentStatus', 'getDocumentsByUserId'],
  secretary: ['getDocumentsByRole', 'forwardDocumentStatus', 'getDocumentsByUserId'],
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
