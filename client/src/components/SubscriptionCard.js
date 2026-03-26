import { Link } from 'react-router-dom';

const statusConfig = {
  active:    { cls: 'badge-active',    icon: '●', label: 'Active' },
  inactive:  { cls: 'badge-inactive',  icon: '●', label: 'Inactive' },
  cancelled: { cls: 'badge-cancelled', icon: '●', label: 'Cancelled' },
};

export default function SubscriptionCard({ user }) {
  const cfg = statusConfig[user?.subscriptionStatus] || statusConfig.inactive;

  return (
    <div className="card-dark p-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h5 className="mb-0" style={{ fontWeight: 700 }}>Subscription</h5>
        <span className={cfg.cls}>{cfg.icon} {cfg.label}</span>
      </div>

      {user?.subscriptionStatus === 'active' ? (
        <div>
          <div className="card-dark2 p-3 mb-3 d-flex align-items-center gap-3">
            <div style={{ fontSize: '1.5rem' }}>✅</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Draw eligible</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {user.subscriptionPlan === 'yearly' ? '£100/year' : '£10/month'} · {user.subscriptionPlan} plan
              </div>
            </div>
          </div>
          <Link to="/subscribe" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            Manage subscription →
          </Link>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            Subscribe to enter monthly prize draws and support your chosen charity.
          </p>
          <Link to="/subscribe" className="btn btn-accent btn-sm px-4">Subscribe now</Link>
        </div>
      )}
    </div>
  );
}
