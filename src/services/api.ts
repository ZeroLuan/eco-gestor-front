import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// URL base do backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const DEFAULT_TIMEOUT = 30000;

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Interceptor Request
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("auth_token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error("❌ Erro na requisição:", error);
        return Promise.reject(error);
    }
);

// Interceptor Response
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        return response.data;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || error.response.data?.error || "Erro na requisição";

            console.error(`❌ Erro ${status}:`, message);

            if (status === 401) {
                localStorage.removeItem("auth_token");
                localStorage.removeItem("user_data");
                window.location.href = "/login"; // Force redirect? Better to use react-router context if possible, but this works for now.
                return Promise.reject(new Error("Sessão expirada. Faça login novamente."));
            }
            if (status === 403) return Promise.reject(new Error("Você não tem permissão para acessar este recurso."));
            if (status === 404) return Promise.reject(new Error("Recurso não encontrado."));
            if (status >= 500) return Promise.reject(new Error("Erro no servidor. Tente novamente mais tarde."));

            return Promise.reject(new Error(message));
        }
        if (error.code === "ECONNABORTED") return Promise.reject(new Error("Requisição expirou."));
        if (error.message === "Network Error") return Promise.reject(new Error("Erro de conexão."));

        return Promise.reject(error);
    }
);

class ApiClient {
    getAuthToken(): string | null {
        return localStorage.getItem("auth_token");
    }

    setAuthToken(token: string) {
        localStorage.setItem("auth_token", token);
    }

    clearAuthToken() {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
    }

    async get<T = any>(endpoint: string, params: object = {}): Promise<T> {
        return axiosInstance.get(endpoint, { params });
    }

    async post<T = any>(endpoint: string, data: object = {}, config: AxiosRequestConfig = {}): Promise<T> {
        return axiosInstance.post(endpoint, data, config);
    }

    async put<T = any>(endpoint: string, data: object = {}, config: AxiosRequestConfig = {}): Promise<T> {
        return axiosInstance.put(endpoint, data, config);
    }

    async patch<T = any>(endpoint: string, data: object = {}, config: AxiosRequestConfig = {}): Promise<T> {
        return axiosInstance.patch(endpoint, data, config);
    }

    async delete<T = any>(endpoint: string): Promise<T> {
        return axiosInstance.delete(endpoint);
    }
}

export const apiClient = new ApiClient();
export { axiosInstance };
export default ApiClient;
