import React, { useState } from 'react';
import { Play, Sparkles, AlertCircle } from 'lucide-react';

export default function SignalSimulator({ onSimulate }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const scenarios = [
    {
      title: 'Flash Sale Listing Flood',
      desc: '100 listings/hr + 5 shared devices (Triggers Automated Suspension)',
      badge: 'Critical Abuse',
      payload: {
        sellerId: `seller_burst_${Math.floor(1000 + Math.random() * 9000)}`,
        sellerName: 'BargainBot Inc',
        accountAgeDays: 3,
        listingsLastHour: 95,
        ordersLastHour: 2,
        positiveReviewsRatio: 0.60,
        uniqueDevicesCount: 5,
        distinctIpCount: 4,
        avgListingPriceUsd: 1200.0,
        payoutAccountChangedRecently: true,
        geoMismatchCountry: true
      }
    },
    {
      title: 'Account Takeover (ATO)',
      desc: 'Payout method changed + IP geo mismatch + high-value listing',
      badge: 'High Risk',
      payload: {
        sellerId: `seller_ato_${Math.floor(1000 + Math.random() * 9000)}`,
        sellerName: 'Vintage Collectibles',
        accountAgeDays: 120,
        listingsLastHour: 25,
        ordersLastHour: 1,
        positiveReviewsRatio: 0.95,
        uniqueDevicesCount: 3,
        distinctIpCount: 3,
        avgListingPriceUsd: 850.0,
        payoutAccountChangedRecently: true,
        geoMismatchCountry: true
      }
    },
    {
      title: 'Review Manipulation Ring',
      desc: 'Abnormal orders surge with skewed reviews and proxy rotation',
      badge: 'Elevated Risk',
      payload: {
        sellerId: `seller_rev_${Math.floor(1000 + Math.random() * 9000)}`,
        sellerName: 'QuickStars Store',
        accountAgeDays: 20,
        listingsLastHour: 12,
        ordersLastHour: 45,
        positiveReviewsRatio: 0.15,
        uniqueDevicesCount: 4,
        distinctIpCount: 5,
        avgListingPriceUsd: 25.0,
        payoutAccountChangedRecently: false,
        geoMismatchCountry: false
      }
    },
    {
      title: 'Legitimate Power Seller',
      desc: 'Normal baseline activity (Triggers Auto-Dismissal with zero noise)',
      badge: 'Normal / Low',
      payload: {
        sellerId: `seller_norm_${Math.floor(1000 + Math.random() * 9000)}`,
        sellerName: 'Trusted Prime Goods',
        accountAgeDays: 450,
        listingsLastHour: 2,
        ordersLastHour: 15,
        positiveReviewsRatio: 0.98,
        uniqueDevicesCount: 1,
        distinctIpCount: 1,
        avgListingPriceUsd: 45.0,
        payoutAccountChangedRecently: false,
        geoMismatchCountry: false
      }
    }
  ];

  const triggerScenario = async (sc) => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await onSimulate(sc.payload);
      setFeedback({
        type: 'success',
        text: `Evaluated ${sc.payload.sellerName}: Score ${res.compositeRiskScore} -> Decision: ${res.routingDecision}`
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: `Error simulating scenario: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <Sparkles size={20} color="#38bdf8" />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Live Signal Ingestion Simulator</h3>
      </div>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        Inject realistic marketplace signal payloads to test Kafka event normalization, velocity rules, and ML anomaly routing.
      </p>

      {feedback && (
        <div style={{
          padding: '0.75rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          background: feedback.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: feedback.type === 'success' ? '#86efac' : '#fca5a5',
          border: `1px solid ${feedback.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
        }}>
          {feedback.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {scenarios.map((sc, i) => (
          <div key={i} style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{sc.title}</span>
                <span className={`badge ${sc.badge.includes('Critical') ? 'badge-critical' : sc.badge.includes('High') ? 'badge-high' : sc.badge.includes('Elevated') ? 'badge-elevated' : 'badge-low'}`} style={{ fontSize: '0.65rem' }}>
                  {sc.badge}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>{sc.desc}</p>
            </div>
            <button
              className="btn btn-secondary"
              disabled={loading}
              onClick={() => triggerScenario(sc)}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Play size={14} /> Ingest Signal
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
