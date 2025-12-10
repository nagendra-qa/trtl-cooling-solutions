import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { billsAPI } from '../services/api';
import * as FileSystem from 'expo-file-system';

// Same theme colors as web app
const COLORS = {
  primaryBlue: '#0ea5e9',
  darkBlue: '#0c4a6e',
  white: '#ffffff',
  lightGray: '#f4f4f4',
  darkGray: '#383838',
};

export default function BillDetailsScreen({ route, navigation }) {
  const { billId } = route.params;
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  useEffect(() => {
    fetchBillDetails();
  }, []);

  const fetchBillDetails = async () => {
    try {
      const response = await billsAPI.getById(billId);
      setBill(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch bill details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloadingPDF(true);
    try {
      const response = await billsAPI.downloadPDF(billId);

      // Create file path in the document directory
      const fileUri = FileSystem.documentDirectory + `Invoice-${bill.billNumber}.pdf`;

      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];

        // Write the file
        await FileSystem.writeAsStringAsync(fileUri, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        Alert.alert(
          'Success',
          'PDF downloaded successfully!',
          [
            {
              text: 'Open',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  FileSystem.getContentUriAsync(fileUri).then(cUri => {
                    Linking.openURL(cUri);
                  });
                } else {
                  Linking.openURL(fileUri);
                }
              }
            },
            { text: 'OK' }
          ]
        );
      };
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download PDF');
    } finally {
      setDownloadingPDF(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryBlue} />
      </View>
    );
  }

  if (!bill) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill Details</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Invoice Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Invoice Information</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Invoice Number:</Text>
            <Text style={styles.value}>{bill.billNumber}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>
              {new Date(bill.billDate).toLocaleDateString('en-IN')}
            </Text>
          </View>

          {bill.customerWONumber && (
            <View style={styles.row}>
              <Text style={styles.label}>Work Order:</Text>
              <Text style={styles.value}>{bill.customerWONumber}</Text>
            </View>
          )}

          {bill.customerWODate && (
            <View style={styles.row}>
              <Text style={styles.label}>WO Date:</Text>
              <Text style={styles.value}>
                {new Date(bill.customerWODate).toLocaleDateString('en-IN')}
              </Text>
            </View>
          )}

          {bill.projectName && (
            <View style={styles.row}>
              <Text style={styles.label}>Project:</Text>
              <Text style={styles.value}>{bill.projectName}</Text>
            </View>
          )}

          {bill.referenceNo && (
            <View style={styles.row}>
              <Text style={styles.label}>Reference:</Text>
              <Text style={styles.value}>{bill.referenceNo}</Text>
            </View>
          )}
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items / Services</Text>

          {bill.items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <Text style={styles.itemTitle}>
                {index + 1}. {item.description}
              </Text>

              <View style={styles.itemDetails}>
                {item.sacCode && (
                  <Text style={styles.itemText}>SAC: {item.sacCode}</Text>
                )}
                <Text style={styles.itemText}>
                  Qty: {item.quantity} {item.unit || 'EA'}
                </Text>
                <Text style={styles.itemText}>
                  Rate: ₹{item.rate.toFixed(2)}
                </Text>
              </View>

              <Text style={styles.itemAmount}>
                Amount: ₹{item.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.card}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>
              ₹{bill.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total:</Text>
            <Text style={styles.grandTotalValue}>
              ₹{bill.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          {bill.amountInWords && (
            <View style={styles.wordsContainer}>
              <Text style={styles.wordsLabel}>Amount in Words:</Text>
              <Text style={styles.wordsText}>{bill.amountInWords}</Text>
            </View>
          )}
        </View>

        {/* Payment Terms */}
        {bill.paymentTerms && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Payment Terms</Text>
            <Text style={styles.infoText}>{bill.paymentTerms}</Text>
          </View>
        )}

        {/* Download PDF Button */}
        <TouchableOpacity
          style={[styles.downloadButton, downloadingPDF && styles.buttonDisabled]}
          onPress={handleDownloadPDF}
          disabled={downloadingPDF}
        >
          {downloadingPDF ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.downloadButtonText}>📥 Download PDF</Text>
            </>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  itemCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkBlue,
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  grandTotalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkBlue,
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  wordsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  wordsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  wordsText: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontStyle: 'italic',
  },
  infoText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  downloadButton: {
    backgroundColor: COLORS.primaryBlue,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
    shadowColor: COLORS.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  downloadButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
});
