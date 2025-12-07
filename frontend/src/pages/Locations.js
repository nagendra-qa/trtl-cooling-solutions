import React from 'react';

const Locations = () => {
  const locations = [
    { id: 1, name: 'Chanda Nagar', type: 'Main Office' },
    { id: 2, name: 'Gachibowli', type: 'Service Area' },
    { id: 3, name: 'Madhapur', type: 'Service Area' },
    { id: 4, name: 'HitechCity', type: 'Service Area' },
    { id: 5, name: 'Manikonda', type: 'Service Area' },
    { id: 6, name: 'Kondapur', type: 'Service Area' },
    { id: 7, name: 'Kukatpally', type: 'Service Area' },
    { id: 8, name: 'Miyapur', type: 'Service Area' },
    { id: 9, name: 'Ameerpet', type: 'Service Area' },
    { id: 10, name: 'Begumpet', type: 'Service Area' },
    { id: 11, name: 'Secunderabad', type: 'Service Area' },
    { id: 12, name: 'Banjara Hills', type: 'Service Area' },
    { id: 13, name: 'Jubilee Hills', type: 'Service Area' },
    { id: 14, name: 'Mehdipatnam', type: 'Service Area' },
    { id: 15, name: 'Tolichowki', type: 'Service Area' },
    { id: 16, name: 'Attapur', type: 'Service Area' },
    { id: 17, name: 'Rajendranagar', type: 'Service Area' },
    { id: 18, name: 'Shamshabad', type: 'Service Area' },
    { id: 19, name: 'Dilsukhnagar', type: 'Service Area' },
    { id: 20, name: 'LB Nagar', type: 'Service Area' },
    { id: 21, name: 'Uppal', type: 'Service Area' },
    { id: 22, name: 'Nacharam', type: 'Service Area' },
    { id: 23, name: 'ECIL', type: 'Service Area' },
    { id: 24, name: 'Kompally', type: 'Service Area' },
    { id: 25, name: 'Alwal', type: 'Service Area' },
    { id: 26, name: 'Bowenpally', type: 'Service Area' },
    { id: 27, name: 'SR Nagar', type: 'Service Area' },
    { id: 28, name: 'Panjagutta', type: 'Service Area' },
    { id: 29, name: 'Somajiguda', type: 'Service Area' },
    { id: 30, name: 'Lakdi Ka Pul', type: 'Service Area' },
    { id: 31, name: 'Masab Tank', type: 'Service Area' },
    { id: 32, name: 'Malakpet', type: 'Service Area' },
    { id: 33, name: 'Chaderghat', type: 'Service Area' },
    { id: 34, name: 'Charminar', type: 'Service Area' },
    { id: 35, name: 'Falaknuma', type: 'Service Area' },
    { id: 36, name: 'Moosapet', type: 'Service Area' },
    { id: 37, name: 'Balanagar', type: 'Service Area' },
    { id: 38, name: 'Sanath Nagar', type: 'Service Area' },
    { id: 39, name: 'Nizampet', type: 'Service Area' },
    { id: 40, name: 'Bachupally', type: 'Service Area' },
    { id: 41, name: 'Pragathi Nagar', type: 'Service Area' },
    { id: 42, name: 'Yapral', type: 'Service Area' },
    { id: 43, name: 'AS Rao Nagar', type: 'Service Area' },
    { id: 44, name: 'Malkajgiri', type: 'Service Area' },
    { id: 45, name: 'Sainikpuri', type: 'Service Area' },
    { id: 46, name: 'Kapra', type: 'Service Area' },
    { id: 47, name: 'Habsiguda', type: 'Service Area' },
    { id: 48, name: 'Tarnaka', type: 'Service Area' },
    { id: 49, name: 'Vidyanagar', type: 'Service Area' },
    { id: 50, name: 'Ramanthapur', type: 'Service Area' },
    { id: 51, name: 'Nagole', type: 'Service Area' },
    { id: 52, name: 'Kothapet', type: 'Service Area' },
    { id: 53, name: 'Chaitanyapuri', type: 'Service Area' },
    { id: 54, name: 'Hayathnagar', type: 'Service Area' },
    { id: 55, name: 'Vanasthalipuram', type: 'Service Area' },
    { id: 56, name: 'Saroor Nagar', type: 'Service Area' },
    { id: 57, name: 'Bandlaguda', type: 'Service Area' },
    { id: 58, name: 'Kismathpur', type: 'Service Area' },
    { id: 59, name: 'Narsingi', type: 'Service Area' },
    { id: 60, name: 'Kokapet', type: 'Service Area' },
    { id: 61, name: 'Financial District', type: 'Service Area' },
    { id: 62, name: 'Nanakramguda', type: 'Service Area' },
    { id: 63, name: 'Raidurg', type: 'Service Area' },
    { id: 64, name: 'Serilingampally', type: 'Service Area' },
    { id: 65, name: 'Kollur', type: 'Service Area' },
    { id: 66, name: 'Patancheru', type: 'Service Area' },
    { id: 67, name: 'Jeedimetla', type: 'Service Area' },
    { id: 68, name: 'Quthbullapur', type: 'Service Area' },
    { id: 69, name: 'Medchal', type: 'Service Area' },
    { id: 70, name: 'Shamirpet', type: 'Service Area' }
  ];

  const mainOffice = {
    name: 'Chanda Nagar',
    address: 'Plot no-721, Huda Colony, Chanda Nagar, Hyderabad-500050',
    phone: '+91-8179697191',
    timings: 'Mon-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 5:00 PM'
  };

  return (
    <div style={{ paddingTop: '20px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ color: 'var(--dark-blue)', fontSize: '42px', marginBottom: '15px' }}>Service Locations</h1>
          <p style={{ color: 'var(--dark-gray)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            We serve across Hyderabad and surrounding areas with professional AC services
          </p>
        </div>

        {/* Main Office Highlight */}
        <div style={{
          background: 'linear-gradient(135deg, var(--dark-blue) 0%, var(--primary-green) 100%)',
          padding: '50px 30px',
          borderRadius: '12px',
          textAlign: 'center',
          color: 'white',
          marginBottom: '60px'
        }}>
          <h2 style={{ fontSize: '32px', marginBottom: '15px', color: 'white' }}>Main Office</h2>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            background: 'rgba(255,255,255,0.1)',
            padding: '30px',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ fontSize: '24px', marginBottom: '15px', color: 'white' }}>{mainOffice.name}</h3>
            <p style={{ fontSize: '18px', marginBottom: '10px', opacity: 0.95 }}>
              {mainOffice.address}
            </p>
            <p style={{ fontSize: '16px', marginBottom: '10px', opacity: 0.9 }}>
              <strong>Phone:</strong> {mainOffice.phone}
            </p>
            <p style={{ fontSize: '16px', opacity: 0.9 }}>
              <strong>Timings:</strong> {mainOffice.timings}
            </p>
          </div>
        </div>

        {/* Service Areas Grid */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ color: 'var(--dark-blue)', fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>
            Service Areas Across Hyderabad
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {locations.filter(loc => loc.type !== 'Main Office').map((location) => (
              <div
                key={location.id}
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  borderLeft: '3px solid var(--primary-green)',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(14, 165, 233, 0.2)';
                  e.currentTarget.style.borderLeftColor = 'var(--dark-blue)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderLeftColor = 'var(--primary-green)';
                }}
              >
                <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                  <img
                    src="/Images/GoogleMap_Symbol.jpeg"
                    alt="Location"
                    style={{ width: '40px', height: '40px' }}
                  />
                </div>
                <h4 style={{ color: 'var(--dark-blue)', marginBottom: '5px', fontSize: '16px' }}>
                  {location.name}
                </h4>
                <p style={{ color: '#666', fontSize: '13px' }}>24/7 Service Available</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Info Section */}
        <div style={{
          background: 'var(--light-gray)',
          padding: '50px 30px',
          borderRadius: '12px',
          marginBottom: '60px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: 'var(--dark-blue)', fontSize: '32px', marginBottom: '20px' }}>
            Wide Coverage Across Hyderabad
          </h2>
          <p style={{ color: 'var(--dark-gray)', fontSize: '16px', marginBottom: '30px', maxWidth: '700px', margin: '0 auto 30px' }}>
            We provide comprehensive AC installation, repair, and maintenance services across all major areas in Hyderabad.
            Our expert technicians are ready to serve you with quick response times and professional service.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            flexWrap: 'wrap',
            marginTop: '30px'
          }}>
            <a
              href="tel:+918179697191"
              className="btn btn-primary"
              style={{
                padding: '12px 30px',
                fontSize: '16px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
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
              href="https://wa.me/918179697191"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{
                padding: '12px 30px',
                fontSize: '16px',
                textDecoration: 'none',
                background: '#0ea5e9',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locations;
