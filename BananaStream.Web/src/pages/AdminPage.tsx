import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    Drawer,
    List,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    MenuItem, ListItemButton,
} from '@mui/material';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from "react-router-dom";

interface Role {
    ID: number;
    Name: string;
}

interface User {
    ID: number;
    Login: string;
    Password: string;
    Role_ID: number;
    Role: Role;
}



const AdminPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedTab, setSelectedTab] = useState<'users' | 'roles'>('users');
    const [newRoleName, setNewRoleName] = useState('');
    const [newUserLogin, setNewUserLogin] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRoleID, setNewUserRoleID] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data.users);
        } catch (error) {
            setError('Ошибка при получении пользователей');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/roles`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles(response.data.roles);
        } catch (error) {
            setError('Ошибка при получении ролей');
        }
    };

    const handleAddRole = async () => {
        if (!newRoleName) return;
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/roles`,
                { Name: newRoleName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRoles([...roles, response.data.role]);
            setNewRoleName('');
        } catch (error) {
            setError('Ошибка при добавлении роли');
        }
    };

    const handleAddUser = async () => {
        if (!newUserLogin || !newUserPassword || newUserRoleID === null) {
            setError('Все поля должны быть заполнены');
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/register`,
                {
                    Login: newUserLogin,
                    Password: newUserPassword,
                    Role_ID: newUserRoleID,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const newUser = response.data.user;

            // Проверяем, что новый пользователь имеет все необходимые поля
            if (newUser && newUser.ID && newUser.Login && newUser.Role) {
                setUsers([...users, newUser]);
            } else {
                console.error('Неполные данные пользователя:', newUser);
                console.log('Ответ от сервера:', response.data); // Логируем ответ для проверки
                setError('Ошибка при добавлении пользователя');
            }

            setNewUserLogin('');
            setNewUserPassword('');
            setNewUserRoleID(null);
        } catch (error) {
            setError('Ошибка при добавлении пользователя');
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter(user => user.ID !== id));
        } catch (error) {
            setError('Ошибка при удалении пользователя');
        }
    };

    const handleDeleteRole = async (id: number) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/roles/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles(roles.filter(role => role.ID !== id));
        } catch (error) {
            setError('Ошибка при удалении роли');
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    backgroundColor: '#121212',
                }}
            >
                <ClipLoader color="#FFEB3B" size={50} />
            </div>
        );
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212', color: 'white' }}>
            {/* Sidebar */}
            <Drawer
                sx={{
                    width: 280, // Увеличили ширину боковой панели
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 280, // Увеличили ширину бумаги боковой панели
                        backgroundColor: '#1c1c1c',
                        color: 'white',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        padding: '16px',
                    }}
                >
                    <List sx={{ flexGrow: 1 }}>
                        <ListItemButton
                            onClick={() => setSelectedTab('users')}
                            sx={{
                                borderRadius: '8px', // Скругленные углы
                                '&:hover': {
                                    backgroundColor: '#3d3d3d', // Цвет фона при наведении
                                    transform: 'scale(1.02)', // Легкое увеличение при наведении
                                },
                                transition: 'background-color 0.3s, transform 0.3s', // Плавный переход
                                paddingBottom: '10px'
                            }}
                        >
                            <ListItemText primary="Пользователи" sx={{ fontWeight: 'bold', color: 'white' }} />
                        </ListItemButton>
                        <ListItemButton
                            onClick={() => setSelectedTab('roles')}
                            sx={{
                                borderRadius: '8px', // Скругленные углы
                                '&:hover': {
                                    backgroundColor: '#3d3d3d', // Цвет фона при наведении
                                    transform: 'scale(1.02)', // Легкое увеличение при наведении
                                },
                                transition: 'background-color 0.3s, transform 0.3s', // Плавный переход
                            }}
                        >
                            <ListItemText primary="Роли" sx={{ fontWeight: 'bold', color: 'white' }} />
                        </ListItemButton>
                    </List>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '10px',
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/')}
                            size="small" // Уменьшили размер кнопки
                            style={{
                                backgroundColor: '#444',
                                color: 'white',
                                borderColor: '#666',
                                flex: 1,
                                padding: '8px 12px', // Добавляем меньшее значение padding
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
                            }}
                        >
                            Назад
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleLogout}
                            size="small"  // Уменьшили размер кнопки
                            style={{
                                backgroundColor: '#ff5555',
                                color: 'white',
                                flex: 1,
                                padding: '8px 12px', // Добавляем меньшее значение padding
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
                            }}
                        >
                            Выход
                        </Button>
                    </Box>
                </Box>
            </Drawer>


    {/* Content */}
            <Box sx={{ flexGrow: 1, padding: 4 }}>
                <Typography variant="h4" sx={{ color: '#FFEB3B', marginBottom: 2 }}>
                    Админ-панель
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                {selectedTab === 'users' ? (
                    <>
                        <Typography variant="h5" sx={{ color: '#FFEB3B' }}>
                            Пользователи
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                            <TextField
                                label="Логин"
                                variant="filled"
                                value={newUserLogin}
                                onChange={e => setNewUserLogin(e.target.value)}
                                sx={{ backgroundColor: '#333', color: 'white', flex: 1 }}
                            />
                            <TextField
                                label="Пароль"
                                type="password"
                                variant="filled"
                                value={newUserPassword}
                                onChange={e => setNewUserPassword(e.target.value)}
                                sx={{ backgroundColor: '#333', color: 'white', flex: 1 }}
                            />
                            <TextField
                                select
                                label="Роль"
                                variant="filled"
                                value={newUserRoleID || ''}
                                onChange={e => setNewUserRoleID(Number(e.target.value))}
                                sx={{ backgroundColor: '#333', color: 'white', flex: 1 }}
                            >
                                {roles.map(role => (
                                    <MenuItem key={role.ID} value={role.ID}>
                                        {role.Name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
                                variant="contained"
                                onClick={handleAddUser}
                                startIcon={<AddIcon />}
                                sx={{ backgroundColor: '#FFEB3B', color: 'black' }}
                            >
                                Добавить
                            </Button>
                        </Box>
                        <TableContainer component={Paper} sx={{ backgroundColor: '#333' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#FFEB3B' }}>Логин</TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#FFEB3B' }}>Роль</TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#FFEB3B' }}>Действия</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map(user => (
                                        <TableRow key={user.ID}>
                                            <TableCell sx={{ fontSize: '1rem', color: 'white' }}>{user.Login}</TableCell>
                                            <TableCell sx={{ fontSize: '1rem', color: 'white' }}>{user.Role.Name}</TableCell>
                                            <TableCell>
                                                <IconButton color="error" onClick={() => handleDeleteUser(user.ID)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                ) : (
                    <>
                        <Typography variant="h5" sx={{ color: '#FFEB3B' }}>
                            Роли
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                            <TextField
                                label="Название роли"
                                variant="filled"
                                value={newRoleName}
                                onChange={e => setNewRoleName(e.target.value)}
                                sx={{ backgroundColor: '#333', color: 'white', flex: 1 }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleAddRole}
                                startIcon={<AddIcon />}
                                sx={{ backgroundColor: '#FFEB3B', color: 'black' }}
                            >
                                Добавить
                            </Button>
                        </Box>
                        <TableContainer component={Paper} sx={{ backgroundColor: '#333' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#FFEB3B' }}>Название</TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#FFEB3B' }}>Действия</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {roles.map(role => (
                                        <TableRow key={role.ID}>
                                            <TableCell sx={{ fontSize: '1rem', color: 'white' }}>{role.Name}</TableCell>
                                            <TableCell>
                                                <IconButton color="error" onClick={() => handleDeleteRole(role.ID)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default AdminPage;
