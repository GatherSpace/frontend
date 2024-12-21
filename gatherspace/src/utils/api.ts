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
  fetchElements: async () => {
    const response = await api.get("/elements");
    return response.data;
  },
};

export const userApi = {
  updateMetadata: async (avatarId: string) => {
    await api.post("/user/metadata", { avatarId });
  },
  fetchAvatars: async () => {
    const response = await api.get("user/avatars");
    return response.data;
  },
  fetchBulkUserData: async (userIds: string[]) => {
    const response = await api.get(
      `/user/bulk?${userIds.map((id) => "ids=" + id).join("&")}`
    );
    return response.data;
  },
};

export const spaceApi = {
  fetchSpaceDetails: async (spaceId: string) => {
    const response = await api.get(`/space/${spaceId}`);
    return response.data;
  },
  createSpace: async (name: string, dimensions: string, mapId: string) => {
    const response = await api.post("/space", { name, dimensions, mapId });
    return response.data;
  },
  deleteSpace: async (spaceId: string) => {
    await api.delete(`/space/${spaceId}`);
  },
  fetchUserSpaces: async () => {
    const response = await api.get("space/all");
    return response.data;
  },
  addElementToSpace: async (
    spaceId: string,
    elementId: string,
    x: number,
    y: number
  ) => {
    const response = await api.post(`/space/element`, {
      elementId,
      spaceId,
      x,
      y,
    });
    return response.data;
  },
  deleteElementFromSpace: async (spaceId: string) => {
    // i need to send data in the body
    await api.delete("space/element", { data: { spaceId } });
  },

  // 9. /user/metadata/bulk?ids=userId&ids=userId1&ids=userId2.. - GET
};

// websocket

export const websocketApi = {
  joinSpace: async (spaceId: string, token: string) => {
    return true;
  },
  updatePosition: async (
    spaceId: string,
    position: { x: number; y: number }
  ) => {
    return true;
  },
};

// Export convenience functions for components

export const fetchAvatars = userApi.fetchAvatars; //4
export const updateMetadata = userApi.updateMetadata; //5
export const fetchBulkUserData = userApi.fetchBulkUserData; //6

export const createElement = adminApi.createElement; //7
export const updateElement = adminApi.updateElement; //8
export const createAvatar = adminApi.createAvatar; //11
export const createMap = adminApi.createMap; //12
export const fetchElements = adminApi.fetchElements; //2

export const createSpace = spaceApi.createSpace; //9
export const deleteSpace = spaceApi.deleteSpace; //10
export const addElementToSpace = spaceApi.addElementToSpace; //13
export const deleteElementFromSpace = spaceApi.deleteElementFromSpace; //14
export const fetchUserSpaces = spaceApi.fetchUserSpaces; //1
export const fetchSpaceDetails = spaceApi.fetchSpaceDetails; //3

export default api;
