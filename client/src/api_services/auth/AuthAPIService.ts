import type { AuthResponse } from "../../types/auth/AuthResponse";
import type { IAuthAPIService } from "./IAuthAPIService";
import axios from "axios";

const API_URL: string = import.meta.env.VITE_GATEWAY_URL;

export const authApi: IAuthAPIService = {
  async prijava(korisnickoIme: string, lozinka: string): Promise<AuthResponse> {
    try {
      const res = await axios.post<AuthResponse>(`${API_URL}auth/login`, {
        email: korisnickoIme,
        password: lozinka,
      });
      
      const token = res.data.accessToken;

      if(token) {
        localStorage.setItem("token", token);
      }

      return res.data;
    } catch (error) {
      let message = "Greška prilikom prijave.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.error || message; 
      }
      throw new Error(message);
      }
  },

  async registracija(email:string,lozinka:string,ime:string,prezime:string,datumRodjenja:string,pol:string,drzava:string,ulica:string,broj:string):Promise<AuthResponse>{

    try {
      const res = await axios.post<AuthResponse>(`${API_URL}users/register`, {
        email: email,
        password: lozinka,
        firstName:ime,
        lastName:prezime,
        dateOfBirth:datumRodjenja,
        gender:pol,
        state:drzava,
        streetName:ulica,
        streetNumber:broj,
      });

      const token = res.data.accessToken;

      if(token) {
        localStorage.setItem("token", token);
      }

      return res.data;
    } catch (error) {
      let message = "Greška prilikom registracije.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }
      throw new Error(message);
      }

  }
};
