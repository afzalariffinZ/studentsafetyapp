# 🛡️ Safety App - University Campus Safety System

A comprehensive React Native safety application designed specifically for University of Malaya students, providing emergency response features, incident reporting, and real-time campus safety monitoring.

## 📱 Features

### 🚨 Emergency Response
- **Emergency SOS Button**: Instant emergency alert with 10-second countdown
- **Automatic Location Sharing**: GPS coordinates sent to authorities
- **Audio Recording**: Voice message recording during emergencies
- **Real-time Status Updates**: Live feedback on emergency response progress

### 🗺️ Interactive Campus Map
- **Live Incident Map**: Real-time visualization of campus incidents
- **User Location Tracking**: Shows your current position on campus
- **Interactive Filtering**: Filter incidents by Emergency/Non-Emergency
- **Satellite Imagery**: High-resolution campus view with detailed markers

### 📊 Incident Management
- **Report Incidents**: Submit detailed incident reports with evidence
- **Photo/Video Upload**: Attach media evidence to reports
- **Report History**: View and track all submitted reports
- **Escalation System**: Automatic escalation for unresolved incidents

### 🔒 Safety Features
- **Safety Mode Toggle**: Enhanced safety monitoring
- **Privacy Controls**: Secure data handling and user privacy
- **Location Services**: Precise campus positioning
- **Offline Support**: Basic functionality without internet connection

## 🛠️ Technology Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo SDK 53**: Development platform and tools
- **TypeScript**: Type-safe JavaScript development
- **React Navigation**: Navigation and routing

### Core Libraries
- **expo-location**: GPS and location services
- **react-native-webview**: Interactive map rendering
- **expo-camera**: Camera access for evidence capture
- **expo-image-picker**: Media selection and upload
- **@react-native-async-storage/async-storage**: Local data storage

### Mapping & Visualization
- **Leaflet.js**: Interactive map functionality
- **Esri World Imagery**: Satellite map tiles
- **Custom Markers**: Location-specific incident visualization

### UI & Styling
- **@expo/vector-icons**: Comprehensive icon library
- **expo-linear-gradient**: Advanced gradient effects
- **expo-blur**: Visual effects and overlays

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git** for version control
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### Mobile Testing
- **Expo Go** app on your mobile device, OR
- **Android Emulator** or **iOS Simulator**

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/afzalariffinZ/studentsafety.git
cd safety
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
The app requires location permissions and camera access. These are pre-configured in `app.json`.

### 4. Start Development Server
```bash
npm start
# or
npx expo start
```

### 5. Run on Device/Emulator

#### Option A: Expo Go (Recommended for testing)
1. Install **Expo Go** from App Store/Play Store
2. Scan the QR code displayed in terminal
3. App will load on your device

#### Option B: Development Build
```bash
# Android
npm run android

# iOS (macOS only)
npm run ios

# Web
npm run web
```

## 📱 Usage Guide

### Emergency Response
1. **Press Emergency SOS** button on home screen
2. **10-second countdown** begins automatically
3. **Voice recording** starts for incident details
4. **Location is shared** with campus security
5. **Confirmation** received when help is dispatched

### Incident Reporting
1. Navigate to **"Report Incident"** in Quick Access
2. Fill out incident details and location
3. **Attach photos/videos** as evidence
4. Submit report for review
5. Track report status in **"View Report History"**

### Campus Map Navigation
1. View **"Campus Incident Reports"** section
2. Use **filter buttons** (All/Emergency/Non-Emergency)
3. **Tap markers** to view incident details
4. Your **blue marker** shows current location

### Safety Mode
- Toggle **Safety Mode** for enhanced monitoring
- Periodic location updates to emergency contacts
- Automatic incident detection capabilities

## 🗂️ Project Structure

