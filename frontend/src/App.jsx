import { Navigate, Route, Routes } from 'react-router-dom';
import AuthForm from './components/AuthForm.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NotesPage from './pages/NotesPage.jsx';
import { useAuth } from './hooks/useAuth.jsx';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? '/notes' : '/login'} replace />} />
      <Route path="/login" element={<AuthForm mode="login" />} />
      <Route path="/register" element={<AuthForm mode="register" />} />
      <Route
        path="/notes"
        element={(
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}