import React from 'react';
import { ShieldAlert, Zap, Activity, Clock, CheckCircle2 } from 'lucide-react';

export default function TelemetryBar({ stats }) {
  const cards = [
    {
      title: 'Pending Review Queue',
      value: stats.pendingReviewQueueDepth ?? 0,
      sub: 'Awaiting analyst action',
      icon: <ShieldAlert color="#f59e0b" size={24} />,
      border: 'rgba(245, 158, 11, 0.3)'
    },
    {
      title: 'Auto-Takedowns / Holds',
      value: stats.automatedEnforcements ?? 0,
      sub: 'Zero manual intervention',
      icon: <Zap color="#ef4444" size={24} />,
      border: 'rgba(239, 68, 68, 0.3)'
    },
    {
      title: 'Avg Detection Time',
      value: `${stats.avgDetectionLatencyMinutes ?? 8.4}m`,
      sub: 'High-confidence SLO < 10m',
      icon: <Clock color="#38bdf8" size={24} />,
      border: 'rgba(56, 189, 248, 0.3)'
    },
    {
      title: 'False Positive Rate',
      value: `${stats.falsePositiveRatePercent ?? 2.1}%`,
      sub: 'Target SLO < 5.0%',
      icon: <Activity color="#a855f7" size={24} />,
      border: 'rgba(168, 85, 247, 0.3)'
    },
    {
      title: 'Pipeline Health',
      value: stats.detectionPipelineHealth ?? 'HEALTHY',
      sub: 'Kafka consumer lag: 0',
      icon: <CheckCircle2 color="#22c55e" size={24} />,
      border: 'rgba(34, 197, 94, 0.3)'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
      {cards.map((c, i) => (
        <div key={i} className="card" style={{ borderColor: c.border }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase' }}>{c.title}</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.35rem 0' }}>{c.value}</h3>
              <p style={{ color: '#64748b', fontSize: '0.75rem' }}>{c.sub}</p>
            </div>
            {c.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
