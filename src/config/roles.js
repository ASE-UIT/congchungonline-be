const allRoles = {
  user: [
    'uploadDocuments',
    'viewNotarizationHistory',
    'createSession',
    'addUserToSession',
    'deleteUserOutOfSession',
    'joinSession',
    'getNotarizationFields',
    'getNotarizationServices',
    'getUserByEmail',
  ],
  admin: [
    'getUsers',
    'manageUsers',
    'uploadDocuments',
    'viewNotarizationHistory',
    'manageRoles',
    'manageNotarizationFields',
    'manageNotarizationServices',
    'getAllNotarizations',
    'getToDayDocumentCount',
    'getToDayUserCount',
    'getUserMonthly',
    'getTodayDocumentsByNotaryField',
    'getMonthDocumentsByNotaryField',
    'getEmployeeCount',
    'getEmployeeList',
    'getNotarizationFields',
    'getNotarizationServices',
    'getSessions',
    'getDailySessionCount',
    'getMonthlySessionCount',
    'getUserByEmail',
    'createSession',
    'addUserToSession',
    'deleteUserOutOfSession',
    'joinSession',
  ],
  notary: ['getDocumentsByRole', 'forwardDocumentStatus', 'getApproveHistory', 'joinSession'],
  secretary: ['getDocumentsByRole', 'forwardDocumentStatus', 'getApproveHistory', 'joinSession'],
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
