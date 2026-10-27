import React from 'react';
import { ShieldAlert, Zap, Activity, Clock, CheckCircle2 } from 'lucide-react';

export default function TelemetryBar({ stats }) {
  const cards = [
    {
      title: 'Pending Review Queue',
      value: stats.pendingReviewQueueDepth ?? 0,
      sub: 'Awaiting analyst action',
      icon: <ShieldAlert color="#ffffff" size={24} />,
      border: 'rgba(255, 255, 255, 0.35)'
    },
    {
      title: 'Auto-Takedowns / Holds',
      value: stats.automatedEnforcements ?? 0,
      sub: 'Zero manual intervention',
      icon: <Zap color="#f4f4f5" size={24} />,
      border: 'rgba(255, 255, 255, 0.25)'
    },
    {
      title: 'Avg Detection Time',
      value: `${stats.avgDetectionLatencyMinutes ?? 8.4}m`,
      sub: 'High-confidence SLO < 10m',
      icon: <Clock color="#ffffff" size={24} />,
      border: 'rgba(255, 255, 255, 0.25)'
    },
    {
      title: 'False Positive Rate',
      value: `${stats.falsePositiveRatePercent ?? 2.1}%`,
      sub: 'Target SLO < 5.0%',
      icon: <Activity color="#e4e4e7" size={24} />,
      border: 'rgba(255, 255, 255, 0.25)'
    },
    {
      title: 'Pipeline Health',
      value: stats.detectionPipelineHealth ?? 'HEALTHY',
      sub: 'Kafka consumer lag: 0',
      icon: <CheckCircle2 color="#ffffff" size={24} />,
      border: 'rgba(255, 255, 255, 0.35)'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
      {cards.map((c, i) => (
        <div key={i} className="card" style={{ borderColor: c.border }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#a1a1aa', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase' }}>{c.title}</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.35rem 0', color: '#ffffff' }}>{c.value}</h3>
              <p style={{ color: '#71717a', fontSize: '0.75rem' }}>{c.sub}</p>
            </div>
            {c.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
