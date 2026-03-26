import { useEffect, useState } from 'react';
import api from '../api/axios';

const TABS = [
  { id: 'users', label: '👥 Users' },
  { id: 'draws', label: '🎲 Draws' },
  { id: 'charities', label: '❤️ Charities' },
  { id: 'proof', label: '📎 Proof' },
];

export default function AdminPanel() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [draws, setDraws] = useState([]);
  const [drawLoading, setDrawLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [charityForm, setCharityForm] = useState({ name: '', description: '', category: '', website: '' });
  const [proofForm, setProofForm] = useState({ drawId: '', winnerId: '', proofUrl: '' });

  useEffect(() => {
    if (tab === 'users') api.get('/admin/users').then(r => setUsers(r.data));
    if (tab === 'draws') api.get('/draws').then(r => setDraws(r.data));
  }, [tab]);

  const flash = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); };

  const handleUserUpdate = async (id, field, value) => {
    await api.patch(`/admin/users/${id}`, { [field]: value });
    setUsers(users.map(u => u._id === id ? { ...u, [field]: value } : u));
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
  };

  const handleTriggerDraw = async () => {
    setDrawLoading(true);
    try {
      const { data } = await api.post('/draws/trigger');
      flash(`Draw completed — ${data.winners.length} winner(s) found`);
      api.get('/draws').then(r => setDraws(r.data));
    } catch (err) {
      flash(err.response?.data?.message || 'Error triggering draw', 'danger');
    } finally { setDrawLoading(false); }
  };

  const handleCreateCharity = async (e) => {
    e.preventDefault();
    await api.post('/charities', charityForm);
    flash('Charity created successfully');
    setCharityForm({ name: '', description: '', category: '', website: '' });
  };

  const handleUploadProof = async (e) => {
    e.preventDefault();
    await api.post('/draws/proof', proofForm);
    flash('Proof URL uploaded');
    setProofForm({ drawId: '', winnerId: '', proofUrl: '' });
  };

  const statusBadge = (s) => {
    const map = { active: 'badge-active', inactive: 'badge-inactive', cancelled: 'badge-cancelled' };
    return <span className={map[s] || 'badge-inactive'}>{s}</span>;
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h3>Admin Panel</h3>
        <p>Manage users, draws, charities and winner proofs</p>
      </div>

      {msg.text && <div className={`alert-gcs-${msg.type} p-3 mb-4 rounded`}>{msg.text}</div>}

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} className={`btn btn-sm ${tab === t.id ? 'btn-accent' : 'btn-ghost'}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Users ── */}
      {tab === 'users' && (
        <div className="card-dark p-0" style={{ overflow: 'hidden' }}>
          <div className="p-3 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 600 }}>All Users</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{users.length} total</span>
          </div>
          <div className="table-responsive">
            <table className="table table-gcs mb-0">
              <thead>
                <tr>
                  <th>User</th><th>Status</th><th>Plan</th><th>Charity</th><th>Role</th><th></th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td>
                      <select
                        className="form-select form-control-dark"
                        style={{ width: 'auto', fontSize: '0.8rem', padding: '4px 8px' }}
                        value={u.subscriptionStatus}
                        onChange={e => handleUserUpdate(u._id, 'subscriptionStatus', e.target.value)}
                      >
                        <option value="inactive">Inactive</option>
                        <option value="active">Active</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.subscriptionPlan || '—'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.selectedCharity?.name || '—'}</td>
                    <td>
                      <select
                        className="form-select form-control-dark"
                        style={{ width: 'auto', fontSize: '0.8rem', padding: '4px 8px' }}
                        value={u.role}
                        onChange={e => handleUserUpdate(u._id, 'role', e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-ghost py-0 px-2" style={{ color: 'var(--red)', borderColor: 'rgba(239,68,68,0.3)', fontSize: '0.8rem' }} onClick={() => handleDeleteUser(u._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Draws ── */}
      {tab === 'draws' && (
        <div>
          <button className="btn btn-accent mb-4 px-4" onClick={handleTriggerDraw} disabled={drawLoading}>
            {drawLoading ? <span className="spinner-border spinner-border-sm me-2" /> : '🎲 '}
            {drawLoading ? 'Running draw…' : 'Trigger Monthly Draw'}
          </button>

          {draws.length === 0 && (
            <div className="card-dark p-4 text-center" style={{ color: 'var(--text-muted)' }}>No draws yet.</div>
          )}

          {draws.map(d => (
            <div className="card-dark p-4 mb-3" key={d._id}>
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {new Date(d.year, d.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Pool: £{d.totalPool} · {d.winners.length} winner(s) · Numbers: {d.winningNumbers.join(', ')}
                  </div>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  {d.jackpotRolledOver && (
                    <span style={{ fontSize: '0.75rem', background: 'var(--gold-dim)', color: 'var(--gold)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>
                      🔥 Jackpot rolled
                    </span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{d._id}</span>
                </div>
              </div>
              {d.winners.length > 0 && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  {d.winners.map((w, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{w._id}</span>
                      {' — '}{w.user?.name} · {w.tier} · £{w.prize}
                      {w.proofUrl && <span style={{ color: 'var(--green)' }}> · ✓ Proof</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Charities ── */}
      {tab === 'charities' && (
        <div className="card-dark p-4">
          <h6 style={{ fontWeight: 700, marginBottom: 20 }}>Add New Charity</h6>
          <form onSubmit={handleCreateCharity}>
            <div className="row g-3">
              {[
                { key: 'name', label: 'Charity name', required: true },
                { key: 'category', label: 'Category' },
                { key: 'website', label: 'Website URL' },
                { key: 'description', label: 'Description' },
              ].map(f => (
                <div className={f.key === 'description' ? 'col-12' : 'col-md-6'} key={f.key}>
                  <label className="form-label">{f.label}</label>
                  <input className="form-control form-control-dark w-100"
                    value={charityForm[f.key]}
                    onChange={e => setCharityForm({ ...charityForm, [f.key]: e.target.value })}
                    required={f.required} />
                </div>
              ))}
            </div>
            <button className="btn btn-accent mt-4 px-4">Create Charity</button>
          </form>
        </div>
      )}

      {/* ── Proof ── */}
      {tab === 'proof' && (
        <div className="card-dark p-4">
          <h6 style={{ fontWeight: 700, marginBottom: 4 }}>Upload Winner Proof</h6>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>
            Copy the Draw ID and Winner sub-document ID from the Draws tab above.
          </p>
          <form onSubmit={handleUploadProof}>
            <div className="row g-3">
              {[
                { key: 'drawId', label: 'Draw ID' },
                { key: 'winnerId', label: 'Winner Sub-document ID' },
                { key: 'proofUrl', label: 'Proof URL' },
              ].map(f => (
                <div className="col-12" key={f.key}>
                  <label className="form-label">{f.label}</label>
                  <input className="form-control form-control-dark w-100"
                    placeholder={f.key === 'proofUrl' ? 'https://…' : 'MongoDB ObjectId'}
                    value={proofForm[f.key]}
                    onChange={e => setProofForm({ ...proofForm, [f.key]: e.target.value })}
                    required />
                </div>
              ))}
            </div>
            <button className="btn btn-accent mt-4 px-4">Upload Proof</button>
          </form>
        </div>
      )}
    </div>
  );
}
