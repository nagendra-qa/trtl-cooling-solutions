import React, { useState, useEffect } from 'react';
import { workOrdersAPI } from '../services/api';

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchWorkOrders();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      showMessage('error', 'Please select a PDF file');
      return;
    }

    try {
      setUploading(true);
      const data = new FormData();
      data.append('pdf', pdfFile);

      await workOrdersAPI.create(data);
      showMessage('success', 'Work order uploaded and processed successfully');
      fetchWorkOrders();
      resetForm();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Error uploading work order');
    } finally {
      setUploading(false);
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
    setPdfFile(null);
    setShowModal(false);
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
              <th>WO Date</th>
              <th>Project Name</th>
              <th>Reference No</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workOrders.map((wo) => (
              <tr key={wo._id}>
                <td>{wo.workOrderNumber}</td>
                <td>{wo.serviceDate ? new Date(wo.serviceDate).toLocaleDateString('en-IN') : '-'}</td>
                <td>{wo.projectName || '-'}</td>
                <td>{wo.referenceNo || '-'}</td>
                <td>{wo.totalAmount ? `₹${wo.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}</td>
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
              <h2>Upload Work Order PDF</h2>
              <button className="close-btn" onClick={resetForm}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Work Order PDF File *</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
                <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  System will automatically extract: WO Number, WO Date, Project Name, Reference, Services, and Total Amount
                </small>
              </div>
              {pdfFile && (
                <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '15px' }}>
                  <strong>Selected File:</strong> {pdfFile.name}
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  {uploading ? 'Processing...' : 'Upload & Extract Data'}
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
