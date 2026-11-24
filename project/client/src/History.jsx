import { useEffect, useState } from "react"

// Component meant to display, update, or delete history data, as well as view past entered transactions
export default function History() {
    // History data
    const [history, setHistory] = useState([]);
    // History data Item that will hold the state of the current item that the user is trying to edit/delete
    const [historyItem, setHistoryItem] = useState({});

    // Fetching the history data via a GET request that will decide and paramterize the return DOM
    useEffect(() => {
        const fetchHistory = async () =>  await fetch('/api/fetchHistory/')
        .then(res => res.json())
        .then(data => setHistory(data['history']));

        fetchHistory();
    }, []);

    // Function to attain CSRFToken
    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    // Usage in fetch:
    const csrfToken = getCookie('csrftoken');

    // Updating the selected transaction
    const updateTransaction = async () => {        
        const update = await fetch(`/api/fetchHistory/${historyItem.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(historyItem)
        })

        const data = await update.json()

        update.ok ? (alert(data.message), window.location.reload()) : alert(data.message)
    }

    // Deleting the selected transaction
    const deleteTransaction = async () => {
        const delete_t = await fetch(`/api/fetchHistory/${historyItem.id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            }
        })

        const data = await delete_t.json()

        delete_t.ok ? window.location.reload() : alert(data.message)
    }

    if(!history) {
        return (
            <>
                <p style={{ display: 'flex', justifySelf: 'center', marginTop: '5%'}}>
                    <b>Go to the transaction tab to enter data that will be shown in the history page</b>
                </p>
            </>
        )
    } else {
        return (
            <>
                <div>
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Date</th> <th>Amount</th> <th>Type</th> <th>SubCategory</th> <th>Recurring Transaction</th> <th>Recurring Date</th> <th>Message</th> <th> Edit </th>
                            </tr>
                        </thead>
                        <tbody id="history_body">
                            {history.map(item => (
                                <tr>
                                    <td>{item.date}</td>
                                    <td>${item.amount.toFixed(2)}</td>
                                    <td>{item.transaction_type}</td>
                                    <td>{item.subtransaction_type}</td>
                                    <td>{String(item.recurring)}</td>
                                    <td>{item.recurring_type}</td>
                                    <td>{item.message}</td>

                                    <td>
                                        <button type="button" className="btn btn-warning" onClick={() => setHistoryItem(item)} data-bs-toggle="modal" data-bs-target='#modal_edit'>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                    <div className="modal fade" id="modal_edit" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="modalLabel">Transaction Information</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>

                                <div className="modal-body">
                                    <form>
                                        <label htmlFor="amount" className="form-label">Transaction Amount: </label><br />
                                        <input type="number" id="amount" placeholder={historyItem.amount} onChange={e => setHistoryItem(prev => ({...prev, amount: e.target.value}))} className="form-control" /><br />

                                        <label htmlFor="date" className="form-label">Date: {historyItem.date}</label><br />
                                        <input type="date" name="date" id="date" className="form-control" onChange={e => setHistoryItem(prev ({...prev, date: e.target.value}))}/><br />
                                    
                                        <label htmlFor="message_box" className="form-label">Message: </label>
                                        <textarea className="form-control form-control-sm" id="message_box" rows="3" value={historyItem.message} style={{width: "75%"}} onChange={e => setHistoryItem(prev => ({...prev, message: e.target.value}))}></textarea><br />
                                    
                                        <fieldset>
                                            <legend className="form-label">Transaction Type: </legend><br />
                                            <div className="form-check form-check-inline">
                                                <input type="radio" value="income" id="i_choice" className="form-check-input" checked={historyItem.transaction_type === 'income'} onChange={e => setHistoryItem(prev => ({...prev, transaction_type: e.target.value, subtransaction_type: 'earned'}))}/>
                                                <label htmlFor="i_choice" className="form-check-label">Income</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input type="radio" value="expense" id="e_choice" className="form-check-input" checked={historyItem.transaction_type === 'expense'} onChange={e => setHistoryItem(prev => ({...prev, transaction_type: e.target.value, subtransaction_type: 'food'}))} />
                                                <label htmlFor="e_choice" className="form-check-label">Expense</label>
                                            </div>
                                        </fieldset><br />

                                        <fieldset disabled={historyItem.transaction_type === 'expense'}>
                                            <legend className="form-label">Income Category: </legend><br/>
                                            <div className="form-check">
                                                <input type="radio" value="earned" id="earned_type" className="form-check-input" checked={historyItem.subtransaction_type === 'earned'} onChange={() => setHistoryItem(prev => ({...prev, subtransaction_type: 'earned'}))}/>
                                                <label htmlFor="earned_type" className="form-check-label">Earned</label><br/>
                                            </div>
                                            <div className="form-check">
                                                <input type="radio" value="portfolio" id="portfolio_type" className="form-check-input" checked={historyItem.subtransaction_type === 'portfolio'} onChange={() => setHistoryItem(prev => ({...prev, subtransaction_type: 'portfolio'}))}/>
                                                <label htmlFor="portfolio_type" className="form-check-label">Portfolio</label><br/>
                                            </div>
                                            <div className="form-check">
                                                <input type="radio" value="passive" id="passive_type" className="form-check-input" checked={historyItem.subtransaction_type === 'passive'} onChange={() => setHistoryItem(prev => ({...prev, subtransaction_type: 'passive'}))}/>
                                                <label htmlFor="passive_type" className="form-check-label">Passive</label>
                                            </div>
                                        </fieldset><br/>

                                        <fieldset disabled={historyItem.transaction_type === 'income'}>
                                            <legend className="form-label">Expense Category: </legend><br/>
                                            <div className="form-check">
                                                <input type="radio" value="food" id="food_type" className="form-check-input" checked={historyItem.subtransaction_type === 'food'} onChange={e => setHistoryItem(prev => ({...prev, subtransaction_type: e.target.value}))} />
                                                <label htmlFor="food_type" className="form-check-label">Food/Grocery</label><br/>
                                            </div>
                                            <div className="form-check">
                                                <input type="radio" value="housing" id="housing_type" className="form-check-input" checked={historyItem.subtransaction_type === 'housing'} onChange={e => setHistoryItem(prev => ({...prev, subtransaction_type: e.target.value}))} />
                                                <label htmlFor="housing_type" className="form-check-label">Housing/Utilities</label><br/>
                                            </div>
                                            <div className="form-check">
                                                <input type="radio" value="personal" id="personal_type" className="form-check-input" checked={historyItem.subtransaction_type === 'personal'} onChange={e => setHistoryItem(prev => ({...prev, subtransaction_type: e.target.value}))} />
                                                <label htmlFor="personal_type" className="form-check-label">Personal</label><br/>
                                            </div>
                                            <div className="form-check">
                                                <input type="radio" value="transportation" id="transportation_type" className="form-check-input" checked={historyItem.subtransaction_type === 'transportation'} onChange={e => setHistoryItem(prev => ({...prev, subtransaction_type: e.target.value}))} />
                                                <label htmlFor="transportation_type" className="form-check-label">Transportation</label><br/>
                                            </div>
                                            <div className="form-check">
                                                <input type="radio" value="financial" id="financial_type" className="form-check-input" checked={historyItem.subtransaction_type === 'financial'} onChange={e => setHistoryItem(prev => ({...prev, subtransaction_type: e.target.value}))} />
                                                <label htmlFor="financial_type" className="form-check-label">Financial/Debt</label><br/>
                                            </div>   
                                        </fieldset><br/>
                                        
                                        <fieldset>
                                            <legend className="form-label">Recurring Transaction?: </legend>
                                            <div className="form-check form-check-inline">
                                                <input type="radio" value="yes" id="recur_yes" className="form-check-input" checked={historyItem.recurring === true} onChange={() => setHistoryItem(prev => ({...prev, recurring: true, recurring_type: 'daily'}))} />
                                                <label htmlFor="recur_yes" className="form-check-label">Yes</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input type="radio" value="no" id="recur_no" className="form-check-input" checked={historyItem.recurring === false} onChange={() => setHistoryItem(prev => ({...prev, recurring: false, recurring_type: 'N/A'}))} />
                                                <label htmlFor="recur_no" className="form-check-label">No</label>
                                            </div>
                                        </fieldset><br />

                                        <fieldset disabled={historyItem.recurring === false}>
                                            <legend className="form-label">When is this transaction's recurrence date? </legend><br />
                                            <div className="form-check form-check-inline">
                                                <input type="radio" value="daily" id="d_val" className="form-check-input" checked={historyItem.recurring_type === 'daily'} onChange={e => setHistoryItem(prev => ({...prev, recurring_type: e.target.value}))} />
                                                <label htmlFor="d_val" className="form-check-label">Daily</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input type="radio" value="weekly" id="w_val" className="form-check-input" checked={historyItem.recurring_type === 'weekly'} onChange={e => setHistoryItem(prev => ({...prev, recurring_type: e.target.value}))} />
                                                <label htmlFor="w_val" className="form-check-label">Weekly</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input type="radio" value="monthly" id="m_val" className="form-check-input" checked={historyItem.recurring_type === 'monthly'} onChange={e => setHistoryItem(prev => ({...prev, recurring_type: e.target.value}))} />
                                                <label htmlFor="m_val" className="form-check-label">Monthly</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input type="radio" value="annually" id="a_val" className="form-check-input" checked={historyItem.recurring_type === 'annually'} onChange={e => setHistoryItem(prev => ({...prev, recurring_type: e.target.value}))} />
                                                <label htmlFor="a_val" className="form-check-label">Annually</label>
                                            </div>
                                        </fieldset><br/>

                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-success" onClick={() => updateTransaction()}>Save changes</button>
                                            <button type="button" className="btn btn-danger" onClick={() => deleteTransaction()}>Delete</button>
                                        </div>
                                    </form> 

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}