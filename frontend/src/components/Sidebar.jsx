import { BookOpenText, LogOut, Plus, Search, Sparkles } from 'lucide-react';

export default function Sidebar({ user, activeFilter, setActiveFilter, onNewNote, onSignOut, noteCount }) {
  return (
    <aside className="sidebar">
      <a className="brand-lockup sidebar-brand" href="/notes" aria-label="Margin Notes dashboard">
        <span className="brand-mark"><BookOpenText size={20} strokeWidth={1.8} /></span>
        <span>margin<span className="brand-period">.</span></span>
      </a>

      <button className="new-note-button" onClick={onNewNote} aria-label="Create a new note" title="New note">
        <Plus size={17} /> <span>New note</span><kbd>N</kbd>
      </button>

      <div className="sidebar-section-label">YOUR SPACE <span>{String(noteCount).padStart(2, '0')}</span></div>
      <nav className="sidebar-nav" aria-label="Note filters">
        <button className={activeFilter === 'all' ? 'nav-item selected' : 'nav-item'} onClick={() => setActiveFilter('all')} aria-label="All notes" title="All notes">
          <BookOpenText size={17} /><span>All notes</span><span className="nav-count">{noteCount}</span>
        </button>
        <button className={activeFilter === 'tagged' ? 'nav-item selected' : 'nav-item'} onClick={() => setActiveFilter('tagged')} aria-label="Notes with AI insights" title="With insights">
          <Sparkles size={17} /><span>With insights</span>
        </button>
        <button className={activeFilter === 'untagged' ? 'nav-item selected' : 'nav-item'} onClick={() => setActiveFilter('untagged')} aria-label="Unsorted notes" title="Unsorted">
          <Search size={17} /><span>Unsorted</span>
        </button>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <span className="note-spark"><Sparkles size={14} /></span>
          <p>Ideas are seeds.<br /><em>Keep collecting.</em></p>
          <span className="note-index">M / 01</span>
        </div>
        <div className="account-row">
          <div className="avatar">{user?.email?.charAt(0).toUpperCase() || 'M'}</div>
          <div className="account-copy"><strong>{user?.email?.split('@')[0]}</strong><span>Personal space</span></div>
          <button className="icon-button signout-button" onClick={onSignOut} title="Sign out" aria-label="Sign out"><LogOut size={17} /></button>
        </div>
      </div>
    </aside>
  );
}