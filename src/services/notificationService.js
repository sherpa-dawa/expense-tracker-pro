import * as Notifications from 'expo-notifications';

export const initNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true }),
  });
};

export const scheduleDailyReminder = async () => {
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Daily Reminder', body: 'Don't forget to track your expenses today!' },
    trigger: { hour: 20, minute: 0, repeats: true },
  });
};

export const scheduleBudgetAlert = async (title, body) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
};
