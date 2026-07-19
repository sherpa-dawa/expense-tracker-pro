export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const validateDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

export const validateRequired = (value) => {
  return value !== undefined && value !== null && value.toString().trim() !== '';
};
