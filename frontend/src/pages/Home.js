import React, { useState, useEffect } from 'react';
import { companyAPI } from '../services/api';

const Home = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await companyAPI.getDetails();
      setCompanyInfo(response.data);
    } catch (error) {
      console.error('Error fetching company info:', error);
    } finally {
      setLoading(false);
    }
  };

  // Service images mapping - Using local images from public/Images folder + Unsplash for others
  const serviceImages = {
    'Split AC': '/Images/AC_Split AC.jpeg',
    'Window AC': '/Images/Window_AC.jpeg',
    'Cassette AC': '/Images/Cassette_AC.jpeg',
    'VRF AC': '/Images/VRF_AC.jpg',
    'AHU AC': '/Images/AHU_AC.jpeg',
    'AC Installation': 'https://images.unsplash.com/photo-1631545806609-c2f4833a0b41?w=400&h=250&fit=crop',
    'AC Repair & Maintenance': 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=250&fit=crop',
    'Preventive Maintenance (PPM)': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop',
    'Gas Charging': 'https://images.unsplash.com/photo-1635405074683-96d6921a9a0f?w=400&h=250&fit=crop',
    'Filter Cleaning & Replacement': 'https://images.unsplash.com/photo-1581578949510-fa7315c4c350?w=400&h=250&fit=crop',
    'Strainer Cleaning': 'https://images.unsplash.com/photo-1604754742629-3e580a61f696?w=400&h=250&fit=crop',
    'Chemical Cleaning': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=250&fit=crop',
    'Compressor Repair': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=250&fit=crop',
    '24/7 Emergency Services': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=250&fit=crop'
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '20px', lineHeight: '1.2' }}>
              Air Conditioner<br />Repair Services
            </h1>
            <p style={{ fontSize: '22px', marginBottom: '30px', opacity: 0.9 }}>
              Bringing Cool Air Back to Your Home.
            </p>

            {/* Service Checklist */}
            <div className="service-checklist">
              <div className="service-check-item">
                <div className="check-icon">✓</div>
                <span>AC Installation</span>
              </div>
              <div className="service-check-item">
                <div className="check-icon">✓</div>
                <span>AC Health Checkup</span>
              </div>
              <div className="service-check-item">
                <div className="check-icon">✓</div>
                <span>AC Service</span>
              </div>
              <div className="service-check-item">
                <div className="check-icon">✓</div>
                <span>AC Repairs</span>
              </div>
            </div>

            <button className="book-now-btn" onClick={() => window.location.href = `tel:${companyInfo?.phone || '+918179697191'}`}>
              Book Now
            </button>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1631545806609-c2f4833a0b41?w=600&h=500&fit=crop"
              alt="AC Unit"
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating Contact Buttons */}
      <div className="floating-buttons">
        <a
          href={`https://wa.me/${companyInfo?.phone?.replace(/[^0-9]/g, '') || '918179697191'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn whatsapp-btn"
          title="WhatsApp"
        >
          💬
        </a>
        <a
          href={`tel:${companyInfo?.phone || '+918179697191'}`}
          className="floating-btn phone-btn"
          title="Call Now"
        >
          📞
        </a>
        <div className="floating-btn chat-btn" title="Chat">
          💬
        </div>
      </div>

      <div className="container">
        {/* Repair and Installation Services Section */}
        <div style={{ textAlign: 'center', marginBottom: '50px', marginTop: '60px' }}>
          <h2 style={{ color: '#1e3c72', fontSize: '36px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            OUR REPAIR AND INSTALLATION SERVICES
          </h2>
          <p style={{ color: '#666', fontSize: '18px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            Welcome to our AC Repair Services! We offer efficient solutions to keep your home cool. Our technicians ensure your system runs smoothly.
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: '#1e3c72', fontSize: '36px', marginBottom: '15px' }}>Our Services</h2>
          <p style={{ color: '#666', fontSize: '16px' }}>Comprehensive AC Solutions for Your Business</p>
        </div>

        <div className="services-grid">
          {companyInfo?.services?.map((service, index) => (
            <div key={index} className="service-card">
              <div style={{
                width: '100%',
                height: '180px',
                backgroundColor: '#e0e0e0',
                borderRadius: '8px',
                marginBottom: '15px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img
                  src={serviceImages[service] || 'https://images.unsplash.com/photo-1631545806609-c2f4833a0b41?w=400&h=250&fit=crop'}
                  alt={service}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="service-icon" style="font-size: 64px; display: flex; align-items: center; justify-content: center; height: 100%">❄️</div>';
                  }}
                />
              </div>
              <h3>{service}</h3>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
                Professional and reliable service
              </p>
            </div>
          ))}
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: 'white',
          padding: '50px 30px',
          borderRadius: '12px',
          textAlign: 'center',
          marginTop: '50px',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '32px', marginBottom: '25px' }}>Get in Touch</h2>
          <p style={{ fontSize: '18px', marginBottom: '30px' }}>
            Contact us for all your AC service needs
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '25px',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📞</div>
              <strong style={{ display: 'block', marginBottom: '8px', fontSize: '16px' }}>Phone</strong>
              <span style={{ fontSize: '18px' }}>{companyInfo?.phone || '+91-XXXXXXXXXX'}</span>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '25px',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📧</div>
              <strong style={{ display: 'block', marginBottom: '8px', fontSize: '16px' }}>Email</strong>
              <span style={{ fontSize: '18px' }}>{companyInfo?.email || 'info@acservice.com'}</span>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '25px',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📍</div>
              <strong style={{ display: 'block', marginBottom: '8px', fontSize: '16px' }}>Address</strong>
              <span style={{ fontSize: '16px' }}>{companyInfo?.officeAddress || 'Plot no-721, Huda Colony, Chanda Nagar, Hyderabad-500050'}</span>
            </div>
          </div>

          {companyInfo?.gst && (
            <div style={{ marginTop: '30px', fontSize: '14px', opacity: 0.9 }}>
              GST No: {companyInfo.gst}
            </div>
          )}
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ color: '#1e3c72', marginBottom: '15px' }}>Why Choose Us?</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            marginTop: '30px'
          }}>
            <div>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>⚡</div>
              <h4 style={{ color: '#1e3c72', marginBottom: '8px' }}>Fast Service</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>Quick response time</p>
            </div>
            <div>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>✓</div>
              <h4 style={{ color: '#1e3c72', marginBottom: '8px' }}>Experienced Team</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>Skilled professionals</p>
            </div>
            <div>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>💰</div>
              <h4 style={{ color: '#1e3c72', marginBottom: '8px' }}>Competitive Pricing</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>Best value for money</p>
            </div>
            <div>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛡️</div>
              <h4 style={{ color: '#1e3c72', marginBottom: '8px' }}>Quality Assured</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>Guaranteed satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
