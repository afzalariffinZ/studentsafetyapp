# Campus Safety & Police Management System

<img width="1920" height="1080" alt="Copy of Blue and Yellow Modern Gradient Cyber Security Presentation" src="https://github.com/user-attachments/assets/14f35f90-520b-4047-a29b-48cfd0b472f1" />

A comprehensive safety management solution consisting of two integrated applications: a web-based police dashboard for administrators and a mobile app for students to report incidents and emergencies.

## 🏗️ Project Architecture

This repository contains two complementary applications:

- **`hassanberg_police/`** - Web-based admin dashboard for police and security personnel
- **`studentsafety/`** - React Native mobile app for students to report incidents

## 📱 Student Safety Mobile App

### Overview
A React Native mobile application built with Expo Router that allows students to report safety incidents, view campus maps, and access emergency services. The app features an intuitive interface with real-time incident reporting and location tracking.

### UI Snippets

### UI Snippets

<table align="center" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/25ba7264-a419-4b56-a14e-678cc7b9259d"
           alt="UI 1" width="200" border="2" style="border-radius:20px;"/>
    </td>
    <td width="10"></td>
    <td>
      <img src="https://github.com/user-attachments/assets/8f29cc75-8249-42c2-8a23-05e2ebd699b4"
           alt="UI 2" width="200" border="2" style="border-radius:20px;"/>
    </td>
    <td width="10"></td>
    <td>
      <img src="https://github.com/user-attachments/assets/3fcc2291-8a07-4ddc-93f6-fcfeaa95774c"
           alt="UI 3" width="200" border="2" style="border-radius:20px;"/>
    </td>
  </tr>
</table>

<table align="center" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/b9f8cad6-dbe3-44fa-a2fb-d3cbd93bf3cc"
           alt="UI 4" width="200" border="2" style="border-radius:20px;"/>
    </td>
    <td width="10"></td>
    <td>
      <img src="https://github.com/user-attachments/assets/6f3b4803-cb8e-4ad9-a90b-9aa654574f3a"
           alt="UI 5" width="200" border="2" style="border-radius:20px;"/>
    </td>
    <td width="10"></td>
    <td>
      <img src="https://github.com/user-attachments/assets/d86f40b5-1391-45c1-8b49-0e67451953a3"
           alt="UI 6" width="200" border="2" style="border-radius:20px;"/>
    </td>
  </tr>
</table>

<table align="center" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/2a6e7532-907b-4af2-bad0-b588a43a362c"
           alt="UI 7" width="200" border="2" style="border-radius:20px;"/>
    </td>
  </tr>
</table>




### Features
- 🚨 **Emergency Reporting** - Quick access to report various types of incidents
- 🗺️ **Interactive Campus Map** - Location-based incident reporting with real-time mapping
- 📱 **Cross-Platform** - Available on iOS, Android, and Web
- 🔐 **Secure Data Storage** - Local storage for report history and user preferences
- 📊 **Report History** - Track previous reports and their status
- 🎨 **Professional UI** - University-inspired design with UM Touch color palette
- 📍 **Location Services** - GPS integration for accurate incident reporting
- 📷 **Media Support** - Camera integration for evidence capture
- 🔔 **Push Notifications** - Real-time updates on report status

### Tech Stack
- **Framework:** Expo SDK 53 with Expo Router 5
- **Language:** TypeScript
- **UI:** React Native with Expo Vector Icons
- **Navigation:** File-based routing with bottom tabs
- **Storage:** AsyncStorage for local data persistence
- **Maps:** Interactive campus mapping
- **Camera:** Expo Camera and Image Picker
- **Location:** Expo Location for GPS services

### Getting Started

#### Prerequisites
- Node.js (16.x or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android)

#### Installation

