# ExpenseTracker Pro

A premium, feature-rich expense tracking application built with React Native and Expo.

## Features

### Core Features
- **Smart Dashboard** - Real-time spending overview with period filters, quick actions, budget progress, top categories, and recent transactions
- **Expense Entry** - Full form with amount, description, category picker, date, payment method, notes, tags, receipt photo, recurring toggle, and split bill options
- **Receipt Scanner** - Camera-based OCR scanning with automatic merchant, item, and total extraction
- **Analytics & Charts** - Pie charts, bar charts, line charts for daily/monthly trends, category breakdown, and smart AI insights
- **Budget Management** - Monthly budgets, category budgets, daily budget calculator, progress tracking with visual indicators
- **Savings Goals** - Create goals with icons, deadlines, track contributions, progress visualization
- **Recurring Expenses** - Auto-track bills and subscriptions with frequency settings
- **Group Splitting** - Split expenses with friends/roommates, track who owes what
- **Categories** - 15+ pre-built categories, custom category creation with color/icon picker
- **Multi-Currency** - 15 currencies with conversion support
- **3 Themes** - Dark, Light, and Midnight themes
- **Settings** - Notifications, backup, sync, export, biometric auth, haptic feedback
- **Auth** - Email/password login, biometric authentication, secure storage

### Premium Features
- Cloud sync with offline support
- Data export (CSV, JSON)
- Smart budget alerts and notifications
- Receipt OCR scanning
- Bill splitting with groups
- Recurring expense automation
- Savings goals tracker
- Weekly spending reports
- Biometric security

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and toolchain
- **Redux Toolkit** - State management with persistence
- **React Navigation** - Navigation and routing
- **Reanimated** - Smooth animations
- **React Native Chart Kit** - Data visualization
- **Expo Camera** - Receipt scanning
- **Expo Local Authentication** - Biometric security
- **Expo Notifications** - Push notifications
- **date-fns** - Date manipulation

## Project Structure

```
expense-tracker/
├── src/
│   ├── screens/           # All app screens
│   ├── components/        # Reusable components
│   ├── store/             # Redux store and slices
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API and external services
│   ├── context/           # React contexts (theme, auth, currency)
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   └── assets/            # Images, fonts, icons
├── App.js                 # Entry point
├── package.json           # Dependencies
├── app.json              # Expo configuration
└── babel.config.js       # Babel configuration
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/expense-tracker-pro.git
   cd expense-tracker-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on physical device

### Building for Production

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Or use EAS Build
eas build --platform ios
eas build --platform android
```

## Configuration

### Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Add your Firebase config to `src/config/firebase.js`

### Appwrite Setup (Optional)
1. Create an Appwrite project at [cloud.appwrite.io](https://cloud.appwrite.io)
2. Add your Appwrite config to `src/config/appwrite.js`

### Push Notifications
1. Configure Expo push notifications in `app.json`
2. Set up FCM for Android and APNs for iOS

## Customization

### Adding New Categories
Edit the `EXPENSE_CATEGORIES` array in `src/utils/constants.js`

### Adding New Themes
Add a new theme object to the `themes` object in `src/context/ThemeContext.js`

### Adding New Currencies
Add a new currency to the `currencies` object in `src/context/CurrencyContext.js`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@expensetracker.com or join our Slack channel.

---

Built with ❤️ using React Native & Expo
