import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from 'src/shared/constants/index.ts';
import { ApiResponse, User, Invite, NetworkValue } from 'src/shared/types/index.ts';

// Create an axios instance with the base URL
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Set up request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Set up response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Implement global error handling here
    // TODO: Handle token refresh if needed
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string): void => {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  localStorage.setItem('authToken', token);
};

export const clearAuthToken = (): void => {
  delete axiosInstance.defaults.headers.common['Authorization'];
  localStorage.removeItem('authToken');
};

class Api {
  constructor() {
    // Constructor is empty as we're using the axiosInstance created above
  }

  async login(phoneNumber: string, otp: string): Promise<ApiResponse<User>> {
    try {
      const response = await axiosInstance.post('/auth/login', { phoneNumber, otp });
      return response.data;
    } catch (error) {
      // TODO: Implement proper error handling
      throw error;
    }
  }

  async register(userData: object): Promise<ApiResponse<User>> {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      // TODO: Implement proper error handling
      throw error;
    }
  }

  async getUserProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await axiosInstance.get('/users/profile');
      return response.data;
    } catch (error) {
      // TODO: Implement proper error handling
      throw error;
    }
  }

  async updateUserProfile(profileData: object): Promise<ApiResponse<User>> {
    try {
      const response = await axiosInstance.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      // TODO: Implement proper error handling
      throw error;
    }
  }

  async getInvites(): Promise<ApiResponse<Invite[]>> {
    try {
      const response = await axiosInstance.get('/invites');
      return response.data;
    } catch (error) {
      // TODO: Implement proper error handling
      throw error;
    }
  }

  async createInvite(inviteData: object): Promise<ApiResponse<Invite>> {
    try {
      const response = await axiosInstance.post('/invites', inviteData);
      return response.data;
    } catch (error) {
      // TODO: Implement proper error handling
      throw error;
    }
  }

  async getNetworkValue(): Promise<ApiResponse<NetworkValue>> {
    try {
      const response = await axiosInstance.get('/network-value');
      return response.data;
    } catch (error) {
      // TODO: Implement proper error handling
      throw error;
    }
  }
}

export const api = new Api();