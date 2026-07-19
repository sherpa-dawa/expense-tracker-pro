# 📱 Share ExpenseTracker Pro with Friends

## Quick Start for Ongmu

### Step 1: Build the App

```bash
# Make the build script executable
chmod +x build.sh

# Run it
./build.sh

# Or manually:
# Android APK (easiest to share)
eas build --platform android --profile preview

# iOS IPA  
eas build --platform ios --profile production
```

### Step 2: Share with Friends

#### Android (APK)
1. After build completes, EAS gives you a download link
2. Share this link via WhatsApp, email, or any messaging app
3. Friends tap the link → download APK → install (allow "Unknown Sources" if prompted)
4. Done! They can use the app immediately

#### iOS (TestFlight)
1. Build completes → Apple processes it (~30 min)
2. Go to App Store Connect → TestFlight
3. Add friends' emails as "Internal Testers"
4. They get an email invitation
5. They install TestFlight app, then install your app

### Step 3: Update Without Rebuilding (OTA Updates)

When you make JS-only changes (no new native modules):

```bash
# Push update to all users instantly
eas update --branch production --message "New quote of the day!"
```

Users get the update automatically next time they open the app!

---

## 📋 Build Profiles Explained

| Profile | Output | Use Case |
|---------|--------|----------|
| `preview` | `.apk` file | Share with friends directly |
| `production` | `.aab` (Android) / `.ipa` (iOS) | Publish to App Store / Play Store |
| `development` | Development build | For testing during development |

---

## 🔗 Useful Links After Build

- **Expo Dashboard**: https://expo.dev/accounts/[your-username]/projects/expense-tracker-pro-ongmu
- **Download builds**, manage updates, view analytics

---

## 🚀 One-Command Setup (First Time Only)

```bash
# 1. Install dependencies
npm install

# 2. Install EAS CLI
npm install -g eas-cli

# 3. Login to Expo
eas login

# 4. Configure project
eas build:configure

# 5. Build and share!
eas build --platform android --profile preview
```

---

## 💡 Pro Tips

- **APK files** can be shared via Google Drive, Dropbox, WhatsApp, email
- **QR Code**: Expo dashboard generates QR codes for easy sharing
- **Deep Link**: Set up `expensetracker://` scheme for app links
- **OTA Updates**: Push JS changes instantly without app store review

Happy sharing, Ongmu! 🎉
