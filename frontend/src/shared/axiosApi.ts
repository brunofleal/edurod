import axios from "axios";
import { deleteToken } from "./token";

console.log(import.meta.env.VITE_BASE_URL);
const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosApi.interceptors.response.use(undefined, async (error) => {
  if (error.response?.status === 401) {
    await deleteToken();
  }
});

export { axiosApi };
