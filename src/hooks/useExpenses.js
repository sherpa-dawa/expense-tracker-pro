import { useSelector, useDispatch } from 'react-redux';
import { addExpense, updateExpense, deleteExpense, setFilters, clearFilters } from '../store/expenseSlice';

export const useExpenses = () => {
  const dispatch = useDispatch();
  const expenses = useSelector(state => state.expenses.items);
  const categories = useSelector(state => state.expenses.categories);
  const filters = useSelector(state => state.expenses.filters);

  return {
    expenses,
    categories,
    filters,
    addExpense: (data) => dispatch(addExpense(data)),
    updateExpense: (data) => dispatch(updateExpense(data)),
    deleteExpense: (id) => dispatch(deleteExpense(id)),
    setFilters: (data) => dispatch(setFilters(data)),
    clearFilters: () => dispatch(clearFilters()),
  };
};
