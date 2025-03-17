import React, { useState, useEffect } from 'react';
import {Typography, Card, CardContent, Grid, Box, IconButton} from '@mui/material';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from 'react-router-dom';
import { Room } from "../types/Room.ts";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Иконка назад

const StudentPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Индикатор загрузки
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        // Первичная загрузка комнат
        fetchRooms();

        // Автоматическое обновление комнат каждые 10 секунд
        const interval = setInterval(fetchRooms, 10000);

        // Очистка интервала при размонтировании компонента
        return () => clearInterval(interval);
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/rooms`);
            setRooms(response.data);
        } catch (error) {
            console.error("Ошибка загрузки комнат:", error);
        } finally {
            setLoading(false); // Отключаем загрузку, даже если произошла ошибка
        }
    };

    const handleRoomClick = async (roomName: string) => {
        const uniqueValue = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/studentToken`, {
                room: roomName,
                identity: uniqueValue,
            });

            if (response.status === 200) {
                const { token: roomToken } = response.data;
                navigate('/room', { state: { roomToken, roomName } });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert('Ошибка входа в комнату: ' + error.response?.data.error);
            } else {
                alert('Произошла неожиданная ошибка');
            }
        }
    };

    // Отображаем индикатор загрузки, пока комнаты не загружены
    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    width: "100vw",
                }}
            >
                <ClipLoader color="#36D7B7" size={50} />
            </div>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                minHeight: "100vh",
                width: "100%",
                backgroundColor: "#121212",
                padding: '0px',
                boxSizing: 'border-box',
            }}
        >
            <Box
                sx={{
                    flexGrow: 1,
                    backgroundColor: '#333',
                    padding: '20px',
                    margin: '20px',
                    borderRadius: '8px',
                    color: 'white',
                    boxSizing: 'border-box',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: rooms.length === 0 ? 'center' : 'flex-start',
                    position: 'relative', // Для позиционирования кнопки
                }}
            >
                {/* Кнопка назад */}
                <IconButton
                    onClick={() => navigate(-1)} // Навигация на предыдущую страницу
                    sx={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        backgroundColor: '#444',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#555',
                        },
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>

                {rooms.length > 0 ? (
                    <>
                        <Typography variant="h5" style={{ marginBottom: '20px', fontSize: '30px' }}>
                            Комнаты
                        </Typography>
                        <Grid container spacing={3}>
                            {rooms.map((room, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Card
                                        style={{
                                            backgroundColor: '#FDFFAB',
                                            color: 'white',
                                            cursor: 'pointer',
                                            borderRadius: '12px', // Скругленные углы
                                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // Тень
                                            transition: 'transform 0.3s, box-shadow 0.3s', // Анимация при наведении
                                        }}
                                        onClick={() => handleRoomClick(room.name)}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                                            (e.currentTarget as HTMLElement).style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                                            (e.currentTarget as HTMLElement).style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
                                        }}
                                    >
                                        <CardContent style={{ padding: '20px', textAlign: 'center' }}>
                                            <Typography
                                                variant="h6"
                                                style={{
                                                    fontSize: '18px',
                                                    fontWeight: 'bold',
                                                    marginBottom: '10px',
                                                    color: "black"
                                                }}
                                            >
                                                {room.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                style={{
                                                    color: '#606060', // Немного светлее для текста
                                                    fontSize: '14px',
                                                }}
                                            >
                                                {room.num_participants} котиков в комнате
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                    </>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '20px',
                        }}
                    >
                        <img
                            src="/zerorooms.png"
                            alt="No rooms available"
                            style={{
                                maxWidth: '150px',
                                maxHeight: '150px',
                                opacity: 0.8,
                            }}
                        />
                        <Typography variant="h6" style={{ color: 'gray', textAlign: 'center' }}>
                            Комнат нет, котики уснули
                        </Typography>
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default StudentPage;