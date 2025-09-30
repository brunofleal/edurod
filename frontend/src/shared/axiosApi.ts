import axios from "axios";
import { deleteToken, getToken } from "./token";

console.log(`Using backend url: ${import.meta.env.VITE_BASE_URL}`);
const axiosApi = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

// Request interceptor to add auth-token header
axiosApi.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers["auth-token"] = token;
    }
    return config;
});

axiosApi.interceptors.response.use(undefined, async (error) => {
    if (error.response?.status === 401) {
        await deleteToken();
    }
});

export { axiosApi };
