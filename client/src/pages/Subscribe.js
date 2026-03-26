import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const plans = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '£10',
    period: 'per month',
    desc: 'Flexible — cancel anytime',
    badge: null,
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: '£100',
    period: 'per year',
    desc: 'Save £20 vs monthly',
    badge: 'Best value',
  },
];

const perks = [
  { icon: '🎲', text: 'Monthly draw entry (3-tier prize pool)' },
  { icon: '🔥', text: 'Jackpot rollover if no 5-match winner' },
  { icon: '❤️', text: 'Charity contribution (minimum 10%)' },
  { icon: '🎯', text: 'Rolling 5-score Stableford tracking' },
];

export default function Subscribe() {
  const [selected, setSelected] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/subscriptions/checkout', { plan: selected });
      window.location.href = data.url;
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating checkout');
      setLoading(false);
    }
  };

  const selectedPlan = plans.find(p => p.id === selected);

  return (
    <div className="row justify-content-center mt-2 fade-in">
      <div className="col-md-9 col-lg-7">
        <div className="page-header text-center">
          <h3>Choose your plan</h3>
          <p>10%+ of every subscription goes directly to your chosen charity</p>
        </div>

        {/* Plan cards */}
        <div className="row g-3 mb-4">
          {plans.map(plan => (
            <div className="col-6" key={plan.id}>
              <div className={`plan-card ${selected === plan.id ? 'selected' : ''}`} onClick={() => setSelected(plan.id)}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{plan.label}</span>
                  {plan.badge && (
                    <span style={{ fontSize: '0.7rem', background: 'var(--gold-dim)', color: 'var(--gold)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>
                      {plan.badge}
                    </span>
                  )}
                </div>
                <div className="stat-number mb-1">{plan.price}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{plan.period}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: 8 }}>{plan.desc}</div>
                {selected === plan.id && (
                  <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--accent-light)', fontWeight: 600 }}>
                    ✓ Selected
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Perks */}
        <div className="card-dark2 p-4 mb-4">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, fontWeight: 600 }}>
            What's included
          </div>
          <div className="row g-2">
            {perks.map((p, i) => (
              <div className="col-12 col-sm-6" key={i}>
                <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.875rem' }}>
                  <span>{p.icon}</span>
                  <span style={{ color: 'var(--text-dim)' }}>{p.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-accent w-100 py-3" style={{ fontSize: '1rem', fontWeight: 700 }} onClick={handleSubscribe} disabled={loading}>
          {loading
            ? <span className="spinner-border spinner-border-sm me-2" />
            : null}
          {loading ? 'Redirecting to Stripe…' : `Subscribe — ${selectedPlan?.price} ${selectedPlan?.period}`}
        </button>
        <p className="text-center mt-2" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          🔒 Secure payment via Stripe · Cancel anytime
        </p>
      </div>
    </div>
  );
}
