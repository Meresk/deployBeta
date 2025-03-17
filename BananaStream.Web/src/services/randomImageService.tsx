// generateRandomAbstractCanvas.ts
const generateRandomImage = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    // Заливка фона случайным цветом
    ctx.fillStyle = getRandomColor();
    ctx.fillRect(0, 0, width, height);

    // Рисуем несколько случайных фигур
    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = getRandomColor();
        ctx.beginPath();
        ctx.arc(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 50 + 20,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    // Добавляем случайные линии
    for (let i = 0; i < 10; i++) {
        ctx.strokeStyle = getRandomColor();
        ctx.lineWidth = Math.random() * 5 + 1;
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.stroke();
    }
};

// Функция для генерации случайного цвета
const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export default generateRandomImage;
