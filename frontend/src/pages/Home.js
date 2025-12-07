import React, {useState, useEffect} from 'react';
import {companyAPI} from '../services/api';

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
        'VRF AC': '/Images/VRF_AC.jpeg',
        'AHU AC': '/Images/AHU_AC.jpeg',
        'AC Installation': '/Images/AC_Installation.jpeg',
        'AC Repair & Maintenance': 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=250&fit=crop&auto=format&q=70',
        'Preventive Maintenance (PPM)': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop&auto=format&q=70',
        'Gas Charging': '/Images/AC_GasFilling.jpeg',
        'Filter Cleaning & Replacement': 'https://images.unsplash.com/photo-1581578949510-fa7315c4c350?w=400&h=250&fit=crop&auto=format&q=70',
        'Strainer Cleaning': 'https://images.unsplash.com/photo-1604754742629-3e580a61f696?w=400&h=250&fit=crop&auto=format&q=70',
        'Chemical Cleaning': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=250&fit=crop&auto=format&q=70',
        'Compressor Repair': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=250&fit=crop&auto=format&q=70',
        '24/7 Emergency Services': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=250&fit=crop&auto=format&q=70'
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div>
            {/* Hero Section - Full Screen Background */}
            <section style={{
                position: 'relative',
                display: 'flex',
                minHeight: 'calc(100vh - 140px)',
                alignItems: 'center',
                overflow: 'hidden'
            }}>
                {/* Background Image */}
                <img
                    src="/Images/HomePage.jpeg"
                    alt="AC technician working on an air conditioning unit"
                    fetchpriority="high"
                    loading="eager"
                    decoding="async"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0
                    }}
                />

                {/* Dark Overlay for Readability */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, rgba(21, 35, 83, 0.85) 0%, rgba(21, 35, 83, 0.6) 100%)',
                    zIndex: 1
                }}></div>

                {/* Content */}
                <div className="container" style={{position: 'relative', zIndex: 2, padding: '80px 20px'}}>
                    <div style={{maxWidth: '900px'}}>
                        <h1 style={{
                            fontSize: '56px',
                            fontWeight: 'bold',
                            color: 'white',
                            marginBottom: '20px',
                            lineHeight: '1.2'
                        }}>
                            <span style={{display: 'block'}}>Your Premier Partner for</span>
                            <span style={{display: 'block', color: '#0ea5e9'}}>Advanced AC Solutions</span>
                        </h1>

                        <p style={{
                            fontSize: '22px',
                            color: 'rgba(255, 255, 255, 0.95)',
                            marginBottom: '30px',
                            maxWidth: '700px',
                            lineHeight: '1.6'
                        }}>
                            Professional installation, repair, maintenance, and gas refilling services across Hyderabad.
                            Keeping you cool, comfortable, and worry-free — every season, every time.
                        </p>

                        {/* Service Checklist */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: '15px',
                            marginBottom: '30px',
                            maxWidth: '700px'
                        }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <div style={{
                                    background: '#0ea5e9',
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    flexShrink: 0
                                }}>✓
                                </div>
                                <span style={{color: 'white', fontSize: '16px'}}>AC Installation</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <div style={{
                                    background: '#0ea5e9',
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    flexShrink: 0
                                }}>✓
                                </div>
                                <span style={{color: 'white', fontSize: '16px'}}>AC Maintenance & Repairs</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <div style={{
                                    background: '#0ea5e9',
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    flexShrink: 0
                                }}>✓
                                </div>
                                <span style={{color: 'white', fontSize: '16px'}}>AC Gas Top-Up</span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '15px',
                            flexWrap: 'wrap',
                            marginTop: '40px'
                        }}>
                            <a
                                href={`tel:${companyInfo?.phone || '+918179697191'}`}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '14px 30px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    background: '#0ea5e9',
                                    color: 'white',
                                    borderRadius: '6px',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#0284c7'}
                                onMouseOut={(e) => e.target.style.background = '#0ea5e9'}
                            >
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/724/724664.png"
                                    alt="Phone"
                                    style={{width: '20px', height: '20px', filter: 'brightness(0) invert(1)'}}
                                />
                                Book a Service

                            </a>

                            <a
                                href={`https://wa.me/${companyInfo?.phone?.replace(/[^0-9]/g, '') || '918179697191'}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '14px 30px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    background: '#0ea5e9',
                                    color: 'white',
                                    borderRadius: '6px',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#0284c7'}
                                onMouseOut={(e) => e.target.style.background = '#0ea5e9'}
                            >
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
                                    alt="WhatsApp"
                                    style={{width: '20px', height: '20px', filter: 'brightness(0) invert(1)'}}
                                />
                                Get a Free Quote
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Fade Gradient */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '64px',
                    background: 'linear-gradient(to top, rgba(255, 255, 255, 1) 0%, transparent 100%)',
                    zIndex: 1
                }}></div>
            </section>

            {/* Floating Contact Buttons */}
            <div className="floating-buttons">
                <a
                    href={`https://wa.me/${companyInfo?.phone?.replace(/[^0-9]/g, '') || '918179697191'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="floating-btn whatsapp-btn"
                    title="WhatsApp"
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                        alt="WhatsApp"
                        style={{width: '32px', height: '32px'}}
                    />
                </a>
                <a
                    href={`tel:${companyInfo?.phone || '+918179697191'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="floating-btn phone-btn"
                    title="Call Now"
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/724/724664.png"
                        alt="Call"
                        style={{width: '32px', height: '32px'}}
                    />
                </a>
            </div>

            <div className="container">
                {/* Repair and Installation Services Section */}
                <div style={{textAlign: 'center', marginBottom: '50px', marginTop: '60px'}}>
                    <h2 style={{
                        color: '#1e3c72',
                        fontSize: '36px',
                        fontWeight: 'bold',
                        marginBottom: '15px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        OUR REPAIR AND INSTALLATION SERVICES
                    </h2>
                    <p style={{
                        color: '#666',
                        fontSize: '18px',
                        maxWidth: '800px',
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        Welcome to our AC Repair Services! We offer efficient solutions to keep your home cool. Our
                        technicians ensure your system runs smoothly.
                    </p>
                </div>

                <div className="services-grid" id="services">
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
                                    src={serviceImages[service] || 'https://images.unsplash.com/photo-1631545806609-c2f4833a0b41?w=400&h=250&fit=crop&auto=format&q=70'}
                                    alt={service}
                                    loading="lazy"
                                    decoding="async"
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
                            <p style={{color: '#666', fontSize: '14px', marginTop: '10px'}}>
                                Professional and reliable service
                            </p>
                        </div>
                    ))}
                </div>

                <div className="card" style={{textAlign: 'center', padding: '40px'}}>
                    <h3 style={{color: '#1e3c72', marginBottom: '15px'}}>Why Choose Us?</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '30px',
                        marginTop: '30px'
                    }}>
                        <div>
                            <div style={{fontSize: '40px', marginBottom: '10px'}}>⚡</div>
                            <h4 style={{color: '#1e3c72', marginBottom: '8px'}}>Fast Service</h4>
                            <p style={{color: '#666', fontSize: '14px'}}>Quick response time</p>
                        </div>
                        <div>
                            <div style={{fontSize: '40px', marginBottom: '10px'}}>✓</div>
                            <h4 style={{color: '#1e3c72', marginBottom: '8px'}}>Experienced Team</h4>
                            <p style={{color: '#666', fontSize: '14px'}}>Skilled professionals</p>
                        </div>
                        <div>
                            <div style={{fontSize: '40px', marginBottom: '10px'}}>💰</div>
                            <h4 style={{color: '#1e3c72', marginBottom: '8px'}}>Competitive Pricing</h4>
                            <p style={{color: '#666', fontSize: '14px'}}>Best value for money</p>
                        </div>
                        <div>
                            <div style={{fontSize: '40px', marginBottom: '10px'}}>🛡️</div>
                            <h4 style={{color: '#1e3c72', marginBottom: '8px'}}>Quality Assured</h4>
                            <p style={{color: '#666', fontSize: '14px'}}>Guaranteed satisfaction</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
