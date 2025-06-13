import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@sweetalert2/theme-bootstrap-4/bootstrap-4.min.css';

// Create customized SweetAlert instance with React support
const MySwal = withReactContent(Swal);

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                await MySwal.fire({
                    title: 'Session Expired',
                    text: 'Your session has expired. Please login again.',
                    icon: 'warning' as const,
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'bootstrap-4-theme',
                        confirmButton: 'btn btn-primary'
                    }
                });
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                await MySwal.fire({
                    title: 'Error',
                    text: data.message || 'Something went wrong',
                    icon: 'error' as const,
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'bootstrap-4-theme',
                        confirmButton: 'btn btn-primary'
                    }
                });
            }
        }
        return Promise.reject(error);
    }
);

export default api;