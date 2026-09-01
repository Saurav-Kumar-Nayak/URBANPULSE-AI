import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { api } from '../services/api';
import { Server, CheckCircle2, ExternalLink } from 'lucide-react';

export default function ApiDocsPage() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    api.getHealth()
      .then(res => setHealth(res))
      .catch(err => setHealth({ status: 'offline', error: err.message }));
  }, []);

  const endpoints = [
    { method: "GET", path: "/api/health", desc: "System health check, version, and ML training status." },
    { method: "GET", path: "/api/overview", desc: "Executive dashboard summary KPIs, avg AQI, congestion, and active zones." },
    { method: "GET", path: "/api/traffic", desc: "Corridor peak-hour traffic flow, hourly trends, weekday vs weekend, and forecasts." },
    { method: "GET", path: "/api/pollution", desc: "Air Quality Index (AQI) trends, PM2.5/PM10 breakdown, and weather correlations." },
    { method: "GET", path: "/api/anomalies", desc: "IsolationForest & statistical anomaly stream logs and severity breakdown." },
    { method: "POST", path: "/api/anomalies/detect", desc: "Live anomaly evaluation on custom test telemetry payload." },
    { method: "GET", path: "/api/predictions", desc: "Trained Scikit-learn model metadata, R², RMSE, Accuracy, F1, and feature importances." },
    { method: "POST", path: "/api/predictions/predict", desc: "Real-time inference endpoint for AQI, Congestion, and Risk Classification models." },
    { method: "GET", path: "/api/insights", desc: "AI INSIGHT ENGINE structured analytical insights with evidence flags." },
    { method: "GET", path: "/api/locations", desc: "Spatial metadata, coordinates, and live telemetry for all urban zones." },
    { method: "GET", path: "/api/records", desc: "Filterable telemetry record dataset with search, pagination, and filters." },
    { method: "GET", path: "/api/records/export", desc: "Direct downloadable CSV export stream of telemetry records." }
  ];

  return (
    <PageContainer
      title="FastAPI OpenAPI & Reference"
      subtitle="Complete REST API contract reference table with dual route mounts under /api and /api/v1"
      badge={<Badge variant="cyan">OpenAPI 3.0</Badge>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Card style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={20} color="#06b6d4" />
              FastAPI Backend Service Diagnostics
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
              Python 3.11+ • FastAPI • SQLite (urbanpulse.db) • Scikit-learn ML Engine
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Badge variant={health?.status === 'online' ? 'healthy' : 'critical'}>
              <CheckCircle2 size={14} style={{ marginRight: '4px' }} />
              {health?.status === 'online' ? 'Backend Service Online' : 'Backend Service Offline'}
            </Badge>

            <a 
              href="http://localhost:8000/docs" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-primary"
              style={{ textDecoration: 'none', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Swagger UI / Docs <ExternalLink size={14} />
            </a>
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: '1.0rem', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
            Registered REST API Endpoints
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint Path</th>
                  <th>Description</th>
                  <th>Dual Mount (/v1)</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((ep, idx) => (
                  <tr key={idx}>
                    <td>
                      <Badge variant={ep.method === 'GET' ? 'cyan' : 'healthy'}>
                        {ep.method}
                      </Badge>
                    </td>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: '#38bdf8' }}>{ep.path}</td>
                    <td style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{ep.desc}</td>
                    <td>
                      <Badge variant="subtle">Supported (/v1{ep.path.replace('/api','')})</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
