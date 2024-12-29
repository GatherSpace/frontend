import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import {
  Element,
  Avatar,
  Space,
  AuthResponse,
  Map,
  createSpaceResponse,
} from "../types/api.types";

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

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const handleApiError = (error: AxiosError) => {
  if (error.response) {
    throw new ApiError(error.response.status, error.response.data as string);
  }
  throw new Error("Network error");
};

export const auth = {
  signup: async (
    username: string,
    password: string,
    role: "Admin" | "User"
  ): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/signup", {
        username,
        password,
        role,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  signin: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/signin", {
        username,
        password,
      });
      Cookies.set("token", response.data.token, {
        secure: true,
        sameSite: "strict",
      });
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  signout: () => {
    Cookies.remove("token");
  },
};

export const adminApi = {
  createElement: async (
    element: Omit<Element, "id">
  ): Promise<{ id: string }> => {
    try {
      const response = await api.post("/admin/element", element);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  updateElement: async (id: string, imageUrl: string) => {
    try {
      await api.put(`/admin/element/${id}`, { imageUrl });
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  createAvatar: async (avatar: { imageUrl: string; name: string }) => {
    try {
      const response = await api.post("/admin/avatar", avatar);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  createMap: async (map: {
    id?: string;
    thumbnail: string;
    dimensions: string;
    name: string;
    defaultElements: Array<{ elementId: string; x: number; y: number }>;
  }) => {
    try {
      const response = await api.post("/admin/map", map);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  fetchElements: async () => {
    try {
      const response = await api.get("/elements");
      return response.data.elements;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
};

export const userApi = {
  updateMetadata: async (avatarId: string): Promise<void> => {
    try {
      await api.post("/user/metadata", { avatarId });
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  fetchAvatars: async (): Promise<Avatar[]> => {
    try {
      const response = await api.get("user/avatars");
      return response.data.avatars;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  fetchBulkUserData: async (userIds: string[]) => {
    try {
      const response = await api.get(
        `/user/bulk?${userIds.map((id) => "ids=" + id).join("&")}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
};

export const spaceApi = {
  fetchSpaceDetails: async (spaceId: string): Promise<Space> => {
    try {
      const response = await api.get<Space>(`/space/${spaceId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  createSpace: async (
    name: string,
    dimensions: string,
    mapId: string
  ): Promise<createSpaceResponse> => {
    try {
      const response = await api.post("/space", { name, dimensions, mapId });
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  deleteSpace: async (spaceId: string): Promise<void> => {
    try {
      await api.delete(`/space/${spaceId}`);
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  fetchUserSpaces: async (): Promise<Space[]> => {
    try {
      const response = await api.get("space/all");
      return response.data.spaces;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  addElementToSpace: async (
    spaceId: string,
    elementId: string,
    x: number,
    y: number
  ) => {
    try {
      const response = await api.post(`/space/element`, {
        elementId,
        spaceId,
        x,
        y,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  deleteElementFromSpace: async (spaceId: string) => {
    try {
      await api.delete("space/element", { data: { spaceId } });
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  getAllMaps: async (): Promise<Map[]> => {
    try {
      const response = await api.get("/maps");
      return response.data.maps;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
};

// websocket

// Export convenience functions for components

export const {
  fetchAvatars,
  updateMetadata,
  fetchBulkUserData,
  createElement,
  updateElement,
  createAvatar,
  createMap,
  fetchElements,
  createSpace,
  deleteSpace,
  addElementToSpace,
  deleteElementFromSpace,
  fetchUserSpaces,
  fetchSpaceDetails,
  getAllMaps,
} = {
  fetchAvatars: userApi.fetchAvatars,
  updateMetadata: userApi.updateMetadata,
  fetchBulkUserData: userApi.fetchBulkUserData,
  createElement: adminApi.createElement,
  updateElement: adminApi.updateElement,
  createAvatar: adminApi.createAvatar,
  createMap: adminApi.createMap,
  fetchElements: adminApi.fetchElements,
  createSpace: spaceApi.createSpace,
  deleteSpace: spaceApi.deleteSpace,
  addElementToSpace: spaceApi.addElementToSpace,
  deleteElementFromSpace: spaceApi.deleteElementFromSpace,
  fetchUserSpaces: spaceApi.fetchUserSpaces,
  fetchSpaceDetails: spaceApi.fetchSpaceDetails,
  getAllMaps: spaceApi.getAllMaps,
};

export default api;
