import { useEffect, useState } from 'react';
import api from '../api/axios';
import ScorePanel from '../components/ScorePanel';
import SubscriptionCard from '../components/SubscriptionCard';
import CharitySummary from '../components/CharitySummary';

const StatCard = ({ value, label, sub, accent }) => (
  <div className="card-dark p-4 fade-in">
    <div className="stat-number" style={accent ? { color: accent } : {}}>{value}</div>
    <div className="stat-label">{label}</div>
    {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
  </div>
);

export default function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => { api.get('/auth/me').then(r => setProfile(r.data)); }, []);

  if (!profile) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border spinner-accent" />
    </div>
  );

  const isActive = profile.subscriptionStatus === 'active';

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h3>Welcome back, <span className="gradient-text">{profile.name}</span> 👋</h3>
          <p>Here's your Golf Charity overview</p>
        </div>
        {!isActive && (
          <a href="/subscribe" className="btn btn-accent btn-sm px-4">
            🎯 Subscribe to enter draws
          </a>
        )}
      </div>

      {/* Stats row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <StatCard
            value={isActive ? '✓' : '✗'}
            label="Draw Eligible"
            sub={isActive ? 'Active subscriber' : 'Subscribe to enter'}
            accent={isActive ? 'var(--green)' : 'var(--red)'}
          />
        </div>
        <div className="col-6 col-md-3">
          <StatCard value={`${profile.charityPercentage || 0}%`} label="To Charity" sub="Of each payment" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard
            value={profile.subscriptionPlan ? profile.subscriptionPlan.charAt(0).toUpperCase() + profile.subscriptionPlan.slice(1) : '—'}
            label="Plan"
            sub={profile.subscriptionPlan === 'yearly' ? '£100/year' : profile.subscriptionPlan === 'monthly' ? '£10/month' : 'No plan'}
          />
        </div>
        <div className="col-6 col-md-3">
          <StatCard value={profile.selectedCharity ? '✓' : '—'} label="Charity" sub={profile.selectedCharity?.name || 'None selected'} />
        </div>
      </div>

      {/* Main content */}
      <div className="row g-4">
        <div className="col-lg-6">
          <ScorePanel />
        </div>
        <div className="col-lg-6 d-flex flex-column gap-4">
          <SubscriptionCard user={profile} />
          <CharitySummary user={profile} />
        </div>
      </div>
    </div>
  );
}
