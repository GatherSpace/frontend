export interface AuthResponse {
  token: string;
  userId: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Element {
  id?: string;
  width: number;
  height: number;
  staticValue: boolean;
  imageUrl: string;
}

export interface Avatar {
  id?: string;
  imageUrl: string;
  name: string;
}

export interface MapElement {
  id: string;
  elementId: string;
  mapId: string;
  staticValue: boolean;
  x: number;
  y: number;
}

export interface Map {
  id: string;
  name: string;
  dimensions?: string;
  width?: number;
  height?: number;
  thumbnail: string;
  creatorId: string;
  mapId?: string;
  MapElements: MapElement[];
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
  dimensions?: string;
  width?: number;
  height?: number;
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

export interface createSpaceResponse {
  id: string;
}
