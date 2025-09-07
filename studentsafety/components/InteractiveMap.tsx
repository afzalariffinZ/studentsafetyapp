import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

const mapHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>University of Malaya Report Map</title>
    
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

    <style>
        body, html {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, sans-serif;
            background-color: #f4f4f4;
        }
        #map {
            width: 100%;
            height: 100vh;
            border-radius: 12px;
        }
        
        .filter-controls {
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            z-index: 1000;
            display: flex;
            gap: 8px;
            justify-content: center;
        }
        .filter-controls button {
            padding: 8px 16px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            background-color: rgba(255, 255, 255, 0.95);
            color: #374151;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s;
            backdrop-filter: blur(8px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .filter-controls button:hover {
            background-color: rgba(248, 250, 252, 0.98);
        }
        .filter-controls button.active {
            background-color: rgba(59, 130, 246, 0.95);
            color: #ffffff;
            border-color: #3b82f6;
        }
        
        /* Custom popup styling */
        .leaflet-popup-content-wrapper {
            border-radius: 8px;
        }
        .leaflet-popup-content {
            margin: 8px 10px;
            font-size: 12px;
            line-height: 1.4;
        }
    </style>
</head>
<body>
    <div class="filter-controls">
        <button id="btn-all" class="active" onclick="showAll()">All Reports</button>
        <button id="btn-emergency" onclick="showEmergency()">Emergency</button>
        <button id="btn-non-emergency" onclick="showNonEmergency()">Non-Emergency</button>
    </div>

    <div id="map"></div>

    <script>
        const reportData = [
            { report_id: 1, student_id: 24004812, latitude: 3.120894, longitude: 101.653018, report_type: "Non-Emergency Report", datetime: "2025-08-15 11:45:19" },
            { report_id: 2, student_id: 23008851, latitude: 3.123515, longitude: 101.655931, report_type: "Non-Emergency Report", datetime: "2025-07-28 03:22:51" },
            { report_id: 3, student_id: 22002116, latitude: 3.128138, longitude: 101.661263, report_type: "Emergency Report", datetime: "2025-07-04 18:01:33" },
            { report_id: 4, student_id: 22005904, latitude: 3.119989, longitude: 101.653856, report_type: "Non-Emergency Report", datetime: "2025-07-19 09:15:28" },
            { report_id: 5, student_id: 23001842, latitude: 3.117452, longitude: 101.659121, report_type: "Non-Emergency Report", datetime: "2025-08-01 22:30:11" },
            { report_id: 6, student_id: 24007309, latitude: 3.126821, longitude: 101.658983, report_type: "Non-Emergency Report", datetime: "2025-07-11 05:40:55" },
            { report_id: 7, student_id: 22003316, latitude: 3.120195, longitude: 101.657858, report_type: "Non-Emergency Report", datetime: "2025-08-25 14:05:01" },
            { report_id: 8, student_id: 24009125, latitude: 3.116522, longitude: 101.657215, report_type: "Non-Emergency Report", datetime: "2025-08-08 01:55:42" },
            { report_id: 9, student_id: 23000551, latitude: 3.118231, longitude: 101.651949, report_type: "Non-Emergency Report", datetime: "2025-07-02 12:12:30" },
            { report_id: 10, student_id: 23006748, latitude: 3.121955, longitude: 101.654195, report_type: "Non-Emergency Report", datetime: "2025-07-30 08:00:17" },
            { report_id: 11, student_id: 22008219, latitude: 3.116021, longitude: 101.660134, report_type: "Emergency Report", datetime: "2025-08-11 20:25:13" },
            { report_id: 12, student_id: 24004523, latitude: 3.124993, longitude: 101.661312, report_type: "Non-Emergency Report", datetime: "2025-07-22 00:48:04" },
            { report_id: 13, student_id: 23003781, latitude: 3.123898, longitude: 101.653191, report_type: "Non-Emergency Report", datetime: "2025-08-05 17:33:49" },
            { report_id: 14, student_id: 22006110, latitude: 3.130911, longitude: 101.659199, report_type: "Non-Emergency Report", datetime: "2025-07-14 06:51:27" },
            { report_id: 15, student_id: 24001199, latitude: 3.119843, longitude: 101.652144, report_type: "Non-Emergency Report", datetime: "2025-08-18 23:10:59" },
            { report_id: 16, student_id: 23007845, latitude: 3.117965, longitude: 101.654898, report_type: "Non-Emergency Report", datetime: "2025-07-09 13:28:44" },
            { report_id: 17, student_id: 22005542, latitude: 3.121487, longitude: 101.660281, report_type: "Emergency Report", datetime: "2025-08-29 19:40:36" },
            { report_id: 18, student_id: 24002931, latitude: 3.120519, longitude: 101.651887, report_type: "Non-Emergency Report", datetime: "2025-07-25 04:59:18" },
            { report_id: 19, student_id: 23009587, latitude: 3.122114, longitude: 101.655813, report_type: "Non-Emergency Report", datetime: "2025-08-03 10:14:02" },
            { report_id: 20, student_id: 22000218, latitude: 3.118846, longitude: 101.659917, report_type: "Non-Emergency Report", datetime: "2025-07-16 21:05:50" },
            { report_id: 21, student_id: 24006450, latitude: 3.125181, longitude: 101.658523, report_type: "Non-Emergency Report", datetime: "2025-08-22 16:37:25" },
            { report_id: 22, student_id: 23004176, latitude: 3.117009, longitude: 101.653951, report_type: "Non-Emergency Report", datetime: "2025-07-07 07:44:11" },
            { report_id: 23, student_id: 22008891, latitude: 3.131153, longitude: 101.661032, report_type: "Non-Emergency Report", datetime: "2025-08-13 02:20:47" },
            { report_id: 24, student_id: 24003348, latitude: 3.119111, longitude: 101.658042, report_type: "Non-Emergency Report", datetime: "2025-07-20 15:55:39" },
            { report_id: 25, student_id: 23005321, latitude: 3.116098, longitude: 101.656801, report_type: "Non-Emergency Report", datetime: "2025-08-30 23:58:01" },
            { report_id: 26, student_id: 22007654, latitude: 3.123555, longitude: 101.653215, report_type: "Non-Emergency Report", datetime: "2025-07-01 09:10:22" },
            { report_id: 27, student_id: 24001002, latitude: 3.121988, longitude: 101.652146, report_type: "Non-Emergency Report", datetime: "2025-08-06 18:45:07" },
            { report_id: 28, student_id: 23006288, latitude: 3.126932, longitude: 101.659051, report_type: "Emergency Report", datetime: "2025-07-12 11:29:56" },
            { report_id: 29, student_id: 22002571, latitude: 3.116101, longitude: 101.658909, report_type: "Non-Emergency Report", datetime: "2025-08-27 00:19:34" },
            { report_id: 30, student_id: 24008109, latitude: 3.119993, longitude: 101.651903, report_type: "Non-Emergency Report", datetime: "2025-07-24 03:03:10" }
        ];

        const map = L.map('map').setView([3.122, 101.656], 15);

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri'
        }).addTo(map);

        const emergencyLayer = L.layerGroup();
        const nonEmergencyLayer = L.layerGroup();

        reportData.forEach(report => {
            let markerOptions = {
                radius: 6,
                fillOpacity: 0.85,
                stroke: true,
                weight: 2,
            };

            const popupContent = \`
                <div style="font-family: system-ui, -apple-system, sans-serif;">
                    <div style="font-weight: 600; color: #1f2937; margin-bottom: 6px;">Report #\${report.report_id}</div>
                    <div style="margin-bottom: 4px;"><strong>Student:</strong> \${report.student_id}</div>
                    <div style="margin-bottom: 4px;"><strong>Type:</strong> \${report.report_type}</div>
                    <div style="color: #6b7280; font-size: 11px;">\${report.datetime}</div>
                </div>
            \`;
            
            let marker;

            if (report.report_type === 'Emergency Report') {
                markerOptions.color = '#dc2626';
                markerOptions.fillColor = '#ef4444';
                marker = L.circleMarker([report.latitude, report.longitude], markerOptions);
                marker.bindPopup(popupContent).addTo(emergencyLayer);
            } else {
                markerOptions.color = '#d97706';
                markerOptions.fillColor = '#f59e0b';
                marker = L.circleMarker([report.latitude, report.longitude], markerOptions);
                marker.bindPopup(popupContent).addTo(nonEmergencyLayer);
            }
        });

        emergencyLayer.addTo(map);
        nonEmergencyLayer.addTo(map);

        const btnAll = document.getElementById('btn-all');
        const btnEmergency = document.getElementById('btn-emergency');
        const btnNonEmergency = document.getElementById('btn-non-emergency');
        const buttons = [btnAll, btnEmergency, btnNonEmergency];

        function setActiveButton(activeBtn) {
            buttons.forEach(btn => {
                btn.classList.remove('active');
            });
            activeBtn.classList.add('active');
        }

        function showAll() {
            if (!map.hasLayer(emergencyLayer)) {
                map.addLayer(emergencyLayer);
            }
            if (!map.hasLayer(nonEmergencyLayer)) {
                map.addLayer(nonEmergencyLayer);
            }
            setActiveButton(btnAll);
        }

        function showEmergency() {
            if (!map.hasLayer(emergencyLayer)) {
                map.addLayer(emergencyLayer);
            }
            if (map.hasLayer(nonEmergencyLayer)) {
                map.removeLayer(nonEmergencyLayer);
            }
            setActiveButton(btnEmergency);
        }

        function showNonEmergency() {
            if (map.hasLayer(emergencyLayer)) {
                map.removeLayer(emergencyLayer);
            }
            if (!map.hasLayer(nonEmergencyLayer)) {
                map.addLayer(nonEmergencyLayer);
            }
            setActiveButton(btnNonEmergency);
        }
    </script>
</body>
</html>
`;

interface InteractiveMapProps {
  height?: number;
}

export default function InteractiveMap({ height = 300 }: InteractiveMapProps) {
  return (
    <View style={[styles.container, { height }]}>
      <WebView
        source={{ html: mapHTML }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
