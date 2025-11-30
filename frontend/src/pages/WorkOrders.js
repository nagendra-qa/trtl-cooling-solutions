import React, { useState, useEffect } from 'react';
import { workOrdersAPI, customersAPI, campsAPI } from '../services/api';

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [camps, setCamps] = useState([]);
  const [allCamps, setAllCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [formData, setFormData] = useState({
    workOrderNumber: '',
    customer: '',
    camp: '',
    serviceDate: '',
    technicianName: '',
    workDescription: '',
    services: []
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCustomers();
    fetchAllCamps();
    fetchWorkOrders();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchAllCamps = async () => {
    try {
      const response = await campsAPI.getAll();
      setAllCamps(response.data);
    } catch (error) {
      console.error('Error fetching camps:', error);
    }
  };

  const fetchWorkOrders = async () => {
    try {
      const response = await workOrdersAPI.getAll();
      setWorkOrders(response.data);
    } catch (error) {
      showMessage('error', 'Error fetching work orders');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleCustomerChange = (customerId) => {
    setFormData({ ...formData, customer: customerId, camp: '' });
    const customerCamps = allCamps.filter(camp => camp.customer._id === customerId);
    setCamps(customerCamps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('data', JSON.stringify(formData));
      if (pdfFile) {
        data.append('pdf', pdfFile);
      }

      if (editingId) {
        await workOrdersAPI.update(editingId, formData);
        showMessage('success', 'Work order updated successfully');
      } else {
        await workOrdersAPI.create(data);
        showMessage('success', 'Work order created successfully');
      }
      fetchWorkOrders();
      resetForm();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Error saving work order');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this work order?')) {
      try {
        await workOrdersAPI.delete(id);
        showMessage('success', 'Work order deleted successfully');
        fetchWorkOrders();
      } catch (error) {
        showMessage('error', 'Error deleting work order');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      workOrderNumber: '',
      customer: '',
      camp: '',
      serviceDate: '',
      technicianName: '',
      workDescription: '',
      services: []
    });
    setPdfFile(null);
    setEditingId(null);
    setShowModal(false);
    setCamps([]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Work Orders</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Upload Work Order
          </button>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>WO Number</th>
              <th>Customer</th>
              <th>Camp</th>
              <th>Service Date</th>
              <th>Technician</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workOrders.map((wo) => (
              <tr key={wo._id}>
                <td>{wo.workOrderNumber}</td>
                <td>{wo.customer.name}</td>
                <td>{wo.camp.campName}</td>
                <td>{new Date(wo.serviceDate).toLocaleDateString()}</td>
                <td>{wo.technicianName || '-'}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: wo.status === 'completed' ? '#d4edda' : '#fff3cd',
                    color: wo.status === 'completed' ? '#155724' : '#856404'
                  }}>
                    {wo.status}
                  </span>
                </td>
                <td>
                  {wo.pdfFile && (
                    <a
                      href={`http://localhost:5000/uploads/${wo.pdfFile.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ marginRight: '10px' }}
                    >
                      View PDF
                    </a>
                  )}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(wo._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {workOrders.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No work orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Upload Work Order</h2>
              <button className="close-btn" onClick={resetForm}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Work Order Number *</label>
                <input
                  type="text"
                  name="workOrderNumber"
                  className="form-control"
                  value={formData.workOrderNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Customer *</label>
                <select
                  name="customer"
                  className="form-control"
                  value={formData.customer}
                  onChange={(e) => handleCustomerChange(e.target.value)}
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
                <label>Camp *</label>
                <select
                  name="camp"
                  className="form-control"
                  value={formData.camp}
                  onChange={handleChange}
                  required
                  disabled={!formData.customer}
                >
                  <option value="">Select Camp</option>
                  {camps.map((camp) => (
                    <option key={camp._id} value={camp._id}>
                      {camp.campName} - {camp.location}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Service Date *</label>
                <input
                  type="date"
                  name="serviceDate"
                  className="form-control"
                  value={formData.serviceDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Technician Name</label>
                <input
                  type="text"
                  name="technicianName"
                  className="form-control"
                  value={formData.technicianName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Work Description</label>
                <textarea
                  name="workDescription"
                  className="form-control"
                  value={formData.workDescription}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Upload Work Order PDF *</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrders;
