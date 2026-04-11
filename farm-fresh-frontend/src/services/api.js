import axios from "axios";

const api = axios.create({
    baseURL: "https://your-app-name.onrender.com/api"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


api.interceptors.response.use(
    res => res,
    err => {
        if (
            (err.response?.status === 401 || err.response?.status === 403) &&
            !err.config.url.includes("/auth/register")
        ) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default api;
