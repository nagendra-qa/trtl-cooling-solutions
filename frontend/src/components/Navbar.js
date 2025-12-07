import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Don't render navbar on admin pages (admin has its own header)
  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      {/* Top Banner */}
      <div className="top-banner">
        Best AC Repair Services - Call Now - <a href="tel:+918179697191">+91-8179697191</a>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {/* Professional Logo Image */}
              <img
                src="/Images/Logo.jpeg"
                alt="TRTL Cooling Solutions - Tanish Ram & Tejas Laxman"
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  border: '3px solid rgba(255,255,255,0.3)'
                }}
              />

              {/* Company Name and Tagline */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  lineHeight: '1.2'
                }}>
                  TRTL Cooling Solutions
                </span>
                <span style={{
                  fontSize: '11px',
                  opacity: 0.85,
                  fontWeight: 'bold',
                  marginTop: '2px'
                }}>
                  Tanish Ram & Tejas Laxman
                </span>
              </div>
            </div>
          </Link>

          {/* Public Navigation Links */}
          <ul className="navbar-nav">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>Services</Link></li>
            <li><Link to="/locations" className={location.pathname === '/locations' ? 'active' : ''}>Locations</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact Us</Link></li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
