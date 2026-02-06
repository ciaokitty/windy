import React, { useState, useEffect } from 'react';
import WorldMap from './WorldMap';
import Pinwheel from './Pinwheel';
import TimeControls from './TimeControls';
import { fetchWindData } from './weatherService';

function App() {
  const [location, setLocation] = useState({ lat: 51.505, lng: -0.09 }); // Default London
  const [date, setDate] = useState(new Date());

  // Placeholder for weather data state
  const [weather, setWeather] = useState({
    windSpeed: 0,
    windDirection: 0,
    loading: false,
    error: false,
    locationName: 'Loading...'
  });

  useEffect(() => {
    async function loadData() {
      if (!location) return;
      // Keep previous data while loading to avoid flicker/reset
      setWeather(prev => ({ ...prev, loading: true, error: false }));

      const { lat, lng } = location;
      const data = await fetchWindData(lat, lng, date);

      setWeather({
        windSpeed: data.speed || 0,
        windDirection: data.direction || 0,
        loading: false,
        error: data.error || false,
        locationName: data.locationName || 'Unknown Place'
      });
    }

    loadData();
  }, [location, date]);

  return (
    <div className="app-container">

      {/* Visual / Controls Panel */}
      <div style={{
        flex: '0 0 auto', // Desktop: fixed width, Mobile: auto height
        minWidth: '400px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        zIndex: 1000,
        // Paper texture background
        background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23fffbeb'/%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E\")",
        borderRight: '3px dashed #333', // Desktop border
        overflowY: 'auto',
        position: 'relative' // Ensure z-index works
      }} className="controls-panel">

        <header style={{ textAlign: 'center' }}>
          <h1 style={{
            margin: 0,
            fontSize: '3.5rem',
            color: '#333',
            transform: 'rotate(-2deg)',
            letterSpacing: '-1px'
          }}>
            <span style={{ color: '#ef4444' }}>W</span>indy <span style={{ color: '#3b82f6' }}>P</span>inwheel
          </h1>
          <p style={{ margin: '0.2rem 0 0', color: '#555', fontSize: '1.4rem' }}>
            {weather.locationName}
          </p>
        </header>

        <div style={{ flex: 1, minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {weather.loading && <div style={{ position: 'absolute', color: '#ef4444', fontSize: '1.8rem', fontWeight: 'bold', transform: 'rotate(5deg)' }}>Checking the wind...</div>}
          <div style={{ width: '100%', height: '100%', opacity: weather.loading ? 0.3 : 1, transition: 'opacity 0.3s' }}>
            <Pinwheel speed={weather.windSpeed} direction={weather.windDirection} />
          </div>
        </div>

        {/* Improved Controls Container */}
        <div style={{
          background: 'transparent',
          padding: '1rem',
          border: 'none',
        }}>
          <TimeControls date={date} setDate={setDate} />
        </div>
      </div>

      {/* Map Panel */}
      <div style={{ flex: 1, position: 'relative' }}>
        <WorldMap location={location} setLocation={setLocation} />
      </div>

      <style>{`
        @media (max-width: 768px) {
           .controls-panel {
              width: 100% !important;
              min-width: unset !important;
              border-right: none !important;
              border-top: 3px dashed #333 !important;
              flex: 1 !important; /* Allow it to grow/shrink */
           }
        }
      `}</style>
    </div>
  );
}

export default App;
