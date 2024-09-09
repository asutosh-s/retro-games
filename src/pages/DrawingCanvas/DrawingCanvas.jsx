import React, { useState, useRef, useEffect } from "react";
import './DrawingCanvas.css';

const DrawingCanvas = () => {

    const [isDrawing, setIsDrawing] = useState(false)
    const [isErasing, setIsErasing] = useState(false)
    const canvasRef = useRef(null)
    const [contxt, setContxt] = useState(null)

    const [history, setHistory] = useState([]); // History of canvas states
    const [historyIndex, setHistoryIndex] = useState(-1);

    useEffect(() => {
        const canvas = canvasRef.current;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        canvas.width = width;
        canvas.height = height;

        const canvasContext = canvas.getContext('2d');
        canvasContext.strokeStyle = '#000';
        canvasContext.lineWidth = 1;
        setContxt(canvasContext);
    }, []);

    useEffect(() => {
        if (contxt && historyIndex >= 0) {
            const canvas = canvasRef.current;
            if (canvas) {
                const image = new Image();
                image.src = history[historyIndex];
                image.onload = () => {
                    contxt.clearRect(0, 0, canvas.width, canvas.height);
                    contxt.drawImage(image, 0, 0);
                };
            }
        }
    }, [historyIndex]);

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        const rect = canvasRef.current.getBoundingClientRect();
        contxt.beginPath();
        contxt.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        const rect = canvasRef.current.getBoundingClientRect();
        contxt.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        console.log(e.clientX - rect.left, e.clientY - rect.top);
        contxt.stroke();
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        saveCanvasState();
    };

    const handleTouchStart = (e) => {
        e.preventDefault();
        setIsDrawing(true);
        const rect = canvasRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        contxt.beginPath();
        contxt.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        contxt.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
        contxt.stroke();
    };

    const saveCanvasState = () => {
        if (contxt) {
            const canvas = canvasRef.current;
            if (canvas) {
                const dataUrl = canvas.toDataURL();
                setHistory(prevHistory => {
                    // Keep only up to current historyIndex + 1 elements
                    const newHistory = prevHistory.slice(0, historyIndex + 1);
                    newHistory.push(dataUrl);
                    return newHistory;
                });
                setHistoryIndex(prevIndex => prevIndex + 1);
            }
        }
    };

    const handleTouchEnd = () => {
        setIsDrawing(false);
        saveCanvasState();
    };

    const undo = () => {
        setHistoryIndex(prevIndex => {
            const newIndex = Math.max(prevIndex - 1, 0);
            return newIndex;
        });
    };

    const redo = () => {
        setHistoryIndex(prevIndex => {
            const newIndex = Math.min(prevIndex + 1, history.length - 1);
            return newIndex;
        });
    };

    const handleClear = () => {
        contxt.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const handleToggleEraser = () => {
        setIsErasing(!isErasing);
        contxt.strokeStyle = isErasing ? '#000000' : '#FFFFFF'; // Toggle between black and white
        contxt.lineWidth = isErasing ? 1 : 20;
    };

    useEffect(() => {
        if (contxt) {
            const canvas = canvasRef.current;

            canvas.addEventListener('mousedown', handleMouseDown);
            canvas.addEventListener('mousemove', handleMouseMove);
            canvas.addEventListener('mouseup', handleMouseUp);
            canvas.addEventListener('touchstart', handleTouchStart);
            canvas.addEventListener('touchmove', handleTouchMove);
            canvas.addEventListener('touchend', handleTouchEnd);

            return () => {
                canvas.removeEventListener('mousedown', handleMouseDown);
                canvas.removeEventListener('mousemove', handleMouseMove);
                canvas.removeEventListener('mouseup', handleMouseUp);
                canvas.removeEventListener('touchstart', handleTouchStart);
                canvas.removeEventListener('touchmove', handleTouchMove);
                canvas.removeEventListener('touchend', handleTouchEnd);
            }
        }
    }, [contxt, isDrawing, isErasing]);

    return (
        <div className="canvas-area">
            <canvas
                ref={canvasRef}
                className="canvas-board"
                style={{ border: '1px solid #000', backgroundColor: 'white' }}
            />

            <div className="canvas-buttons">
                <button onClick={handleClear}>Clear</button>
                <button onClick={handleToggleEraser}>
                    {isErasing ? 'Drawing' : 'Eraser'}
                </button>
                <button onClick={undo} disabled={historyIndex <= 0}>Undo</button>
                <button onClick={redo} disabled={historyIndex >= history.length - 1}>Redo</button>
            </div>
        </div>
    )
}

export default DrawingCanvas;