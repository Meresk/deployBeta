import "@livekit/components-styles";
import { useNavigate } from "react-router-dom";
import logo from "/bananastreamlogotitle.png";

export default function Room() {
    const navigate = useNavigate();

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
                boxSizing: "border-box", // Включаем padding в расчёт высоты
                margin: 0, // Убираем внешние отступы
                padding: 0, // Убираем внутренние отступы
            }}
        >

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingBottom: "50px",
                }}
            >
                <img
                    style={{
                        height: "auto",
                        width: "80%", // Процентное значение для адаптивности
                        maxWidth: "340px", // Ограничение максимального размера
                    }}
                    src={logo}
                    alt="Logo"
                />
                <h1
                    style={{
                        color: "white",
                        fontSize: "clamp(1.5rem, 5vw, 3rem)", // Адаптивный размер шрифта
                        textAlign: "center", // Центрирование текста
                    }}
                >
                    Кто вы сегодня?
                </h1>
                <div
                    style={{
                        display: "flex",
                        gap: "50px",
                        marginTop: "20px",
                        flexWrap: "wrap", // Позволяет элементам переноситься на новую строку
                        justifyContent: "center", // Центрирование на маленьких экранах
                    }}
                >
                    {/* Преподаватель */}
                    <div
                        onClick={() => navigate("/login")}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                    >
                        <img
                            src="/teacher.png"
                            alt="Преподаватель"
                            style={{
                                width: "clamp(100px, 30vw, 200px)", // Адаптивный размер изображения
                                height: "auto",
                                transition: "transform 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        />
                        <span
                            style={{
                                marginTop: "10px",
                                color: "white",
                                fontSize: "clamp(1rem, 3vw, 1.2rem)", // Адаптивный шрифт
                                textAlign: "center",
                            }}
                        >
                            Преподаватель
                        </span>
                    </div>

                    {/* Студент */}
                    <div
                        onClick={() => navigate("/student")}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                    >
                        <img
                            src="/student.png"
                            alt="Студент"
                            style={{
                                width: "clamp(100px, 30vw, 200px)", // Адаптивный размер изображения
                                height: "auto",
                                transition: "transform 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        />
                        <span
                            style={{
                                marginTop: "10px",
                                color: "white",
                                fontSize: "clamp(1rem, 3vw, 1.2rem)", // Адаптивный шрифт
                                textAlign: "center",
                            }}
                        >
                            Студент
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
