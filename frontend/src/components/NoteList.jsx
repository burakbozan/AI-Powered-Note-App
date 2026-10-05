import { FileText, Search, Sparkles } from 'lucide-react';

function formatDate(date) {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return 'Just now';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(value);
}

export default function NoteList({ notes, selectedId, onSelect, search, setSearch, selectedTag, setSelectedTag, allTags }) {
  return (
    <section className="note-library" aria-label="Notes library">
      <div className="library-heading">
        <div>
          <span className="eyebrow">THE NOTEBOOK</span>
          <h1>Your notes<span className="heading-period">.</span></h1>
        </div>
        <span className="library-total">{String(notes.length).padStart(2, '0')} ENTRIES</span>
      </div>

      <label className="search-field">
        <Search size={17} />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your notes" aria-label="Search notes" />
        <kbd>/</kbd>
      </label>

      {allTags.length > 0 && (
        <label className="tag-filter">
          <span>FILTER BY TAG</span>
          <select value={selectedTag} onChange={(event) => setSelectedTag(event.target.value)} aria-label="Filter notes by tag">
            <option value="">Every tag</option>
            {allTags.map((tag) => <option value={tag} key={tag}>{tag}</option>)}
          </select>
        </label>
      )}

      <div className="note-list" aria-live="polite">
        {notes.length === 0 ? (
          <div className="empty-library">
            <span><FileText size={20} /></span>
            <strong>No notes in this corner.</strong>
            <p>Try another filter, or make a fresh note.</p>
          </div>
        ) : notes.map((note, index) => (
          <button
            key={note.id}
            className={`note-row ${selectedId === note.id ? 'active' : ''}`}
            onClick={() => onSelect(note)}
          >
            <div className="note-row-top">
              <span className="note-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="note-date">{formatDate(note.updatedAt)}</span>
            </div>
            <strong className="note-row-title">{note.title}</strong>
            <p className="note-excerpt">{note.content?.replace(/[#>*_`~\[\]()]/g, '').replace(/\s+/g, ' ').trim() || 'An empty page, ready for a thought.'}</p>
            <div className="note-row-bottom">
              <span className="note-tags">
                {(note.tags || []).slice(0, 2).map((tag) => <span className="tag-chip" key={tag}>{tag}</span>)}
              </span>
              {note.summary && <Sparkles className="has-summary" size={15} title="AI insight available" />}
            </div>
          </button>
        ))}
      </div>
      <div className="library-foot"><span>END OF THE PAGE</span><span>✳</span></div>
    </section>
  );
}