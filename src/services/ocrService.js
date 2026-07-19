export const ocrService = {
  async processReceipt(imageUri) {
    // Mock OCR processing - replace with actual OCR API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          merchant: 'Sample Store',
          date: new Date().toISOString(),
          total: 45.67,
          items: [{ name: 'Item 1', amount: 20.00 }, { name: 'Item 2', amount: 25.67 }],
          category: 'shopping',
        });
      }, 2000);
    });
  },
};
