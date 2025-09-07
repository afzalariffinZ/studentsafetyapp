import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export default function ReportIncidentScreen() {
  const router = useRouter();
  const [selectedIncidentType, setSelectedIncidentType] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [reportEvidence, setReportEvidence] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTakePhoto = async () => {
    try {
      // Request camera permissions
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      if (cameraPermission.status !== 'granted') {
        Alert.alert(
          "Camera Permission Required",
          "Please enable camera permissions in your device settings to take photos."
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        setReportEvidence([...reportEvidence, photoUri]);
        Alert.alert("Success", "Photo captured and added to evidence!");
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const handleUploadImage = async () => {
    try {
      // Request media library permissions
      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (libraryPermission.status !== 'granted') {
        Alert.alert(
          "Photo Library Permission Required",
          "Please enable photo library permissions in your device settings to upload images."
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setReportEvidence([...reportEvidence, imageUri]);
        Alert.alert("Success", "Image uploaded and added to evidence!");
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedIncidentType) {
      Alert.alert("Incomplete Form", "Please select an incident type.");
      return;
    }

    if (!incidentDescription.trim()) {
      Alert.alert("Incomplete Form", "Please provide an incident description.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate brief processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newReport = {
        id: Date.now().toString(),
        type: selectedIncidentType,
        description: incidentDescription,
        location: 'Main Campus - Student Union',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        status: 'Under Review',
        icon: selectedIncidentType === 'Safety Concern' ? 'warning' : 
              selectedIncidentType === 'Property Damage' ? 'build' :
              selectedIncidentType === 'Harassment' ? 'person-remove' : 'report',
        evidence: reportEvidence,
      };

      await ReportStorage.addReport(newReport);
      
      // Clear the form
      setSelectedIncidentType('');
      setIncidentDescription('');
      setReportEvidence([]);

      // Show success message
      Alert.alert(
        "✅ Report Successfully Sent!",
        `Your ${selectedIncidentType.toLowerCase()} report has been submitted and sent to Campus Security.\n\n📍 Location: Main Campus - Student Union\n⏰ Time: ${new Date().toLocaleString()}\n\n🔍 Status: Under Review\n\nYou will be notified of any updates. Thank you for helping keep our campus safe!`,
        [
          {
            text: "View My Reports",
            onPress: () => {
              router.replace('/report-history');
            }
          },
          {
            text: "Back to Home",
            onPress: () => router.back(),
            style: "cancel"
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert("Error", "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={AppColors.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Incident</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Incident Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Incident Type</Text>
          <View style={styles.incidentTypeGrid}>
            {[
              { type: 'Safety Concern', color: AppColors.warning },
              { type: 'Property Damage', color: AppColors.danger },
              { type: 'Harassment', color: AppColors.accent },
              { type: 'Other', color: AppColors.gray[600] }
            ].map((item) => (
              <TouchableOpacity
                key={item.type}
                style={[
                  styles.incidentTypeButton,
                  selectedIncidentType === item.type && { 
                    backgroundColor: item.color,
                    borderColor: item.color 
                  }
                ]}
                onPress={() => setSelectedIncidentType(item.type)}
              >
                <Text style={[
                  styles.incidentTypeText,
                  selectedIncidentType === item.type && { color: AppColors.white }
                ]}>
                  {item.type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Evidence */}
        <View style={styles.section}>
          <View style={styles.evidenceHeader}>
            <Text style={styles.sectionTitle}>Add Evidence (Optional)</Text>
            {reportEvidence.length > 0 && (
              <Text style={styles.evidenceCount}>
                {reportEvidence.length} file{reportEvidence.length !== 1 ? 's' : ''} added
              </Text>
            )}
          </View>
          <View style={styles.evidenceButtons}>
            <TouchableOpacity style={styles.evidenceButton} onPress={handleTakePhoto}>
              <MaterialIcons name="camera-alt" size={20} color={AppColors.gray[600]} />
              <Text style={styles.evidenceButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.evidenceButton} onPress={handleUploadImage}>
              <MaterialIcons name="upload" size={20} color={AppColors.gray[600]} />
              <Text style={styles.evidenceButtonText}>Upload Image</Text>
            </TouchableOpacity>
          </View>
          
          {/* Display added evidence */}
          {reportEvidence.length > 0 && (
            <View style={styles.evidencePreview}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {reportEvidence.map((imageUri, index) => (
                  <View key={index} style={styles.evidenceImageContainer}>
                    <Image 
                      source={{ uri: imageUri }} 
                      style={styles.evidenceImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity 
                      style={styles.removeEvidenceButton}
                      onPress={() => setReportEvidence(reportEvidence.filter((_, i) => i !== index))}
                    >
                      <Ionicons name="close-circle" size={18} color={AppColors.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Incident Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Incident Description</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Please describe what happened..."
            value={incidentDescription}
            onChangeText={setIncidentDescription}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Location & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location & Time</Text>
          <View style={styles.locationTimeCard}>
            <View style={styles.locationTimeItem}>
              <MaterialIcons name="location-on" size={20} color={AppColors.primary} />
              <View style={styles.locationTimeText}>
                <Text style={styles.locationTimeTitle}>Main Campus - Student Union</Text>
                <Text style={styles.locationTimeSubtitle}>Current Location</Text>
              </View>
            </View>
            <View style={styles.locationTimeItem}>
              <MaterialIcons name="access-time" size={20} color={AppColors.primary} />
              <View style={styles.locationTimeText}>
                <Text style={styles.locationTimeTitle}>{new Date().toLocaleDateString()}, {new Date().toLocaleTimeString()}</Text>
                <Text style={styles.locationTimeSubtitle}>Current Time</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
          onPress={handleSubmitReport}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "📤 Sending Report..." : "Submit Report"}
          </Text>
        </TouchableOpacity>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          This report will be submitted anonymously to campus security for review.
        </Text>

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
  incidentTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  incidentTypeButton: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.gray[200],
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  incidentTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.gray[700],
    letterSpacing: -0.1,
  },
  evidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  evidenceCount: {
    fontSize: 12,
    color: AppColors.gray[500],
    letterSpacing: -0.1,
  },
  evidenceButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  evidenceButton: {
    flex: 1,
    backgroundColor: AppColors.white,
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
  descriptionInput: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: AppColors.gray[700],
    minHeight: 100,
  },
  locationTimeCard: {
    backgroundColor: AppColors.white,
    borderRadius: 8,
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
  submitButton: {
    backgroundColor: AppColors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.white,
    letterSpacing: -0.2,
  },
  submitButtonDisabled: {
    backgroundColor: AppColors.gray[400],
    opacity: 0.8,
  },
  disclaimer: {
    fontSize: 12,
    color: AppColors.gray[500],
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 40,
    marginTop: 16,
  },
});
