import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig, } from "axios";
import { getAuth } from "firebase/auth";

// Extend AxiosRequestConfig with custom options
declare module "axios" {
    export interface AxiosRequestConfig {
        skipLoader?: boolean;
        skipAuth?: boolean;
        skipContentType?: boolean;
    }
}

const api = axios.create({
    baseURL: "https://api.hygraph.com/v2/your-endpoint",
    timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
    async (
        config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig> => {
        // 🔹 Loader (only if not skipped)
        if (!config.skipLoader) {
            window.dispatchEvent(new CustomEvent("loader", { detail: true }));
        }

        // 🔹 Firebase Auth (only if not skipped)
        if (!config.skipAuth) {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                config.headers.set("Authorization", `Bearer ${token}`);
            }
        }

        // 🔹 Hygraph GraphQL (only if not skipped)
        if (config.url?.includes("hygraph") && !config.skipContentType) {
            config.headers.set("Content-Type", "application/json");
        }

        return config;
    },
    (error: AxiosError) => {
        if (!(error.config as AxiosRequestConfig)?.skipLoader) {
            window.dispatchEvent(new CustomEvent("loader", { detail: false }));
        }
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => {
        if (!(response.config as AxiosRequestConfig)?.skipLoader) {
            window.dispatchEvent(new CustomEvent("loader", { detail: false }));
        }
        return response;
    },
    (error: AxiosError) => {
        if (!(error.config as AxiosRequestConfig)?.skipLoader) {
            window.dispatchEvent(new CustomEvent("loader", { detail: false }));
        }

        if (error.response?.status === 401) {
            console.warn("Unauthorized, redirecting...");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;
