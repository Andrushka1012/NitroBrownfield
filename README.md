# React Native Brownfield with Nitro + RNEF Example

This project demonstrates a React Native brownfield implementation using **Nitro modules** and **RNEF** (new name Rock) that showcases C++ library packaging issues in AAR builds.

## Project Overview

This example project illustrates the integration of:
- **React Native 0.79.2** with New Architecture
- **Nitro modules** for high-performance native code execution
- **RNEF (React Native Embedded Framework)** for brownfield deployment
- **C++ native libraries** with build and packaging challenges

### Running the App

```bash
npx react-native run-android
```

## The C++ Library Issue

This project demonstrates a specific issue with C++ native libraries when building AAR packages for brownfield deployment.

### Reproducing the Issue

To reproduce the C++ library packaging issue, run:

```bash
npx rnef package:aar --variant Release --module-name rnbrownfield
```

### Problem Description

The issue occurs when:
1. Nitro modules contain C++ libraries (`libNitroMath.so`)
2. These libraries need to be properly packaged in the AAR
3. The build system struggles with:
   - Correct library path resolution
   - Proper inclusion in the final AAR package
   - Architecture-specific library handling (arm64-v8a, armeabi-v7a, x86, x86_64)

### Current Workaround

