import { Suspense, lazy, useState } from 'react';
import { Bold, Check, Eye, FilePlus2, Heading2, LoaderCircle, PenLine, Sparkles, Trash2 } from 'lucide-react';

const MDEditor = lazy(() => import('@uiw/react-md-editor'));
const MarkdownPreview = lazy(() => import('@uiw/react-md-editor').then((module) => ({ default: module.default.Markdown })));

function formattedDate(date) {
  if (!date) return 'UNSAVED DRAFT';
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return 'JUST NOW';
  return `UPDATED ${new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(value).toUpperCase()}`;
}

export default function NoteEditor({ note, setNote, onSave, onSummarize, onDelete, saving, summarizing, saveMessage, error }) {
  const [preview, setPreview] = useState(false);

  if (!note) {
    return (
      <main className="editor-empty">
        <div className="empty-emblem"><FilePlus2 size={27} strokeWidth={1.4} /></div>
        <span className="eyebrow">A PLACE TO BEGIN</span>
        <h2>Select a note<br />or start a <em>new one.</em></h2>
        <p>Somewhere between the first line and the last, the idea will find its shape.</p>
      </main>
    );
  }

  return (
    <main className="note-editor" data-color-mode="light">
      <header className="editor-toolbar">
        <span className="editor-breadcrumb">NOTES <span>/</span> {note.id ? 'ENTRY' : 'NEW ENTRY'}</span>
        <div className="toolbar-actions">
          {note.id && (
            <button className="icon-button danger-button" title="Delete note" aria-label="Delete note" onClick={onDelete}>
              <Trash2 size={17} />
            </button>
          )}
          <button className="text-action ai-action" onClick={onSummarize} disabled={!note.id || summarizing || saving} title={!note.id ? 'Save the note to generate insights' : 'Generate a summary and tags'}>
            {summarizing ? <LoaderCircle className="spin" size={15} /> : <Sparkles size={15} />}
            <span>{summarizing ? 'Thinking' : 'AI insight'}</span>
          </button>
          <button className="save-button" onClick={onSave} disabled={saving || !note.title.trim()}>
            {saving ? <LoaderCircle className="spin" size={16} /> : <Check size={16} />}
            <span>{saving ? 'Saving' : 'Save note'}</span>
          </button>
        </div>
      </header>

      <div className="editor-scroll">
        <div className="note-meta"><span className="meta-dot" /> {formattedDate(note.updatedAt)}</div>
        <input
          className="note-title-input"
          value={note.title}
          onChange={(event) => setNote({ ...note, title: event.target.value })}
          placeholder="Give this thought a name..."
          aria-label="Note title"
          maxLength={200}
        />
        <div className="editor-tabs">
          <div className="editor-mode-switch" aria-label="Editor mode">
            <button className={!preview ? 'mode-active' : ''} onClick={() => setPreview(false)}><PenLine size={14} /> Write</button>
            <button className={preview ? 'mode-active' : ''} onClick={() => setPreview(true)}><Eye size={14} /> Read</button>
          </div>
          {!preview && <span className="markdown-hint"><Bold size={13} /><Heading2 size={14} /> MARKDOWN READY</span>}
        </div>

        {preview ? (
          <div className="markdown-preview">
            {note.content ? (
              <Suspense fallback={<p className="preview-placeholder">Opening your page...</p>}>
                <MarkdownPreview source={note.content} />
              </Suspense>
            ) : <p className="preview-placeholder">Your words will appear here.</p>}
          </div>
        ) : (
          <Suspense fallback={<div className="editor-loading"><span className="loader-ring" /> Opening the editor...</div>}>
            <MDEditor
              value={note.content}
              onChange={(content) => setNote({ ...note, content: content || '' })}
              preview="edit"
              hideToolbar={false}
              visibleDragbar={false}
              height={440}
              textareaProps={{ placeholder: 'Start anywhere. The rest can wait...' }}
              className="markdown-editor"
            />
          </Suspense>
        )}

        {note.summary && (
          <section className="insight-panel">
            <div className="insight-heading"><span><Sparkles size={15} /> A SMALL INSIGHT</span><span>AI / 01</span></div>
            <p>{note.summary}</p>
            {!!note.tags?.length && <div className="insight-tags">{note.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
          </section>
        )}
        {saveMessage && <p className="save-status" role="status">{saveMessage}</p>}
        {error && <p className="editor-error" role="alert">{error}</p>}
      </div>
      <footer className="editor-footer"><span>TAKE YOUR TIME</span><span>{note.content.trim().split(/\s+/).filter(Boolean).length} WORDS</span></footer>
    </main>
  );
}