1. **Navigate to the mobile app directory:**
   ```bash
   cd studentsafety
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on specific platforms:**
   ```bash
   # iOS Simulator
   npm run ios
   
   # Android Emulator
   npm run android
   
   # Web Browser
   npm run web
   ```

#### Development Tools
- **Expo Go App:** Scan QR code to test on physical devices
- **Development Build:** For testing native features
- **Expo Dev Tools:** Built-in debugging and development tools

### Project Structure
```
studentsafety/
├── app/                      # App router pages
│   ├── (tabs)/              # Tab-based navigation
│   │   ├── index.tsx        # Home/Dashboard screen
│   │   └── explore.tsx      # Campus exploration
│   ├── report-incident.tsx  # Incident reporting
│   ├── report-detail.tsx    # Report details view
│   └── report-history.tsx   # User's report history
├── components/              # Reusable UI components
│   ├── CampusMap.tsx       # Interactive campus map
│   ├── InteractiveMap.tsx  # Map with incident markers
│   └── ui/                 # UI component library
├── constants/              # App configuration
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions
└── assets/                 # Images, fonts, and static files
```

### Available Scripts
```bash
npm start          # Start Expo development server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run on web browser
npm run lint       # Run ESLint
npm run reset-project  # Reset to blank project
```

## 🌐 Police Dashboard Web App

### Overview
A Next.js-based web dashboard designed for police and security personnel to monitor, manage, and respond to campus safety incidents. Features real-time analytics, interactive maps, and comprehensive incident management tools.

### Features
- 📊 **Real-time Analytics** - Dashboard with incident statistics and trends
- 🗺️ **Interactive Maps** - Leaflet-based mapping with incident markers
- 📋 **Incident Management** - View, filter, and manage reported incidents
- ⚡ **Urgent Alerts** - Highlighted emergency incidents requiring immediate attention
- 📈 **Reporting & Analytics** - Monthly reports and location-based statistics
- 🎨 **Modern UI** - Clean, professional interface built with shadcn/ui
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🔍 **Advanced Filtering** - Sort and filter incidents by type, status, and location

### Tech Stack
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + shadcn/ui
- **Charts:** Recharts for data visualization
- **Maps:** Leaflet with React Leaflet
- **Icons:** Lucide React
- **Performance:** Turbopack for fast builds and development

### Getting Started

#### Prerequisites
- Node.js (18.x or later)
- npm, yarn, pnpm, or bun

#### Installation

1. **Navigate to the web app directory:**
   ```bash
   cd hassanberg_police
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the dashboard.

#### Building for Production

```bash
npm run build    # Build the application
npm start       # Start production server
```

### Project Structure
```
hassanberg_police/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Dashboard home page
│   ├── alerts/            # Emergency alerts section
│   ├── analytics/         # Analytics and reporting
│   ├── incidents/         # Incident management
│   ├── reports/           # Individual report details
│   └── settings/          # Application settings
├── components/            # React components
│   ├── dashboard.tsx      # Main dashboard component
│   ├── map-wrapper.tsx    # Map container
│   ├── map.tsx           # Leaflet map component
│   ├── navbar.tsx        # Navigation bar
│   ├── sidebar.tsx       # Side navigation
│   └── ui/               # UI component library
├── lib/                  # Utility libraries
│   ├── utils.ts          # General utilities
│   └── report-data.ts    # Mock data and types
└── public/               # Static assets
```

### Available Scripts
```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production with Turbopack
npm start        # Start production server
```

## 🔗 Integration & Data Flow

The two applications work together to provide a complete campus safety solution:

1. **Mobile App (Students)** → Reports incidents with location, photos, and details
2. **Web Dashboard (Police/Admin)** → Receives and manages all reported incidents
3. **Real-time Updates** → Status changes are reflected across both platforms
4. **Analytics** → Aggregated data helps identify safety patterns and trends

## 🚀 Deployment

### Mobile App Deployment
- **Development:** Use Expo Go app for testing
- **Production:** Build native apps using EAS Build

### Web Dashboard Deployment
- **Deployment:** Vercel (optimized for Next.js)

#### Quick Deploy to Vercel
```bash
# In hassanberg_police directory
npx vercel --prod
```

## 🛠️ Development Guidelines

### Code Standards
- **TypeScript** is required for all new code
- **ESLint** configuration provided for code quality
- **Responsive design** principles for web components
- **Accessibility** considerations for mobile and web

### Folder Structure
- Keep components modular and reusable
- Use TypeScript interfaces for data types
- Implement proper error handling
- Follow React/React Native best practices

## 📄 License

This project is private and proprietary. All rights reserved.

## 🤝 Contributing

This is a private repository. For internal development only.

## 📞 Support

For technical support or questions about the system:
- Web Dashboard Issues: Contact the development team
- Mobile App Issues: Check Expo documentation and logs
- General Questions: Refer to internal documentation

---

*Last Updated: September 2025*
*Version: 1.0.0*