```
safety/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab-based navigation screens
│   │   ├── index.tsx      # Home screen with emergency features
│   │   ├── explore.tsx    # Campus exploration features
│   │   └── _layout.tsx    # Tab navigation layout
│   ├── report-detail.tsx  # Incident report details
│   ├── report-form.tsx    # New incident reporting
│   ├── report-history.tsx # Report history viewer
│   ├── _layout.tsx        # Root app layout
│   └── +not-found.tsx     # 404 error screen
├── components/            # Reusable UI components
│   ├── CampusMap.tsx     # Interactive campus map
│   ├── ThemedText.tsx    # Themed text component
│   ├── ThemedView.tsx    # Themed view component
│   └── ui/               # UI utility components
├── constants/            # App constants and configuration
│   └── Colors.ts         # Color theme definitions
├── hooks/                # Custom React hooks
│   ├── useColorScheme.ts # Theme management
│   └── useThemeColor.ts  # Color utility hooks
├── utils/                # Utility functions
│   └── reportStorage.ts  # Local data management
├── assets/               # Static assets
│   ├── images/           # App icons and images
│   └── fonts/            # Custom fonts
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## ⚙️ Configuration

### Location Services
Location permissions are configured in `app.json`:
```json
{
  "plugins": [
    ["expo-location", {
      "locationAlwaysAndWhenInUsePermission": "This app needs access to location for safety features."
    }]
  ]
}
```

### Camera & Media Access
Camera permissions for evidence capture:
```json
{
  "android": {
    "permissions": [
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.CAMERA",
      "android.permission.RECORD_AUDIO"
    ]
  }
}
```

## 🧪 Development

### Running Tests
```bash
npm run lint        # Code linting
npm run type-check  # TypeScript validation
```

### Building for Production

#### Mockup Access (Required Expo GO installed in your device)
<img width="473" height="318" alt="image" src="https://github.com/user-attachments/assets/f5c7f880-1f00-49d6-b71e-f059beb5264f" />


#### Android
```bash
npx expo build:android
```

#### iOS
```bash
npx expo build:ios
```

### Environment Setup
1. **Android Development**: Install Android Studio and configure SDK
2. **iOS Development**: Install Xcode (macOS only)
3. **Development Certificates**: Configure signing certificates for app stores

## 🌐 API Integration

The app is designed to integrate with:
- **Campus Security API**: Emergency response coordination
- **University Database**: Student verification and incident tracking
- **Location Services**: Real-time positioning and geofencing
- **Notification System**: Push notifications for safety alerts

*Note: Current version uses mock data for demonstration purposes.*

## 🔒 Security & Privacy

### Data Protection
- **Location data** encrypted and transmitted securely
- **Personal information** stored locally with encryption
- **Emergency recordings** automatically deleted after 30 days
- **GDPR compliant** data handling practices

### User Privacy
- **Minimal data collection**: Only safety-essential information
- **Opt-in location sharing**: User controls location visibility
- **Anonymous reporting**: Option for anonymous incident reports
- **Data retention policies**: Automatic cleanup of old data

## 📄 License

This project is private and proprietary. All rights reserved.

## 🤝 Contributing

This is a private repository. For the use of competition only.

## 👥 Authors & Acknowledgments

### Development Team
- **Afzal Ariffin** - *Lead Developer* - [@afzalariffinZ](https://github.com/afzalariffinZ)


## 📞 Support & Contact

### For Technical Issues
- Email: afzal.ariffin04@gmail.com
- LinkedIn: https://www.linkedin.com/in/afzal-ariffin-764bb9277/

## 📈 Roadmap

### Version 2.0 (Planned)
- [ ] **Real-time Chat**: Direct communication with security
- [ ] **AI Incident Detection**: Automatic incident classification
- [ ] **Multi-language Support**: Bahasa Malaysia and Chinese
- [ ] **Wearable Integration**: Smartwatch compatibility
- [ ] **Advanced Analytics**: Safety pattern analysis

### Version 3.0 (Future)
- [ ] **AR Navigation**: Augmented reality campus guidance
- [ ] **Predictive Safety**: AI-powered risk assessment
- [ ] **Integration APIs**: Third-party security system integration
- [ ] **Voice Commands**: Hands-free emergency activation

---

## 🏃‍♂️ Quick Start

1. **Clone & Install**:
   ```bash
   git clone https://github.com/afzalariffinZ/studentsafety.git
   cd safety
   npm install
   ```

2. **Start Development**:
   ```bash
   npm start
   ```

3. **Test on Device**:
   - Install Expo Go app
   - Scan QR code
   - Grant location permissions

4. **Ready to Use!** 🎉

---

*Stay safe, stay connected.* 🛡️

