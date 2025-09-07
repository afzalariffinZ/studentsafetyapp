import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BrandColors } from '@/constants/Colors';

interface WebMapProps {
  style?: any;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export default function WebMap({ style, initialRegion }: WebMapProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.locationIcon}>📍</Text>
        <Text style={styles.locationText}>Universiti Malaya</Text>
        <Text style={styles.coordinatesText}>
          {initialRegion?.latitude.toFixed(4)}, {initialRegion?.longitude.toFixed(4)}
        </Text>
        <Text style={styles.noteText}>Map view available on mobile devices</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BrandColors.lightBlue,
    borderRadius: 15,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  locationIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BrandColors.blue,
    marginBottom: 5,
  },
  coordinatesText: {
    fontSize: 14,
    color: BrandColors.gray,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 12,
    color: BrandColors.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
