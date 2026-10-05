import { request } from './api.js';

export const notesApi = {
  list: () => request('/notes'),
  create: (note) => request('/notes', { method: 'POST', body: JSON.stringify(note) }),
  update: (id, note) => request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(note) }),
  remove: (id) => request(`/notes/${id}`, { method: 'DELETE' }),
  summarize: (id) => request(`/notes/${id}/summarize`, { method: 'POST' }),
};