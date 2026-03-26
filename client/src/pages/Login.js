import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="col-md-5 col-lg-4 fade-in">
        <div className="text-center mb-4">
          <div className="auth-logo mb-2">⛳ Golf<span className="accent">Charity</span></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to your account</p>
        </div>

        <div className="auth-card">
          {error && <div className="alert-gcs-danger p-3 mb-4 rounded">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input type="email" className="form-control form-control-dark w-100"
                placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input type="password" className="form-control form-control-dark w-100"
                placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="btn btn-accent w-100 py-2" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <hr className="divider my-4" />
          <p className="text-center mb-0" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-light)', textDecoration: 'none', fontWeight: 600 }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
