import React from 'react';
import Main from './pages/MainPage.tsx';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';
import RoomPage from "./pages/RoomPage.tsx"
import AdminPage from "./pages/AdminPage";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={< LoginPage />} />
                <Route path="/" element={< Main />} />
                <Route path="/student" element={< StudentPage />} />
                <Route path="/teacher" element={< TeacherPage />} />
                <Route path="/room" element={< RoomPage />} />
                <Route path="/admin" element={< AdminPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;