import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  signup: async (
    username: string,
    password: string,
    role: "Admin" | "User"
  ) => {
    const response = await api.post("/signup", { username, password, role });
    return response.data;
  },
  signin: async (username: string, password: string) => {
    const response = await api.post("/signin", { username, password });
    Cookies.set("token", response.data.token, {
      secure: true,
      sameSite: "strict",
    });
    return response.data;
  },
  signout: () => {
    Cookies.remove("token");
  },
};

export const adminApi = {
  createElement: async (element: {
    imageUrl: string;
    width: number;
    height: number;
    staticValue: boolean;
  }) => {
    const response = await api.post("/admin/element", element);
    return response.data;
  },
  updateElement: async (id: string, imageUrl: string) => {
    await api.put(`/admin/element/${id}`, { imageUrl });
  },
  createAvatar: async (avatar: { imageUrl: string; name: string }) => {
    const response = await api.post("/admin/avatar", avatar);
    return response.data;
  },
  createMap: async (map: {
    thumbnail: string;
    dimensions: string;
    name: string;
    defaultElements: Array<{ elementId: string; x: number; y: number }>;
  }) => {
    const response = await api.post("/admin/map", map);
    return response.data;
  },
};

export const userApi = {
  updateMetadata: async (avatarId: string) => {
    await api.post("/user/metadata", { avatarId });
  },
  fetchUserSpaces: async () => {
    const response = await api.get("/user/spaces");
    return response.data;
  },
  joinSpace: async (spaceId: string) => {
    await api.post(`/space/${spaceId}/join`);
  },
  leaveSpace: async (spaceId: string) => {
    await api.post(`/space/${spaceId}/leave`);
  },
};

export const spaceApi = {
  fetchSpaceDetails: async (spaceId: string) => {
    const response = await api.get(`/space/${spaceId}`);
    return response.data;
  },
  updatePosition: async (
    spaceId: string,
    position: { x: number; y: number }
  ) => {
    await api.post(`/space/${spaceId}/position`, position);
  },
  fetchElements: async () => {
    const response = await api.get("/elements");
    return response.data;
  },
  fetchAvatars: async () => {
    const response = await api.get("/avatars");
    return response.data;
  },
};

// Export convenience functions for components
export const fetchUserSpaces = userApi.fetchUserSpaces;
export const joinSpace = userApi.joinSpace;
export const leaveSpace = userApi.leaveSpace;
export const fetchSpaceDetails = spaceApi.fetchSpaceDetails;
export const updatePosition = spaceApi.updatePosition;
export const fetchElements = spaceApi.fetchElements;
export const fetchAvatars = spaceApi.fetchAvatars;
export const createElement = adminApi.createElement;
export const updateElement = adminApi.updateElement;
export const createAvatar = adminApi.createAvatar;
export const createMap = adminApi.createMap;

export default api;
