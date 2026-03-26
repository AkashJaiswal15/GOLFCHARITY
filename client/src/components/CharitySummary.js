import { Link } from 'react-router-dom';

export default function CharitySummary({ user }) {
  const charity = user?.selectedCharity;
  const pct = user?.charityPercentage || 10;

  return (
    <div className="card-dark p-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h5 className="mb-0" style={{ fontWeight: 700 }}>Charity</h5>
        {charity && (
          <span style={{ fontSize: '0.8rem', color: 'var(--green)', background: 'rgba(16,185,129,0.1)', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.25)' }}>
            {pct}% allocated
          </span>
        )}
      </div>

      {charity ? (
        <div>
          <div className="card-dark2 p-3 mb-3 d-flex align-items-center gap-3">
            {charity.logo
              ? <img src={charity.logo} alt="" width={40} height={40} className="rounded" />
              : <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>❤️</div>
            }
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{charity.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                £{((pct / 100) * (user.subscriptionPlan === 'yearly' ? 100 : 10)).toFixed(2)} per payment
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: 4, background: 'var(--bg-card3)', borderRadius: 2, marginBottom: 12 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--green)', borderRadius: 2, transition: 'width 0.4s' }} />
          </div>
          <Link to="/charities" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            Change charity →
          </Link>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            No charity selected. At least 10% of your subscription goes to a cause you choose.
          </p>
          <Link to="/charities" className="btn btn-accent btn-sm px-4">Select charity</Link>
        </div>
      )}
    </div>
  );
}
