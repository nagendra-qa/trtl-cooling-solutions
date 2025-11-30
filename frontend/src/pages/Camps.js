import React, { useState, useEffect } from 'react';
import { campsAPI, customersAPI } from '../services/api';

const Camps = () => {
  const [camps, setCamps] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    campName: '',
    location: '',
    address: '',
    contactPerson: '',
    contactPhone: '',
    numberOfUnits: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filterCustomer, setFilterCustomer] = useState('');

  useEffect(() => {
    fetchCustomers();
    fetchCamps();
  }, []);

  useEffect(() => {
    fetchCamps();
  }, [filterCustomer]);

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchCamps = async () => {
    try {
      const response = await campsAPI.getAll(filterCustomer);
      setCamps(response.data);
    } catch (error) {
      showMessage('error', 'Error fetching camps');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await campsAPI.update(editingId, formData);
        showMessage('success', 'Camp updated successfully');
      } else {
        await campsAPI.create(formData);
        showMessage('success', 'Camp created successfully');
      }
      fetchCamps();
      resetForm();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Error saving camp');
    }
  };

  const handleEdit = (camp) => {
    setFormData({
      customer: camp.customer._id,
      campName: camp.campName,
      location: camp.location,
      address: camp.address,
      contactPerson: camp.contactPerson || '',
      contactPhone: camp.contactPhone || '',
      numberOfUnits: camp.numberOfUnits || 0
    });
    setEditingId(camp._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this camp?')) {
      try {
        await campsAPI.delete(id);
        showMessage('success', 'Camp deleted successfully');
        fetchCamps();
      } catch (error) {
        showMessage('error', 'Error deleting camp');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      customer: '',
      campName: '',
      location: '',
      address: '',
      contactPerson: '',
      contactPhone: '',
      numberOfUnits: 0
    });
    setEditingId(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Service Camps</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add Camp
          </button>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="form-group" style={{ marginBottom: '20px', maxWidth: '300px' }}>
          <label>Filter by Customer</label>
          <select
            className="form-control"
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
          >
            <option value="">All Customers</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Camp Name</th>
              <th>Location</th>
              <th>Contact Person</th>
              <th>Phone</th>
              <th>AC Units</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {camps.map((camp) => (
              <tr key={camp._id}>
                <td>{camp.customer.name}</td>
                <td>{camp.campName}</td>
                <td>{camp.location}</td>
                <td>{camp.contactPerson || '-'}</td>
                <td>{camp.contactPhone || '-'}</td>
                <td>{camp.numberOfUnits || 0}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    style={{ marginRight: '10px' }}
                    onClick={() => handleEdit(camp)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(camp._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {camps.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No camps found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Camp' : 'Add Camp'}</h2>
              <button className="close-btn" onClick={resetForm}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer *</label>
                <select
                  name="customer"
                  className="form-control"
                  value={formData.customer}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Camp Name *</label>
                <input
                  type="text"
                  name="campName"
                  className="form-control"
                  value={formData.campName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address *</label>
                <textarea
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Contact Person</label>
                <input
                  type="text"
                  name="contactPerson"
                  className="form-control"
                  value={formData.contactPerson}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  className="form-control"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Number of AC Units</label>
                <input
                  type="number"
                  name="numberOfUnits"
                  className="form-control"
                  value={formData.numberOfUnits}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Camps;
