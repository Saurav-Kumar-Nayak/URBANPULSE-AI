import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { Settings as SettingsIcon, Server, Database, Brain, ExternalLink, CheckCircle, RefreshCw } from 'lucide-react';

export const SettingsPage = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await api.getHealth();
      setHealth(data);
    } catch {
      setHealth({ status: 'offline' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <PageContainer
      title="System & Platform Settings"
      subtitle="FastAPI backend connectivity, SQLite database status, and Scikit-learn model lifecycle control"
      badge={<Badge variant="cyan">System Config</Badge>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* System Health Card */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={18} color="#06b6d4" />
              FastAPI Server Diagnostics
            </h3>
            <Button variant="subtle" icon={RefreshCw} loading={loading} onClick={fetchHealth}>
              Refresh Status
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'rgba(32, 43, 56, 0.4)' }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>API Server Status</span>
              <Badge variant={health?.status === 'online' ? 'healthy' : 'critical'}>
                {health?.status === 'online' ? 'Online (200 OK)' : 'Offline'}
              </Badge>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'rgba(32, 43, 56, 0.4)' }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Base API URL</span>
              <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: '#38bdf8' }}>
                http://127.0.0.1:8000/api
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'rgba(32, 43, 56, 0.4)' }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>OpenAPI Swagger Docs</span>
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.82rem', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
              >
                /docs <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </Card>

        {/* Database & ML Specs */}
        <Card>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} color="#10b981" />
            Storage & Model Engines
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'rgba(32, 43, 56, 0.4)' }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Database Engine</span>
              <span style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 600 }}>SQLite (urbanpulse.db)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'rgba(32, 43, 56, 0.4)' }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Dataset Telemetry Volume</span>
              <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>5,200 Records (8 Zones)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'rgba(32, 43, 56, 0.4)' }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>ML Engine Status</span>
              <Badge variant={health?.ml_engine_trained ? 'violet' : 'warning'}>
                {health?.ml_engine_trained ? 'Scikit-Learn Models Trained' : 'Training Pending'}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* System Features Grid */}
      <Card>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
          UrbanPulse AI Platform Configuration Summary
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6 }}>
          UrbanPulse AI runs an enterprise dark-mode command center consuming FastAPI telemetry endpoints, SQLite database records, and Scikit-learn predictive models (`RandomForestRegressor`, `GradientBoostingRegressor`, `RandomForestClassifier`, `IsolationForest`).
        </p>
      </Card>
    </PageContainer>
  );
};

export default SettingsPage;
