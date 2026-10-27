import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import TelemetryBar from './components/TelemetryBar';
import CaseQueueTable from './components/CaseQueueTable';
import SignalSimulator from './components/SignalSimulator';
import EntityDetailModal from './components/EntityDetailModal';

const API_BASE = process.env.REACT_APP_API_URL || '';

export default function App() {
  const [telemetry, setTelemetry] = useState({
    pendingReviewQueueDepth: 3,
    automatedEnforcements: 14,
    avgDetectionLatencyMinutes: 8.4,
    falsePositiveRatePercent: 2.1,
    detectionPipelineHealth: 'HEALTHY'
  });

  const [cases, setCases] = useState([
    {
      id: 101,
      sellerId: 'seller_burst_8492',
      sellerName: 'Global Tech Deals',
      riskScore: 89.5,
      riskTier: 'CRITICAL',
      status: 'AUTO_ENFORCED',
      anomalyFlags: 'RULE_EXCESSIVE_LISTINGS_PER_HOUR, SUSPICIOUS_MULTI_DEVICE_COLLISION',
      velocityScore: 85.0,
      mlAnomalyScore: 92.0,
      createdAt: new Date().toISOString()
    },
    {
      id: 102,
      sellerId: 'seller_ato_2911',
      sellerName: 'Nordic Luxury Outlets',
      riskScore: 68.0,
      riskTier: 'HIGH',
      status: 'PENDING',
      anomalyFlags: 'RULE_RAPID_PAYOUT_MODIFICATION, GEOLOCATION_MISMATCH',
      velocityScore: 60.0,
      mlAnomalyScore: 74.0,
      createdAt: new Date().toISOString()
    },
    {
      id: 103,
      sellerId: 'seller_rev_5022',
      sellerName: 'Stars Discount Emporium',
      riskScore: 54.2,
      riskTier: 'ELEVATED',
      status: 'PENDING',
      anomalyFlags: 'RULE_ABNORMAL_REVIEW_DISCONTENT',
      velocityScore: 50.0,
      mlAnomalyScore: 58.0,
      createdAt: new Date().toISOString()
    }
  ]);

  const [selectedCase, setSelectedCase] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [tRes, cRes] = await Promise.all([
        axios.get(`${API_BASE}/api/v1/risk/telemetry`).catch(() => null),
        axios.get(`${API_BASE}/api/v1/cases`).catch(() => null)
      ]);

      if (tRes && tRes.data) {
        setTelemetry(tRes.data);
      }
      if (cRes && cRes.data && cRes.data.length > 0) {
        setCases(cRes.data);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleSimulate = async (payload) => {
    const res = await axios.post(`${API_BASE}/api/v1/risk/evaluate`, payload);
    await fetchData();
    return res.data;
  };

  const handleResolve = async (caseId) => {
    try {
      await axios.patch(`${API_BASE}/api/v1/cases/${caseId}/resolve`, { decision: 'RESOLVED' });
    } catch (e) {
      // Local optimistic update
      setCases(prev => prev.filter(c => c.id !== caseId));
    }
    await fetchData();
  };

  const handleDismiss = async (caseId) => {
    try {
      await axios.patch(`${API_BASE}/api/v1/cases/${caseId}/resolve`, { decision: 'DISMISSED' });
    } catch (e) {
      setCases(prev => prev.filter(c => c.id !== caseId));
    }
    await fetchData();
  };

  const handleEnforce = async (caseId, sellerId, actionType) => {
    await axios.post(`${API_BASE}/api/v1/enforcement/execute`, {
      caseId,
      sellerId,
      actionType,
      initiatedBy: 'ANALYST_CONSOLE'
    });
    await fetchData();
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '1.5rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={36} color="#ffffff" />
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Marketplace Risk &amp; Abuse Detection Console
            </h1>
            <p style={{ color: '#d4d4d8', fontSize: '0.85rem' }}>
              E-Commerce Trust &amp; Safety Real-Time Detection and Enforcement Platform
            </p>
          </div>
        </div>
        <button
          className="btn btn-secondary"
          onClick={fetchData}
          disabled={isRefreshing}
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} /> Refresh Telemetry
        </button>
      </header>

      {/* Main Content */}
      <TelemetryBar stats={telemetry} />
      <CaseQueueTable
        cases={cases}
        onInspect={setSelectedCase}
        onResolve={handleResolve}
        onDismiss={handleDismiss}
      />
      <SignalSimulator onSimulate={handleSimulate} />

      {/* Entity Deep-Dive Modal */}
      {selectedCase && (
        <EntityDetailModal
          currentCase={selectedCase}
          onClose={() => setSelectedCase(null)}
          onEnforce={handleEnforce}
        />
      )}
    </div>
  );
}
