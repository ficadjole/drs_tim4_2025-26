import type { AuthResponse } from "../../types/auth/AuthResponse";
import type { IAuthAPIService } from "./IAuthAPIService";
import axios from "axios";

const API_URL: string = import.meta.env.VITE_GATEWAY_URL;

export const authApi: IAuthAPIService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await axios.post<AuthResponse>(`${API_URL}auth/login`, {
        email: email,
        password: password,
      });
      
      const token = res.data.accessToken;

      if(token) {
        localStorage.setItem("token", token);
      }

      return res.data;
    } catch (error) {
      let message = "Error while logging in.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.error || message; 
      }
      throw new Error(message);
      }
  },

  async register(email:string, password:string, name:string, lastName:string, dateOfBirth:string, gender:string, state:string, streetName:string, streetNumber:string):Promise<AuthResponse>{

    try {
      const res = await axios.post<AuthResponse>(`${API_URL}auth/register`, {
        email: email,
        password: password,
        firstName: name,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        gender: gender,
        state: state,
        streetName: streetName,
        streetNumber: streetNumber,
      });

      const token = res.data.accessToken;

      if(token) {
        localStorage.setItem("token", token);
      }

      return res.data;
    } catch (error) {
      let message = "Error while registering.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }
      throw new Error(message);
      }

  }
};
