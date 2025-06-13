import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-main">
        <Link to="/" className="logo">EventMate</Link>
        
        {/* Hamburger Menu Button */}
        <button 
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      <div className={`navbar-links ${isMenuOpen ? 'show' : ''}`}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link to="/calendar" onClick={() => setIsMenuOpen(false)}>Calendar</Link>
        <Link to="/events" onClick={() => setIsMenuOpen(false)}>Events</Link>
        <Link to="/create" className="btn create-btn" onClick={() => setIsMenuOpen(false)}>+ Create</Link>

        {user ? (
          <div className="user-section">
            <span className="user-info">{user.email} ({user.role})</span>
            <button onClick={() => {
              logout();
              setIsMenuOpen(false);
            }} className="btn logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="auth-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link to="/register" className="auth-link" onClick={() => setIsMenuOpen(false)}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
