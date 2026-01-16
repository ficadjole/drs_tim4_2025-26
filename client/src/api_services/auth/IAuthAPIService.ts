import type { AuthResponse } from "../../types/auth/AuthResponse";

/**
 * Interfejs za Auth API servis.
 */
export interface IAuthAPIService {
  login(email: string, password: string): Promise<AuthResponse>;
  register(email:string, password:string, name:string, lastName:string, dateOfBirth:string, gender:string, state:string, street:string, streetNumber:string):Promise<AuthResponse>;
}