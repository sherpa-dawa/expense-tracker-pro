import React, { useEffect, useState } from 'react';
import { StatusBar, View, StyleSheet, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { store } from './src/store/store';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { CurrencyProvider } from './src/context/CurrencyContext';

import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AuthScreen from './src/screens/AuthScreen';
import BottomNav from './src/components/common/BottomNav';

LogBox.ignoreLogs(['Reanimated 2']);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Add" component={AddExpenseScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <AuthProvider>
              <CurrencyProvider>
                <BottomSheetModalProvider>
                  <NavigationContainer>
                    <StatusBar barStyle="light-content" />
                    {showSplash && (
                      <SplashScreen onFinish={() => setShowSplash(false)} />
                    )}
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="Auth" component={AuthScreen} />
                      <Stack.Screen name="Main" component={MainTabs} />
                      <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
                      <Stack.Screen name="Categories" component={CategoriesScreen} />
                      <Stack.Screen name="Profile" component={ProfileScreen} />
                    </Stack.Navigator>
                  </NavigationContainer>
                </BottomSheetModalProvider>
              </CurrencyProvider>
            </AuthProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
