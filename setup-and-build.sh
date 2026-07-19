#!/bin/bash

# ExpenseTracker Pro - Complete Setup & Build Script for Ongmu
# This script handles EAS project initialization and building

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}║${NC}     ${YELLOW}💰 ExpenseTracker Pro - Setup & Build${NC}                ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}     ${GREEN}Built for Ongmu${NC}                                        ${CYAN}║${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo -e "${YELLOW}⚠️  EAS CLI not found. Installing...${NC}"
    npm install -g eas-cli
fi

# Check if logged in
echo -e "${BLUE}🔑 Checking Expo login...${NC}"
if ! eas whoami &> /dev/null; then
    echo -e "${YELLOW}Please login to Expo first:${NC}"
    eas login
fi

USER=$(eas whoami 2>/dev/null || echo "unknown")
echo -e "${GREEN}✅ Logged in as: $USER${NC}"
echo ""

# Check if project is initialized
if [ ! -f "eas.json" ]; then
    echo -e "${RED}❌ eas.json not found. Are you in the project directory?${NC}"
    exit 1
fi

# Check if EAS project exists
if ! grep -q '"projectId"' app.json 2>/dev/null; then
    echo -e "${YELLOW}⚠️  EAS project not initialized yet.${NC}"
    echo -e "${BLUE}🚀 Creating new EAS project...${NC}"
    echo ""

    # Initialize EAS project
    eas init --id $(uuidgen 2>/dev/null || python3 -c "import uuid; print(uuid.uuid4())") 2>/dev/null || eas init

    echo ""
    echo -e "${GREEN}✅ EAS project initialized!${NC}"
fi

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📱 What would you like to build?${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${GREEN}1)${NC} Android APK  ${YELLOW}(easiest to share with friends)${NC}"
echo -e "  ${GREEN}2)${NC} Android AAB  ${YELLOW}(Google Play Store format)${NC}"
echo -e "  ${GREEN}3)${NC} iOS IPA      ${YELLOW}(iPhone/iPad - requires Apple Dev Account)${NC}"
echo -e "  ${GREEN}4)${NC} All platforms"
echo -e "  ${GREEN}5)${NC} Just setup EAS project (no build yet)"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}🔨 Building Android APK...${NC}"
        echo -e "${YELLOW}⏳ This will take ~10-15 minutes. You'll get a download link.${NC}"
        echo ""
        eas build --platform android --profile preview
        ;;
    2)
        echo ""
        echo -e "${BLUE}🔨 Building Android AAB (Play Store)...${NC}"
        eas build --platform android --profile production
        ;;
    3)
        echo ""
        echo -e "${BLUE}🔨 Building iOS IPA...${NC}"
        echo -e "${YELLOW}⚠️  Requires Apple Developer Account ($99/year)${NC}"
        eas build --platform ios --profile production
        ;;
    4)
        echo ""
        echo -e "${BLUE}🔨 Building Android APK first...${NC}"
        eas build --platform android --profile preview
        echo ""
        echo -e "${BLUE}🔨 Building iOS IPA...${NC}"
        eas build --platform ios --profile production
        ;;
    5)
        echo ""
        echo -e "${GREEN}✅ EAS project setup complete!${NC}"
        echo -e "${BLUE}You can now run 'eas build' commands anytime.${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ Build complete!${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}📥 Download your build:${NC}"
echo -e "   ${BLUE}https://expo.dev/accounts/$USER/projects${NC}"
echo ""
echo -e "${CYAN}📱 Share with friends:${NC}"
echo -e "   ${YELLOW}• Android APK: Share the download link directly${NC}"
echo -e "   ${YELLOW}• Friends tap link → download → install → done!${NC}"
echo ""
echo -e "${CYAN}🔄 Future updates (no rebuild needed):${NC}"
echo -e "   ${GREEN}eas update --branch production --message 'New features!'${NC}"
echo ""
