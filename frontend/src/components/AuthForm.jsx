import { useState } from 'react';
import { ArrowRight, BookOpenText, LoaderCircle, Sparkles } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function AuthForm({ mode }) {
  const isRegister = mode === 'register';
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/notes" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await signIn({ email, password }, mode);
      navigate(location.state?.from?.pathname || '/notes', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <aside className="auth-story">
        <Link to="/" className="brand-lockup" aria-label="Margin Notes home">
          <span className="brand-mark"><BookOpenText size={21} strokeWidth={1.8} /></span>
          <span>margin<span className="brand-period">.</span></span>
        </Link>
        <div className="story-copy">
          <span className="eyebrow light-eyebrow"><Sparkles size={14} /> A quieter place to think</span>
          <h1>Give your ideas<br />some <em>room.</em></h1>
          <p>Gather the fragments. Find the thread. Keep what matters close.</p>
        </div>
        <div className="story-foot">
          <span className="story-rule" />
          <span>YOUR THOUGHTS, WELL KEPT</span>
        </div>
        <div className="story-index" aria-hidden="true">01 / 03</div>
      </aside>

      <section className="auth-panel">
        <div className="auth-panel-top">
          <span className="eyebrow">PERSONAL NOTEBOOK</span>
          <span className="auth-edition">EST. FOR YOUR NEXT GOOD IDEA</span>
        </div>
        <div className="auth-form-wrap">
          <span className="form-kicker">{isRegister ? 'A fresh page' : 'Welcome back'}</span>
          <h2>{isRegister ? 'Make it yours.' : 'Pick up the thread.'}</h2>
          <p className="form-intro">
            {isRegister ? 'Create an account to start collecting your thoughts.' : 'Your notebook is right where you left it.'}
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
            <div className="password-label-row">
              <label htmlFor="password">Password</label>
              {isRegister && <span>8 characters minimum</span>}
            </div>
            <input
              id="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              type="password"
              minLength={isRegister ? 8 : undefined}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="submit-button" type="submit" disabled={submitting}>
              {submitting ? <LoaderCircle className="spin" size={18} /> : <>{isRegister ? 'Create your account' : 'Sign in'}<ArrowRight size={17} /></>}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? 'Already have an account?' : 'New to Margin?'}{' '}
            <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link>
          </p>
        </div>
        <p className="auth-privacy">A LITTLE SPACE FOR YOUR INNER LIFE <span>·</span> PRIVATE BY DESIGN</p>
      </section>
    </main>
  );
}