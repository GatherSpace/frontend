/*import React, { useState, useEffect, useRef, useCallback } from "react";
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

export default SpaceView; */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import { fetchElements, fetchBulkUserData } from "../../utils/api";
import { WebSocketService } from "../../services/WebSocketService";
import { Space, Element, WebSocketMessage } from "../../types/api.types";

interface SpaceElement {
  id: string;
  elementId: string;
  spaceId: string;
  x: number;
  y: number;
}

interface UserPosition {
  userId: string;
  x: number;
  y: number;
  avatarUrl?: string;
}

const SpaceView: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const [space, setSpace] = useState<Space | null>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [users, setUsers] = useState<UserPosition[]>([]);
  const [myAvatarUrl, setMyAvatarUrl] = useState<string>("");
  const [myPosition, setMyPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [myUserId, setMyUserId] = useState<string | null>(null);
  // const [gridOffset, setGridOffset] = useState<{ x: number; y: number }>({
  //   x: 0,
  //   y: 0,
  // });
  const gridCellSize = 25;
  const location = useLocation();
  const isMounted = useRef(true);

  const avatarRef = useRef<HTMLDivElement>(null);
  const wsService = new WebSocketService();

  // Fetch elements and space data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const elementsResponse = await fetchElements();
        setElements(elementsResponse);

        if (location.state && location.state.space) {
          setSpace(location.state.space);
        }
        console.log("Space:", location.state.space);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    if (myUserId) {
      const fetchUsers = async () => {
        try {
          const response = await fetchBulkUserData([myUserId]);
          console.log("User data:", response);
          setMyAvatarUrl(response[0].avatarUrl);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUsers();
      return () => {
        isMounted.current = false;
      };
    }
  }, [location, myUserId, users]);

  // Websocket connection and event handling
  const mapUserWithAvatarUrl = async (user: UserPosition) => {
    const avatarUrl = await fetchBulkUserData([user.userId]).then(
      (response) => {
        return response[0].avatarUrl;
      }
    );
    return {
      ...user,
      avatarUrl,
    };
  };
  useEffect(() => {
    if (spaceId) {
      wsService.connect();
      const handleWebSocketMessage = async (message: WebSocketMessage) => {
        // if (!isMounted.current) return;

        switch (message.type) {
          case "space-joined":
            console.log("Joined space:", message.payload);
            setMyPosition({
              x: message.payload.spawn.x,
              y: message.payload.spawn.y,
            });
            setMyUserId(message.payload.userId);
            Promise.all(message.payload.users.map(mapUserWithAvatarUrl)).then(
              (users) => {
                setUsers(users);
              }
            );
            setUsers(users);
            break;

          case "user-joined":
            console.log("User joined:");
            const user = await mapUserWithAvatarUrl(message.payload);
            console.log("User joined:", user);
            setUsers((prevUsers) => [...prevUsers, user]);
            break;
          case "user-left":
            setUsers((prevUsers) =>
              prevUsers.filter((u) => u.userId !== message.payload.userId)
            );
            break;
          case "movement":
            if (message.payload.userId === myUserId) {
              // Update the offset for smooth movement for the local user
              /*setGridOffset((prevOffset) => ({
                x:
                  prevOffset.x -
                  (message.payload.x - myPosition.x) * gridCellSize,
                y:
                  prevOffset.y -
                  (message.payload.y - myPosition.y) * gridCellSize,
              })); */
              setMyPosition({
                x: message.payload.x,
                y: message.payload.y,
              });
            } else {
              // Directly update positions for other users
              setUsers((prevUsers) =>
                prevUsers.map((user) =>
                  user.userId === message.payload.userId
                    ? { ...user, x: message.payload.x, y: message.payload.y }
                    : user
                )
              );
            }
            break;
          case "move-rejected":
            console.log("Move rejected:", message.payload);
            break;
          default:
            console.log("Unknown message type:", message);
        }
      };

      wsService.ws?.addEventListener("message", (event) => {
        const message = JSON.parse(event.data) as WebSocketMessage;
        console.log("Received message:", message);
        handleWebSocketMessage(message);
      });

      // Join space after connection
      if (wsService.ws != null) {
        wsService.ws.onopen = () => {
          console.log("WebSocket Connected");
          wsService.joinSpace(spaceId);
        };
      }
      return () => {
        wsService.disconnect();
      };
    }
  }, [spaceId]);

  // Handle user movement with arrow keys
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      let newX = myPosition.x;
      let newY = myPosition.y;

      switch (event.key) {
        case "ArrowUp":
          newY = Math.max(0, myPosition.y - 1);
          break;
        case "ArrowDown":
          newY = Math.min((space?.height || 0) - 1, myPosition.y + 1);
          break;
        case "ArrowLeft":
          newX = Math.max(0, myPosition.x - 1);
          break;
        case "ArrowRight":
          newX = Math.min((space?.width || 0) - 1, myPosition.x + 1);
          break;
        default:
          return; // Ignore other keys
      }

      if (newX !== myPosition.x || newY !== myPosition.y) {
        wsService.updatePosition(newX, newY);
      }
    },
    [myPosition, space]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Function to get element image URL and dimensions
  const imageUrlWithElementId = useCallback(
    (elementId: string) => {
      const element = elements.find((el) => el.id === elementId);
      return element ? element.imageUrl : "";
    },
    [elements]
  );

  const elementWidthAndHeight = useCallback(
    (elementId: string) => {
      const element = elements.find((el) => el.id === elementId);
      return element
        ? { width: element.width, height: element.height }
        : { width: 0, height: 0 };
    },
    [elements]
  );

  // Center the grid on the user's position when it changes
  useEffect(() => {
    const offsetX =
      -myPosition.x * gridCellSize + window.innerWidth / 2 - gridCellSize / 2;
    const offsetY =
      -myPosition.y * gridCellSize + window.innerHeight / 2 - gridCellSize / 2;
    //setGridOffset({ x: offsetX, y: offsetY });
  }, [myPosition]);

  // Styles
  const gridContainerStyle: React.CSSProperties = {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
  };

  const gridStyle: React.CSSProperties = {
    position: "absolute",
    width: `${(space?.width || 0) * gridCellSize}px`,
    height: `${(space?.height || 0) * gridCellSize}px`,
    // transform: `translate(${gridOffset.x}px, ${gridOffset.y}px)`,

    backgroundImage: `url(${space?.thumbnail})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    /*backgroundImage: `
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
          transparent ${gridCellSize * 2}px)`, */
  };

  const elementStyle = (
    element: SpaceElement,
    widthAndHeight: { width: number; height: number }
  ): React.CSSProperties => ({
    position: "absolute",
    left: `${element.x * gridCellSize}px`,
    top: `${element.y * gridCellSize}px`,
    width: `${widthAndHeight.width * gridCellSize}px`,
    height: `${widthAndHeight.height * gridCellSize}px`,
    objectFit: "contain",
    pointerEvents: "none",
  });

  const avatarStyle: React.CSSProperties = {
    position: "absolute",
    width: `${gridCellSize}px`,
    height: `${gridCellSize}px`,
    border: "2px solid #ccc",
    borderRadius: "50%",
    overflow: "hidden",
    left: `${myPosition.x * gridCellSize}px`,
    top: `${myPosition.y * gridCellSize}px`,
  };

  const userAvatarStyle = (user: UserPosition): React.CSSProperties => ({
    position: "absolute",
    width: `${gridCellSize}px`,
    height: `${gridCellSize}px`,
    border: "2px solid #ccc",
    borderRadius: "50%",
    overflow: "hidden",
    left: `${user.x * gridCellSize}px`,
    top: `${user.y * gridCellSize}px`,
  });

  const avatarImageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <div style={gridContainerStyle}>
      <div style={gridStyle}>
        {/* Render elements */}
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

        {/* Render my avatar */}
        <div ref={avatarRef} style={avatarStyle}>
          <img src={myAvatarUrl} alt="My Avatar" style={avatarImageStyle} />
        </div>

        {/* Render other users' avatars */ console.log("Users:", users)}
        {users.map((user) => (
          <div key={user.userId} style={userAvatarStyle(user)}>
            <img
              src={user.avatarUrl}
              alt="User Avatar"
              style={avatarImageStyle}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpaceView;
