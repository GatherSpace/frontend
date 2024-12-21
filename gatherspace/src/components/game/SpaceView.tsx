import { Box } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSpaceDetails } from '../../utils/api';
import { wsService } from '../../services/WebSocketService';
import { Space, SpaceElement } from '../../types/api.types';
import { useQuery } from '@tanstack/react-query';

const SpaceView = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [space, setSpace] = useState<Space | null>(null);

  const { data: spaceData } = useQuery({
    queryKey: ['space', spaceId],
    queryFn: () => spaceId ? fetchSpaceDetails(spaceId) : null,
    enabled: !!spaceId
  });

  useEffect(() => {
    if (spaceData) {
      setSpace(spaceData);
    }
  }, [spaceData]);

  useEffect(() => {
    if (spaceId) {
      wsService.connect();
      return () => {
        wsService.disconnect();
      };
    }
  }, [spaceId]);

  const renderSpace = () => {
    const canvas = canvasRef.current;
    if (!canvas || !space) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw space elements
    space.elements.forEach((element: SpaceElement) => {
      // Draw element based on its properties
      // This is a placeholder - you'll need to implement actual drawing logic
      ctx.fillStyle = 'blue';
      ctx.fillRect(element.x, element.y, 50, 50);
    });
  };

  useEffect(() => {
    renderSpace();
  }, [space]);

  return (
    <Box w="100%" h="100vh" bg="gray.100">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          border: '1px solid black',
          margin: 'auto',
          display: 'block'
        }}
      />
    </Box>
  );
};

export default SpaceView;
