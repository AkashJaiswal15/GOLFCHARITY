import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export default function ScorePanel() {
  const [scores, setScores] = useState([]);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchScores = useCallback(async () => {
    const { data } = await api.get('/scores');
    setScores(data);
  }, []);

  useEffect(() => { fetchScores(); }, [fetchScores]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num > 45) return setError('Score must be between 1 and 45');
    setSubmitting(true);
    try {
      await api.post('/scores', { value: num });
      setValue('');
      setShowModal(false);
      fetchScores();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding score');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    await api.delete(`/scores/${id}`);
    fetchScores();
  };

  const maxScore = scores.length ? Math.max(...scores.map(s => s.value)) : 0;

  return (
    <div className="card-dark p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-0 fw-700" style={{ fontWeight: 700 }}>Rolling 5 Scores</h5>
          <p className="mb-0 mt-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Stableford · Latest 5 retained
          </p>
        </div>
        <button className="btn btn-accent btn-sm px-3" onClick={() => setShowModal(true)}>
          + Add Score
        </button>
      </div>

      {scores.length === 0 ? (
        <div className="text-center py-4">
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎯</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No scores yet. Add your first Stableford score to enter draws.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {scores.map((s, i) => (
            <div key={s._id} className="card-dark2 px-3 py-2 d-flex align-items-center gap-3">
              <div className="score-rank">{i + 1}</div>
              <div className="score-pill">{s.value}</div>
              {/* Bar */}
              <div className="flex-grow-1" style={{ height: 4, background: 'var(--bg-card3)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${(s.value / 45) * 100}%`,
                  background: s.value === maxScore ? 'var(--gold)' : 'var(--accent)',
                  transition: 'width 0.4s ease'
                }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: 70, textAlign: 'right' }}>
                {new Date(s.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
              <button
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 6px', borderRadius: 4, lineHeight: 1 }}
                onClick={() => handleDelete(s._id)}
                title="Remove score"
              >×</button>
            </div>
          ))}
        </div>
      )}

      {scores.length > 0 && (
        <div className="d-flex justify-content-between mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {scores.length}/5 scores entered
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Avg: <strong style={{ color: 'var(--accent-light)' }}>
              {(scores.reduce((a, s) => a + s.value, 0) / scores.length).toFixed(1)}
            </strong>
          </span>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block modal-dark" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title fw-bold">Enter Stableford Score</h6>
                <button className="btn-close" onClick={() => { setShowModal(false); setError(''); }} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && <div className="alert-gcs-danger p-2 mb-3 rounded" style={{ fontSize: '0.85rem' }}>{error}</div>}
                  <label className="form-label">Score (1 – 45)</label>
                  <input
                    type="number" min="1" max="45"
                    className="form-control form-control-dark w-100"
                    style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: 700 }}
                    value={value} onChange={e => setValue(e.target.value)}
                    autoFocus required
                  />
                  <div className="d-flex justify-content-between mt-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Min: 1</span><span>Max: 45</span>
                  </div>
                </div>
                <div className="modal-footer gap-2">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setShowModal(false); setError(''); }}>Cancel</button>
                  <button type="submit" className="btn btn-accent btn-sm px-4" disabled={submitting}>
                    {submitting ? <span className="spinner-border spinner-border-sm" /> : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
