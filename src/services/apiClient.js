import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if(token) {
            config.headers['Authorization'] = `${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                console.warn("Token hết hạn. Đang tự động đăng xuất...");

                localStorage.removeItem('jwt_token');
                
                localStorage.removeItem('user'); 
                localStorage.removeItem('role');

                if (window.location.pathname !== '/auth/login') {
                    window.location.href = '/auth/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;