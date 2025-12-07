import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { billsAPI } from '../services/api';

// Same theme colors as web app
const COLORS = {
  primaryBlue: '#0ea5e9',
  darkBlue: '#0c4a6e',
  white: '#ffffff',
  lightGray: '#f4f4f4',
  darkGray: '#383838',
  danger: '#dc3545',
};

export default function CreateBillScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    billNumber: '',
    billDate: new Date().toISOString().split('T')[0],
    customerWONumber: '',
    customerWODate: '',
    projectName: '',
    referenceNo: '',
    items: [{ description: '', sacCode: '', unit: 'EA', quantity: 1, rate: 0, amount: 0 }],
    paymentTerms: '30 Days credit',
  });

  useEffect(() => {
    fetchNextInvoiceNumber();
  }, []);

  const fetchNextInvoiceNumber = async () => {
    try {
      const response = await billsAPI.getNextInvoiceNumber();
      setFormData(prev => ({ ...prev, billNumber: response.data.invoiceNumber }));
    } catch (error) {
      console.error('Error fetching invoice number:', error);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === 'quantity' || field === 'rate') {
      const qty = parseFloat(newItems[index].quantity) || 0;
      const rate = parseFloat(newItems[index].rate) || 0;
      newItems[index].amount = qty * rate;
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

  const calculateTotals = () => {
    const totalAmount = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    return { totalAmount, grandTotal: totalAmount };
  };

  const handleSubmit = async () => {
    if (!formData.billNumber || !formData.billDate) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }

    if (formData.items.some(item => !item.description)) {
      Alert.alert('Error', 'Please fill all item descriptions');
      return;
    }

    setLoading(true);
    try {
      const { totalAmount, grandTotal } = calculateTotals();

      const billData = {
        ...formData,
        totalAmount,
        roundUp: 0,
        grandTotal,
        customerWODate: formData.customerWODate || null,
      };

      await billsAPI.create(billData);
      Alert.alert('Success', 'Bill created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create bill');
    } finally {
      setLoading(false);
    }
  };

  const { totalAmount, grandTotal } = calculateTotals();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Bill</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Invoice Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Invoice Details</Text>

          <Text style={styles.label}>Invoice Number *</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={formData.billNumber}
            editable={false}
          />

          <Text style={styles.label}>Invoice Date *</Text>
          <TextInput
            style={styles.input}
            value={formData.billDate}
            onChangeText={(value) => setFormData({ ...formData, billDate: value })}
            placeholder="YYYY-MM-DD"
          />

          <Text style={styles.label}>Work Order Number</Text>
          <TextInput
            style={styles.input}
            value={formData.customerWONumber}
            onChangeText={(value) => setFormData({ ...formData, customerWONumber: value })}
            placeholder="Enter WO number"
          />

          <Text style={styles.label}>Work Order Date</Text>
          <TextInput
            style={styles.input}
            value={formData.customerWODate}
            onChangeText={(value) => setFormData({ ...formData, customerWODate: value })}
            placeholder="YYYY-MM-DD"
          />

          <Text style={styles.label}>Project Name</Text>
          <TextInput
            style={styles.input}
            value={formData.projectName}
            onChangeText={(value) => setFormData({ ...formData, projectName: value })}
            placeholder="Enter project name"
          />

          <Text style={styles.label}>Reference No</Text>
          <TextInput
            style={styles.input}
            value={formData.referenceNo}
            onChangeText={(value) => setFormData({ ...formData, referenceNo: value })}
            placeholder="Enter reference number"
          />
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items / Services</Text>

          {formData.items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemNumber}>Item {index + 1}</Text>
                {formData.items.length > 1 && (
                  <TouchableOpacity onPress={() => removeItem(index)}>
                    <Text style={styles.removeButton}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={item.description}
                onChangeText={(value) => handleItemChange(index, 'description', value)}
                placeholder="Service description"
                multiline
                numberOfLines={2}
              />

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>SAC Code</Text>
                  <TextInput
                    style={styles.input}
                    value={item.sacCode}
                    onChangeText={(value) => handleItemChange(index, 'sacCode', value)}
                    placeholder="995461"
                  />
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Unit</Text>
                  <TextInput
                    style={styles.input}
                    value={item.unit}
                    onChangeText={(value) => handleItemChange(index, 'unit', value)}
                    placeholder="EA"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Quantity *</Text>
                  <TextInput
                    style={styles.input}
                    value={String(item.quantity)}
                    onChangeText={(value) => handleItemChange(index, 'quantity', value)}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Rate *</Text>
                  <TextInput
                    style={styles.input}
                    value={String(item.rate)}
                    onChangeText={(value) => handleItemChange(index, 'rate', value)}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={styles.amountText}>
                Amount: ₹{item.amount.toFixed(2)}
              </Text>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addItem}>
            <Text style={styles.addButtonText}>+ Add Item</Text>
          </TouchableOpacity>
        </View>

        {/* Totals */}
        <View style={styles.card}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total:</Text>
            <Text style={styles.grandTotalValue}>₹{grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Create Bill</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    backgroundColor: COLORS.primaryBlue,
    padding: 16,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderTopWidth: 3,
    borderTopColor: COLORS.primaryBlue,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkBlue,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  disabledInput: {
    backgroundColor: '#e0e0e0',
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  itemCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkBlue,
  },
  removeButton: {
    color: COLORS.danger,
    fontWeight: '600',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    textAlign: 'right',
    marginTop: 8,
  },
  addButton: {
    backgroundColor: COLORS.darkBlue,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkBlue,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  submitButton: {
    backgroundColor: COLORS.primaryBlue,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: COLORS.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
