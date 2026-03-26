import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => pathname === path ? 'nav-pill active' : 'nav-pill';

  return (
    <nav className="gcs-navbar">
      <div className="container d-flex align-items-center py-2 gap-4">
        <Link className="navbar-brand-logo text-decoration-none me-2" to="/dashboard">
          ⛳ Golf<span className="accent">Charity</span>
        </Link>

        {user && (
          <div className="d-none d-md-flex align-items-center gap-1 flex-grow-1">
            <Link className={isActive('/dashboard')} to="/dashboard">Dashboard</Link>
            <Link className={isActive('/charities')} to="/charities">Charities</Link>
            <Link className={isActive('/draws')} to="/draws">Draws</Link>
            {user.role === 'admin' && (
              <Link className={isActive('/admin')} to="/admin">
                <span style={{ color: 'var(--gold)' }}>⚡</span> Admin
              </Link>
            )}
          </div>
        )}

        <div className="ms-auto d-flex align-items-center gap-2">
          {user ? (
            <>
              <div className="d-none d-md-flex align-items-center gap-2 me-1">
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-light)'
                }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{user.name}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sign out</button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost btn-sm" to="/login">Sign in</Link>
              <Link className="btn btn-accent btn-sm" to="/register">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile menu */}
        {user && (
          <div className="d-flex d-md-none gap-2 ms-2">
            <Link className={isActive('/dashboard')} to="/dashboard">Home</Link>
            <Link className={isActive('/charities')} to="/charities">Charity</Link>
            <Link className={isActive('/draws')} to="/draws">Draws</Link>
            {user.role === 'admin' && <Link className={isActive('/admin')} to="/admin">Admin</Link>}
          </div>
        )}
      </div>
    </nav>
  );
}
