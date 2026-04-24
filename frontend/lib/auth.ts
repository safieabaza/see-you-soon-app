const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000';

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
};

export const saveAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('seeYouSoonToken', token);
  }
};

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('seeYouSoonToken');
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
