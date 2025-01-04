import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import { fetchElements } from "../../utils/api";

import { Space, Element } from "../../types/api.types";

interface SpaceElement {
  id: string;
  elementId: string;
  spaceId: string;
  x: number;
  y: number;
}

const SpaceView: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const [space, setSpace] = useState<Space | null>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [users, setUsers] = useState<
    { userId: string; x: number; y: number }[]
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

  const imageUrlWithElementId = (elementId: string) => {
    const element = elements.find((el) => el.id === elementId);
    return element ? element.imageUrl : "";
  };
  const elementWidthAndHeight = (elementId: string) => {
    const element = elements.find((el) => el.id === elementId);
    return element
      ? { width: element.width, height: element.height }
      : { width: 0, height: 0 };
  };
  useEffect(() => {
    if (location.state && location.state.space) {
      setSpace(location.state.space);
      console.log("Space:", location.state.space);
    }

    const fetchUsers = async () => {
      try {
        const response = await fetchElements();
        setElements(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
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

  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    width: `${space?.width || 0 * gridCellSize}px`,
    height: `${space?.height || 0 * gridCellSize}px`,
    backgroundImage: `
      linear-gradient(to right, #ddd 1px, transparent 1px),
      linear-gradient(to bottom, #ddd 1px, transparent 1px)
    `,
    backgroundSize: `${gridCellSize}px ${gridCellSize}px`,
    border: "1px solid #ccc",
    transform: `translate(
      ${Math.min(
        Math.max(0, -0.2 * (space?.width || 0) * gridCellSize),
        0.2 * (space?.width || 0) * gridCellSize
      )}px,
      ${Math.min(
        Math.max(0, -0.2 * (space?.height || 0) * gridCellSize),
        0.2 * (space?.height || 0) * gridCellSize
      )}px
    )`,
    userSelect: "none",
  };

  const elementStyle = (
    element: SpaceElement,
    widthAndHeight: { width: number; height: number },
    isPreview = false
  ): React.CSSProperties => ({
    position: "absolute",

    left: `${(element.x || 0) * gridCellSize}px`,
    top: `${(element.y || 0) * gridCellSize}px`,
    width: `${widthAndHeight.width * gridCellSize}px`,
    height: `${widthAndHeight.height * gridCellSize}px`,
    objectFit: "contain",
    pointerEvents: "none",
    // opacity: isPreview ? 0.5 : element.staticValue ? 0.7 : 1,
  });

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

  const mainImageStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    pointerEvents: "none",
  };

  return (
    <div style={canvasStyle}>
      <div
        style={{
          position: "absolute",
          left: `${myPosition.x * gridCellSize + gridOffset.x}px`,
          top: `${myPosition.y * gridCellSize + gridOffset.y}px`,
        }}
      >
        <img
          src={space?.thumbnail}
          alt="Map background"
          style={mainImageStyle}
          draggable={false}
        />
        <div style={avatarStyle}>
          <img
            src={space?.thumbnail}
            alt="My Avatar"
            style={avatarImageStyle}
          />
        </div>
      </div>
      {users.map((user) => (
        <div
          key={user.userId}
          style={{
            position: "absolute",
            left: `${user.x * gridCellSize + gridOffset.x}px`,
            top: `${user.y * gridCellSize + gridOffset.y}px`,
          }}
        >
          <div style={avatarStyle}>
            <img src={""} alt="User Avatar" style={avatarImageStyle} />
          </div>
        </div>
      ))}{" "}
      {space?.elements?.map((element) => (
        <img
          key={element.id}
          src={imageUrlWithElementId(element.elementId)}
          alt={`Placed element ${element.id}`}
          style={elementStyle(
            element,
            elementWidthAndHeight(element.elementId)
          )}
        />
      ))}
    </div>
  );
};

export default SpaceView;
