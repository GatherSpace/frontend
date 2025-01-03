import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Space } from "../../types/api.types";

const SpaceView: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const [space, setSpace] = useState<Space | null>(null);
  const [users, setUsers] = useState<
    [{ userId: string; x: number; y: number }]
  >([]);
  const [myPosition, setMyPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [gridOffset, setGridOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const gridCellSize = 25;
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.space) {
      setSpace(location.state.space);
    }
  }, [location]);

  const gridStyle: React.CSSProperties = {
    position: "relative",
    width: "100vw",
    height: "100vw",
    overflow: "hidden",
    backgroundImage: `
  repeating-linear-gradient(
    90deg,
    #eee, 
    #eee ${gridCellSize}px,
    transparent ${gridCellSize}px,
    transparent ${gridCellSize * 2}px),
  repeating-linear-gradient(
    0deg,
    #eee, 
    #eee ${gridCellSize}px,
    transparent ${gridCellSize}px, 
    transparent ${gridCellSize * 2}px)`,
    transform: `translate(${gridOffset.x}px, ${gridOffset.y}px)`,
  };

  const avatarStyle: React.CSSProperties = {
    position: "absolute",
    width: `${gridCellSize}px`,
    height: `${gridCellSize}px`,
    border: "1px solid #ccc",
    borderRadius: "50%",
    overflow: "hidden",
  };

  const avatarImageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <div style={gridStyle}>
      <div
        style={{
          position: "absolute",
          left: `${myPosition.x * gridCellSize + gridOffset.x}px`,
          top: `${myPosition.y * gridCellSize + gridOffset.y}px`,
        }}
      >
        <div style={avatarStyle}>
          <img src={""} alt="My Avatar" style={avatarImageStyle} />
        </div>
      </div>
      {Object.entries(users).map(([userId, position]) => (
        <div
          key={userId}
          style={{
            position: "absolute",
            left: `${position.x * gridCellSize + gridOffset.x}px`,
            top: `${position.y * gridCellSize + gridOffset.y}px`,
          }}
        >
          <div style={avatarStyle}>
            <img src={""} alt="User Avatar" style={avatarImageStyle} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpaceView;
