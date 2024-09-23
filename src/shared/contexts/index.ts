import React, { createContext, useState, useEffect, useContext } from 'react';
import { COLORS } from 'src/shared/constants/index.ts';
import { User, NetworkValue, Invite } from 'src/shared/types/index.ts';
import { useAuth as useAuthHook, useNetworkValue, useInvites } from 'src/shared/hooks/index.ts';

// AuthContext
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const auth = useAuthHook();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// ThemeContext
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<string>('light');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// NetworkContext
interface NetworkContextType {
  networkValue: NetworkValue;
  invites: Invite[];
  updateNetworkValue: () => Promise<void>;
  generateInvite: (linkName: string) => Promise<void>;
  deleteInvite: (inviteId: string) => Promise<void>;
}

export const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC = ({ children }) => {
  const { networkValue, updateNetworkValue } = useNetworkValue();
  const { invites, generateInvite, deleteInvite } = useInvites();

  return (
    <NetworkContext.Provider value={{ networkValue, invites, updateNetworkValue, generateInvite, deleteInvite }}>
      {children}
    </NetworkContext.Provider>
  );
};

// Custom hooks for consuming contexts
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};