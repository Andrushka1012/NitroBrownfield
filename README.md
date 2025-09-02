# React Native Brownfield with Nitro + RNEF Example

This project demonstrates a React Native brownfield implementation using **Nitro modules** and **RNEF** (React Native Embedded Framework) that showcases CMake configuration and C++ library packaging issues in AAR builds.

## Project Overview

This example project illustrates the integration of:
- **React Native 0.79.2** with New Architecture enabled
- **Nitro modules** for high-performance native code execution with C++ bindings
- **RNEF** (now known as Rock) for brownfield deployment and AAR packaging
- **CMake build system** with native library dependencies

### What is Brownfield Development?

Brownfield development refers to integrating React Native into existing native Android applications as a library (AAR) rather than as a standalone app. This approach allows teams to:
- Add React Native features to existing native apps
- Maintain existing native infrastructure
- Gradually migrate features to React Native
- Package React Native as a reusable component

### Running the App

```bash
# Install dependencies
npm install

# Run on Android (standard React Native)
# Android app will work
npx react-native run-android
```

## The CMake Configuration Issue

This project demonstrates a critical issue with **Nitro module CMake configuration** when building AAR packages for brownfield deployment.

### Issue Summary

Nitro's code generator creates CMake files that use `find_package(react-native-nitro-modules REQUIRED)`, which fails in brownfield builds

### Reproducing the Issue

#### Step 1: Generate Nitro Code
```bash
# Generate Nitro module code (this works fine)
cd react-native-math 
npx nitro-codegen
```

#### Step 2: Attempt Brownfield Build
```bash
# This will fail with CMake errors
npx rnef package:aar --variant Release --module-name rnbrownfield
```


