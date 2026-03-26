import { useEffect, useState } from 'react';
import api from '../api/axios';

const tierConfig = {
  '5-match': { cls: 'tier-5', color: 'var(--gold)', label: '5 Match', pct: '40% + Jackpot' },
  '4-match': { cls: 'tier-4', color: 'var(--accent-light)', label: '4 Match', pct: '35%' },
  '3-match': { cls: 'tier-3', color: '#34d399', label: '3 Match', pct: '25%' },
};

export default function Draws() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/draws').then(r => setDraws(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border spinner-accent" />
    </div>
  );

  return (
    <div className="fade-in">
      <div className="page-header">
        <h3>Monthly Draws</h3>
        <p>3-tier prize pool · 5-match (40% + jackpot) · 4-match (35%) · 3-match (25%)</p>
      </div>

      {draws.length === 0 && (
        <div className="card-dark p-5 text-center">
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎲</div>
          <p style={{ color: 'var(--text-muted)' }}>No draws completed yet. Check back after the first monthly draw.</p>
        </div>
      )}

      {draws.map(draw => (
        <div className="card-dark p-4 mb-4" key={draw._id}>
          {/* Draw header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
            <div>
              <h5 className="mb-1" style={{ fontWeight: 700 }}>
                {new Date(draw.year, draw.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h5>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Total pool: <strong style={{ color: 'var(--text-dim)' }}>£{draw.totalPool}</strong>
                {' · '}
                {draw.winners.length} winner{draw.winners.length !== 1 ? 's' : ''}
              </span>
            </div>
            {draw.jackpotRolledOver && (
              <div className="jackpot-glow d-flex align-items-center gap-2" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                🔥 Jackpot rolled over
              </div>
            )}
          </div>

          {/* Winning numbers */}
          <div className="mb-4">
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontWeight: 600 }}>
              Winning Numbers
            </div>
            <div className="d-flex gap-2 flex-wrap">
              {draw.winningNumbers.map((n, i) => (
                <div key={i} className="number-ball">{n}</div>
              ))}
            </div>
          </div>

          {/* Prize tiers */}
          <div className="row g-2 mb-4">
            {Object.entries(tierConfig).map(([tier, cfg]) => (
              <div className="col-4" key={tier}>
                <div className={`card-dark2 p-3 text-center ${cfg.cls}`}>
                  <div style={{ fontWeight: 700, color: cfg.color, fontSize: '0.9rem' }}>{cfg.label}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: 4 }}>
                    £{{ '5-match': draw.prizePool?.fiveMatch, '4-match': draw.prizePool?.fourMatch, '3-match': draw.prizePool?.threeMatch }[tier] ?? 0}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{cfg.pct}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Winners */}
          {draw.winners.length > 0 ? (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontWeight: 600 }}>
                Winners
              </div>
              <div className="d-flex flex-column gap-2">
                {draw.winners.map((w, i) => {
                  const cfg = tierConfig[w.tier];
                  return (
                    <div key={i} className={`card-dark2 px-3 py-2 d-flex justify-content-between align-items-center ${cfg?.cls}`}>
                      <div className="d-flex align-items-center gap-3">
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-card3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: cfg?.color }}>
                          {w.user?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{w.user?.name || 'Anonymous'}</div>
                          <div style={{ fontSize: '0.75rem', color: cfg?.color }}>{w.tier}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: cfg?.color }}>£{w.prize}</span>
                        {w.proofUrl && (
                          <a href={w.proofUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm py-0 px-2" style={{ fontSize: '0.75rem' }}>
                            Proof ↗
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="card-dark2 p-3 text-center" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No winners matched 3 or more numbers this draw.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
