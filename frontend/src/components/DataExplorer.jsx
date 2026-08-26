import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, RefreshCw, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { api } from '../services/api';

export default function DataExplorer() {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('ALL');
  const [riskLevel, setRiskLevel] = useState('ALL');
  const [isAnomalyFilter, setIsAnomalyFilter] = useState('ALL');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        page_size: pageSize,
        search: search || undefined,
        location: location !== 'ALL' ? location : undefined,
        risk_level: riskLevel !== 'ALL' ? riskLevel : undefined,
        is_anomaly: isAnomalyFilter === 'TRUE' ? true : (isAnomalyFilter === 'FALSE' ? false : undefined)
      };
      const res = await api.getRecords(params);
      setRecords(res.records || []);
      setTotal(res.total || 0);
      setTotalPages(res.total_pages || 1);
    } catch (e) {
      console.error("Error fetching records:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page, pageSize, location, riskLevel, isAnomalyFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRecords();
  };

  const handleExportCSV = () => {
    const params = {
      location: location !== 'ALL' ? location : undefined,
      is_anomaly: isAnomalyFilter === 'TRUE' ? true : (isAnomalyFilter === 'FALSE' ? false : undefined)
    };
    const exportUrl = api.getExportUrl(params);
    window.open(exportUrl, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Header & Action Controls */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }} className="text-gradient-cyan">
            Urban Telemetry Data Explorer
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Searchable & filterable dataset view connected directly to SQLite backend ({total.toLocaleString()} total records)
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileSpreadsheet size={16} />
          Export Dataset (CSV)
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, minWidth: '220px', display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input 
              type="text" 
              placeholder="Search record code, location, weather..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '34px' }}
            />
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '11px' }} />
          </div>
          <button type="submit" className="btn-subtle">Filter</button>
        </form>

        <select className="input-field" style={{ width: '190px' }} value={location} onChange={(e) => { setLocation(e.target.value); setPage(1); }}>
          <option value="ALL">All Locations</option>
          <option value="Patia Main Road">Patia Main Road</option>
          <option value="Jayadev Vihar">Jayadev Vihar</option>
          <option value="Saheed Nagar">Saheed Nagar</option>
          <option value="Khandagiri">Khandagiri</option>
          <option value="Vani Vihar">Vani Vihar</option>
          <option value="Bhubaneswar Railway Station">Bhubaneswar Railway Station</option>
          <option value="Nandankanan Road">Nandankanan Road</option>
          <option value="Kalarahanga Road">Kalarahanga Road</option>
        </select>

        <select className="input-field" style={{ width: '140px' }} value={riskLevel} onChange={(e) => { setRiskLevel(e.target.value); setPage(1); }}>
          <option value="ALL">All Risk Levels</option>
          <option value="Low">Low Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="High">High Risk</option>
          <option value="Critical">Critical Risk</option>
        </select>

        <select className="input-field" style={{ width: '140px' }} value={isAnomalyFilter} onChange={(e) => { setIsAnomalyFilter(e.target.value); setPage(1); }}>
          <option value="ALL">All Records</option>
          <option value="TRUE">Anomalies Only</option>
          <option value="FALSE">Normal Only</option>
        </select>
      </div>

      {/* 3. Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Location</th>
                <th>Timestamp</th>
                <th>Traffic (veh/min)</th>
                <th>Congestion %</th>
                <th>Avg Speed</th>
                <th>AQI</th>
                <th>PM2.5</th>
                <th>Weather</th>
                <th>Risk Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    Loading records from backend database...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No matching records found.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-cyan)' }}>{r.record_code}</td>
                    <td>{r.location_name}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.timestamp}</td>
                    <td>{r.traffic_density}</td>
                    <td>
                      <span style={{ color: r.congestion_index > 0.7 ? 'var(--accent-rose)' : 'inherit' }}>
                        {Math.round(r.congestion_index * 100)}%
                      </span>
                    </td>
                    <td>{r.avg_speed_kmh} km/h</td>
                    <td style={{ fontWeight: 600 }}>{r.aqi}</td>
                    <td>{r.pm25} µg/m³</td>
                    <td>{r.weather}</td>
                    <td style={{ fontWeight: 700 }}>{r.risk_score}</td>
                    <td>
                      <span className={`badge ${r.is_anomaly ? 'badge-rose' : 'badge-emerald'}`}>
                        {r.is_anomaly ? 'Anomaly' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total.toLocaleString()} total records)
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              disabled={page <= 1} 
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              className="btn-subtle" 
              style={{ padding: '6px 12px' }}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button 
              disabled={page >= totalPages} 
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              className="btn-subtle" 
              style={{ padding: '6px 12px' }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
