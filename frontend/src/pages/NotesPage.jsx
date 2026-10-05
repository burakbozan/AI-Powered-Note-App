import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteEditor from '../components/NoteEditor.jsx';
import NoteList from '../components/NoteList.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNotes } from '../hooks/useNotes.js';

const blankNote = () => ({ title: '', content: '', tags: [], summary: '' });

export default function NotesPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { notes, loading, error: loadError, save, remove, summarize } = useNotes();
  const [draft, setDraft] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [editorError, setEditorError] = useState('');

  const allTags = useMemo(() => [...new Set(notes.flatMap((note) => note.tags || []))].sort(), [notes]);
  const filteredNotes = useMemo(() => notes.filter((note) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [note.title, note.content, note.summary, ...(note.tags || [])]
      .some((value) => value?.toLowerCase().includes(query));
    const matchesType = activeFilter === 'all'
      || (activeFilter === 'tagged' && (note.summary || note.tags?.length))
      || (activeFilter === 'untagged' && !note.tags?.length);
    return matchesSearch && matchesType && (!selectedTag || note.tags?.includes(selectedTag));
  }), [notes, search, activeFilter, selectedTag]);

  function selectNote(note) {
    setDraft({ ...note });
    setSaveMessage('');
    setEditorError('');
  }

  function startNewNote() {
    setDraft(blankNote());
    setSaveMessage('');
    setEditorError('');
  }

  async function saveDraft() {
    if (!draft?.title.trim()) {
      setEditorError('Give your note a title before saving.');
      return;
    }
    setSaving(true);
    setEditorError('');
    setSaveMessage('');
    try {
      const saved = await save(draft);
      setDraft(saved);
      setSaveMessage('All tucked away.');
    } catch (requestError) {
      setEditorError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function createSummary() {
    setSummarizing(true);
    setEditorError('');
    try {
      const updated = await summarize(draft.id);
      setDraft(updated);
    } catch (requestError) {
      setEditorError(requestError.message);
    } finally {
      setSummarizing(false);
    }
  }

  async function deleteDraft() {
    if (!draft?.id || !window.confirm('Delete this note for good?')) return;
    try {
      await remove(draft.id);
      setDraft(null);
    } catch (requestError) {
      setEditorError(requestError.message);
    }
  }

  function handleSignOut() {
    signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="workspace-shell">
      <Sidebar
        user={user}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        onNewNote={startNewNote}
        onSignOut={handleSignOut}
        noteCount={notes.length}
      />
      <NoteList
        notes={filteredNotes}
        selectedId={draft?.id}
        onSelect={selectNote}
        search={search}
        setSearch={setSearch}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        allTags={allTags}
      />
      {loading ? (
        <main className="editor-empty loading-state"><span className="loader-ring" /><span className="eyebrow">OPENING YOUR NOTEBOOK</span></main>
      ) : (
        <NoteEditor
          note={draft}
          setNote={setDraft}
          onSave={saveDraft}
          onSummarize={createSummary}
          onDelete={deleteDraft}
          saving={saving}
          summarizing={summarizing}
          saveMessage={saveMessage}
          error={editorError || loadError}
        />
      )}
    </div>
  );
}