import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { billsAPI } from '../services/api';

// Same theme colors as web app
const COLORS = {
  primaryBlue: '#0ea5e9',
  darkBlue: '#0c4a6e',
  hoverBlue: '#0284c7',
  white: '#ffffff',
  lightGray: '#f4f4f4',
  darkGray: '#383838',
  danger: '#dc3545',
};

export default function DashboardScreen({ navigation }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await billsAPI.getAll();
      setBills(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch bills');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await AsyncStorage.removeItem('adminToken');
            await AsyncStorage.removeItem('adminUser');
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const handleDeleteBill = async (id, billNumber) => {
    Alert.alert(
      'Delete Bill',
      `Are you sure you want to delete Invoice ${billNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await billsAPI.delete(id);
              Alert.alert('Success', 'Bill deleted successfully');
              fetchBills();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete bill');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBills();
  };

  const renderBillItem = ({ item }) => (
    <View style={styles.billCard}>
      <View style={styles.billHeader}>
        <Text style={styles.billNumber}>{item.billNumber}</Text>
        <Text style={styles.billAmount}>
          ₹{item.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <View style={styles.billDetails}>
        <Text style={styles.detailText}>
          Date: {new Date(item.billDate).toLocaleDateString('en-IN')}
        </Text>
        {item.customerWONumber && (
          <Text style={styles.detailText}>WO: {item.customerWONumber}</Text>
        )}
        {item.projectName && (
          <Text style={styles.detailText}>Project: {item.projectName}</Text>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.viewButton]}
          onPress={() => navigation.navigate('BillDetails', { billId: item._id })}
        >
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDeleteBill(item._id, item.billNumber)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Bills / Invoices</Text>
          <Text style={styles.headerSubtitle}>AC Billing Admin</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Create Bill Button */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateBill')}
        >
          <Text style={styles.createButtonText}>+ Create Bill</Text>
        </TouchableOpacity>
      </View>

      {/* Bills List */}
      <FlatList
        data={bills}
        renderItem={renderBillItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primaryBlue]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bills found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  header: {
    backgroundColor: COLORS.primaryBlue,
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: COLORS.darkBlue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  actionBar: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  createButton: {
    backgroundColor: COLORS.primaryBlue,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  billCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderTopWidth: 3,
    borderTopColor: COLORS.primaryBlue,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  billNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkBlue,
  },
  billAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  billDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: COLORS.primaryBlue,
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
