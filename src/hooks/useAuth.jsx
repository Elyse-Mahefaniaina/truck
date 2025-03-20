import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const { isLoading, error, login, logout } = useContext(AuthContext);

  return { isLoading, error, login, logout };
};
