import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

interface GameCanvasProps {
  width: number;
  height: number;
  position: { x: number; y: number };
  elements?: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    imageUrl: string;
    staticValue: boolean;
  }>;
}

const GameCanvas = ({ width, height, position, elements = [] }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background grid (optional)
    ctx.strokeStyle = '#edf2f7';
    for (let x = 0; x < width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw elements
    elements.forEach(element => {
      // For now, just draw rectangles for elements
      ctx.fillStyle = element.staticValue ? '#4A5568' : '#A0AEC0';
      ctx.fillRect(
        element.x * 32,
        element.y * 32,
        element.width * 32,
        element.height * 32
      );
    });

    // Draw player
    ctx.fillStyle = '#3182CE';
    ctx.beginPath();
    ctx.arc(
      position.x * 32 + 16,
      position.y * 32 + 16,
      12,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, [width, height, position, elements]);

  return (
    <Box position="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: '1px solid #E2E8F0',
          backgroundColor: 'white',
        }}
      />
    </Box>
  );
};

export default GameCanvas;
