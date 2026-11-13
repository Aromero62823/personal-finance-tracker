import { useEffect, useState } from 'react'
import './style.css';
import Plot from 'react-plotly.js'

export default function Home() {
    const [chart, setChart] = useState(null);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [subWeights, setSubWeights] = useState({'earned': 0, 'portfolio': 0, 'passive': 0, 'personal': 0, 'housing': 0, 'food': 0, 'transportation': 0, 'financial': 0})

    // Quickly find a corresponding Month name to its integer value (1-12)
    const months = {1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'}

    // Filtering the page's insightful data based off of data parameters
    const filterMonth = async (e) => {
        // .split() returns an array, using the map(), we can then convert every string to a Number type value(gets rid of the 0 in 06)
        let [year, month] = e.target.value.split('-').map(x => Number(x));

        if(year != 0) {
            document.getElementById('home_header').innerHTML = `${months[month]} ${year}`
        } else {
            document.getElementById('home_header').innerHTML = 'Ongoing Total'
        }

        // Using a fetch statement to change the variables to the month/year parameters.
        await fetch(`/api/plotData/?month=${month}&year=${year}`)
        .then(res => res.json())
        .then(data => setChart(data))

        await fetch(`/api/totalIncome/?month=${month}&year=${year}`)
        .then(res => res.json())
        .then(data => setTotalIncome(data['total income'] + '$'))

        await fetch(`/api/totalExpense/?month=${month}&year=${year}`)
        .then(res => res.json())
        .then(data => setTotalExpense(data['total expense'] + '$'))
       
    }

    // Calling the APIs on the initial render: //

    // Calling the plotly graph from the django backend
    useEffect(() => {
        const fetchChart = async() => {
            await fetch('/api/plotData/')
            .then(res => res.json())
            .then(data => setChart(data))
        }
        fetchChart();
    }, []);

    // Total income API for the logged in user
    useEffect(() => {
        const fetchTotalIncome = async () => {
            fetch('/api/totalIncome/')
            .then(res => res.json())
            .then(data => setTotalIncome(data['total income'] + '$'))
        };
        fetchTotalIncome();
    }, []);

    // Total expense API
    useEffect(() => {
        fetch('/api/totalExpense/')
        .then(res => res.json())
        .then(data => setTotalExpense(data['total expense'] + '$'))
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
    }, [])

    if(!chart) {
        return (
        <p style={{display: 'flex', position: 'relative', marginTop: '5%', justifySelf: 'center'}}>
            <b>Go to the transaction tab to enter data that will parameterise the graph and be shown in the homepage</b>
        </p>)
    } else {
        return (
            <>
            <br />
            <h4 style={{ marginTop: '1%' }}>
                <b>Financial Statistics for: <span id="home_header">Ongoing Total</span></b>
            </h4><br />

            <div style={{ marginLeft: '3%' }}>
                <label for='date_choice'><h6>Choose Month/Year:  </h6> </label>
                <input type="month" onChange={e => filterMonth(e)} id="date_choice" />
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
                        <td>{totalIncome}</td> <td id="expense-total">{totalExpense}</td>
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

            <div className="graph-placeholder" id="plot_graph">
                <Plot data={chart.data} layout={chart.layout} style={{width: '100%'}}/>
            </div>
            </>
        )
    }
}
