import { useEffect, useState } from 'react'
import TotalCard from './TotalCard';

export default function App() {
  const [t_expense, setExpense] = useState(null);
  const [t_income, setIncome] = useState(null);

  useEffect(() => {
    fetch('/api/totalExpense/', {cache: 'no-store'})
    .then(res => res.json())
    .then(data => setExpense(data['total expense']));
  }, []);

  useEffect(() => {
    fetch('/api/totalIncome/', {cache: 'no-store'})
    .then(res => res.json())
    .then(data => setIncome(data['total income']));
  }, []);

  return (
    <div>
      <input type='month' onChange={e => alert(e.target.value)}></input>
      <TotalCard label="Expense" amount={t_expense} />
      <TotalCard label='Income' amount={t_income} />
    </div>
  )

}
