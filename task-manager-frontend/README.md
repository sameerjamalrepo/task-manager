# Task Manager Frontend

React Native (Expo) mobile app for Project & Task Management.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

1. Navigate to the frontend folder
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your backend API URL (e.g., `http://192.168.x.x:3000/api` for local network)

### Running the App

#### Using Expo Go (Easiest)
```bash
npm start
```
This will start the Expo dev server. Scan the QR code with:
- **iOS**: Camera app
- **Android**: Expo Go app

#### Running on Android Emulator
```bash
npm run android
```

#### Running on iOS Simulator (Mac only)
```bash
npm run ios
```

#### Web Version
```bash
npm run web
```

## Project Structure

```
src/
├── App.js               # Main navigation setup
├── redux/
│   ├── store.js         # Redux store configuration
│   └── slices/
│       ├── authSlice.js      # Auth state management
│       ├── projectsSlice.js  # Projects state management
│       └── tasksSlice.js     # Tasks state management
├── screens/
│   ├── LoginScreen.js
│   ├── ProjectsScreen.js
│   ├── CreateProjectScreen.js
│   ├── TasksScreen.js
│   ├── CreateTaskScreen.js
│   └── ProfileScreen.js
├── utils/               # Utility functions
└── hooks/               # Custom hooks
```

## Features

- **OTP-based Authentication**: Secure login with email verification
- **Project Management**: Create, view, update, delete projects
- **Task Management**: Create, view, mark complete/incomplete, delete tasks
- **State Management**: Redux with Thunk middleware
- **API Integration**: Axios for REST API calls
- **Persistent Storage**: Token stored securely using Expo Secure Store

## Tech Stack

- React Native with Expo
- Redux & Redux Thunk
- Axios
- React Navigation
- Expo Secure Store

## API Configuration

Update the `EXPO_PUBLIC_API_URL` in `.env` to point to your backend server:

```
# Local Development
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Network Access (replace with your IP)
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/api

# Production
EXPO_PUBLIC_API_URL=https://yourdomain.com/api
```

## Troubleshooting

### Port Already in Use
If Expo port is already in use, specify a different port:
```bash
expo start --port 19001
```

### Network Issues
Ensure your device is on the same network as your backend server, or use a tunnel:
```bash
expo start --tunnel
```

### Module Not Found
Clear cache and reinstall:
```bash
npm start -- --clear
```

## Building for Production

### Android APK
```bash
expo build:android
```

### iOS
```bash
eas build --platform ios
```

Refer to [Expo Docs](https://docs.expo.dev) for detailed build instructions.
