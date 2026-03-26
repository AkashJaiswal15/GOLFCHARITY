import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const fields = [
    { key: 'name', label: 'Full name', type: 'text', placeholder: 'John Smith' },
    { key: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com' },
    { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="col-md-5 col-lg-4 fade-in">
        <div className="text-center mb-4">
          <div className="auth-logo mb-2">⛳ Golf<span className="accent">Charity</span></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Create your free account</p>
        </div>

        <div className="auth-card">
          {error && <div className="alert-gcs-danger p-3 mb-4 rounded">{error}</div>}

          <form onSubmit={handleSubmit}>
            {fields.map(f => (
              <div className="mb-3" key={f.key}>
                <label className="form-label">{f.label}</label>
                <input type={f.type} className="form-control form-control-dark w-100"
                  placeholder={f.placeholder}
                  value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required />
              </div>
            ))}
            <button className="btn btn-accent w-100 py-2 mt-1" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <hr className="divider my-4" />
          <p className="text-center mb-0" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-light)', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
