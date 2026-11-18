import { useEffect, useState } from 'react'
import './style.css';
import Plot from 'react-plotly.js'

export default function Home() {
    // Usestate variables that will be managed, accessed, and manipulated through different procedures based off of events(onload, api calls, etc...)
    const [chart, setChart] = useState(null);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [subWeights, setSubWeights] = useState({ earned: [0, 0], portfolio: [0, 0], passive: [0, 0], personal: [0, 0], housing: [0, 0], food: [0, 0], transportation: [0, 0], financial: [0, 0]});
    const [smallInsight, setSmallInsight] = useState({small_exp: {size: 'N/A', instances: 'N/A', amount: 'N/A', center: 'N/A', percent: 'N/A'}, small_inc: {size: 'N/A', instances: 'N/A', amount: 'N/A', center: 'N/A', percent: 'N/A'}});
    const [mediumInsight, setMediumInsight] = useState({medium_exp: {size: 'N/A', instances: 'N/A', amount: 'N/A', center: 'N/A', percent: 'N/A'}, medium_inc: {size: 'N/A', instances: 'N/A', amount: 'N/A', center: 'N/A', percent: 'N/A'}});
    const [largeInsight, setLargeInsight] = useState({large_exp: {size: 'N/A', instances: 'N/A', amount: 'N/A', center: 'N/A', percent: 'N/A'}, large_inc: {size: 'N/A', instances: 'N/A', amount: 'N/A', center: 'N/A', percent: 'N/A'}});

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

        await fetch(`/api/subWeights/?month=${month}&year=${year}`)
        .then(res => res.json())
        .then(data => {
            // instantiation through unpacking
            setSubWeights(prev => ({
                ...prev,
                ...data['sub_weight']
            }));
        });

        await fetch(`/api/fetchTransactionInsights/?month=${month}&year=${year}`)
        .then(res => res.json())
        .then(data => {
            // Instantiating the state variables by unpacking them 
            setSmallInsight(prev => ({
                ...prev,
                small_exp: data['small_exp'],
                small_inc: data['small_inc']
            }))

            setMediumInsight(prev => ({
                ...prev,
                medium_exp: data['medium_exp'],
                medium_inc: data['medium_inc']
            }))

            setLargeInsight(prev => ({
                ...prev,
                large_exp: data['large_exp'],
                large_inc: data['large_inc']
            }))
        })
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
        const fetchExpenseTotal = async() => {
            await fetch('/api/totalExpense/')
            .then(res => res.json())
            .then(data => setTotalExpense(data['total expense'] + '$'))
        };
        fetchExpenseTotal();
    }, []);

    // Calling in the subweights
    useEffect(() => {
        const fetchSubWeights = async() => {
            await fetch('/api/subWeights/')
            .then(res => res.json())
            .then(data => {
            // Unloading the previous key-value data
            setSubWeights((prev) => ({
                ...prev,
                ...data['sub_weight']
            }))
        }
        )};
        fetchSubWeights();
    }, []);

    // Calling the kMeans function in order to parameterize transaction insights in the user's dashboard
    useEffect(() => {
        fetch('/api/fetchTransactionInsights/')
        .then(res => res.json())
        .then(data => {
            // Instantiating the state variables by unpacking them 
            setSmallInsight(prev => ({
                ...prev,
                small_exp: data['small_exp'],
                small_inc: data['small_inc']
            }))

            setMediumInsight(prev => ({
                ...prev,
                medium_exp: data['medium_exp'],
                medium_inc: data['medium_inc']
            }))

            setLargeInsight(prev => ({
                ...prev,
                large_exp: data['large_exp'],
                large_inc: data['large_inc']
            }))

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
                        <td>{subWeights['earned'][0]+'%'}</td> <td>{subWeights['portfolio'][0]+'%'}</td> <td>{subWeights['passive'][0]+'%'}</td>
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
                        <td>{subWeights['personal'][0]+'%'}</td> <td>{subWeights['housing'][0]+'%'}</td> <td>{subWeights['food'][0]+'%'}</td> <td>{subWeights['transportation'][0]+'%'}</td> <td>{subWeights['financial'][0]+'%'}</td>
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
                        <td>{subWeights['earned'][1]+'%'}</td> <td>{subWeights['portfolio'][1]+'%'}</td> <td>{subWeights['passive'][1]+'%'}</td>
                        <td>{subWeights['personal'][1]+'%'}</td> <td>{subWeights['housing'][1]+'%'}</td> <td>{subWeights['food'][1]+'%'}</td>
                        <td>{subWeights['transportation'][1]+'%'}</td> <td>{subWeights['financial'][1]+'%'}</td>
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
                    <td>{smallInsight.small_inc.center ? smallInsight.small_inc.center + '$' : 'N/A'}</td>
                    <td>{smallInsight.small_inc.instances ? smallInsight.small_inc.instances : 'N/A'}</td>
                    <td>{smallInsight.small_inc.percent ? smallInsight.small_inc.percent + '%' : 'N/A'}</td>
                    <td>{smallInsight.small_inc.amount ? smallInsight.small_inc.amount + '$' : 'N/A'}</td>
                </tr>
                <tr>
                    <th scope="row">Medium</th>
                    <td>{mediumInsight.medium_inc.center ? mediumInsight.medium_inc.center + '$' : 'N/A'}</td>
                    <td>{mediumInsight.medium_inc.instances ? mediumInsight.medium_inc.instances : 'N/A'}</td>
                    <td>{mediumInsight.medium_inc.percent ? mediumInsight.medium_inc.percent + '%' : 'N/A'}</td>
                    <td>{mediumInsight.medium_inc.amount ? mediumInsight.medium_inc.amount + '$' : 'N/A'}</td>
                </tr>
                <tr>
                    <th scope="row">Large</th>
                    <td>{largeInsight.large_inc.center ? largeInsight.large_inc.center + '$' : 'N/A'}</td>
                    <td>{largeInsight.large_inc.instances ? largeInsight.large_inc.instances : 'N/A'}</td>
                    <td>{largeInsight.large_inc.percent ? largeInsight.large_inc.percent + '%' : 'N/A'}</td>
                    <td>{largeInsight.large_inc.amount  ? largeInsight.large_inc.amount + '$' : 'N/A'}</td>
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
                    <td>{smallInsight.small_exp.center ? smallInsight.small_exp.center + '$' : 'N/A'}</td>
                    <td>{smallInsight.small_exp.instances ? smallInsight.small_exp.instances : 'N/A'}</td>
                    <td>{smallInsight.small_exp.percent ? smallInsight.small_exp.percent + '%' : 'N/A'}</td>
                    <td>{smallInsight.small_exp.amount ? smallInsight.small_exp.amount + '$' : 'N/A'}</td>
                </tr>
                <tr>
                    <th scope="row">Medium</th>
                    <td>{mediumInsight.medium_exp.center ? mediumInsight.medium_exp.center + '$' : 'N/A'}</td>
                    <td>{mediumInsight.medium_exp.instances ? mediumInsight.medium_exp.instances : 'N/A'}</td>
                    <td>{mediumInsight.medium_exp.percent ? mediumInsight.medium_exp.percent + '%' : 'N/A'}</td>
                    <td>{mediumInsight.medium_exp.amount ? mediumInsight.medium_exp.amount + '$' : 'N/A'}</td>
                </tr>
                <tr>
                    <th scope="row">Large</th>
                    <td>{largeInsight.large_exp.center ? largeInsight.large_exp.center + '$' : 'N/A'}</td>
                    <td>{largeInsight.large_exp.instances ? largeInsight.large_exp.instances : 'N/A'}</td>
                    <td>{largeInsight.large_exp.percent ? largeInsight.large_exp.percent + '%' : 'N/A'}</td>
                    <td>{largeInsight.large_exp.amount ? largeInsight.large_exp.amount + '$' : 'N/A'}</td>
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
