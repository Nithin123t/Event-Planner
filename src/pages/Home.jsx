import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const particlesInit = async (engine) => {
    // Loads the full tsparticles package, which includes all presets and shapes
    await loadFull(engine);
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/create');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-container">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "#0a192f" } },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 100, duration: 0.4 },
            },
          },
          particles: {
            color: { value: "#ffffff" },
            links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.5, width: 1 },
            collisions: { enable: true },
            move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1.5, straight: false },
            number: { density: { enable: true, area: 800 }, value: 80 },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
      />

      {/* Hero Content */}
      <div className="hero-content">
        <h1 className="hero-title">Welcome to Event Planner</h1>
        <p className="hero-desc">
          Your one-stop platform for creating, organizing, and celebrating events.
          Whether you're planning a festival, party, or corporate gathering, we’ve got you covered!
        </p>
        <button className="cta-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
}
