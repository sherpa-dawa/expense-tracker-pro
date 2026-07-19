import { useSelector, useDispatch } from 'react-redux';
import { setMonthlyBudget, setCategoryBudget, addSavingsGoal, addAlert } from '../store/budgetSlice';

export const useBudget = () => {
  const dispatch = useDispatch();
  const budgets = useSelector(state => state.budgets);

  return {
    budgets,
    setMonthlyBudget: (data) => dispatch(setMonthlyBudget(data)),
    setCategoryBudget: (data) => dispatch(setCategoryBudget(data)),
    addSavingsGoal: (data) => dispatch(addSavingsGoal(data)),
    addAlert: (data) => dispatch(addAlert(data)),
  };
};
