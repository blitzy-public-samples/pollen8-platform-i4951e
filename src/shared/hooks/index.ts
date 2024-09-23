import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from 'src/shared/constants/index.ts';
import { User, ApiResponse, Invite, NetworkValue } from 'src/shared/types/index.ts';
import { calculateNetworkValue } from 'src/shared/utils/index.ts';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (phoneNumber: string, otp: string) => {
    try {
      setLoading(true);
      const response = await axios.post<ApiResponse<User>>(`${API_BASE_URL}/auth/login`, { phoneNumber, otp });
      const userData = response.data.data;
      setUser(userData);
      localStorage.setItem('token', userData.token);
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse<User>>(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data.data);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { user, loading, login, logout, checkAuth };
};

export const useApi = <T>(endpoint: string, options: object = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios<ApiResponse<T>>(`${API_BASE_URL}${endpoint}`, options);
      setData(response.data.data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  return { data, loading, error, fetchData };
};

export const useForm = <T extends object>(initialValues: T, validateFunction: (values: T) => Partial<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues(prevValues => ({ ...prevValues, [name]: value }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setTouched(prevTouched => ({ ...prevTouched, [name]: true }));
    const validationErrors = validateFunction(values);
    setErrors(validationErrors);
  };

  const handleSubmit = (onSubmit: (values: T) => void) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateFunction(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  };

  return { values, errors, touched, handleChange, handleBlur, handleSubmit };
};

export const useNetworkValue = (userId: string) => {
  const [networkValue, setNetworkValue] = useState<number>(0);
  const { data: userData, fetchData } = useApi<User>(`/users/${userId}`);

  const updateNetworkValue = useCallback(() => {
    if (userData) {
      const newNetworkValue = calculateNetworkValue(userData);
      setNetworkValue(newNetworkValue);
    }
  }, [userData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    updateNetworkValue();
  }, [userData, updateNetworkValue]);

  return { networkValue, updateNetworkValue };
};

export const useInvites = () => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const { data, fetchData } = useApi<Invite[]>('/invites');

  const generateInvite = async (linkName: string) => {
    const response = await axios.post<ApiResponse<Invite>>(`${API_BASE_URL}/invites`, { linkName });
    setInvites(prevInvites => [...prevInvites, response.data.data]);
  };

  const deleteInvite = async (inviteId: string) => {
    await axios.delete(`${API_BASE_URL}/invites/${inviteId}`);
    setInvites(prevInvites => prevInvites.filter(invite => invite.id !== inviteId));
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data) {
      setInvites(data);
    }
  }, [data]);

  return { invites, generateInvite, deleteInvite };
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};