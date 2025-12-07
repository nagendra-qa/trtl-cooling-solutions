import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--dark-blue)',
      color: 'var(--white)',
      padding: '40px 20px 20px',
      marginTop: '60px'
    }}>
      <div className="container">
        {/* Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Company Info */}
          <div>
            <h3 style={{ color: 'var(--white)', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
              TRTL Cooling Solutions
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', opacity: 0.9, marginBottom: '15px', fontWeight: 'bold' }}>
              Tanish Ram & Tejas Laxman
            </p>
            <p style={{ fontSize: '14px', lineHeight: '1.8', opacity: 0.9 }}>
              Your trusted partner for complete air conditioning solutions for homes and businesses in Hyderabad.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ color: 'var(--white)', marginBottom: '20px', fontSize: '20px' }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/" style={{ color: 'var(--white)', textDecoration: 'none', opacity: 0.9, fontSize: '14px' }}>
                  Home
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/services" style={{ color: 'var(--white)', textDecoration: 'none', opacity: 0.9, fontSize: '14px' }}>
                  Services
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <a href="#locations" style={{ color: 'var(--white)', textDecoration: 'none', opacity: 0.9, fontSize: '14px' }}>
                  Locations
                </a>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <a href="#contact" style={{ color: 'var(--white)', textDecoration: 'none', opacity: 0.9, fontSize: '14px' }}>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{ color: 'var(--white)', marginBottom: '20px', fontSize: '20px' }}>
              Contact Us
            </h3>
            <div style={{ fontSize: '14px', lineHeight: '1.8', opacity: 0.9 }}>
              <p style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"></path>
                  <polyline points="12,5 12,9 12,13"></polyline>
                </svg>
                <span>Plot no-721, Huda Colony, Chanda Nagar, Hyderabad-500050</span>
              </p>

              <p style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <a href="tel:+918179697191" style={{ color: 'white', textDecoration: 'none' }}>
                  +91-8179697191
                </a>
              </p>

              <p style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <a href="mailto:eshwarsvp99.com@gmail.com" style={{ color: 'white', textDecoration: 'none' }}>
                  eshwarsvp99.com@gmail.com
                </a>
              </p>
            </div>

          </div>

          {/* Business Hours */}
          <div>
            <h3 style={{ color: 'var(--white)', marginBottom: '20px', fontSize: '20px' }}>
              Business Hours
            </h3>
            <div style={{ fontSize: '14px', lineHeight: '1.8', opacity: 0.9 }}>
              <p style={{ marginBottom: '8px', fontWeight: '600' }}>Monday - Saturday:</p>
              <p style={{ marginBottom: '15px' }}>9:00 AM - 8:00 PM</p>
              <p style={{ marginBottom: '8px', fontWeight: '600' }}>Sunday:</p>
              <p style={{ marginBottom: '15px' }}>10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.2)',
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '14px',
          opacity: 0.8
        }}>
          <p>
            ©2025 TRTL Cooling Solutions. All Rights Reserved. <Link to="/privacy-policy" style={{ color: 'var(--white)', textDecoration: 'none' }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
