import React, { useState } from 'react';
import { useUrbanPulseContext } from '../context/UrbanPulseContext';
import LoginModal from '../components/ui/LoginModal';

export const LandingPage = () => {
  const { setActiveTab } = useUrbanPulseContext();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Helper for clickable overlay button styling
  const overlayStyle = (left, top, width, height) => ({
    position: 'absolute',
    left,
    top,
    width,
    height,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    borderRadius: '6px',
    zIndex: 10,
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
  });

  return (
    <div
      className="landing-page-container"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#06090e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* 16:9 Responsive Visual Container for exact design fidelity */}
      <div
        className="landing-hero-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1920px',
          aspectRatio: '1024 / 575',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 50px rgba(0,0,0,0.8)'
        }}
      >
        {/* 100% UNMODIFIED HERO LANDING IMAGE ASSET */}
        <img
          src="/landing_hero.png"
          alt="UrbanPulse AI - Smart Cities. Smarter Tomorrow."
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            userSelect: 'none',
            WebkitUserDrag: 'none',
            imageRendering: 'high-quality'
          }}
        />

        {/* ============================================================ */}
        {/* INVISIBLE INTERACTIVE CLICKABLE OVERLAYS (EXACT PIXEL ZONES) */}
        {/* ============================================================ */}

        {/* TOP NAVBAR: LOGO */}
        <button
          style={overlayStyle('2%', '2%', '22%', '6.5%')}
          onClick={() => setActiveTab('home')}
          title="UrbanPulse AI - Home"
          aria-label="UrbanPulse AI Home"
        />

        {/* TOP NAVBAR NAVIGATION LINKS */}
        <button
          style={overlayStyle('31.5%', '2.5%', '4.5%', '5.5%')}
          onClick={() => setActiveTab('home')}
          title="Home"
          aria-label="Home"
        />
        <button
          style={overlayStyle('37%', '2.5%', '6.5%', '5.5%')}
          onClick={() => setActiveTab('command-center')}
          title="Dashboard"
          aria-label="Dashboard"
        />
        <button
          style={overlayStyle('44.5%', '2.5%', '6%', '5.5%')}
          onClick={() => setActiveTab('live-city')}
          title="Live City Map"
          aria-label="Live City"
        />
        <button
          style={overlayStyle('51.5%', '2.5%', '6%', '5.5%')}
          onClick={() => setActiveTab('analytics')}
          title="Analytics Workspace"
          aria-label="Analytics"
        />
        <button
          style={overlayStyle('58.5%', '2.5%', '7%', '5.5%')}
          onClick={() => setActiveTab('predictions')}
          title="AI Predictions & Insights"
          aria-label="AI Insights"
        />
        <button
          style={overlayStyle('66.5%', '2.5%', '4.5%', '5.5%')}
          onClick={() => setActiveTab('api-docs')}
          title="About & System Architecture"
          aria-label="About"
        />

        {/* TOP NAVBAR ACTIONS */}
        <button
          style={overlayStyle('77.5%', '2%', '8.5%', '6.5%')}
          onClick={() => setIsLoginOpen(true)}
          title="Operator Login"
          aria-label="Login"
        />
        <button
          style={overlayStyle('87.2%', '2%', '10.5%', '6.5%')}
          onClick={() => setActiveTab('command-center')}
          title="Get Started with UrbanPulse AI"
          aria-label="Get Started"
        />

        {/* MAIN HERO CTA BUTTON: "Explore City →" */}
        <button
          style={overlayStyle('3.4%', '48.2%', '17%', '7.8%')}
          onClick={() => setActiveTab('live-city')}
          title="Explore City Map & Digital Twin"
          aria-label="Explore City"
        />

        {/* FEATURE BADGES (UNDER HERO TITLE) */}
        <button
          style={overlayStyle('3.4%', '60%', '6%', '14.5%')}
          onClick={() => setActiveTab('traffic')}
          title="Smart Traffic Intelligence"
          aria-label="Smart Traffic"
        />
        <button
          style={overlayStyle('10.5%', '60%', '6.5%', '14.5%')}
          onClick={() => setActiveTab('pollution')}
          title="Clean Environment & AQI"
          aria-label="Clean Environment"
        />
        <button
          style={overlayStyle('18.2%', '60%', '6.5%', '14.5%')}
          onClick={() => setActiveTab('weather')}
          title="Weather Insights"
          aria-label="Weather Insights"
        />
        <button
          style={overlayStyle('26%', '60%', '6.5%', '14.5%')}
          onClick={() => setActiveTab('risk')}
          title="City Safety & Risk Anomalies"
          aria-label="City Safety"
        />

        {/* LIVE CITY INTELLIGENCE PANEL (FLOATING RIGHT CARD) */}
        <button
          style={overlayStyle('76.5%', '22%', '20%', '5.5%')}
          onClick={() => setActiveTab('traffic')}
          title="Traffic Flow Telemetry"
          aria-label="Traffic Flow"
        />
        <button
          style={overlayStyle('76.5%', '28.8%', '20%', '5.5%')}
          onClick={() => setActiveTab('pollution')}
          title="Air Quality Details"
          aria-label="Air Quality"
        />
        <button
          style={overlayStyle('76.5%', '35.5%', '20%', '5.5%')}
          onClick={() => setActiveTab('weather')}
          title="Weather Diagnostics"
          aria-label="Weather Diagnostics"
        />
        <button
          style={overlayStyle('76.5%', '42.2%', '20%', '5.5%')}
          onClick={() => setActiveTab('risk')}
          title="City Safety Telemetry"
          aria-label="City Safety Telemetry"
        />

        {/* BOTTOM METRIC CARDS */}
        <button
          style={overlayStyle('3%', '83.2%', '15.5%', '11.8%')}
          onClick={() => setActiveTab('traffic')}
          title="Live Traffic Analytics"
          aria-label="Live Traffic Card"
        />
        <button
          style={overlayStyle('19.5%', '83.2%', '15.5%', '11.8%')}
          onClick={() => setActiveTab('pollution')}
          title="Air Quality Monitor"
          aria-label="Air Quality Card"
        />
        <button
          style={overlayStyle('35.2%', '83.2%', '13.5%', '11.8%')}
          onClick={() => setActiveTab('weather')}
          title="Weather Station Data"
          aria-label="Weather Card"
        />
        <button
          style={overlayStyle('49.8%', '83.2%', '14.5%', '11.8%')}
          onClick={() => setActiveTab('risk')}
          title="City Safety & Risk Intelligence"
          aria-label="City Safety Card"
        />

        {/* BOTTOM RIGHT: AI PREDICTIONS CARD */}
        <button
          style={overlayStyle('68.8%', '82.5%', '28.5%', '13%')}
          onClick={() => setActiveTab('predictions')}
          title="AI Predictions & Smart Planning Studio"
          aria-label="AI Predictions Card"
        />
      </div>

      {/* LOGIN AUTH MODAL */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};

export default LandingPage;
