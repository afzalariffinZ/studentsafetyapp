import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ReportStorage } from '@/utils/reportStorage';

const { width } = Dimensions.get('window');

// Professional color palette (matching the main app)
const AppColors = {
  primary: '#1e3a8a', // Deep blue
  secondary: '#0f172a', // Navy
  accent: '#3b82f6', // Blue
  success: '#059669', // Green
  warning: '#d97706', // Orange
  danger: '#dc2626', // Red
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Resolved':
      return AppColors.success;
    case 'In Progress':
      return AppColors.accent;
    case 'Under Review':
      return AppColors.warning;
    default:
      return AppColors.gray[500];
  }
};

const getStatusBadgeStyle = (status: string) => {
  return {
    backgroundColor: getStatusColor(status),
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  };
};

export default function ReportHistoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All Reports');
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0 });

  const tabs = ['All Reports', 'Emergency', 'Incidents'];

  const loadReports = useCallback(() => {
    const allReports = ReportStorage.getAllReports();
    const reportStats = ReportStorage.getStats();
    setReports(allReports);
    setStats(reportStats);
  }, []);

  // Load reports when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [loadReports])
  );

  const filterReports = (tab: string) => {
    if (tab === 'Emergency') {
      return reports.filter(report => report.type.includes('Emergency'));
    }
    if (tab === 'Incidents') {
      return reports.filter(report => !report.type.includes('Emergency'));
    }
    return reports;
  };

  const filteredReports = filterReports(activeTab);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={AppColors.gray[800]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report History</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Reports List */}
        <View style={styles.reportsList}>
          {filteredReports.map((report) => (
            <TouchableOpacity 
              key={report.id} 
              style={styles.reportCard}
              onPress={() => router.push({
                pathname: '/report-detail',
                params: { report: JSON.stringify(report) }
              })}
              activeOpacity={0.7}
            >
              <View style={styles.reportHeader}>
                <View style={styles.reportIconContainer}>
                  <MaterialIcons 
                    name={report.icon as any} 
                    size={24} 
                    color={report.type.includes('Emergency') ? AppColors.danger : AppColors.accent} 
                  />
                </View>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportType}>{report.type}</Text>
                  <Text style={styles.reportLocation}>{report.location}</Text>
                </View>
                <View style={getStatusBadgeStyle(report.status)}>
                  <Text style={styles.statusText}>{report.status}</Text>
                </View>
              </View>
              <View style={styles.reportFooter}>
                <Text style={styles.reportDate}>{report.date}</Text>
                <Text style={styles.reportTime}>{report.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Reports</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: AppColors.success }]}>{stats.resolved}</Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: AppColors.accent }]}>{stats.pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.gray[50],
  },
  header: {
    backgroundColor: AppColors.white,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[100],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.gray[800],
    letterSpacing: -0.2,
  },
  headerSpacer: {
    width: 40,
  },
  tabContainer: {
    backgroundColor: AppColors.white,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[100],
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: AppColors.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.gray[600],
    letterSpacing: -0.1,
  },
  activeTabText: {
    color: AppColors.accent,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  reportsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  reportCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: AppColors.gray[100],
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportIconContainer: {
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportType: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray[800],
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  reportLocation: {
    fontSize: 14,
    color: AppColors.gray[600],
    letterSpacing: -0.1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.white,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportDate: {
    fontSize: 12,
    color: AppColors.gray[500],
    letterSpacing: -0.1,
  },
  reportTime: {
    fontSize: 12,
    color: AppColors.gray[500],
    letterSpacing: -0.1,
  },
  summaryContainer: {
    backgroundColor: AppColors.white,
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: AppColors.gray[100],
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray[800],
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.gray[800],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: AppColors.gray[600],
    textAlign: 'center',
    letterSpacing: -0.1,
  },
});
