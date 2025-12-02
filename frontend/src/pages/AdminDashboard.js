import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import Customers from './Customers';
import Camps from './Camps';
import WorkOrders from './WorkOrders';
import Bills from './Bills';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customers');
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyAdmin();
  }, []);

  const verifyAdmin = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin');
        return;
      }

      const response = await adminAPI.verify();
      setAdmin(response.data.admin);
    } catch (error) {
      console.error('Verification failed:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  if (loading) {
    return <div className="loading">Verifying admin access...</div>;
  }

  return (
    <div>
      {/* Admin Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '20px 0',
        marginBottom: '0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ margin: '0', fontSize: '24px' }}>Admin Dashboard</h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
              TRTL Cooling Solutions - Management Portal
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Logged in as</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{admin?.username}</div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-danger"
              style={{ padding: '8px 20px' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        background: 'white',
        borderBottom: '2px solid #e0e0e0',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            gap: '0',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveTab('customers')}
              style={{
                padding: '15px 25px',
                border: 'none',
                background: activeTab === 'customers' ? '#1e3c72' : 'transparent',
                color: activeTab === 'customers' ? 'white' : '#666',
                fontSize: '15px',
                fontWeight: activeTab === 'customers' ? 'bold' : 'normal',
                cursor: 'pointer',
                borderBottom: activeTab === 'customers' ? '3px solid #1e88e5' : 'none',
                transition: 'all 0.3s'
              }}
            >
              👥 Customers
            </button>
            <button
              onClick={() => setActiveTab('camps')}
              style={{
                padding: '15px 25px',
                border: 'none',
                background: activeTab === 'camps' ? '#1e3c72' : 'transparent',
                color: activeTab === 'camps' ? 'white' : '#666',
                fontSize: '15px',
                fontWeight: activeTab === 'camps' ? 'bold' : 'normal',
                cursor: 'pointer',
                borderBottom: activeTab === 'camps' ? '3px solid #1e88e5' : 'none',
                transition: 'all 0.3s'
              }}
            >
              🏢 Camps
            </button>
            <button
              onClick={() => setActiveTab('workorders')}
              style={{
                padding: '15px 25px',
                border: 'none',
                background: activeTab === 'workorders' ? '#1e3c72' : 'transparent',
                color: activeTab === 'workorders' ? 'white' : '#666',
                fontSize: '15px',
                fontWeight: activeTab === 'workorders' ? 'bold' : 'normal',
                cursor: 'pointer',
                borderBottom: activeTab === 'workorders' ? '3px solid #1e88e5' : 'none',
                transition: 'all 0.3s'
              }}
            >
              📋 Work Orders
            </button>
            <button
              onClick={() => setActiveTab('bills')}
              style={{
                padding: '15px 25px',
                border: 'none',
                background: activeTab === 'bills' ? '#1e3c72' : 'transparent',
                color: activeTab === 'bills' ? 'white' : '#666',
                fontSize: '15px',
                fontWeight: activeTab === 'bills' ? 'bold' : 'normal',
                cursor: 'pointer',
                borderBottom: activeTab === 'bills' ? '3px solid #1e88e5' : 'none',
                transition: 'all 0.3s'
              }}
            >
              💰 Bills
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '15px 25px',
                border: 'none',
                background: 'transparent',
                color: '#666',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                marginLeft: 'auto'
              }}
            >
              🌐 View Public Site →
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div>
        {activeTab === 'customers' && <Customers />}
        {activeTab === 'camps' && <Camps />}
        {activeTab === 'workorders' && <WorkOrders />}
        {activeTab === 'bills' && <Bills />}
      </div>
    </div>
  );
};

export default AdminDashboard;
