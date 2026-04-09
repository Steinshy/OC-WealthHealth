export const storage = {
  setAuthToken: (token: string): void => localStorage.setItem('authToken', token),
  removeAuthToken: (): void => localStorage.removeItem('authToken'),
};
