export const ROLES = {
  ADMIN: 1,
  SUPER_ADMIN: 2,
  AUDITOR: 3,
  VISOR: 4,
};

export function getPermissions(roleId) {
  switch (roleId) {
    case ROLES.SUPER_ADMIN:
      return {
        canManageUsers: true,
        viewAdmin: true,
        canCreateUser: true,
        canEditUser: true,
        canManageRoles: true,
        canManageDepartments: true,
        canDeleteUsers: true,
        canEditAll: true,
      };

    case ROLES.ADMIN:
      return {
        canManageUsers: true,
        viewAdmin: true,
        canCreateUser: true,
        canEditUser: true,
        canManageRoles: false,
        canManageDepartments: true,
        canDeleteUsers: true,
        canEditAll: false,
      };

    case ROLES.AUDITOR:
    case ROLES.VISOR:
      return {
        canManageUsers: false,
        viewAdmin: false,
        canCreateUser: false,
        canEditUser: false,
        canManageRoles: false,
        canManageDepartments: false,
        canDeleteUsers: false,
        canEditAll: false,
      };

    default:
      return {};
  }
}
