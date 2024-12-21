import { WebSocketMessage } from "../types/api.types";

export class WebSocketService {
  private ws: WebSocket | null = null;
  private readonly baseUrl: string = "ws://localhost:3000/ws";

  connect() {
    this.ws = new WebSocket(this.baseUrl);
    this.setupEventListeners();
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  joinSpace(spaceId: string) {
    if (!this.ws) throw new Error("WebSocket not connected");

    this.ws.send(
      JSON.stringify({
        type: "join_space",
        payload: { spaceId },
      })
    );
  }

  updatePosition(x: number, y: number) {
    if (!this.ws) throw new Error("WebSocket not connected");

    this.ws.send(
      JSON.stringify({
        type: "update_position",
        payload: { x, y },
      })
    );
  }

  private setupEventListeners() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as WebSocketMessage;
      this.handleMessage(data);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case "user_joined":
        console.log("User joined:", message.payload);
        break;
      case "user_left":
        console.log("User left:", message.payload);
        break;
      case "position_update":
        console.log("Position update:", message.payload);
        break;
      default:
        console.log("Unknown message type:", message);
    }
  }
}

export const wsService = new WebSocketService();
