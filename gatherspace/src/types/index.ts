export interface User {
  userId: string;
  username: string;
  role: 'Admin' | 'User';
}

export interface Element {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  staticValue: boolean;
}

export interface Avatar {
  id: string;
  imageUrl: string;
  name: string;
}

export interface MapElement {
  elementId: string;
  x: number;
  y: number;
}

export interface Map {
  id: string;
  thumbnail: string;
  dimensions: string;
  name: string;
  defaultElements: MapElement[];
}

export interface Position {
  x: number;
  y: number;
}
