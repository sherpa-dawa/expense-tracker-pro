import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const exportService = {
  async exportToCSV(expenses, filename = 'expenses.csv') {
    const headers = 'Date,Title,Category,Amount,Note,Payment Method\n';
    const rows = expenses.map(e => `${e.date},${e.title},${e.category},${e.amount},${e.note || ''},${e.paymentMethod || 'cash'}`).join('\n');
    const csv = headers + rows;
    const fileUri = FileSystem.documentDirectory + filename;
    await FileSystem.writeAsStringAsync(fileUri, csv);
    await Sharing.shareAsync(fileUri);
    return fileUri;
  },
  async exportToJSON(expenses, filename = 'expenses.json') {
    const json = JSON.stringify(expenses, null, 2);
    const fileUri = FileSystem.documentDirectory + filename;
    await FileSystem.writeAsStringAsync(fileUri, json);
    await Sharing.shareAsync(fileUri);
    return fileUri;
  },
};
