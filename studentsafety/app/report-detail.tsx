import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ReportStorage } from '@/utils/reportStorage';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

// Professional color palette
const AppColors = {
  primary: '#1e3a8a',
  secondary: '#0f172a',
  accent: '#3b82f6',
  success: '#059669',
  warning: '#d97706',
  danger: '#dc2626',
  white: '#ffffff',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

export default function ReportDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isEscalationModalVisible, setIsEscalationModalVisible] = useState(false);
  const [escalationDescription, setEscalationDescription] = useState('');
  const [escalationEvidence, setEscalationEvidence] = useState<string[]>([]);
  const [isSubmittingEscalation, setIsSubmittingEscalation] = useState(false);
  
  // Parse the report data from params
  let report = null;
  try {
    if (params.report) {
      report = JSON.parse(params.report as string);
    }
  } catch (error) {
    console.error('Error parsing report data:', error);
  }

  const handleGoBack = () => {
    router.back();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return AppColors.success;
      case 'under review':
        return AppColors.warning;
      case 'in progress':
        return AppColors.accent;
      default:
        return AppColors.gray[600];
    }
  };

  const getReportIcon = (type: string) => {
    if (type.includes('Emergency')) return 'warning';
    if (type.includes('Safety')) return 'shield-checkmark';
    if (type.includes('Property')) return 'build';
    if (type.includes('Harassment')) return 'person-remove';
    return 'document-text';
  };

  const handleEscalateReport = () => {
    setIsEscalationModalVisible(true);
  };

  const handleTakePhoto = async () => {
    try {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      if (cameraPermission.status !== 'granted') {
        Alert.alert(
          "Camera Permission Required",
          "Please enable camera permissions to take photos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const mediaUri = result.assets[0].uri;
        setEscalationEvidence([...escalationEvidence, mediaUri]);
        Alert.alert("Success", "Media captured and added to evidence!");
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const handleUploadMedia = async () => {
    try {
      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (libraryPermission.status !== 'granted') {
        Alert.alert(
          "Media Library Permission Required",
          "Please enable media library permissions to upload files."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const mediaUri = result.assets[0].uri;
        setEscalationEvidence([...escalationEvidence, mediaUri]);
        Alert.alert("Success", "Media uploaded and added to evidence!");
      }
    } catch (error) {
      console.error('Media picker error:', error);
      Alert.alert("Error", "Failed to upload media. Please try again.");
    }
  };

  const handleSubmitEscalation = async () => {
    if (!escalationDescription.trim()) {
      Alert.alert("Incomplete Form", "Please provide a reason for escalation.");
      return;
    }

    setIsSubmittingEscalation(true);

    try {
      // Update the original report status to "Escalated"
      const updatedReport = {
        ...report,
        status: 'Escalated',
        escalation: {
          reason: escalationDescription.trim(),
          evidence: escalationEvidence,
          escalatedDate: new Date().toLocaleDateString(),
          escalatedTime: new Date().toLocaleTimeString(),
        }
      };

      // Update the report in storage
      await ReportStorage.updateReportStatus(report.id, 'Escalated', updatedReport);

      // Clear form
      setEscalationDescription('');
      setEscalationEvidence([]);
      setIsEscalationModalVisible(false);

      // Show success message
      Alert.alert(
        "✅ Case Escalated Successfully",
        "Your case has been escalated to higher authorities. You will be contacted within 24-48 hours for further review.\n\n📋 Escalation ID: #ESC-" + report.id,
        [
          {
            text: "Back to Reports",
            onPress: () => router.replace('/report-history')
          },
          {
            text: "OK",
            onPress: () => router.back(),
            style: "cancel"
          }
        ]
      );
    } catch (error) {
      console.error('Error escalating report:', error);
      Alert.alert("Error", "Failed to escalate case. Please try again.");
    } finally {
      setIsSubmittingEscalation(false);
    }
  };

  if (!report) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={AppColors.gray[800]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Details</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={AppColors.gray[400]} />
          <Text style={styles.errorText}>Report not found</Text>
          <TouchableOpacity style={styles.backHomeButton} onPress={handleGoBack}>
            <Text style={styles.backHomeButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={AppColors.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Report Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Type</Text>
          <View style={styles.typeCard}>
            <View style={styles.typeIconContainer}>
              <MaterialIcons 
                name={getReportIcon(report.type) as any} 
                size={24} 
                color={report.type.includes('Emergency') ? AppColors.danger : AppColors.accent} 
              />
            </View>
            <View style={styles.typeContent}>
              <Text style={styles.typeTitle}>{report.type}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                <Text style={styles.statusText}>Status: {report.status}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>
              {report.description || 'No description provided.'}
            </Text>
          </View>
        </View>

        {/* Escalation Details - Only show if case has been escalated */}
        {report.status.toLowerCase() === 'escalated' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Escalation Details</Text>
            <View style={styles.escalationDetailsCard}>
              <View style={styles.escalationDetailsHeader}>
                <MaterialIcons name="trending-up" size={20} color={AppColors.warning} />
                <Text style={styles.escalationDetailsTitle}>Case Escalated</Text>
              </View>
              <View style={styles.escalationDetailsContent}>
                <Text style={styles.escalationDetailsText}>
                  This case has been escalated to higher authorities for further review. 
                  You will be contacted within 24-48 hours for any additional information needed.
                </Text>
                
                {/* Escalation Information */}
                {report.escalation && (
                  <View style={styles.escalationInfoContainer}>
                    <View style={styles.escalationInfoItem}>
                      <Text style={styles.escalationInfoLabel}>Escalated on:</Text>
                      <Text style={styles.escalationInfoValue}>
                        {report.escalation.escalatedDate} at {report.escalation.escalatedTime}
                      </Text>
                    </View>
                    
                    <View style={styles.escalationInfoItem}>
                      <Text style={styles.escalationInfoLabel}>Escalation ID:</Text>
                      <Text style={styles.escalationInfoValue}>#ESC-{report.id}</Text>
                    </View>
                  </View>
                )}

                {/* User's Reason for Escalation */}
                {(report.escalationReason || (report.escalation && report.escalation.reason)) && (
                  <View style={styles.escalationReasonContainer}>
                    <Text style={styles.escalationReasonLabel}>Reason for Escalation:</Text>
                    <Text style={styles.escalationReasonText}>
                      {report.escalationReason || report.escalation.reason}
                    </Text>
                  </View>
                )}

                {/* Additional Evidence */}
                {report.escalation && report.escalation.evidence && report.escalation.evidence.length > 0 && (
                  <View style={styles.escalationEvidenceContainer}>
                    <Text style={styles.escalationEvidenceLabel}>Additional Evidence:</Text>
                    <View style={styles.escalationEvidenceInfo}>
                      <MaterialIcons name="attachment" size={16} color={AppColors.primary} />
                      <Text style={styles.escalationEvidenceText}>
                        {report.escalation.evidence.length} file{report.escalation.evidence.length !== 1 ? 's' : ''} attached
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Location & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location & Time</Text>
          <View style={styles.locationTimeCard}>
            <View style={styles.locationTimeItem}>
              <MaterialIcons name="location-on" size={20} color={AppColors.primary} />
              <View style={styles.locationTimeText}>
                <Text style={styles.locationTimeTitle}>{report.location}</Text>
                <Text style={styles.locationTimeSubtitle}>Incident Location</Text>
              </View>
            </View>
            <View style={styles.locationTimeItem}>
              <MaterialIcons name="access-time" size={20} color={AppColors.primary} />
              <View style={styles.locationTimeText}>
                <Text style={styles.locationTimeTitle}>{report.date}, {report.time}</Text>
                <Text style={styles.locationTimeSubtitle}>Reported Time</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Evidence */}
        {report.evidence && report.evidence.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Evidence</Text>
            <View style={styles.evidenceCard}>
              <MaterialIcons name="photo" size={20} color={AppColors.primary} />
              <View style={styles.evidenceContent}>
                <Text style={styles.evidenceTitle}>
                  {report.evidence.length} file{report.evidence.length !== 1 ? 's' : ''} attached
                </Text>
                <Text style={styles.evidenceSubtitle}>Photos and documents</Text>
              </View>
            </View>
          </View>
        )}

        {/* Report ID */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Report ID:</Text>
              <Text style={styles.infoValue}>#{report.id}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Submitted:</Text>
              <Text style={styles.infoValue}>{report.date} at {report.time}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Current Status:</Text>
              <Text style={[styles.infoValue, { color: getStatusColor(report.status) }]}>
                {report.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Escalation Button - Only show for resolved cases */}
        {report.status.toLowerCase() === 'resolved' && (
          <View style={styles.section}>
            <View style={styles.escalationCard}>
              <View style={styles.escalationContent}>
                <MaterialIcons name="trending-up" size={20} color={AppColors.warning} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.escalationTitle}>Not satisfied with the resolution?</Text>
                  <Text style={styles.escalationText}>
                    You can escalate this case to higher authorities for further review.
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.escalateButton} onPress={handleEscalateReport}>
                <MaterialIcons name="arrow-upward" size={16} color={AppColors.white} />
                <Text style={styles.escalateButtonText}>Escalate Case</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Contact Information */}
        <View style={styles.section}>
          <View style={styles.contactCard}>
            <MaterialIcons name="info-outline" size={20} color={AppColors.accent} />
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Need help?</Text>
              <Text style={styles.contactText}>
                If you have questions about this report, contact Campus Security at (03) 7967-3200 or visit the Security Office.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Escalation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEscalationModalVisible}
        onRequestClose={() => setIsEscalationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.escalationModal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setIsEscalationModalVisible(false)} 
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={18} color={AppColors.gray[600]} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Escalate Case</Text>
                <View style={styles.headerSpacer} />
              </View>

              {/* Reason */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Reason for Escalation</Text>
                <TextInput
                  style={styles.reasonInput}
                  placeholder="Please explain why you are not satisfied with the current resolution and want to escalate this case..."
                  placeholderTextColor={AppColors.gray[400]}
                  value={escalationDescription}
                  onChangeText={setEscalationDescription}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Add Evidence */}
              <View style={styles.modalSection}>
                <View style={styles.evidenceHeader}>
                  <Text style={styles.modalSectionTitle}>Additional Evidence (Optional)</Text>
                  {escalationEvidence.length > 0 && (
                    <Text style={styles.evidenceCount}>
                      {escalationEvidence.length} file{escalationEvidence.length !== 1 ? 's' : ''} added
                    </Text>
                  )}
                </View>
                <View style={styles.evidenceButtons}>
                  <TouchableOpacity style={styles.evidenceButton} onPress={handleTakePhoto}>
                    <MaterialIcons name="camera-alt" size={20} color={AppColors.gray[600]} />
                    <Text style={styles.evidenceButtonText}>Take Photo/Video</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.evidenceButton} onPress={handleUploadMedia}>
                    <MaterialIcons name="upload" size={20} color={AppColors.gray[600]} />
                    <Text style={styles.evidenceButtonText}>Upload Media</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Display added evidence */}
                {escalationEvidence.length > 0 && (
                  <View style={styles.evidencePreview}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {escalationEvidence.map((mediaUri, index) => (
                        <View key={index} style={styles.evidenceImageContainer}>
                          <Image 
                            source={{ uri: mediaUri }} 
                            style={styles.evidenceImage}
                            resizeMode="cover"
                          />
                          <TouchableOpacity 
                            style={styles.removeEvidenceButton}
                            onPress={() => setEscalationEvidence(escalationEvidence.filter((_, i) => i !== index))}
                          >
                            <Ionicons name="close-circle" size={18} color={AppColors.danger} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity 
                style={[styles.submitEscalationButton, isSubmittingEscalation && styles.submitButtonDisabled]} 
                onPress={handleSubmitEscalation}
                disabled={isSubmittingEscalation}
              >
                <Text style={styles.submitEscalationButtonText}>
                  {isSubmittingEscalation ? "📤 Escalating Case..." : "Submit Escalation"}
                </Text>
              </TouchableOpacity>

              {/* Disclaimer */}
              <Text style={styles.escalationDisclaimer}>
                Your escalation will be reviewed by senior management within 24-48 hours. You will be contacted for any additional information needed.
              </Text>
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
  header: {
    backgroundColor: AppColors.white,
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[100],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.gray[800],
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray[800],
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  typeCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.gray[100],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeContent: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray[800],
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: AppColors.white,
    letterSpacing: -0.1,
  },
  descriptionCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.gray[100],
  },
  descriptionText: {
    fontSize: 14,
    color: AppColors.gray[700],
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  locationTimeCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.gray[100],
    gap: 12,
  },
  locationTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationTimeText: {
    flex: 1,
  },
  locationTimeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.gray[800],
    letterSpacing: -0.1,
  },
  locationTimeSubtitle: {
    fontSize: 12,
    color: AppColors.gray[600],
    letterSpacing: -0.1,
  },
  evidenceCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.gray[100],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  evidenceContent: {
    flex: 1,
  },
  evidenceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.gray[800],
    letterSpacing: -0.1,
  },
  evidenceSubtitle: {
    fontSize: 12,
    color: AppColors.gray[600],
    letterSpacing: -0.1,
  },
  infoCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.gray[100],
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: AppColors.gray[600],
    letterSpacing: -0.1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.gray[800],
    letterSpacing: -0.1,
  },
  contactCard: {
    backgroundColor: AppColors.accent + '10',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.accent + '20',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.accent,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  contactText: {
    fontSize: 13,
    color: AppColors.gray[700],
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: AppColors.gray[600],
    marginTop: 16,
    marginBottom: 24,
  },
  backHomeButton: {
    backgroundColor: AppColors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backHomeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.white,
  },
  escalationCard: {
    backgroundColor: AppColors.warning + '10',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.warning + '20',
  },
  escalationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  escalationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.warning,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  escalationText: {
    fontSize: 13,
    color: AppColors.gray[700],
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  escalateButton: {
    backgroundColor: AppColors.warning,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  escalateButtonText: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  // Escalation Details Styles
  escalationDetailsCard: {
    backgroundColor: AppColors.warning + '08',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.warning + '30',
  },
  escalationDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  escalationDetailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.warning,
    marginLeft: 8,
    letterSpacing: -0.1,
  },
  escalationDetailsContent: {
    paddingLeft: 4,
  },
  escalationDetailsText: {
    fontSize: 14,
    color: AppColors.gray[700],
    lineHeight: 20,
    letterSpacing: -0.1,
    marginBottom: 12,
  },
  escalationReasonContainer: {
    backgroundColor: AppColors.gray[50],
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: AppColors.gray[200],
  },
  escalationReasonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.gray[600],
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  escalationReasonText: {
    fontSize: 14,
    color: AppColors.gray[800],
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  // Escalation Info Styles
  escalationInfoContainer: {
    marginBottom: 16,
  },
  escalationInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[100],
  },
  escalationInfoLabel: {
    fontSize: 14,
    color: AppColors.gray[600],
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  escalationInfoValue: {
    fontSize: 14,
    color: AppColors.gray[800],
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  // Escalation Evidence Styles
  escalationEvidenceContainer: {
    marginTop: 12,
  },
  escalationEvidenceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.gray[600],
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  escalationEvidenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  escalationEvidenceText: {
    fontSize: 13,
    color: AppColors.primary,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  escalationModal: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[100],
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.gray[900],
    flex: 1,
    textAlign: 'center',
  },
  modalSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray[900],
    marginBottom: 12,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: AppColors.gray[300],
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: AppColors.gray[900],
    minHeight: 120,
    backgroundColor: AppColors.gray[50],
  },
  evidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  evidenceCount: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '600',
  },
  evidenceButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  evidenceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: AppColors.gray[300],
    borderRadius: 8,
    backgroundColor: AppColors.white,
    gap: 8,
  },
  evidenceButtonText: {
    fontSize: 14,
    color: AppColors.gray[600],
    fontWeight: '500',
  },
  evidencePreview: {
    marginTop: 8,
  },
  evidenceImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  evidenceImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeEvidenceButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: AppColors.white,
    borderRadius: 12,
  },
  submitEscalationButton: {
    backgroundColor: AppColors.danger,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitEscalationButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  escalationDisclaimer: {
    fontSize: 12,
    color: AppColors.gray[500],
    textAlign: 'center',
    lineHeight: 18,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 32,
  },
});
