import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    axios.defaults.baseURL = 'http://localhost:3001';
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    useEffect(() => {
        if (token) {
            axios.get('/api/dashboard')
                .then(response => {
                    setUser(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    // Token is invalid or expired
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const response = await axios.post('/api/auth/login', { email, password });
        const { accessToken } = response.data;
        localStorage.setItem('token', accessToken);
        setToken(accessToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };