import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    // Optionally, add logic to change theme here
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/'; // or use navigate if using react-router
  };

  return (
    <header className="top-navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">📝</span>
          <span className="logo-text">DoHub</span>
        </div>
        
        <div className={`navbar-toggle${isMenuOpen ? ' open' : ''}`} onClick={toggleMenu} tabIndex={0} aria-label="Toggle menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        
        <nav className={`navbar-nav${isMenuOpen ? ' open' : ''}`}>
          <a href="#" className="nav-link active">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </a>
          <a href="#" className="nav-link">
            <span className="nav-icon">📝</span>
            <span className="nav-text">Tasks</span>
          </a>
          <a href="#" className="nav-link">
            <span className="nav-icon">📈</span>
            <span className="nav-text">Statistics</span>
          </a>
          <a href="#" className="nav-link">
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profile</span>
          </a>
          <a href="#" className="nav-link">
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings</span>
          </a>
          <button className="logout-button animated-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
          <button className="mode-toggle animated-btn" title="Toggle Dark/Light Mode" onClick={toggleDarkMode}>
            <span role="img" aria-label="theme">{isDarkMode ? '🌙' : '☀️'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;