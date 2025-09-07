import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform, SafeAreaView, TouchableOpacity, Modal, Pressable, TextInput, Alert } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReportStorage } from '@/utils/reportStorage';
import CampusMap from '@/components/CampusMap';

const { width, height } = Dimensions.get('window');

// Professional color palette inspired by UM Touch
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

export default function HomeScreen() {
  const router = useRouter();
  const [isEmergencyModalVisible, setIsEmergencyModalVisible] = useState(false);
  const [isEmergencyActivated, setIsEmergencyActivated] = useState(false);
  const [emergencyTimer, setEmergencyTimer] = useState(10);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isEmergencyCompleted, setIsEmergencyCompleted] = useState(false);
  const [isSafetyModeActive, setIsSafetyModeActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Timer effect for emergency countdown
  useEffect(() => {
    if (isEmergencyActivated && emergencyTimer > 0) {
      timerRef.current = setTimeout(() => {
        setEmergencyTimer(prev => prev - 1);
      }, 1000);
    } else if (emergencyTimer === 0 && isEmergencyActivated) {
      // Timer reached zero - save emergency report and contact authorities
      handleEmergencyComplete();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isEmergencyActivated, emergencyTimer]);

  const handleEmergencyPress = () => {
    setIsEmergencyModalVisible(true);
  };

  const handleCloseEmergency = () => {
    setIsEmergencyModalVisible(false);
    setIsEmergencyActivated(false);
    setEmergencyTimer(10);
    setIsRecordingAudio(false);
    setIsEmergencyCompleted(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleActivateEmergency = () => {
    setIsEmergencyActivated(true);
    setEmergencyTimer(10);
  };

  const handleCancelEmergency = () => {
    setIsEmergencyActivated(false);
    setEmergencyTimer(10);
    setIsRecordingAudio(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleToggleAudioRecording = () => {
    setIsRecordingAudio(!isRecordingAudio);
    if (!isRecordingAudio) {
      console.log('Audio recording started');
      // Here you would start actual audio recording
    } else {
      console.log('Audio recording stopped');
      // Here you would stop actual audio recording
    }
  };

  const handleEmergencyComplete = async () => {
    try {
      // Create emergency report
      const emergencyReport = {
        id: Date.now().toString(),
        type: 'Emergency SOS',
        description: `Emergency SOS activated and completed. ${isRecordingAudio ? 'Audio recording was enabled.' : 'No audio recording.'}`,
        location: 'Main Campus - Student Union',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        status: 'Emergency Response Initiated',
        icon: 'warning',
        evidence: isRecordingAudio ? ['emergency_audio_recording.mp3'] : [],
      };

      // Save to report storage
      await ReportStorage.addReport(emergencyReport);

      console.log('Emergency report saved:', emergencyReport);

      // Set emergency as completed to show the confirmation message
      setIsEmergencyCompleted(true);

      // In a real app, this would:
      // - Send location to emergency services
      // - Contact campus security
      // - Alert emergency contacts
      // - Start emergency protocols
      
    } catch (error) {
      console.error('Error saving emergency report:', error);
      // Still set as completed even if there was an error saving
      setIsEmergencyCompleted(true);
    }
  };

  const handleReportPress = () => {
    router.push('/report-incident');
  };

  const handleViewReportHistory = () => {
    router.push('/report-history');
  };

  const handleCallEmergency = () => {
    // In a real app, this would make an actual emergency call
    console.log('Emergency call initiated');
  };

  const handleAlertContacts = () => {
    // In a real app, this would alert emergency contacts
    console.log('Emergency contacts alerted');
  };

  const handleToggleSafetyMode = () => {
    setIsSafetyModeActive(!isSafetyModeActive);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.profileSection}>
              <View style={styles.profileIcon}>
                <Ionicons name="person" size={20} color={AppColors.white} />
              </View>
              <View style={styles.profileText}>
                <Text style={styles.welcomeText}>Welcome back</Text>
                <Text style={styles.userName}>ILHAM FAKHRI BIN MOHD FADHIL</Text>
                <Text style={styles.safetyText}>Stay safe today</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={20} color={AppColors.gray[600]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency SOS Button */}
        <View style={styles.emergencySection}>
          <TouchableOpacity style={styles.emergencySOSButton} onPress={handleEmergencyPress}>
            <View style={styles.emergencyIconContainer}>
              <MaterialIcons name="warning" size={28} color={AppColors.white} />
            </View>
            <Text style={styles.emergencySOSText}>Emergency SOS</Text>
          </TouchableOpacity>
        </View>

        {/* Safety Mode */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.safetyModeCard} onPress={handleToggleSafetyMode}>
            <View style={styles.safetyModeContent}>
              <MaterialIcons 
                name="security" 
                size={20} 
                color={isSafetyModeActive ? AppColors.success : AppColors.gray[600]} 
              />
              <View style={styles.safetyModeTextContainer}>
                <Text style={[
                  styles.safetyModeTitle, 
                  isSafetyModeActive && { color: AppColors.success }
                ]}>
                  Safety Mode
                </Text>
                <Text style={[
                  styles.safetyModeSubtitle,
                  isSafetyModeActive && { color: AppColors.success }
                ]}>
                  {isSafetyModeActive ? 'Active - Location shared' : 'Tap to activate'}
                </Text>
              </View>
            </View>
            <View style={[
              styles.toggleSwitch, 
              isSafetyModeActive && styles.toggleSwitchActive
            ]}>
              <View style={[
                styles.toggleKnob, 
                isSafetyModeActive && styles.toggleKnobActive
              ]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* University of Malaya Campus Map */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="map" size={20} color={AppColors.gray[600]} />
            <Text style={styles.currentLocationTitle}>Campus Incident Reports</Text>
          </View>
          <Text style={styles.mapSubtitle}>University of Malaya - Live incident map with filtering</Text>
          <View style={styles.mapContainer}>
            <CampusMap />
          </View>
        </View>

        {/* Quick Access */}
        <View style={styles.section}>
          <Text style={styles.quickAccessTitle}>Quick Access</Text>
          <View style={styles.quickAccessContainer}>
            <TouchableOpacity style={styles.quickAccessItem} onPress={handleReportPress}>
              <MaterialIcons name="report-problem" size={20} color={AppColors.gray[600]} />
              <Text style={styles.quickAccessText}>Report Incident</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAccessItem} onPress={handleViewReportHistory}>
              <Ionicons name="time-outline" size={20} color={AppColors.gray[600]} />
              <Text style={styles.quickAccessText}>View Report History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Emergency Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEmergencyModalVisible}
        onRequestClose={handleCloseEmergency}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.emergencyModal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.emergencyModalHeader}>
                <TouchableOpacity onPress={handleCloseEmergency} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={18} color={AppColors.danger} />
                </TouchableOpacity>
                <Text style={styles.emergencyModalTitle}>Emergency Report</Text>
                <View style={styles.headerSpacer} />
              </View>

              {!isEmergencyActivated ? (
                <>
                  {/* Emergency SOS Card */}
                  <View style={styles.emergencySOSCard}>
                    <View style={styles.emergencyWarningIconContainer}>
                      <MaterialIcons name="warning" size={32} color={AppColors.danger} />
                    </View>
                    <Text style={styles.emergencySOSTitle}>Emergency SOS</Text>
                    <Text style={styles.emergencySOSSubtitle}>Press and hold to activate emergency protocol</Text>
                    
                    <TouchableOpacity 
                      style={styles.emergencySOSButtonModal}
                      onPress={handleActivateEmergency}
                    >
                      <MaterialIcons name="local-hospital" size={24} color={AppColors.white} />
                      <Text style={styles.emergencySOSButtonText}>EMERGENCY</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Location Card */}
                  <View style={styles.locationCardModal}>
                    <View style={styles.locationCardHeader}>
                      <MaterialIcons name="location-on" size={20} color={AppColors.primary} />
                      <Text style={styles.locationCardTitle}>Your Location</Text>
                    </View>
                    <View style={styles.locationDetails}>
                      <Text style={styles.locationNameModal}>Main Campus - Student Union</Text>
                      <Text style={styles.locationCoordinates}>Lat: 40.7829, Lng: -73.9654</Text>
                      <Text style={styles.locationAccuracy}>Accuracy: ±3 meters</Text>
                    </View>
                  </View>

                  {/* Quick Actions */}
                  <View style={styles.quickActionsCard}>
                    <Text style={styles.quickActionsTitle}>Quick Actions</Text>
                    <View style={styles.quickActionButtons}>
                      <TouchableOpacity style={styles.quickActionButton}>
                        <MaterialIcons name="phone" size={24} color={AppColors.danger} />
                        <Text style={styles.quickActionText}>Call 911</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.quickActionButton}>
                        <MaterialIcons name="contacts" size={24} color={AppColors.primary} />
                        <Text style={styles.quickActionText}>Alert Contacts</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  {/* Emergency Activated Card */}
                  {!isEmergencyCompleted ? (
                    <View style={styles.emergencyActivatedCard}>
                      <View style={styles.emergencyActivatedIconContainer}>
                        <MaterialIcons name="warning" size={32} color={AppColors.danger} />
                      </View>
                      <Text style={styles.emergencyActivatedTitle}>Emergency Activated</Text>
                      <Text style={styles.emergencyTimer}>{emergencyTimer}s</Text>
                      <Text style={styles.emergencyActivatedSubtitle}>Authorities will be contacted automatically</Text>
                    </View>
                  ) : (
                    <View style={styles.emergencyCompletedCard}>
                      <View style={styles.emergencyCompletedIconContainer}>
                        <MaterialIcons name="check-circle" size={32} color={AppColors.success} />
                      </View>
                      <Text style={styles.emergencyCompletedTitle}>Authorities Notified</Text>
                      <Text style={styles.emergencyCompletedSubtitle}>
                        Campus security has received your emergency report and is on their way to your location.
                      </Text>
                      <View style={styles.emergencyCompletedActions}>
                        <TouchableOpacity 
                          style={styles.viewReportButton}
                          onPress={() => {
                            handleCloseEmergency();
                            setTimeout(() => {
                              router.push('/report-history');
                            }, 100);
                          }}
                        >
                          <Text style={styles.viewReportButtonText}>View Report</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.closeModalButton}
                          onPress={handleCloseEmergency}
                        >
                          <Text style={styles.closeModalButtonText}>Close</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* Evidence Recording - Only show if emergency is not completed */}
                  {!isEmergencyCompleted && (
                    <View style={styles.evidenceRecordingCard}>
                      <Text style={styles.evidenceRecordingTitle}>Evidence Recording</Text>
                      <View style={styles.evidenceRecordingButtons}>
                        <TouchableOpacity 
                          style={[
                            styles.evidenceRecordingButton,
                            isRecordingAudio && styles.evidenceRecordingButtonActive
                          ]}
                          onPress={handleToggleAudioRecording}
                        >
                          <MaterialIcons 
                            name="mic" 
                            size={20} 
                            color={isRecordingAudio ? AppColors.white : AppColors.gray[600]} 
                          />
                          <Text style={[
                            styles.evidenceRecordingButtonText,
                            isRecordingAudio && styles.evidenceRecordingButtonTextActive
                          ]}>
                            {isRecordingAudio ? 'Stop Recording' : 'Record Audio'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* Live Location Sharing - Only show if emergency is not completed */}
                  {!isEmergencyCompleted && (
                    <View style={styles.liveLocationCard}>
                      <View style={styles.liveLocationHeader}>
                        <Text style={styles.liveLocationTitle}>Live Location Sharing</Text>
                        <View style={styles.liveLocationStatus} />
                      </View>
                      <Text style={styles.liveLocationSubtitle}>Your location is being shared with emergency contacts and campus security</Text>
                    </View>
                  )}

                  {/* Cancel Emergency Button - Only show if emergency is not completed */}
                  {!isEmergencyCompleted && (
                    <TouchableOpacity style={styles.cancelEmergencyButton} onPress={handleCancelEmergency}>
                      <Text style={styles.cancelEmergencyButtonText}>Cancel Emergency Report</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.gray[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: AppColors.white,
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[100],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileIconText: {
    fontSize: 16,
    color: AppColors.white,
  },
  profileText: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray[800],
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.gray[900],
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  safetyText: {
    fontSize: 14,
    color: AppColors.gray[500],
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray[800],
    marginBottom: 16,
    marginLeft: 8,
    letterSpacing: -0.2,
  },
  emergencySection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  emergencySOSButton: {
    backgroundColor: AppColors.danger,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
  },
  emergencyIconContainer: {
    marginRight: 12,
  },
  emergencyWarningIcon: {
    fontSize: 24,
    color: AppColors.white,
    marginBottom: 8,
  },
  emergencySOSText: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.white,
    letterSpacing: -0.3,
    marginTop: 4,
  },
  reportButton: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: AppColors.gray[100],
  },
  reportIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  reportText: {
    fontSize: 16,
    color: AppColors.gray[800],
    fontWeight: '500',
    marginLeft: 12,
    letterSpacing: -0.2,
  },
  safetyModeCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: AppColors.gray[100],
  },
  safetyModeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  safetyModeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  safetyModeTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  safetyModeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray[800],
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  safetyModeSubtitle: {
    fontSize: 14,
    color: AppColors.gray[500],
    letterSpacing: -0.1,
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: AppColors.gray[200],
    justifyContent: 'center',
    alignItems: 'flex-start', // Inactive = knob on the left
    paddingHorizontal: 3,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: AppColors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleSwitchActive: {
    backgroundColor: AppColors.success,
    alignItems: 'flex-end', // Active = knob on the right
  },
  toggleKnobActive: {
    backgroundColor: AppColors.white,
  },
  currentLocationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray[800],
    marginLeft: 8,
    letterSpacing: -0.2,
  },
  mapSubtitle: {
    fontSize: 14,
    color: AppColors.gray[600],
    marginBottom: 16,
    letterSpacing: -0.1,
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: AppColors.gray[100],
  },
  locationCard: {
    backgroundColor: AppColors.gray[50],
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  locationIconContainer: {
    marginBottom: 12,
  },
  locationMapIcon: {
    fontSize: 32,
  },
  locationTextContainer: {
    alignItems: 'center',
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray[800],
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  locationBuilding: {
    fontSize: 14,
    color: AppColors.gray[600],
    letterSpacing: -0.1,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray[800],
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  quickAccessContainer: {
    gap: 12,
  },
  quickAccessItem: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: AppColors.gray[100],
  },
  quickAccessIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  quickAccessText: {
    fontSize: 16,
    color: AppColors.gray[800],
    fontWeight: '500',
    marginLeft: 12,
    letterSpacing: -0.2,
  },
  // Emergency Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  emergencyModal: {
    backgroundColor: AppColors.gray[50],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '85%',
  },
  emergencyModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: AppColors.danger,
    fontWeight: 'bold',
  },
  emergencyModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.danger,
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  emergencySOSCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: AppColors.danger,
  },
  emergencyWarningIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  warningTriangle: {
    fontSize: 32,
    color: AppColors.danger,
  },
  emergencySOSTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.danger,
    marginBottom: 8,
    textAlign: 'center',
  },
  emergencySOSSubtitle: {
    fontSize: 14,
    color: AppColors.gray[600],
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emergencySOSButtonModal: {
    backgroundColor: AppColors.danger,
    borderRadius: 100,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emergencySOSButtonIcon: {
    fontSize: 24,
    color: AppColors.white,
    marginBottom: 4,
  },
  emergencySOSButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppColors.white,
    textAlign: 'center',
  },
  locationCardModal: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIconModal: {
    fontSize: 20,
    marginRight: 8,
  },
  locationCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.gray[800],
  },
  locationDetails: {
    backgroundColor: AppColors.gray[50],
    borderRadius: 8,
    padding: 12,
  },
  locationNameModal: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray[800],
    marginBottom: 4,
  },
  locationCoordinates: {
    fontSize: 12,
    color: AppColors.gray[600],
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  locationAccuracy: {
    fontSize: 12,
    color: AppColors.gray[500],
  },
  quickActionsCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.gray[800],
    marginBottom: 16,
  },
  quickActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: AppColors.gray[50],
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.gray[200],
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.gray[700],
    textAlign: 'center',
  },
  // Report Modal Styles
  reportModal: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '90%',
  },
  reportModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  reportModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.gray[800],
    letterSpacing: -0.2,
  },
  reportSection: {
    marginBottom: 24,
  },
  reportSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray[800],
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  incidentTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  incidentTypeButton: {
    backgroundColor: AppColors.white,
    borderWidth: 2,
    borderColor: AppColors.gray[200],
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 0.48,
    alignItems: 'center',
  },
  incidentTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.gray[700],
    letterSpacing: -0.1,
  },
  evidenceButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  evidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  evidenceCount: {
    fontSize: 12,
    color: AppColors.success,
    fontWeight: '500',
  },
  evidenceButton: {
    flex: 1,
    backgroundColor: AppColors.gray[50],
    borderWidth: 1,
    borderColor: AppColors.gray[200],
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  evidenceButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.gray[700],
    letterSpacing: -0.1,
  },
  descriptionInput: {
    backgroundColor: AppColors.gray[50],
    borderWidth: 1,
    borderColor: AppColors.gray[200],
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: AppColors.gray[800],
    minHeight: 120,
    textAlignVertical: 'top',
  },
  locationTimeCard: {
    backgroundColor: AppColors.gray[50],
    borderRadius: 8,
    padding: 16,
  },
  locationTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTimeText: {
    marginLeft: 12,
    flex: 1,
  },
  locationTimeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray[800],
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  locationTimeSubtitle: {
    fontSize: 12,
    color: AppColors.gray[600],
    letterSpacing: -0.1,
  },
  submitButton: {
    backgroundColor: AppColors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.white,
    letterSpacing: -0.2,
  },
  disclaimer: {
    fontSize: 12,
    color: AppColors.gray[500],
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
  // Emergency Activated Styles
  emergencyActivatedCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: AppColors.danger,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emergencyActivatedIconContainer: {
    marginBottom: 16,
  },
  emergencyActivatedTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: AppColors.danger,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  emergencyTimer: {
    fontSize: 48,
    fontWeight: '700',
    color: AppColors.danger,
    marginBottom: 8,
  },
  emergencyActivatedSubtitle: {
    fontSize: 14,
    color: AppColors.gray[600],
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  evidenceRecordingCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: AppColors.gray[100],
  },
  evidenceRecordingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray[800],
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  evidenceRecordingButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  evidenceRecordingButton: {
    flex: 1,
    backgroundColor: AppColors.gray[50],
    borderWidth: 1,
    borderColor: AppColors.gray[200],
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  evidenceRecordingButtonActive: {
    backgroundColor: AppColors.success,
    borderColor: AppColors.success,
  },
  evidenceRecordingButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.gray[700],
    letterSpacing: -0.1,
  },
  evidenceRecordingButtonTextActive: {
    color: AppColors.white,
  },
  liveLocationCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: AppColors.gray[100],
  },
  liveLocationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  liveLocationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray[800],
    letterSpacing: -0.2,
  },
  liveLocationStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AppColors.success,
  },
  liveLocationSubtitle: {
    fontSize: 14,
    color: AppColors.gray[600],
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  cancelEmergencyButton: {
    backgroundColor: AppColors.warning,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelEmergencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.white,
    letterSpacing: -0.2,
  },
  // Evidence Preview Styles
  evidencePreview: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray[100],
  },
  evidenceImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  evidenceImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: AppColors.gray[100],
  },
  removeEvidenceButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: AppColors.white,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  // Emergency Completed Styles
  emergencyCompletedCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: AppColors.success,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emergencyCompletedIconContainer: {
    marginBottom: 16,
  },
  emergencyCompletedTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: AppColors.success,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  emergencyCompletedSubtitle: {
    fontSize: 16,
    color: AppColors.gray[700],
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: -0.1,
    marginBottom: 24,
  },
  emergencyCompletedActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  viewReportButton: {
    flex: 1,
    backgroundColor: AppColors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewReportButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  closeModalButton: {
    flex: 1,
    backgroundColor: AppColors.gray[100],
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: AppColors.gray[700],
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
