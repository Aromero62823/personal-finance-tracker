import { useState } from "react";


export default function Transaction() {
    const [type, setType] = useState('income'); // Transaction type
    const [subType, setSubType] = useState('earned'); // Transaction sub-type
    const [amount, setAmount] = useState(); // Transaction amount
    const [date, setDate] = useState(); // Transaction Date
    const [recur, setRecur] = useState(false); // recur => true or false (boolean)
    const [recurType, setRecurType] = useState('N/A'); // recur type
    const [message, setMessage] = useState("");

    // Function to attain CSRFToken
    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    // Usage in fetch:
    const csrfToken = getCookie('csrftoken');

    async function submitTransaction(e) {
        // Preventing the form from refreshing
        e.preventDefault();

        // Initializing Payload with useState variables
        const payload = {
            'type': type,
            'subType': subType,
            'amount': amount,
            'date': date,
            'recur': recur,
            'recurType': recurType,
            'message': message
        }

        // Submitting a fetch POST
        const response = await fetch('/api/submitTransaction/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(payload)
        })
        
        const data = await response.json();
        // Reload the transaction page if the response is returning with an ok
        response.ok ? (alert(data.message), window.location.reload()) : alert(data.message);
    }

    return (
        <>
        {/* Convertted from HTML to JSX format */}
        <div className="container px-0 p-4 my-4 bg-light border">
            <form style={{display: '-ms-flexbox', justifySelf: 'center', justifyContent: 'center'}} autoComplete="off" onSubmit={e => submitTransaction(e)}>

            <h4>Transaction Information</h4><br />
            <fieldset>
                <legend>Type: </legend>
                <label htmlFor="i_choice">
                    <input type='radio' value="income" id="i_choice" checked={type === 'income'} onChange={(e) => {
                        setType(e.target.value)
                        setSubType('earned')}} />
                    Income
                </label>
                <label htmlFor="e_choice">
                    <input type="radio" value="expense" id="e_choice" checked={type === 'expense'} onChange={(e) => {
                        setType(e.target.value)
                        setSubType('food')}} />
                    Expense 
                </label>
            </fieldset><br />

            <fieldset id="sub_income" disabled={type === 'expense'}>
                <legend>Income Category: </legend><br/>

                <input type="radio" value="earned" name="sub_i_type" id="earned_type" checked={subType === 'earned'} onChange={(e) => setSubType(e.target.value)}/>
                <label htmlFor="earned_type">Earned</label><br/>

                <input type="radio" value="portfolio" name="sub_i_type" id="portfolio_type" checked={subType === 'portfolio'} onChange={(e) => setSubType(e.target.value)} />
                <label htmlFor="portfolio_type">Portfolio</label><br/>

                <input type="radio" value="passive" name="sub_i_type" id="passive_type" checked={subType === 'passive'} onChange={(e) => setSubType(e.target.value)} />
                <label htmlFor="passive_type">Passive</label>
            </fieldset><br/>

            <fieldset id="sub_expense" disabled={type === 'income'}>
                <legend>Expense Category: </legend><br/>
                <input type="radio" value="food" name="sub_e_type" id="food_type" checked={subType === 'food'} onChange={(e) => setSubType(e.target.value)} />
                <label htmlFor="food_type">Food/Grocery</label><br/>

                <input type="radio" value="housing" name="sub_e_type" id="housing_type" checked={subType === 'housing'} onChange={(e) => setSubType(e.target.value)} />
                <label htmlFor="housing_type">Housing/Utilities</label><br/>

                <input type="radio" value="personal" name="sub_e_type" id="personal_type" checked={subType === 'personal'} onChange={(e) => setSubType(e.target.value)} />
                <label htmlFor="personal_type">Personal</label><br/>

                <input type="radio" value="transportation" name="sub_e_type" id="transportation_type" checked={subType === 'transportation'} onChange={(e) => setSubType(e.target.value)} />
                <label htmlFor="transportation_type">Transportation</label><br/>

                <input type="radio" value="financial" name="sub_e_type" id="financial_type" checked={subType === 'financial'} onChange={(e) => setSubType(e.target.value)} />
                <label htmlFor="financial_type">Financial/Debt</label><br/>
            </fieldset><br/>

            <label htmlFor="amount_id">Transaction Amount: </label><br />
            <input type="number" id="amount_id" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} required={true}/><br /><br />

            <label htmlFor="date_id">Date of Transaction: </label><br />
            <input type="date" name="date" id="date_id" onChange={e => setDate(e.target.value)} required={true}/><br /><br />

            <fieldset id="recur_choice_fieldset">
                <legend>Recurring Transaction? </legend>
                <input type="radio" value="yes" id="recur_yes" name="recur_choice" checked={recur === true} onChange={() => {
                    setRecur(true)
                    setRecurType('daily')}} />
                <label htmlFor="recur_yes">Yes</label>
                <input type="radio" value="no" id="recur_no" name="recur_choice" checked={recur === false} onChange={() => {
                    setRecur(false) 
                    setRecurType('N/A')}}/>
                <label htmlFor="recur_no">No</label>
            </fieldset><br/>

            <fieldset id="date_range_id" disabled={recur === false}>
                <legend>When is this transaction's recurrence date? </legend><br />
                <label htmlFor="d_val">Daily</label>
                <input type="radio" value='daily' name="date_type" id="d_val" onChange={(e) => setRecurType(e.target.value)} checked={recurType === 'daily'}/>
                <label htmlFor="w_val">Weekly</label>
                <input type="radio" value="weekly" name="date_type" id="w_val" onChange={(e) => setRecurType(e.target.value)} checked={recurType ==='weekly'}/>
                <label htmlFor="m_val">Monthly</label>
                <input type="radio" value="monthly" name="date_type" id="m_val" onChange={(e) => setRecurType(e.target.value)} checked={recurType === 'monthly'}/>
                <label htmlFor="a_val">Annually</label>
                <input type="radio" value="annually" name="date_type" id="a_val" onChange={(e) => setRecurType(e.target.value)} checked={recurType === 'annually'}/>
            </fieldset><br/>

            <label htmlFor="message_id" className="form-label">Message: (Optional)</label>
            <textarea className="form-control form-control-sm" name="message" id="message_id" rows={3} value={message} placeholder="Optional Note" style={{width: '75%'}} onChange={(e) => setMessage(e.target.value)}></textarea><br />
            
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
    </>
    )
}