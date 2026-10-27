import React, { useState } from 'react';
import { X, ShieldAlert, Ban, DollarSign, Trash2, CheckCircle2 } from 'lucide-react';

export default function EntityDetailModal({ currentCase, onClose, onEnforce }) {
  const [actionSuccess, setActionSuccess] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  if (!currentCase) return null;

  const handleAction = async (actionType) => {
    setLoadingAction(true);
    setActionSuccess(null);
    try {
      await onEnforce(currentCase.id, currentCase.sellerId, actionType);
      setActionSuccess(`Successfully executed ${actionType} for seller ${currentCase.sellerId}`);
    } catch (err) {
      setActionSuccess(`Failed to execute: ${err.message}`);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldAlert size={24} color="#ef4444" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Entity Risk Profile: #{currentCase.sellerId}</h3>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Case #{currentCase.id} • SLA Target Active</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {actionSuccess && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#86efac',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem'
          }}>
            <CheckCircle2 size={16} />
            {actionSuccess}
          </div>
        )}

        {/* Score Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Composite Score</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>{currentCase.riskScore?.toFixed(1)}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Velocity Engine (45%)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#38bdf8' }}>{currentCase.velocityScore?.toFixed(0)}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ML Anomaly Model (55%)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#a855f7' }}>{currentCase.mlAnomalyScore?.toFixed(0)}</div>
          </div>
        </div>

        {/* Anomaly Flags */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Triggered Detection Signals</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {currentCase.anomalyFlags ? currentCase.anomalyFlags.split(',').map((f, i) => (
              <span key={i} className="badge badge-high" style={{ fontSize: '0.7rem' }}>{f.trim()}</span>
            )) : <span style={{ color: '#64748b', fontSize: '0.85rem' }}>No specific flags registered</span>}
          </div>
        </div>

        {/* Graph Relationship Metadata */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Entity Relationship Graph Linkages</h4>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div><strong>Device Fingerprint:</strong> dfp_99a8b1c2 (Shared with 4 sellers)</div>
            <div><strong>IP Geolocation:</strong> 185.220.101.4 (Known VPN/Tor exit)</div>
            <div><strong>Payout Bank Hash:</strong> routing_****9182 (Collision flag)</div>
            <div><strong>Account Age:</strong> 3 days old</div>
          </div>
        </div>

        {/* Action Triggers */}
        <div>
          <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Trigger Mitigation &amp; Enforcement</h4>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-danger"
              disabled={loadingAction}
              onClick={() => handleAction('SUSPEND_SELLER')}
            >
              <Ban size={16} /> Suspend Seller
            </button>
            <button
              className="btn btn-warning"
              disabled={loadingAction}
              onClick={() => handleAction('TAKEDOWN_LISTINGS')}
            >
              <Trash2 size={16} /> Takedown Listings
            </button>
            <button
              className="btn btn-secondary"
              disabled={loadingAction}
              onClick={() => handleAction('HOLD_PAYOUT')}
            >
              <DollarSign size={16} /> Freeze Payouts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
