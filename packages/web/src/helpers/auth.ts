import decode from 'jwt-decode';

const ACCESS_TOKEN = 'NOTE_APP';

export const login = (accessToken, remember) =>
  remember ? localStorage.setItem(ACCESS_TOKEN, accessToken) : sessionStorage.setItem(ACCESS_TOKEN, accessToken);

export const isLoggedIn = () => {
  const token = getAccessToken();
  return !!token && !isTokenExpired(token);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);

const isTokenExpired = token => {
  try {
    const decoded = decode(token);
    if (decoded.exp < Date.now() / 1000) {
      return true;
    } else return false;
  } catch (err) {
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  sessionStorage.removeItem(ACCESS_TOKEN);
  return;
};
