import { useCallback, useEffect, useState } from 'react';
import { notesApi } from '../services/notes.js';

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await notesApi.list();
      setNotes(result.notes);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function save(note) {
    const result = note.id
      ? await notesApi.update(note.id, { title: note.title, content: note.content })
      : await notesApi.create({ title: note.title, content: note.content });
    setNotes((current) => [result.note, ...current.filter((item) => item.id !== result.note.id)]);
    return result.note;
  }

  async function remove(id) {
    await notesApi.remove(id);
    setNotes((current) => current.filter((note) => note.id !== id));
  }

  async function summarize(id) {
    const result = await notesApi.summarize(id);
    setNotes((current) => current.map((note) => (note.id === id ? result.note : note)));
    return result.note;
  }

  return { notes, loading, error, refresh, save, remove, summarize };
}