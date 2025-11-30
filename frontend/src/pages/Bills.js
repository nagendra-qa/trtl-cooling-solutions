import React, { useState, useEffect } from 'react';
import { billsAPI, workOrdersAPI, customersAPI } from '../services/api';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    billNumber: '',
    workOrder: '',
    customer: '',
    camp: '',
    billDate: new Date().toISOString().split('T')[0],
    customerWONumber: '',
    customerWODate: '',
    projectName: '',
    referenceNo: '',
    items: [{ description: '', sacCode: '', unit: 'EA', quantity: 1, rate: 0, amount: 0 }],
    paymentTerms: '30 Days credit',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBills();
    fetchWorkOrders();
    fetchCustomers();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await billsAPI.getAll();
      setBills(response.data);
    } catch (error) {
      showMessage('error', 'Error fetching bills');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkOrders = async () => {
    try {
      const response = await workOrdersAPI.getAll();
      setWorkOrders(response.data);
    } catch (error) {
      console.error('Error fetching work orders:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const fetchNextInvoiceNumber = async () => {
    try {
      const response = await billsAPI.getNextInvoiceNumber();
      setFormData(prev => ({ ...prev, billNumber: response.data.invoiceNumber }));
    } catch (error) {
      console.error('Error fetching next invoice number:', error);
    }
  };

  const openModal = () => {
    setShowModal(true);
    fetchNextInvoiceNumber();
  };

  const calculateTotals = (items) => {
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const roundUp = 0; // Can be calculated if needed
    const grandTotal = totalAmount + roundUp;
    return { totalAmount, roundUp, grandTotal };
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }

    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', sacCode: '', unit: 'EA', quantity: 1, rate: 0, amount: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleWorkOrderSelect = (woId) => {
    const selectedWO = workOrders.find(wo => wo._id === woId);
    if (selectedWO) {
      const items = selectedWO.services && selectedWO.services.length > 0
        ? selectedWO.services
        : [{ description: '', sacCode: '', unit: 'EA', quantity: 1, rate: 0, amount: 0 }];

      setFormData({
        ...formData,
        workOrder: woId,
        customer: selectedWO.customer._id,
        camp: selectedWO.camp._id,
        customerWONumber: selectedWO.workOrderNumber,
        customerWODate: selectedWO.serviceDate ? new Date(selectedWO.serviceDate).toISOString().split('T')[0] : '',
        projectName: selectedWO.projectName || '',
        referenceNo: selectedWO.referenceNo || '',
        items: items
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { totalAmount, roundUp, grandTotal } = calculateTotals(formData.items);

      const billData = {
        ...formData,
        totalAmount,
        roundUp,
        grandTotal,
        customerWODate: formData.customerWODate || null
      };

      if (editingId) {
        await billsAPI.update(editingId, billData);
        showMessage('success', 'Bill updated successfully');
      } else {
        await billsAPI.create(billData);
        showMessage('success', 'Bill created successfully');
      }
      fetchBills();
      resetForm();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Error saving bill');
    }
  };

  const handleDownloadPDF = async (billId, billNumber) => {
    try {
      const response = await billsAPI.downloadPDF(billId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${billNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showMessage('success', 'Bill downloaded successfully');
    } catch (error) {
      showMessage('error', 'Error downloading bill');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await billsAPI.delete(id);
        showMessage('success', 'Bill deleted successfully');
        fetchBills();
      } catch (error) {
        showMessage('error', 'Error deleting bill');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      billNumber: '',
      workOrder: '',
      customer: '',
      camp: '',
      billDate: new Date().toISOString().split('T')[0],
      customerWONumber: '',
      customerWODate: '',
      projectName: '',
      referenceNo: '',
      items: [{ description: '', sacCode: '', unit: 'EA', quantity: 1, rate: 0, amount: 0 }],
      paymentTerms: '30 Days credit',
      notes: ''
    });
    setEditingId(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { totalAmount, grandTotal } = calculateTotals(formData.items);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Bills / Invoices</h2>
          <button className="btn btn-primary" onClick={openModal}>
            Create Bill
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
              <th>Bill Number</th>
              <th>Customer</th>
              <th>Camp</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill._id}>
                <td>{bill.billNumber}</td>
                <td>{bill.customer.name}</td>
                <td>{bill.camp.campName}</td>
                <td>{new Date(bill.billDate).toLocaleDateString()}</td>
                <td>₹{bill.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: bill.status === 'paid' ? '#d4edda' : '#fff3cd',
                    color: bill.status === 'paid' ? '#155724' : '#856404'
                  }}>
                    {bill.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-success"
                    style={{ marginRight: '10px' }}
                    onClick={() => handleDownloadPDF(bill._id, bill.billNumber)}
                  >
                    Download PDF
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(bill._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {bills.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No bills found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: '900px' }}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit Bill' : 'Create Bill'}</h2>
              <button className="close-btn" onClick={resetForm}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Invoice Number * (Auto-generated)</label>
                  <input
                    type="text"
                    name="billNumber"
                    className="form-control"
                    value={formData.billNumber}
                    onChange={handleChange}
                    placeholder="2025-26/001"
                    required
                    style={{ backgroundColor: '#f0f0f0' }}
                  />
                  <small style={{ color: '#666', fontSize: '12px' }}>
                    Auto-generated based on financial year
                  </small>
                </div>
                <div className="form-group">
                  <label>Bill Date *</label>
                  <input
                    type="date"
                    name="billDate"
                    className="form-control"
                    value={formData.billDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Select Work Order (Auto-fills details)</label>
                <select
                  name="workOrder"
                  className="form-control"
                  value={formData.workOrder}
                  onChange={(e) => handleWorkOrderSelect(e.target.value)}
                >
                  <option value="">Select Work Order (Optional)</option>
                  {workOrders.map((wo) => (
                    <option key={wo._id} value={wo._id}>
                      {wo.workOrderNumber} - {wo.customer.name} - {wo.camp.campName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Customer WO Number</label>
                  <input
                    type="text"
                    name="customerWONumber"
                    className="form-control"
                    value={formData.customerWONumber}
                    onChange={handleChange}
                    placeholder="4800007945"
                  />
                </div>
                <div className="form-group">
                  <label>Customer WO Date</label>
                  <input
                    type="date"
                    name="customerWODate"
                    className="form-control"
                    value={formData.customerWODate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    name="projectName"
                    className="form-control"
                    value={formData.projectName}
                    onChange={handleChange}
                    placeholder="Neelanchal - HYD - Service jobs"
                  />
                </div>
                <div className="form-group">
                  <label>Reference No</label>
                  <input
                    type="text"
                    name="referenceNo"
                    className="form-control"
                    value={formData.referenceNo}
                    onChange={handleChange}
                    placeholder="A.D017"
                  />
                </div>
              </div>

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
                <label>Services / Items</label>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', marginBottom: '10px' }}>
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th style={{ width: '100px' }}>SAC Code</th>
                        <th style={{ width: '80px' }}>Unit</th>
                        <th style={{ width: '80px' }}>Qty</th>
                        <th style={{ width: '100px' }}>Rate</th>
                        <th style={{ width: '120px' }}>Amount</th>
                        <th style={{ width: '60px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <textarea
                              placeholder="Service description"
                              className="form-control"
                              value={item.description}
                              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                              rows="2"
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="995461"
                              className="form-control"
                              value={item.sacCode}
                              onChange={(e) => handleItemChange(index, 'sacCode', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="EA"
                              className="form-control"
                              value={item.unit}
                              onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              placeholder="Qty"
                              className="form-control"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                              step="0.01"
                              min="0"
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              placeholder="Rate"
                              className="form-control"
                              value={item.rate}
                              onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                              step="0.01"
                              min="0"
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              placeholder="Amount"
                              className="form-control"
                              value={item.amount}
                              readOnly
                              style={{ backgroundColor: '#f0f0f0' }}
                            />
                          </td>
                          <td>
                            {formData.items.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => removeItem(index)}
                                style={{ padding: '5px 10px' }}
                              >
                                ×
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button type="button" className="btn btn-secondary" onClick={addItem}>
                  Add Item
                </button>
              </div>

              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong>Total Amount:</strong>
                  <span>₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}>
                  <strong>Grand Total:</strong>
                  <strong>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                </div>
              </div>

              <div className="form-group">
                <label>Payment Terms</label>
                <input
                  type="text"
                  name="paymentTerms"
                  className="form-control"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  placeholder="30 Days credit"
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  className="form-control"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Bill' : 'Create Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;
