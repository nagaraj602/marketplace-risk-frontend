import React from 'react';
import { Eye, Check, X, AlertTriangle } from 'lucide-react';

export default function CaseQueueTable({ cases, onInspect, onResolve, onDismiss }) {
  if (!cases || cases.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <AlertTriangle size={36} color="#64748b" style={{ margin: '0 auto 1rem' }} />
        <h4 style={{ color: '#94a3b8', fontSize: '1.1rem' }}>No Active Cases in Review Queue</h4>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Use the Signal Simulator below to inject risk signals or wait for incoming Kafka events.
        </p>
      </div>
    );
  }

  const getTierBadge = (tier) => {
    switch (tier?.toUpperCase()) {
      case 'CRITICAL': return <span className="badge badge-critical">Critical</span>;
      case 'HIGH': return <span className="badge badge-high">High</span>;
      case 'ELEVATED': return <span className="badge badge-elevated">Elevated</span>;
      default: return <span className="badge badge-low">Low</span>;
    }
  };

  return (
    <div className="card" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Trust &amp; Safety Prioritized Case Queue</h3>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Showing {cases.length} cases</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Seller</th>
            <th>Composite Score</th>
            <th>Risk Tier</th>
            <th>Status</th>
            <th>Flags</th>
            <th>Created</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id}>
              <td style={{ fontWeight: 600, color: '#38bdf8' }}>#{c.id}</td>
              <td>
                <div style={{ fontWeight: 500 }}>{c.sellerName || c.sellerId}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.sellerId}</div>
              </td>
              <td>
                <span style={{
                  fontWeight: 700,
                  color: c.riskScore >= 80 ? '#ef4444' : c.riskScore >= 60 ? '#f97316' : '#22c55e'
                }}>
                  {c.riskScore?.toFixed(1)} / 100
                </span>
              </td>
              <td>{getTierBadge(c.riskTier)}</td>
              <td>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  background: c.status === 'AUTO_ENFORCED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                  color: c.status === 'AUTO_ENFORCED' ? '#f87171' : '#60a5fa'
                }}>
                  {c.status}
                </span>
              </td>
              <td style={{ maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#94a3b8' }}>
                {c.anomalyFlags || 'None'}
              </td>
              <td style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {c.createdAt ? new Date(c.createdAt).toLocaleTimeString() : 'Just now'}
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem' }} onClick={() => onInspect(c)} title="Deep-dive Inspector">
                    <Eye size={15} />
                  </button>
                  <button className="btn btn-primary" style={{ padding: '0.35rem 0.6rem' }} onClick={() => onResolve(c.id)} title="Resolve Case">
                    <Check size={15} />
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem' }} onClick={() => onDismiss(c.id)} title="Dismiss as False Positive">
                    <X size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
