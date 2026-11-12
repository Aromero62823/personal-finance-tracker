import { useEffect, useState } from 'react'
import './style.css';
import Chart from './Chart'

export default function Homepage() {
  const [date, setDate] = useState();

  function filterMonth (e) {
    setDate(e.target.value);
  }

  // Calling the apis
  // Total income api for the logged in user
  useEffect(() => {
    fetch('/api/totalIncome/')
    .then(res => res.json())
    .then(data => document.getElementById('income-total').innerHTML = data['total income'] + '$')
  }, []);

  // Total expense api
  useEffect(() => {
    fetch('/api/totalExpense/')
    .then(res => res.json())
    .then(data => document.getElementById('expense-total').innerHTML = data['total expense'] + '$')
  }, []);

  // Calling in the subweights
  useEffect(() => {
    fetch('/api/subWeights/')
    .then(res => res.json())
    .then(data => {
      // Importted from script.js
      // Instantiating variables before for-loop execution to paramaterize values
      let sub = data['sub_weight'];
      let sub_cats = ['earned', 'portfolio', 'passive', 'personal', 'housing','food', 'transportation', 'financial'];

      // For-loop to take up less space for parameterization
      for(let i = 0;i < sub_cats.length;i++) {
          // Variable that contains the income or expense string based off of i value in for-loop
          let cat = i < 3 ? 'income' : 'expense';

          // Sub category percentages based off of their category totals
          document.getElementById(`${cat}-sub${i+1}`).innerHTML = sub[sub_cats[i]][0] + '%';

          // Sub Category percentages based off of total
          document.getElementById(`sub${i+1}`).innerHTML = sub[sub_cats[i]][1] + '%';
      }
    })
  })

  // Calling the kMeans function in order to parameterize transaction insights in the user's dashboard
  useEffect(() => {
    fetch('/api/fetchTransactionInsights/')
    .then(res => res.json())
    .then(data => {
      let sizes = ['small_', 'medium_', 'large_'];
      let attrs = ['center', 'instances', 'percent', 'amount'];
      let symbols = ['$', '', '%', '$']
      let counter = 0;

      // Using for-loops to paramaterize 
      for(let i = 0;i < 3; i++) {
          for(let j = 0;j < 4;j++) {
              counter++;
              document.getElementById(`exp-ins${counter}`).innerHTML = data[sizes[i]+'exp'][attrs[j]] > 0 ? data[sizes[i]+'exp'][attrs[j]] + symbols[j] : 'N/A';
              document.getElementById(`inc-ins${counter}`).innerHTML = data[sizes[i]+'inc'][attrs[j]] > 0 ? data[sizes[i]+'inc'][attrs[j]] + symbols[j] : 'N/A';
          }
      }
    })
  })

  return (
    <>  
      <br />
      <h4 style={{ marginTop: '1%' }}>
          <b>Financial Statistics for: <span id="home_header">Ongoing Total</span></b>
      </h4><br />

      <div style={{ marginLeft: '3%' }}>
        <label for='date_choice'><h6>Choose Month/Year:  </h6> </label>
        <input type="month" value={date} onChange={e => filterMonth(e)} id="date_choice" />
      </div><br />

      {/* Total Income/Expense table */}
      <h6>Total Income/Expense Amount</h6>
      <table className="table table-dark">
          <thead>
              <tr>
                  <th>Total Income</th> <th>Total Expense</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td id="income-total">No data</td> <td id="expense-total">No data</td>
              </tr>
          </tbody>
      </table>

      {/* Subcategory table for the Income Category */}
      <h6>Income SubCategory Weight Information by Income</h6>
      <table className="table table-success">
          <thead>
              <tr>
                  <th>Earned</th> <th>Portfolio</th> <th>Passive</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td id="income-sub1">No data</td> <td id="income-sub2">No data</td> <td id="income-sub3">No data</td>
              </tr>
          </tbody>
      </table>

      {/* Subcategory table for the Expense Category */}
      <h6>Expense SubCategory Weight Information By Expense</h6>
      <table className="table table-danger">
          <thead>
              <tr>
                  <th>Personal</th> <th>Housing</th> <th>Food</th> <th>Transportation</th> <th>Financial</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td id="expense-sub4">No data</td> <td id="expense-sub5">No data</td> <td id="expense-sub6">No data</td> <td id="expense-sub7">No data</td> <td id="expense-sub8">No data</td>
              </tr>
          </tbody>
      </table>

      {/* Subcategory table for both Income/Expense Categories */}
      <h6>SubCategory Weight Information by Total</h6>
      <table className="table table-dark">
          <thead>
              <tr>
                  <th>Earned</th> <th>Portfolio</th> <th>Passive</th> <th>Personal</th> <th>Housing</th> <th>Food</th> <th>Transportation</th> <th>Financial</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td id="sub1">No data</td> <td id="sub2">No data</td> <td id="sub3">No data</td> <td id="sub4">No data</td> <td id="sub5">No data</td> <td id="sub6">No data</td> <td id="sub7">No data</td> <td id="sub8">No data</td>
              </tr>
          </tbody>
      </table>

      {/* Transaction Insight table - Income */}
      <h6>Income Transaction Insight</h6>
      <table className="table table-success">
        <tbody>
          <tr>
              <th scope="row">Group</th>
              <th>Average Amount</th>
              <th>Instances</th>
              <th>% of Total Income</th>
              <th>Total Amount</th>
          </tr>
          <tr>
              <th scope="row">Small</th>
              <td id="inc-ins1"></td>
              <td id="inc-ins2"></td>
              <td id="inc-ins3"></td>
              <td id="inc-ins4"></td>
          </tr>
          <tr>
              <th scope="row">Medium</th>
              <td id="inc-ins5"></td>
              <td id="inc-ins6"></td>
              <td id="inc-ins7"></td>
              <td id="inc-ins8"></td>
          </tr>
          <tr>
              <th scope="row">Large</th>
              <td id="inc-ins9"></td>
              <td id="inc-ins10"></td>
              <td id="inc-ins11"></td>
              <td id="inc-ins12"></td>
          </tr>
        </tbody>
      </table>

      {/* Transacion Insight table - Expense */}
      <h6>Expense Transaction Insight</h6>
      <table className="table table-danger">
        <tbody>
          <tr>
              <th scope="row">Group</th>
              <th>Average Amount</th>
              <th>Instances</th>
              <th>% of Total Expenses</th>
              <th>Total Amount</th>
          </tr>
          <tr>
              <th scope="row">Small</th>
              <td id="exp-ins1"></td>
              <td id="exp-ins2"></td>
              <td id="exp-ins3"></td>
              <td id="exp-ins4"></td>
          </tr>
          <tr>
              <th scope="row">Medium</th>
              <td id="exp-ins5"></td>
              <td id="exp-ins6"></td>
              <td id="exp-ins7"></td>
              <td id="exp-ins8"></td>
          </tr>
          <tr>
              <th scope="row">Large</th>
              <td id="exp-ins9"></td>
              <td id="exp-ins10"></td>
              <td id="exp-ins11"></td>
              <td id="exp-ins12"></td>
          </tr>
        </tbody>
      </table>

      <Chart />
    </>
  )

}
