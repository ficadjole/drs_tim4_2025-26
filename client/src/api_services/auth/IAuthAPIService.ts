import type { AuthResponse } from "../../types/auth/AuthResponse";

/**
 * Interfejs za Auth API servis.
 */
export interface IAuthAPIService {
  prijava(email: string, lozinka: string): Promise<AuthResponse>;
  registracija(email:string,lozinka:string,ime:string,prezime:string,datumRodjenja:string,pol:string,drzava:string,ulica:string,broj:string):Promise<AuthResponse>;
}