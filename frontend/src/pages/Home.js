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
        'VRF AC': '/Images/VRF_AC.jpg',
        'AHU AC': '/Images/AHU_AC.jpeg',
        'AC Installation': 'https://images.unsplash.com/photo-1631545806609-c2f4833a0b41?w=400&h=250&fit=crop&auto=format&q=70',
        'AC Repair & Maintenance': 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=250&fit=crop&auto=format&q=70',
        'Preventive Maintenance (PPM)': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop&auto=format&q=70',
        'Gas Charging': 'https://images.unsplash.com/photo-1635405074683-96d6921a9a0f?w=400&h=250&fit=crop&auto=format&q=70',
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
                    src="/Images/HomePage.png"
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
                            <span style={{display: 'block'}}>Your Trusted Partner for</span>
                            <span style={{display: 'block', color: '#0ea5e9'}}>Complete AC Solutions</span>
                        </h1>

                        <p style={{
                            fontSize: '22px',
                            color: 'rgba(255, 255, 255, 0.95)',
                            marginBottom: '30px',
                            maxWidth: '700px',
                            lineHeight: '1.6'
                        }}>
                            Expert air conditioning services for your home and business. Professional installation,
                            repair, and maintenance services in Hyderabad. We keep you cool when it matters most.
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
                                <span style={{color: 'white', fontSize: '16px'}}>AC Health Checkup</span>
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
                                <span style={{color: 'white', fontSize: '16px'}}>AC Gas Filling</span>
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
                                <span style={{color: 'white', fontSize: '16px'}}>AC Repairs</span>
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
                                    src="/Images/Caller.png"
                                    alt="Phone"
                                    style={{width: '24px', height: '24px'}}
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
                                    background: 'white',
                                    color: '#0c4a6e',
                                    borderRadius: '6px',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#f4f4f4'}
                                onMouseOut={(e) => e.target.style.background = 'white'}
                            >
                                <img
                                    src="/Images/Whatsup.png"
                                    alt="WhatsApp"
                                    style={{width: '24px', height: '24px'}}
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

                {/* Locations Section */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '60px',
                    marginBottom: '40px',
                    padding: '40px 20px',
                    background: '#f8f9fa',
                    borderRadius: '12px'
                }}>
                    <h2 id="locations" style={{color: '#1e3c72', fontSize: '36px', marginBottom: '15px'}}>Service
                        Locations</h2>
                    <p style={{color: '#666', fontSize: '16px', marginBottom: '30px'}}>We serve across Hyderabad and
                        surrounding areas</p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        maxWidth: '1100px',
                        margin: '0 auto'
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'center'}}>
                                <img
                                    src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png"
                                    alt="Location"
                                    style={{width: '40px', height: '40px'}}
                                />
                            </div>
                            <h4 style={{color: '#1e3c72', marginBottom: '8px'}}>Chanda Nagar</h4>
                            <p style={{color: '#666', fontSize: '14px'}}>Main Office</p>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'center'}}>
                                <img
                                    src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png"
                                    alt="Location"
                                    style={{width: '40px', height: '40px'}}
                                />
                            </div>
                            <h4 style={{color: '#1e3c72', marginBottom: '8px'}}>Gachibowli</h4>
                            <p style={{color: '#666', fontSize: '14px'}}>Service Area</p>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'center'}}>
                                <img
                                    src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png"
                                    alt="Location"
                                    style={{width: '40px', height: '40px'}}
                                />
                            </div>
                            <h4 style={{color: '#1e3c72', marginBottom: '8px'}}>Madhapur</h4>
                            <p style={{color: '#666', fontSize: '14px'}}>Service Area</p>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'center'}}>
                                <img
                                    src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png"
                                    alt="Location"
                                    style={{width: '40px', height: '40px'}}
                                />
                            </div>
                            <h4 style={{color: '#1e3c72', marginBottom: '8px'}}>HitechCity</h4>
                            <p style={{color: '#666', fontSize: '14px'}}>Service Area</p>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'center'}}>
                                <img
                                    src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png"
                                    alt="Location"
                                    style={{width: '40px', height: '40px'}}
                                />
                            </div>
                            <h4 style={{color: '#1e3c72', marginBottom: '8px'}}>Manikonda</h4>
                            <p style={{color: '#666', fontSize: '14px'}}>Service Area</p>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'center'}}>
                                <img
                                    src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png"
                                    alt="Location"
                                    style={{width: '40px', height: '40px'}}
                                />
                            </div>
                            <h4 style={{color: '#1e3c72', marginBottom: '8px'}}>Hyderabad</h4>
                            <p style={{color: '#666', fontSize: '14px'}}>All Areas</p>
                        </div>
                    </div>
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
                    <h2 id="contact" style={{fontSize: '32px', marginBottom: '25px'}}>Get in Touch</h2>
                    <p style={{fontSize: '18px', marginBottom: '30px'}}>
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
                            <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'center'}}>
                                <img
                                    src="/Images/Caller.png"
                                    alt="Phone"
                                    style={{width: '48px', height: '48px'}}
                                />
                            </div>
                            <strong style={{display: 'block', marginBottom: '8px', fontSize: '16px'}}>Phone</strong>
                            <span style={{fontSize: '18px'}}>{companyInfo?.phone || '+91-XXXXXXXXXX'}</span>
                        </div>

                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '25px',
                            borderRadius: '8px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'center'}}>
                                <img
                                    src="/Images/Mail.png"
                                    alt="Email"
                                    style={{width: '48px', height: '48px'}}
                                />
                            </div>
                            <strong style={{display: 'block', marginBottom: '8px', fontSize: '16px'}}>Email</strong>
                            <span style={{fontSize: '18px'}}>{companyInfo?.email || 'eshwarsvp99.com@gmail.com'}</span>
                        </div>

                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '25px',
                            borderRadius: '8px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'center'}}>
                                <img
                                    src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png"
                                    alt="Location"
                                    style={{width: '48px', height: '48px'}}
                                />
                            </div>
                            <strong style={{display: 'block', marginBottom: '8px', fontSize: '16px'}}>Address</strong>
                            <span
                                style={{fontSize: '16px'}}>{companyInfo?.officeAddress || 'Plot no-721, Huda Colony, Chanda Nagar, Hyderabad-500050'}</span>
                        </div>
                    </div>

                    {companyInfo?.gst && (
                        <div style={{marginTop: '30px', fontSize: '14px', opacity: 0.9}}>
                            GST No: {companyInfo.gst}
                        </div>
                    )}
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
