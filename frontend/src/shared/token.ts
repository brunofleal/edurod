const TOKEN_KEY = "JWT_TOKEN";

export const setToken = (jwt: string) => {
  localStorage.setItem(TOKEN_KEY, jwt);
};

export const deleteToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
