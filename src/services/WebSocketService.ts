/*import { WebSocketMessage } from "../types/api.types";
import Cookies from "js-cookie";
 export class WebSocketService {
  ws: WebSocket | null = null;
  private readonly baseUrl: string = "ws://localhost:8080/ws";
  //static instance: WebSocketService | null = null;

  getInstance() {
    if (!this.ws) {
      this.connect();
    }
    return this.ws;
  }

  connect() {
    this.ws = new WebSocket(this.baseUrl);

    // console.log("WebSocket Connected");
    //this.setupEventListeners();
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  joinSpace(spaceId: string) {
    if (!this.ws) throw new Error("WebSocket not connected");
    const token = Cookies.get("token");
    if (!token) throw new Error("Token not found");
    this.ws.send(
      JSON.stringify({
        type: "join",
        payload: { token, spaceId },
      })
    );
  }

  updatePosition(x: number, y: number) {
    if (!this.ws) throw new Error("WebSocket not connected");

    this.ws.send(
      JSON.stringify({
        type: "move",
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
*/
/*
import { WebSocketMessage } from "../types/api.types";
import Cookies from "js-cookie";

type MessageHandler = (message: WebSocketMessage) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private readonly baseUrl: string = "ws://localhost:8080/ws";
  private messageHandlers: Set<MessageHandler> = new Set();
  private isConnecting: boolean = false;

  getInstance(): WebSocket | null {
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      this.connect();
    }
    return this.ws;
  }

  connect() {
    if (
      this.isConnecting ||
      (this.ws && this.ws.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    this.isConnecting = true;
    this.ws = new WebSocket(this.baseUrl);

    this.ws.onopen = () => {
      console.log("WebSocket Connected");
      this.isConnecting = false;
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        console.log("Received message:", message);
        this.messageHandlers.forEach((handler) => handler(message));
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      this.isConnecting = false;
    };

    this.ws.onclose = () => {
      console.log("WebSocket Disconnected");
      this.isConnecting = false;
      this.ws = null;
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.messageHandlers.clear();
    }
  }

  addMessageHandler(handler: MessageHandler) {
    this.messageHandlers.add(handler);
  }

  removeMessageHandler(handler: MessageHandler) {
    this.messageHandlers.delete(handler);
  }

  joinSpace(spaceId: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }

    const token = Cookies.get("token");
    if (!token) throw new Error("Token not found");

    this.ws.send(
      JSON.stringify({
        type: "join",
        payload: { token, spaceId },
      })
    );
  }

  updatePosition(x: number, y: number) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }

    this.ws.send(
      JSON.stringify({
        type: "move",
        payload: { x, y },
      })
    );
  }
}

export const wsService = new WebSocketService();
*/

import { WebSocketMessage } from "../types/api.types";
import Cookies from "js-cookie";

type MessageHandler = (message: WebSocketMessage) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private readonly baseUrl: string = "ws://localhost:8080/ws";
  private messageHandlers: Set<MessageHandler> = new Set();
  private connectionPromise: Promise<void> | null = null;

  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.baseUrl);

        this.ws.onopen = () => {
          console.log("WebSocket Connected");
          resolve();
          this.connectionPromise = null;
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage;
            console.log("Received message:", message);
            this.messageHandlers.forEach((handler) => handler(message));
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket Error:", error);
          reject(error);
          this.connectionPromise = null;
        };

        this.ws.onclose = () => {
          console.log("WebSocket Disconnected");
          this.ws = null;
          this.connectionPromise = null;
        };
      } catch (error) {
        reject(error);
        this.connectionPromise = null;
      }
    });

    return this.connectionPromise;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.messageHandlers.clear();
      this.connectionPromise = null;
    }
  }

  addMessageHandler(handler: MessageHandler) {
    this.messageHandlers.add(handler);
  }

  removeMessageHandler(handler: MessageHandler) {
    this.messageHandlers.delete(handler);
  }

  async joinSpace(spaceId: string) {
    await this.connect();

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }

    const token = Cookies.get("accessToken");
    if (!token) throw new Error("Token not found");

    this.ws.send(
      JSON.stringify({
        type: "join",
        payload: { token, spaceId },
      })
    );
  }

  async sendChatMessage(message: { userId: string; message: string }) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }
    this.ws.send(
      JSON.stringify({
        type: "message",
        payload: message,
      })
    );
  }

  async updatePosition(x: number, y: number) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }

    this.ws.send(
      JSON.stringify({
        type: "move",
        payload: { x, y },
      })
    );
  }
}

export const wsService = new WebSocketService();
