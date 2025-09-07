import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

interface Incident {
  id: string;
  latitude: number;
  longitude: number;
  type: 'emergency' | 'non-emergency';
  title: string;
  description: string;
  timestamp: string;
}

const SAMPLE_INCIDENTS: Incident[] = [
  {
    id: '1',
    latitude: 3.1211,
    longitude: 101.6536,
    type: 'emergency',
    title: 'Medical Emergency',
    description: 'Student collapsed near library',
    timestamp: '2025-09-07T10:30:00Z'
  },
  {
    id: '2',
    latitude: 3.1225,
    longitude: 101.6542,
    type: 'non-emergency',
    title: 'Maintenance Issue',
    description: 'Broken light in parking lot',
    timestamp: '2025-09-07T09:15:00Z'
  },
  {
    id: '3',
    latitude: 3.1198,
    longitude: 101.6528,
    type: 'emergency',
    title: 'Security Alert',
    description: 'Suspicious activity reported',
    timestamp: '2025-09-07T11:45:00Z'
  },
  {
    id: '4',
    latitude: 3.1234,
    longitude: 101.6555,
    type: 'non-emergency',
    title: 'Lost & Found',
    description: 'Student ID card found',
    timestamp: '2025-09-07T08:20:00Z'
  },
  {
    id: '5',
    latitude: 3.1189,
    longitude: 101.6515,
    type: 'emergency',
    title: 'Fire Alarm',
    description: 'Smoke detected in building',
    timestamp: '2025-09-07T12:10:00Z'
  }
];

export default function CampusMap() {
  const [incidents, setIncidents] = useState<Incident[]>(SAMPLE_INCIDENTS);
  const [filter, setFilter] = useState<'all' | 'emergency' | 'non-emergency'>('all');
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    // Force map re-render when filter changes
    setMapKey(prev => prev + 1);
  }, [filter, userLocation]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location Permission', 'Location permission is needed to show your position on the map. Using default campus view.');
        // Set a default location near UM campus for demo
        setUserLocation({
          latitude: 3.1215,
          longitude: 101.6540,
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(userCoords);
      console.log('User location obtained:', userCoords);
    } catch (error) {
      console.error('Error getting location:', error);
      // Use a default location near UM for demo
      setUserLocation({
        latitude: 3.1215,
        longitude: 101.6540,
      });
      Alert.alert('Location Info', 'Using campus demo location. For real location, please enable GPS and grant permissions.');
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'all') return true;
    return incident.type === filter;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    });
  };

  // Create HTML for the map
  const createMapHTML = () => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
            body { 
                margin: 0; 
                padding: 0; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            #map { 
                height: 100vh; 
                width: 100%; 
            }
            .leaflet-popup-content {
                font-size: 14px;
                line-height: 1.4;
                margin: 8px 0;
            }
            .popup-title {
                font-weight: 600;
                color: #1e3a8a;
                margin-bottom: 4px;
                font-size: 14px;
            }
            .popup-description {
                color: #64748b;
                margin-bottom: 6px;
                font-size: 13px;
            }
            .popup-time {
                font-size: 11px;
                color: #94a3b8;
                font-style: italic;
            }
            .user-location-marker {
                background: #007AFF;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 3px 10px rgba(0,123,255,0.4);
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.7; }
                100% { transform: scale(1); opacity: 1; }
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            // Initialize map centered on University of Malaya with minimal controls
            var map = L.map('map', {
                attributionControl: false,
                zoomControl: false
            }).setView([3.1211, 101.6536], 16);
            
            // Use satellite imagery
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                maxZoom: 19
            }).addTo(map);

            // Custom icons
            var emergencyIcon = L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:#dc2626;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.3);'></div>",
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            var nonEmergencyIcon = L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:#d97706;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.3);'></div>",
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            var userIcon = L.divIcon({
                className: 'custom-div-icon',
                html: "<div class='user-location-marker'></div>",
                iconSize: [22, 22],
                iconAnchor: [11, 11]
            });

            // Add user location if available
            ${userLocation ? `
            var userMarker = L.marker([${userLocation.latitude}, ${userLocation.longitude}], {icon: userIcon})
                .addTo(map)
                .bindPopup('<div class="popup-title">📍 Your Location</div><div class="popup-description">You are here on campus</div>');
            
            // Center map on user location
            map.setView([${userLocation.latitude}, ${userLocation.longitude}], 17);
            ` : `
            console.log('No user location available');
            `}

            // Add incident markers
            var incidents = ${JSON.stringify(filteredIncidents)};
            incidents.forEach(function(incident) {
                var icon = incident.type === 'emergency' ? emergencyIcon : nonEmergencyIcon;
                var timestamp = new Date(incident.timestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                L.marker([incident.latitude, incident.longitude], {icon: icon})
                    .addTo(map)
                    .bindPopup(
                        '<div class="popup-title">' + incident.title + '</div>' +
                        '<div class="popup-description">' + incident.description + '</div>' +
                        '<div class="popup-time">📅 ' + timestamp + '</div>'
                    );
            });

            // Disable scroll wheel zoom initially for better mobile experience
            map.scrollWheelZoom.disable();
            
            // Enable zoom on tap
            map.on('click', function() {
                map.scrollWheelZoom.enable();
                setTimeout(function() {
                    map.scrollWheelZoom.disable();
                }, 3000);
            });

            // Add zoom controls
            L.control.zoom({
                position: 'bottomleft'
            }).addTo(map);

            console.log('Map initialized successfully');
        </script>
    </body>
    </html>`;
  };

  return (
    <View style={styles.container}>
      {/* Filter Controls */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All ({incidents.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter === 'emergency' && styles.activeFilter]}
          onPress={() => setFilter('emergency')}
        >
          <Text style={[styles.filterText, filter === 'emergency' && styles.activeFilterText]}>
            Emergency ({incidents.filter(i => i.type === 'emergency').length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter === 'non-emergency' && styles.activeFilter]}
          onPress={() => setFilter('non-emergency')}
        >
          <Text style={[styles.filterText, filter === 'non-emergency' && styles.activeFilterText]}>
            Non-Emergency ({incidents.filter(i => i.type === 'non-emergency').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapWrapper}>
        <WebView
          key={mapKey}
          style={styles.map}
          source={{ html: createMapHTML() }}
          scrollEnabled={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoadEnd={() => console.log('Map loaded successfully')}
          onError={(error) => console.error('WebView error:', error)}
        />

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legend</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#dc2626' }]} />
            <Text style={styles.legendText}>Emergency</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#d97706' }]} />
            <Text style={styles.legendText}>Non-Emergency</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#007AFF' }]} />
            <Text style={styles.legendText}>Your Location</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  activeFilterText: {
    color: '#fff',
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  legend: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 120,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  legendText: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
});
