import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/authService';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@sweetalert2/theme-bootstrap-4/bootstrap-4.min.css';

// Create a customized instance with the theme
const MySwal = withReactContent(Swal);

// Set default configurations
const swalConfig = {
    customClass: {
        popup: 'bootstrap-4-theme'
    }
};

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('token')
    );
    const navigate = useNavigate();

    const login = async (username: string, password: string) => {
        try {
            const { data } = await apiLogin(username, password);
            localStorage.setItem('token', data.token);
            setIsAuthenticated(true);
            navigate('/students');
        } catch (error) {
            await MySwal.fire({
                ...swalConfig,
                title: 'Login Failed',
                text: 'Invalid username or password',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const register = async (username: string, password: string) => {
        try {
            await apiRegister(username, password);
            await MySwal.fire({
                ...swalConfig,
                title: 'Registration Successful',
                text: 'You can now login with your credentials',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            navigate('/login');
        } catch (error) {
            await MySwal.fire({
                ...swalConfig,
                title: 'Registration Failed',
                text: 'Username already exists',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const logout = () => {
        apiLogout();
        setIsAuthenticated(false);
        navigate('/login');
    };

    return { isAuthenticated, login, register, logout };
};