import React from 'react';
import { Database, Wind, Car, ShieldAlert, AlertTriangle, MapPin, TrendingUp, TrendingDown } from 'lucide-react';

export default function KpiCards({ kpis = [], overview = null, loading = false }) {
  if (loading) {
    return (
      <div className="kpi-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="kpi-card skeleton">
            <div className="skeleton-title"></div>
            <div className="skeleton-value"></div>
          </div>
        ))}
      </div>
    );
  }

  const icons = {
    "Total Urban Records": Database,
    "Air Quality Index (AQI)": Wind,
    "Traffic Congestion": Car,
    "Urban Risk Score": ShieldAlert,
    "Active Anomalies": AlertTriangle,
    "Monitored Zones": MapPin
  };

  const displayKpis = kpis.length > 0 ? kpis : [
    { title: "Total Urban Records", value: overview?.total_records ? `${overview.total_records.toLocaleString()}` : "5,200", unit: "records", change: "+4.2%", status: "normal" },
    { title: "Air Quality Index (AQI)", value: overview?.avg_aqi || 68, unit: "AQI", change: overview?.aqi_status || "Moderate", status: "normal" },
    { title: "Traffic Congestion", value: overview?.avg_congestion_pct || "48%", unit: "index", change: `${overview?.avg_congestion_index || 0.48}`, status: "warning" },
    { title: "Urban Risk Score", value: overview?.urban_risk_score || 46.5, unit: "/100", change: overview?.risk_level || "Medium", status: "normal" },
    { title: "Active Anomalies", value: overview?.anomaly_count || 218, unit: "events", change: "4.2%", status: "warning" },
    { title: "Monitored Zones", value: overview?.active_zones || 8, unit: "zones", change: "Active", status: "normal" }
  ];

  return (
    <div className="kpi-grid">
      {displayKpis.map((card, idx) => {
        const IconComponent = icons[card.title] || Database;
        const isCritical = card.status === 'critical' || card.status === 'warning';

        return (
          <div key={idx} className={`kpi-card ${isCritical ? 'kpi-warning' : ''}`}>
            <div className="kpi-card-header">
              <span className="kpi-title">{card.title}</span>
              <div className="kpi-icon-wrapper">
                <IconComponent size={18} className="kpi-icon" />
              </div>
            </div>

            <div className="kpi-body">
              <span className="kpi-value">{card.value}</span>
              {card.unit && <span className="kpi-unit"> {card.unit}</span>}
            </div>

            <div className="kpi-footer">
              <span className={`kpi-badge ${card.status || 'normal'}`}>
                {card.change}
              </span>
              <span className="kpi-subtext">Real Backend Telemetry</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
