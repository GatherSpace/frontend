import { Box, useToast } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSpaceDetails, websocketApi } from "../../utils/api";
import GameCanvas from "./GameCanvas";

interface Position {
  x: number;
  y: number;
}

const SpaceView = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const toast = useToast();
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const { data: space } = useQuery({
    queryKey: ["space", spaceId],
    queryFn: () => fetchSpaceDetails(spaceId!),
  });

  useEffect(() => {
    if (!spaceId) return;

    // Connect to SSE endpoint for real-time updates
    const eventSource = new EventSource(
      `http://localhost:3000/api/space/${spaceId}/events`
    );
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleServerEvent(data);
    };

    return () => {
      eventSource.close();
    };
  }, [spaceId]);

  const handleServerEvent = (event: any) => {
    switch (event.type) {
      case "user-joined":
        toast({
          title: "User joined",
          description: `${event.payload.username} joined the space`,
          status: "info",
        });
        break;
      case "user-left":
        toast({
          title: "User left",
          description: `${event.payload.username} left the space`,
          status: "info",
        });
        break;
      case "movement":
        // Update other user's position
        break;
      case "movement-rejected":
        // Reset position if server rejected the movement
        setPosition({ x: event.payload.x, y: event.payload.y });
        break;
    }
  };

  const handleKeyDown = async (e: KeyboardEvent) => {
    const newPosition = { ...position };

    switch (e.key) {
      case "ArrowUp":
        newPosition.y -= 1;
        break;
      case "ArrowDown":
        newPosition.y += 1;
        break;
      case "ArrowLeft":
        newPosition.x -= 1;
        break;
      case "ArrowRight":
        newPosition.x += 1;
        break;
      default:
        return;
    }

    // Update position locally
    setPosition(newPosition);

    // Send position update to server
    try {
      await websocketApi.updatePosition(spaceId!, newPosition);
    } catch (error) {
      toast({
        title: "Movement failed",
        description: "Failed to update position",
        status: "error",
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position]);

  if (!space) return null;

  return (
    <Box
      ref={containerRef}
      position="relative"
      width="100%"
      height="calc(100vh - 100px)"
      backgroundColor="gray.100"
      overflow="hidden"
      p={4}
    >
      <GameCanvas
        width={800}
        height={600}
        position={position}
        elements={space.elements || []}
      />
    </Box>
  );
};

export default SpaceView;
