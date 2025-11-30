import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
              {/* Professional CSS Logo */}
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: 'white',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                overflow: 'hidden'
              }}>
                {/* Snowflake + Wave Design */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Background gradient circle */}
                  <div style={{
                    position: 'absolute',
                    width: '35px',
                    height: '35px',
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    borderRadius: '50%',
                    opacity: 0.15
                  }}></div>

                  {/* Snowflake design */}
                  <div style={{
                    position: 'relative',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1e3c72',
                    zIndex: 1
                  }}>
                    ❄
                  </div>

                  {/* Wave line */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    width: '80%',
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, #2a5298, transparent)',
                    borderRadius: '2px'
                  }}></div>
                </div>
              </div>

              {/* Company Name and Tagline */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase'
                }}>
                  TRTL Cooling
                </span>
                <span style={{ fontSize: '11px', opacity: 0.9, fontWeight: 'normal', marginTop: '-2px' }}>
                  Cooling You Can Trust
                </span>
              </div>
            </div>
          </Link>
          <ul className="navbar-nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/customers">Customers</Link></li>
            <li><Link to="/camps">Camps</Link></li>
            <li><Link to="/workorders">Work Orders</Link></li>
            <li><Link to="/bills">Bills</Link></li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
