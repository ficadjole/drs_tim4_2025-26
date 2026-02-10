import axios from "axios";
import type { User } from "../../models/users/UserDto";

const API_URL: string = import.meta.env.VITE_GATEWAY_URL + "users";

export const userApi = {
  async getAllUsers(): Promise<User[]> {
    const res = await axios.get<User[]>(`${API_URL}/getAll`);
    return res.data;
  },

  async getUserById(id: number): Promise<User | undefined> {
    const users = await axios.get<User>(`${API_URL}/${id}`);
    return users.data;
  },

  async updateUser(id: number, userData: any): Promise<any> {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${API_URL}/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  async createUser(userData: User): Promise<User>{
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API_URL}/register`,userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  async deleteUser(id: number): Promise<any> {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  async addMoney(id:number,money:number) :Promise<boolean>{
    const token = localStorage.getItem("token");
    const res = await axios.put(`${API_URL}/add-money/${id}`,{money: money},{
      headers: { Authorization: `Bearer ${token}` }
    });
    return  res.data;
  }
};