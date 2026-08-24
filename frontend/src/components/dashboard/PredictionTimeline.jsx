import React, { useState } from 'react';
import { Clock, Play, TrendingUp, AlertTriangle } from 'lucide-react';

export const PredictionTimeline = ({ onTimeStepChange }) => {
  const [activeStep, setActiveStep] = useState('NOW');

  const timelineSteps = [
    { id: 'NOW', label: 'NOW', time: '13:00', risk: 'NORMAL', cgChange: '0%' },
    { id: '+30 MIN', label: '+30 MIN', time: '13:30', risk: 'ELEVATED', cgChange: '+6%' },
    { id: '+1 HOUR', label: '+1 HOUR', time: '14:00', risk: 'HIGH', cgChange: '+14%' },
    { id: '+2 HOURS', label: '+2 HOURS', time: '15:00', risk: 'CRITICAL', cgChange: '+22%' },
    { id: '+6 HOURS', label: '+6 HOURS', time: '19:00', risk: 'MODERATE', cgChange: '-8%' },
  ];

  const handleStepClick = (step) => {
    setActiveStep(step.id);
    if (onTimeStepChange) {
      onTimeStepChange(step);
    }
  };

  return (
    <div className="prediction-timeline">
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '130px' }}>
        <Clock size={15} color="#06b6d4" />
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
          AI PREDICTION TIMELINE
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
        {timelineSteps.map((step) => {
          const isActive = activeStep === step.id;
          const isCritical = step.risk === 'CRITICAL' || step.risk === 'HIGH';

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step)}
              className={`timeline-step ${isActive ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div className="timeline-dot" style={{ background: isActive ? '#06b6d4' : (isCritical ? '#fb7185' : 'var(--text-dim)') }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isActive ? '#38bdf8' : '#f8fafc' }}>
                  {step.label}
                </span>
              </div>

              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                {step.time} • <span style={{ color: isCritical ? '#fb7185' : '#34d399', fontWeight: 700 }}>{step.cgChange}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PredictionTimeline;
