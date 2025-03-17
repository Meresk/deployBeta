import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../services/authService.tsx";
import ClipLoader from "react-spinners/ClipLoader";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "../types/jwtPayload.ts";
import logo from "/bananastreamlogotitle.png";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Добавляем состояние для ошибки

    useEffect(() => {
        const validateAuth = async () => {
            const isAuthenticated = await checkAuth();
            if (!isAuthenticated) {
                setLoading(false)
            } else {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const decodedToken = jwtDecode<CustomJwtPayload>(token);
                const role = decodedToken.role;
                const isAuthenticated = await checkAuth();

                if (!isAuthenticated) {
                    navigate("/login");
                } else {
                    if (role === "admin") {
                        navigate("/admin")
                    } else if (role == "teacher") {
                        navigate("/teacher");
                    }
                }
            }
        };

        validateAuth();
    }, [navigate]);

    if (loading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", width: "100vw", }}>
                <ClipLoader color="#36D7B7" size={50} />
            </div>
        );
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const login = form.get('login');
        const password = form.get('password');

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
                login,
                password,
            });

            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem('token', token);

                const decodedToken = jwtDecode<CustomJwtPayload>(token);
                const role = decodedToken.role;
                const isAuthenticated = await checkAuth();

                if (!isAuthenticated) {
                    navigate("/login");
                } else {
                    if (role === "admin") {
                        navigate("/admin")
                    } else if (role == "teacher") {
                        navigate("/teacher");
                    }
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setError("Неверный логин или пароль"); // Устанавливаем сообщение об ошибке
                } else {
                    console.error('Login failed:', error.response?.data.error || error.message);
                }
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                width: "100vw",
                backgroundColor: "#121212",
            }}
        >
            <img
                style={{
                    height: "auto",
                    width: "80%",
                    maxWidth: "340px",
                }}
                src={logo}
                alt="Logo"
            />

            <div style={{ padding: '20px' }}>
                {/* Показываем ошибку, если она есть */}
                {error && (
                    <Typography
                        sx={{
                            color: 'red',
                            marginTop: '10px',
                            textAlign: 'center',
                        }}
                    >
                        {error}
                    </Typography>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="login"
                        label="Login"
                        name="login"
                        autoComplete="login"
                        autoFocus
                        InputProps={{
                            style: { color: 'white' },
                        }}
                        InputLabelProps={{
                            style: { color: 'gray' },
                        }}
                        style={{
                            backgroundColor: '#333',
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        InputProps={{
                            style: { color: 'white' },
                        }}
                        InputLabelProps={{
                            style: { color: 'gray' },
                        }}
                        style={{
                            backgroundColor: '#333',
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{
                            marginTop: '20px',
                            backgroundColor: '#ffff99',
                            color: 'black',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.2)',
                            },
                            transition: 'transform 0.3s',
                        }}
                    >
                        Войти
                    </Button>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            marginTop: '10px',
                        }}
                    >
                        <Button
                            onClick={() => navigate('/')}
                            sx={{
                                backgroundColor: '#444',
                                color: 'gray',
                                borderColor: '#666',
                                marginTop: "5px",
                                width: '150px',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.2)',
                                },
                                transition: 'transform 0.3s',
                            }}
                        >
                            Назад
                        </Button>
                    </Box>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
