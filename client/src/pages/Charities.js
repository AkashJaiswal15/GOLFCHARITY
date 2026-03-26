import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Charities() {
  const [charities, setCharities] = useState([]);
  const [search, setSearch] = useState('');
  const [percentage, setPercentage] = useState(10);
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      api.get(`/charities?search=${search}`).then(r => setCharities(r.data));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSelect = async (charityId) => {
    setLoading(true);
    try {
      await api.post('/charities/select', { charityId, percentage });
      setSelected(charityId);
      setMsg({ text: 'Charity updated successfully!', type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Error', type: 'danger' });
    } finally { setLoading(false); }
  };

  const categoryColors = {
    Health: '#f87171', Environment: '#34d399', Children: '#60a5fa',
    Housing: '#fbbf24', 'Mental Health': '#a78bfa', 'International Aid': '#fb923c',
    Social: '#38bdf8', 'Emergency Services': '#f472b6', General: '#94a3b8',
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h3>Charity Directory</h3>
        <p>Choose where your subscription contribution goes — minimum 10%</p>
      </div>

      {msg.text && (
        <div className={`alert-gcs-${msg.type} p-3 mb-4 rounded`}>{msg.text}</div>
      )}

      {/* Search + percentage */}
      <div className="card-dark p-3 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-8">
            <label className="form-label">Search charities</label>
            <div className="position-relative">
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
              <input
                className="form-control form-control-dark w-100"
                style={{ paddingLeft: 36 }}
                placeholder="Search by name or category…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label">Your contribution</label>
            <div className="d-flex align-items-center gap-2">
              <input
                type="range" min="10" max="100" step="5"
                className="form-range flex-grow-1"
                value={percentage}
                onChange={e => setPercentage(parseInt(e.target.value))}
                style={{ accentColor: 'var(--accent)' }}
              />
              <span style={{ minWidth: 42, fontWeight: 700, color: 'var(--accent-light)', fontSize: '1rem' }}>{percentage}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {charities.map(c => {
          const catColor = categoryColors[c.category] || '#94a3b8';
          const isSelected = selected === c._id;
          return (
            <div className="col-md-6 col-lg-4" key={c._id}>
              <div className={`charity-card ${isSelected ? 'selected' : ''}`} onClick={() => handleSelect(c._id)}>
                <div className="d-flex align-items-start gap-3">
                  <div style={{
                    width: 48, height: 48, borderRadius: 10, flexShrink: 0,
                    background: `${catColor}18`, border: `1px solid ${catColor}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem'
                  }}>
                    {c.logo ? <img src={c.logo} alt="" width={32} height={32} className="rounded" /> : '❤️'}
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</span>
                      {isSelected && <span style={{ color: 'var(--green)', fontSize: '0.8rem', flexShrink: 0 }}>✓</span>}
                    </div>
                    {c.category && (
                      <span style={{ fontSize: '0.7rem', background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}30`, borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>
                        {c.category}
                      </span>
                    )}
                    {c.description && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8, marginBottom: 0, lineHeight: 1.4 }}>
                        {c.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <button
                    className={`btn btn-sm w-100 ${isSelected ? 'btn-ghost' : 'btn-accent'}`}
                    disabled={loading}
                    onClick={e => { e.stopPropagation(); handleSelect(c._id); }}
                  >
                    {isSelected ? '✓ Selected' : 'Select this charity'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {charities.length === 0 && (
          <div className="col-12">
            <div className="card-dark p-5 text-center">
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔍</div>
              <p style={{ color: 'var(--text-muted)' }}>No charities found. Try a different search.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
