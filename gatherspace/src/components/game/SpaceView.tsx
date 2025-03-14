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
import {
  fetchElements,
  fetchBulkUserData,
  fetchSpaceDetails,
} from "../../utils/api";
import { wsService } from "../../services/WebSocketService";
import { Space, Element, WebSocketMessage } from "../../types/api.types";
import Chat from "./Chat";

interface Message {
  sender: string;
  text: string;
}

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
  const [spaceWidthAndHeight, setSpaceWidthAndHeight] = useState({
    width: 0,
    height: 0,
  });
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
  const [gridCellSize, setGridCellSize] = useState(25);
  const [messageUserId, setMessageUserId] = useState<string | null>(null);

  const messageUserIdRef = useRef(messageUserId);
  const location = useLocation();
  const isMounted = useRef(true);

  const avatarRef = useRef<HTMLDivElement>(null);
  const usersRef = useRef(users);

  const myPositionRef = useRef(myPosition);
  const myUserIdRef = useRef(myUserId);
  const spaceWidthAndHeightRef = useRef(spaceWidthAndHeight);

  // for message component
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Adjust gridCellSize based on viewport dimensions and ensure 30x30 cells
  useEffect(() => {
    const updateGridCellSize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const cellSize = Math.min(viewportWidth / 15, viewportHeight / 15);

      setGridCellSize(cellSize);
    };

    updateGridCellSize();
    window.addEventListener("resize", updateGridCellSize);

    return () => {
      window.removeEventListener("resize", updateGridCellSize);
    };
  }, []);

  useEffect(() => {
    myPositionRef.current = myPosition;
    myUserIdRef.current = myUserId;
    messageUserIdRef.current = messageUserId;
  }, [myPosition, myUserId, messageUserId]);

  // Fetch elements and space data
  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      try {
        const elementsResponse = await fetchElements();
        setElements(elementsResponse);
        if (spaceId) {
          const spaceResponse = await fetchSpaceDetails(spaceId);
          console.log("Space:", spaceResponse);
          let width = parseInt(spaceResponse?.dimensions?.split("x")[0] || "0");
          let height = parseInt(
            spaceResponse?.dimensions?.split("x")[1] || "0"
          );
          setSpaceWidthAndHeight({ width, height });
          setSpace(spaceResponse);
        }
        /*if (location.state && location.state.space) {
          setSpace(location.state.space);
        }
        console.log("Space:", location.state.space); */
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    if (myUserId) {
      if (isSubscribed) {
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
      }
    }

    return () => {
      isSubscribed = false;
    };
  }, [location, myUserId, spaceId]);

  useEffect(() => {
    spaceWidthAndHeightRef.current = spaceWidthAndHeight;
  }, [spaceWidthAndHeight]);

  // Websocket connection and event handling
  const mapUserWithAvatarUrl = async (user: UserPosition) => {
    try {
      const response = await fetchBulkUserData([user.userId]);
      const avatarUrl =
        response[0]?.avatarUrl ||
        "https://www.gravatar.com/avatar/default?d=mp";
      return {
        ...user,
        avatarUrl,
      };
    } catch (error) {
      console.error("Error fetching user avatar:", error);
      return {
        ...user,
        avatarUrl: "https://www.gravatar.com/avatar/default?d=mp",
      };
    }
  };

  useEffect(() => {
    if (!spaceId) return;

    let isSubscribed = true;
    let hasJoinedSpace = false;

    const handleWebSocketMessage = async (message: WebSocketMessage) => {
      if (!isSubscribed) return;
      console.log("users", users);
      console.log("My avatar URL:", myAvatarUrl);
      switch (message.type) {
        case "space-joined":
          console.log("space-joined", message);

          setMyPosition({
            x: message.payload.spawn.x,
            y: message.payload.spawn.y,
          });
          setMyUserId(message.payload.userId);
          hasJoinedSpace = true;
          if (message.payload.users.length > 0) {
            const usersWithAvatars = await Promise.all(
              message.payload.users.map(mapUserWithAvatarUrl)
            );
            console.log("Users with avatars:", usersWithAvatars);
            if (isSubscribed) {
              setUsers(usersWithAvatars);
            }
          }
          console.log("Updated my position:", myPosition);
          console.log("Updated users:", users);
          break;

        case "user-joined":
          const newUser = await mapUserWithAvatarUrl(message.payload);
          console.log("New user joined:", newUser);
          if (isSubscribed) {
            setUsers((prevUsers) => [...prevUsers, newUser]);
          }
          break;

        case "user-left":
          if (isSubscribed) {
            setUsers((prevUsers) =>
              prevUsers.filter((u) => u.userId !== message.payload.userId)
            );
          }
          break;

        case "movement":
          console.log("Received movement message:", message);
          if (!isSubscribed) return;
          console.log("userId", myUserIdRef.current);

          if (message.payload.userId == myUserIdRef.current) {
            setMyPosition((prev) => {
              console.log("prev", prev);
              console.log("message.payload", message.payload);
              return {
                ...prev,
                x: message.payload.x,
                y: message.payload.y,
              };
            });
          } else {
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.userId === message.payload.userId
                  ? { ...user, x: message.payload.x, y: message.payload.y }
                  : user
              )
            );
          }

          console.log("Updated my position:", myPosition);
          console.log("Updated users:", users);

          break;
        case "message":
          if (!isSubscribed) return;
          console.log("Received message:", message);
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "Other", text: message.payload.message },
          ]);
          break;

        case "movement-rejected":
          break;
      }
    };

    // Set up websocket connection and join space
    const initializeWebSocket = async () => {
      try {
        wsService.removeMessageHandler(handleWebSocketMessage);
        wsService.addMessageHandler(handleWebSocketMessage);
        await wsService.joinSpace(spaceId);
      } catch (error) {
        console.error("Failed to initialize WebSocket:", error);
      }
    };

    if (isSubscribed) initializeWebSocket();

    // Cleanup
    return () => {
      isSubscribed = false;
      if (hasJoinedSpace) {
        wsService.removeMessageHandler(handleWebSocketMessage);
        wsService.disconnect();
      }
      //
    };
  }, [spaceId]);
  const movementInProgress = useRef(false);

  // Handle user movement with arrow keys
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    let { x, y } = myPositionRef.current;

    switch (event.key) {
      case "ArrowUp":
        y = Math.max(0, y - 1);
        break;
      case "ArrowDown":
        console.log("Space width:", spaceWidthAndHeight.width);
        console.log("y + 1", y + 1);
        if (spaceWidthAndHeightRef.current.width == 0) return;
        y = Math.min(spaceWidthAndHeightRef.current.width - 1, y + 1);
        break;
      case "ArrowLeft":
        x = Math.max(0, x - 1);
        break;
      case "ArrowRight":
        x = Math.min(spaceWidthAndHeightRef.current.height - 1, x + 1);
        break;
      default:
        return; // Ignore other keys
    }

    console.log("Moving to:", x, y);
    // Set flag to indicate movement is in progress
    movementInProgress.current = true;

    // Update position via WebSocket and clear flag once done
    wsService.updatePosition(x, y).finally(() => {
      movementInProgress.current = false;
    });
  }, []);

  const onChatClose = () => {
    setIsChatOpen(!isChatOpen);
    setMessageUserId(null);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
  const handleUserClick = (user: UserPosition): void => {
    setIsChatOpen(!isChatOpen);
    setMessageUserId(user.userId);
  };
  // Function to get element image URL and dimensions
  const imageUrlWithElementId = useCallback(
    (elementId: string) => {
      const element = elements.find((el) => el.id === elementId);
      return element
        ? element.imageUrl
        : "https://www.gravatar.com/avatar/default?d=mp";
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
    width: "100vw", // Changed from 100vw to 100%
    height: "calc(100vh - 72px)", // Assuming navbar is 64px high, adjust as needed
    overflow: "hidden",
    backgroundColor: "grey",
  };
  /*const gridContainerStyle: React.CSSProperties = {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
  };
*/
  const gridStyle: React.CSSProperties = {
    position: "absolute",
    width: `${(spaceWidthAndHeight.width || 0) * gridCellSize}px`,
    height: `${(spaceWidthAndHeight.height || 0) * gridCellSize}px`,
    // transform: `translate(${gridOffset.x}px, ${gridOffset.y}px)`,
    transform: `translate(
      ${-myPosition.x * gridCellSize + window.innerWidth / 2}px,
      ${-myPosition.y * gridCellSize + window.innerHeight / 2}px
    )`,

    backgroundImage: `url(${space?.thumbnail})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    border: "3px solid #ccc",
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

  const chatStyle: React.CSSProperties = {
    position: "absolute",
    top: "20px",
    right: "20px",
    width: "350px",
    height: "100%",
    overflow: "scroll",
    border: "1px solid #ccc",
    padding: "10px",
    background: "#fff",
  };
  // const chatStyle = {
  //   position: "relative",
  //   width: "100%",
  //   height: "400px",
  //   border: "1px solid #ddd",
  //   borderRadius: "8px",
  //   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  //   padding: "20px",
  //   backgroundColor: "#f9f9f9",
  //   overflow: "hidden",
  // };

  const messageListStyle: React.CSSProperties = {
    listStyle: "none",
    padding: "0",
    margin: "0",
    height: "calc(100% - 60px)",
    overflowY: "auto",
    scrollbarWidth: "thin",
  };

  const messageStyle = (sender: string): React.CSSProperties => ({
    padding: "10px",
    margin: "5px 0",
    borderRadius: "12px",
    maxWidth: "70%",
    color: "#fff",
    alignSelf: sender === "You" ? "flex-end" : "flex-start",
    backgroundColor: sender === "You" ? "#4CAF50" : "#007BFF",
  });

  const inputStyle: React.CSSProperties = {
    flex: "1",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007BFF",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  };

  const formStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "20px",
    width: "100%",
    paddingRight: "10px",
    display: "flex",
    gap: "10px",
  };

  return (
    <div style={gridContainerStyle}>
      <div style={gridStyle}>
        {/* Render elements */}
        {space &&
          space?.elements?.map((element) => (
            <img
              key={element.id}
              src={imageUrlWithElementId(element.elementId)}
              alt={`Placed element ${element.id} at x: ${element.x}, y: ${element.y}`}
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

        {/* Render other users' avatars */}
        {users &&
          users.map((user) => (
            <div
              key={user.userId}
              style={userAvatarStyle(user)}
              onClick={() => handleUserClick(user)}
            >
              <img
                src={
                  user.avatarUrl ||
                  "https://www.gravatar.com/avatar/default?d=mp"
                }
                alt={`User ${user.userId} Avatar`}
                style={avatarImageStyle}
              />
            </div>
          ))}
      </div>

      {isChatOpen && (
        <div style={chatStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Chat</h2>
            <p onClick={onChatClose} style={{ cursor: "pointer" }}>
              X
            </p>
          </div>
          <ul style={messageListStyle}>
            {messages.map((message, index) => (
              <li
                key={index}
                style={messageStyle(message.sender)}
                className={message.sender === "You" ? "you" : "other"}
              >
                <strong>{message.sender}:</strong> {message.text}
              </li>
            ))}
          </ul>

          <form
            style={formStyle}
            onSubmit={async (e) => {
              e.preventDefault();
              const sender = "You";
              const text = (e.target as HTMLFormElement).message.value;
              // send message to websocket
              await wsService.sendChatMessage({
                userId: messageUserIdRef.current || "",
                message: text,
              });
              // setting my own message for interface
              setMessages([...messages, { sender, text }]);
              // need to check
              (e.target as HTMLFormElement).reset();
            }}
          >
            <input
              type="text"
              name="message"
              placeholder="Type your message..."
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SpaceView;
