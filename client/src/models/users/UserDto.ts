import type { UserRoleType } from "../../enums/UserRoles";

export interface User {
  id: number;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; 
  gender: string;
  state: string;
  streetName: string;
  streetNumber: string;
  accountBalance: number;
  userRole: UserRoleType;
  userImageUrl: string;
}