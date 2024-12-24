export interface AuthResponse {
  token: string;
  userId: string;
}

export interface Element {
  id: string;
  width: number;
  height: number;
  staticValue: boolean;
  imageUrl: string;
}

export interface Avatar {
  id: string;
  imageUrl: string;
  name: string;
}

export interface SpaceElement {
  id: string;
  elementId: string;
  spaceId: string;
  x: number;
  y: number;
}

export interface Space {
  id: string;
  name: string;
  dimensions: string;
  thumbnail: string;
  creatorId: string;
  mapId?: string;
  elements: SpaceElement[];
}

export interface WebSocketMessage {
  type: string;
  payload: any;
}

export interface SpaceJoinedResponse {
  type: "space-joined";
  payload: {
    spawn: {
      x: number;
      y: number;
    };
    users: Array<{ id: number }>;
  };
}
