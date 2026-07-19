#!/bin/bash
# Quick build script for Ongmu
# Make sure you've run: eas init

echo "Building Android APK for sharing..."
eas build --platform android --profile preview
