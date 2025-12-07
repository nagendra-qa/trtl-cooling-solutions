import React, { useState } from 'react';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);

  const acTypes = [
    {
      id: 1,
      name: 'Split AC',
      image: '/Images/AC_Split AC.jpeg',
      description: 'Split air conditioners are the most popular choice for residential and small commercial spaces. They consist of two units - an indoor unit and an outdoor compressor.',
      features: [
        'Energy efficient operation',
        'Quiet indoor operation',
        'Flexible installation options',
        'Available in various capacities (1 Ton to 2 Ton)',
        'Inverter and non-inverter options'
      ],
      specifications: {
        'Cooling Capacity': '1 Ton - 2 Ton',
        'Power Consumption': '900W - 2000W',
        'Coverage Area': '100-200 sq ft',
        'Refrigerant': 'R32/R410A'
      },
      services: ['Installation', 'Repair', 'Gas Charging', 'Maintenance', 'Compressor Repair']
    },
    {
      id: 2,
      name: 'Window AC',
      image: '/Images/Window_AC.jpeg',
      description: 'Window air conditioners are compact, single-unit systems that fit into a window or wall opening. Ideal for budget-conscious customers.',
      features: [
        'Cost-effective solution',
        'Easy to install and maintain',
        'All components in single unit',
        'No external piping required',
        'Perfect for small rooms'
      ],
      specifications: {
        'Cooling Capacity': '0.75 Ton - 2 Ton',
        'Power Consumption': '800W - 1800W',
        'Coverage Area': '80-180 sq ft',
        'Refrigerant': 'R22/R32'
      },
      services: ['Installation', 'Repair', 'Gas Charging', 'Maintenance', 'Filter Cleaning']
    },
    {
      id: 3,
      name: 'Cassette AC',
      image: '/Images/Cassette_AC.jpeg',
      description: 'Ceiling-mounted cassette ACs are perfect for commercial spaces, offices, and large halls. They provide 360-degree air distribution.',
      features: [
        '4-way air distribution',
        'Ceiling mounted - saves floor space',
        'Uniform cooling throughout room',
        'Modern and aesthetic design',
        'Ideal for commercial spaces'
      ],
      specifications: {
        'Cooling Capacity': '2 Ton - 5 Ton',
        'Power Consumption': '2000W - 5000W',
        'Coverage Area': '200-500 sq ft',
        'Refrigerant': 'R410A'
      },
      services: ['Installation', 'Repair', 'Preventive Maintenance', 'Filter Cleaning', 'Gas Charging']
    },
    {
      id: 4,
      name: 'VRF AC',
      image: '/Images/VRF_AC.jpeg',
      description: 'Variable Refrigerant Flow systems are advanced HVAC solutions for large commercial buildings, offering individual zone control and exceptional energy efficiency.',
      features: [
        'Individual zone temperature control',
        'Highly energy efficient',
        'Simultaneous heating and cooling',
        'Quiet operation',
        'Suitable for large buildings'
      ],
      specifications: {
        'Cooling Capacity': '8 HP - 50 HP',
        'Power Consumption': 'Variable',
        'Coverage Area': '1000+ sq ft',
        'Refrigerant': 'R410A'
      },
      services: ['Installation', 'System Design', 'Maintenance', 'Repair', 'Retrofit']
    },
    {
      id: 5,
      name: 'AHU (Air Handling Unit)',
      image: '/Images/AHU_AC.jpeg',
      description: 'Air Handling Units are used in large commercial and industrial facilities for centralized air conditioning and ventilation.',
      features: [
        'Centralized air conditioning',
        'Fresh air ventilation',
        'Air filtration system',
        'Humidity control',
        'Energy recovery options'
      ],
      specifications: {
        'Cooling Capacity': '5 TR - 100 TR',
        'Airflow Rate': '2000 - 50000 CFM',
        'Coverage Area': '5000+ sq ft',
        'Refrigerant': 'Chilled Water/DX'
      },
      services: ['Installation', 'Maintenance', 'Filter Replacement', 'Cleaning', 'Repair']
    },
    {
      id: 6,
      name: 'Ductable AC',
      image: '/Images/Ductable_AC.jpeg',
      description: 'Ductable or Ducted AC systems provide concealed air conditioning through ducts, perfect for large spaces requiring uniform cooling without visible indoor units.',
      features: [
        'Concealed indoor unit',
        'Multiple rooms cooling from single unit',
        'Aesthetic appeal - no visible units',
        'Uniform temperature distribution',
        'Ideal for large homes and offices'
      ],
      specifications: {
        'Cooling Capacity': '3 Ton - 10 Ton',
        'Power Consumption': '3000W - 10000W',
        'Coverage Area': '500-2000 sq ft',
        'Refrigerant': 'R410A/R32'
      },
      services: ['Installation', 'Duct Cleaning', 'Maintenance', 'Repair', 'Gas Charging']
    },
    {
      id: 7,
      name: 'Central AC',
      image: '/Images/Central_AC.jpeg',
      description: 'Central air conditioning systems provide whole-building climate control, ideal for large residences, villas, and commercial establishments.',
      features: [
        'Whole building climate control',
        'Energy efficient for large spaces',
        'Centralized temperature management',
        'Advanced filtration systems',
        'Quiet operation throughout building'
      ],
      specifications: {
        'Cooling Capacity': '10 Ton - 50 Ton',
        'Power Consumption': '12000W - 60000W',
        'Coverage Area': '3000+ sq ft',
        'Refrigerant': 'R410A'
      },
      services: ['Installation', 'System Design', 'Maintenance', 'Repair', 'Ductwork Service']
    }
  ];

  const maintenanceServices = [
    {
      id: 7,
      name: 'AC Repair & Maintenance',
      image: '/Images/AC Repair & Maintenance.jpg',
      description: 'Comprehensive repair and maintenance services to keep your AC running efficiently year-round.',
      services: ['Complete diagnosis', 'Part replacement', 'Performance testing', 'System optimization', 'Emergency repairs']
    },
    {
      id: 8,
      name: 'Preventive Maintenance (PPM)',
      image: '/Images/Preventive Maintenance (PPM).jpeg',
      description: 'Regular preventive maintenance to ensure optimal performance and extend the life of your AC system.',
      services: ['Scheduled maintenance', 'Performance monitoring', 'Early fault detection', 'Extended equipment life', 'Priority service']
    },
    {
      id: 9,
      name: 'Gas Charging',
      image: '/Images/AC_GasFilling.jpeg',
      description: 'Professional refrigerant gas charging services for all types of AC systems.',
      services: ['Leak detection', 'Gas recovery', 'Vacuum testing', 'Gas charging', 'Leak repair']
    },
    {
      id: 10,
      name: '24/7 Emergency Services',
      image: '/Images/Emergency Services.jpeg',
      description: 'Round-the-clock emergency AC repair services to handle urgent cooling needs.',
      services: ['24/7 availability', 'Fast response time', 'Emergency repairs', 'Temporary cooling solutions', 'Priority scheduling']
    }
  ];

  const ServiceModal = ({ service, onClose }) => (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h2>{service.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <img
            src={service.image}
            alt={service.name}
            style={{
              width: '100%',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '20px'
            }}
          />

          <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px', color: 'var(--dark-gray)' }}>
            {service.description}
          </p>

          {service.features && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ color: 'var(--dark-blue)', marginBottom: '15px' }}>Key Features</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                {service.features.map((feature, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      color: 'var(--primary-green)',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>✓</span>
                    <span style={{ fontSize: '15px' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {service.specifications && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ color: 'var(--dark-blue)', marginBottom: '15px' }}>Specifications</h3>
              <div style={{
                background: 'var(--light-gray)',
                padding: '15px',
                borderRadius: '8px',
                display: 'grid',
                gap: '10px'
              }}>
                {Object.entries(service.specifications).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
                    <strong style={{ color: 'var(--dark-blue)' }}>{key}:</strong>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {service.services && (
            <div>
              <h3 style={{ color: 'var(--dark-blue)', marginBottom: '15px' }}>Services We Provide</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {service.services.map((item, index) => (
                  <span key={index} style={{
                    background: 'var(--primary-green)',
                    color: 'white',
                    padding: '8px 15px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <a
            href="tel:+918179697191"
            className="btn btn-primary"
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Book Service Now
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: '20px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ color: 'var(--dark-blue)', fontSize: '42px', marginBottom: '15px' }}>Our Services</h1>
          <p style={{ color: 'var(--dark-gray)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Comprehensive AC solutions for residential and commercial properties
          </p>
        </div>

        {/* AC Types Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ color: 'var(--dark-blue)', fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>
            AC Types We Service
          </h2>
          <div className="services-grid">
            {acTypes.map((service) => (
              <div
                key={service.id}
                className="service-card"
                onClick={() => setSelectedService(service)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  overflow: 'hidden'
                }}>
                  <img
                    src={service.image}
                    alt={service.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>{service.name}</h3>
                <p style={{ fontSize: '14px', color: 'var(--dark-gray)', marginBottom: '15px', lineHeight: '1.5' }}>
                  {service.description.substring(0, 100)}...
                </p>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px' }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Services Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ color: 'var(--dark-blue)', fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>
            Maintenance & Repair Services
          </h2>
          <div className="services-grid">
            {maintenanceServices.map((service) => (
              <div
                key={service.id}
                className="service-card"
                onClick={() => setSelectedService(service)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  overflow: 'hidden'
                }}>
                  <img
                    src={service.image}
                    alt={service.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>{service.name}</h3>
                <p style={{ fontSize: '14px', color: 'var(--dark-gray)', marginBottom: '15px', lineHeight: '1.5' }}>
                  {service.description.substring(0, 100)}...
                </p>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px' }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          background: 'linear-gradient(135deg, var(--dark-blue) 0%, var(--primary-green) 100%)',
          padding: '50px 30px',
          borderRadius: '12px',
          textAlign: 'center',
          color: 'white',
          marginBottom: '60px'
        }}>
          <h2 style={{ fontSize: '32px', marginBottom: '15px', color: 'white' }}>Need AC Service?</h2>
          <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.9 }}>
            Contact us today for professional AC installation, repair, and maintenance services
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="tel:+918179697191"
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
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
};

export default Services;
