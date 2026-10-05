import { request } from './api.js';

export const authApi = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (credentials) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
};