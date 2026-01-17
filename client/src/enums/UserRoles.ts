
export const UserRole = {
  USER: "USER",
  MANAGER: "MANAGER",
  ADMINISTRATOR: "ADMINISTRATOR"
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];