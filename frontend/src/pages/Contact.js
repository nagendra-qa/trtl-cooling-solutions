import React, { useState, useEffect } from 'react';
import { companyAPI } from '../services/api';

const Contact = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // WhatsApp message format
    const message = `Hello! I would like to inquire about AC services.\n\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nService: ${formData.service}\nMessage: ${formData.message}`;
    const whatsappURL = `https://wa.me/918179697191?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, '_blank');

    setFormStatus({ type: 'success', message: 'Redirecting to WhatsApp...' });
    setFormData({ name: '', phone: '', email: '', service: '', message: '' });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div style={{ paddingTop: '20px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ color: 'var(--dark-blue)', fontSize: '42px', marginBottom: '15px' }}>Contact Us</h1>
          <p style={{ color: 'var(--dark-gray)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Get in touch with us for all your AC service needs
          </p>
        </div>

        {/* Contact Info Cards */}
        <div style={{
          background: 'linear-gradient(135deg, var(--dark-blue) 0%, var(--primary-green) 100%)',
          color: 'white',
          padding: '50px 30px',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '50px'
        }}>
          <h2 style={{ fontSize: '32px', marginBottom: '25px', color: 'white' }}>Get in Touch</h2>
          <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.95 }}>
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
              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <strong style={{ display: 'block', marginBottom: '8px', fontSize: '16px' }}>Phone</strong>
              <a
                href={`tel:${companyInfo?.phone || '+918179697191'}`}
                style={{
                  fontSize: '18px',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'opacity 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                {companyInfo?.phone || '+91-8179697191'}
              </a>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '25px',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <strong style={{ display: 'block', marginBottom: '8px', fontSize: '16px' }}>Email</strong>
              <a
                href={`mailto:${companyInfo?.email || 'eshwarsvp99.com@gmail.com'}`}
                style={{
                  fontSize: '18px',
                  color: 'white',
                  textDecoration: 'none',
                  wordBreak: 'break-word',
                  transition: 'opacity 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                {companyInfo?.email || 'eshwarsvp99.com@gmail.com'}
              </a>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '25px',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"></path>
                  <polyline points="12,5 12,9 12,13"></polyline>
                </svg>
              </div>
              <strong style={{ display: 'block', marginBottom: '8px', fontSize: '16px' }}>Address</strong>
              <span style={{ fontSize: '16px' }}>
                {companyInfo?.officeAddress || 'Plot no-721, Huda Colony, Chanda Nagar, Hyderabad-500050'}
              </span>
            </div>
          </div>

          {companyInfo?.gst && (
            <div style={{ marginTop: '30px', fontSize: '14px', opacity: 0.9 }}>
              GST No: {companyInfo.gst}
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {/* Form */}
          <div className="card">
            <h2 style={{ color: 'var(--dark-blue)', marginBottom: '20px' }}>Send Us a Message</h2>
            {formStatus.message && (
              <div className={`alert ${formStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {formStatus.message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Service Type *</label>
                <select
                  name="service"
                  className="form-control"
                  value={formData.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a service</option>
                  <option value="AC Installation">AC Installation</option>
                  <option value="AC Repair">AC Repair</option>
                  <option value="AC Maintenance">AC Maintenance</option>
                  <option value="Gas Charging">Gas Charging</option>
                  <option value="Preventive Maintenance">Preventive Maintenance</option>
                  <option value="Emergency Service">Emergency Service</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your AC service needs..."
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Send Message via WhatsApp
              </button>
            </form>
          </div>

          {/* Why Choose Us */}
          <div>
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--dark-blue)', marginBottom: '15px' }}>Why Choose Us?</h3>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '32px', flexShrink: 0 }}>⚡</div>
                  <div>
                    <h4 style={{ color: 'var(--dark-blue)', marginBottom: '5px' }}>Fast Service</h4>
                    <p style={{ color: '#666', fontSize: '14px' }}>Quick response time and same-day service available</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '32px', flexShrink: 0 }}>✓</div>
                  <div>
                    <h4 style={{ color: 'var(--dark-blue)', marginBottom: '5px' }}>Experienced Team</h4>
                    <p style={{ color: '#666', fontSize: '14px' }}>Skilled and certified AC technicians</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '32px', flexShrink: 0 }}>💰</div>
                  <div>
                    <h4 style={{ color: 'var(--dark-blue)', marginBottom: '5px' }}>Competitive Pricing</h4>
                    <p style={{ color: '#666', fontSize: '14px' }}>Best value for money with transparent pricing</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '32px', flexShrink: 0 }}>🛡️</div>
                  <div>
                    <h4 style={{ color: 'var(--dark-blue)', marginBottom: '5px' }}>Quality Assured</h4>
                    <p style={{ color: '#666', fontSize: '14px' }}>100% satisfaction guaranteed on all services</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="card">
              <h3 style={{ color: 'var(--dark-blue)', marginBottom: '15px' }}>Quick Contact</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href={`tel:${companyInfo?.phone || '+918179697191'}`}
                  className="btn btn-primary"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    justifyContent: 'center',
                    background: '#0ea5e9',
                    color: 'white'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Call Now
                </a>
                <a
                  href={`https://wa.me/${companyInfo?.phone?.replace(/[^0-9]/g, '') || '918179697191'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{
                    textDecoration: 'none',
                    background: '#0ea5e9',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    justifyContent: 'center'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`mailto:${companyInfo?.email || 'eshwarsvp99.com@gmail.com'}`}
                  className="btn btn-secondary"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    justifyContent: 'center',
                    background: '#0ea5e9',
                    color: 'white'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
