export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  country: 'INDIA' | 'AMERICA';
}

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'ADMIN';
};

export const isManager = (user: User | null): boolean => {
  return user?.role === 'MANAGER';
};

export const isMember = (user: User | null): boolean => {
  return user?.role === 'MEMBER';
};

export const canCheckout = (user: User | null): boolean => {
  return user?.role === 'ADMIN' || user?.role === 'MANAGER';
};

export const canCancelOrder = (user: User | null): boolean => {
  return user?.role === 'ADMIN' || user?.role === 'MANAGER';
};

export const canManagePayments = (user: User | null): boolean => {
  return user?.role === 'ADMIN';
};
