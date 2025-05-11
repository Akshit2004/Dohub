import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer className="footer-glass">
    <div className="footer-content">
      <span className="footer-logo">📝 DoHub</span>
      <span className="footer-text">&copy; {new Date().getFullYear()} Akshit. All rights reserved.</span>
      <span className="footer-links">
        <a href="https://github.com/your-username/do-hub" target="_blank" rel="noopener noreferrer">GitHub</a>
        <span className="footer-dot">·</span>
        <a href="mailto:akshit@email.com">Contact</a>
      </span>
    </div>
  </footer>
);

export default Footer;
