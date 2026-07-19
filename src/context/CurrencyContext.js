import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const currencies = {
  USD: { symbol: '$', name: 'US Dollar', rate: 1 },
  EUR: { symbol: '€', name: 'Euro', rate: 0.92 },
  GBP: { symbol: '£', name: 'British Pound', rate: 0.79 },
  JPY: { symbol: '¥', name: 'Japanese Yen', rate: 150.5 },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', rate: 1.35 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', rate: 1.52 },
  CHF: { symbol: 'Fr', name: 'Swiss Franc', rate: 0.88 },
  CNY: { symbol: '¥', name: 'Chinese Yuan', rate: 7.19 },
  INR: { symbol: '₹', name: 'Indian Rupee', rate: 82.9 },
  BRL: { symbol: 'R$', name: 'Brazilian Real', rate: 4.95 },
  KRW: { symbol: '₩', name: 'South Korean Won', rate: 1330 },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', rate: 1.34 },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', rate: 7.82 },
  MXN: { symbol: 'Mex$', name: 'Mexican Peso', rate: 17.05 },
  ZAR: { symbol: 'R', name: 'South African Rand', rate: 18.9 },
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD');

  const formatAmount = (amount) => {
    const curr = currencies[currency];
    const converted = amount * curr.rate;
    return `${curr.symbol}${converted.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const convertAmount = (amount, fromCurrency, toCurrency) => {
    const fromRate = currencies[fromCurrency]?.rate || 1;
    const toRate = currencies[toCurrency]?.rate || 1;
    return (amount / fromRate) * toRate;
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency, 
      currencies, 
      formatAmount,
      convertAmount 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
