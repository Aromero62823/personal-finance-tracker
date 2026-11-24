import { useState } from "react";

// Component that will help users submit POST requests to enter transactions
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

    // Entering a POST request via an async function
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
                <legend className="form-label">Type: </legend>
                <div className="form-check form-check-inline">
                        <input type='radio' value="income" id="i_choice" checked={type === 'income'} className="form-check-input" onChange={(e) => {
                            setType(e.target.value)
                            setSubType('earned')}} 
                        />
                        <label htmlFor="i_choice" className="form-check-label">Income</label>
                </div>

                <div className="form-check form-check-inline">
                        <input type="radio" value="expense" id="e_choice" checked={type === 'expense'} className="form-check-input" onChange={(e) => {
                            setType(e.target.value)
                            setSubType('food')}} 
                        />
                    <label htmlFor="e_choice" className="form-check-label">Expense</label>
                </div>
            </fieldset><br />

            <fieldset disabled={type === 'expense'}>
                <legend className="form-label">Income Category: </legend><br/>
                <div className="form-check form-check-inline">
                    <input type="radio" value="earned" name="sub_i_type" id="earned_type" checked={subType === 'earned'} className="form-check-input" onChange={(e) => setSubType(e.target.value)}/>
                    <label htmlFor="earned_type" className="form-check-label">Earned</label><br/>
                </div>

                <div className="form-check form-check-inline">
                    <input type="radio" value="portfolio" name="sub_i_type" id="portfolio_type" checked={subType === 'portfolio'} className="form-check-input" onChange={(e) => setSubType(e.target.value)} />
                    <label htmlFor="portfolio_type" className="form-check-label">Portfolio</label><br/>
                </div>

                <div className="form-check form-check-inline">
                    <input type="radio" value="passive" name="sub_i_type" id="passive_type" checked={subType === 'passive'} className="form-check-input" onChange={(e) => setSubType(e.target.value)} />
                    <label htmlFor="passive_type" className="form-check-label">Passive</label>
                </div>
            </fieldset><br/>

            <fieldset disabled={type === 'income'}>
                <legend className="form-label">Expense Category: </legend><br/>
                <div className="form-check">
                    <input type="radio" value="food" name="sub_e_type" id="food_type" checked={subType === 'food'} className="form-check-input" onChange={(e) => setSubType(e.target.value)} />
                    <label htmlFor="food_type" className="form-check-label">Food/Grocery</label><br/>
                </div>

                <div className="form-check">
                    <input type="radio" value="housing" name="sub_e_type" id="housing_type" checked={subType === 'housing'} className="form-check-input" onChange={(e) => setSubType(e.target.value)} />
                    <label htmlFor="housing_type" className="form-check-label">Housing/Utilities</label><br/>
                </div>

                <div className="form-check">
                    <input type="radio" value="personal" name="sub_e_type" id="personal_type" checked={subType === 'personal'} className="form-check-input" onChange={(e) => setSubType(e.target.value)} />
                    <label htmlFor="personal_type" className="form-check-label">Personal</label><br/>
                </div>

                <div className="form-check">
                    <input type="radio" value="transportation" name="sub_e_type" id="transportation_type" checked={subType === 'transportation'} className="form-check-input" onChange={(e) => setSubType(e.target.value)} />
                    <label htmlFor="transportation_type" className="form-check-label">Transportation</label><br/>
                </div>

                <div className="form-check">
                    <input type="radio" value="financial" name="sub_e_type" id="financial_type" checked={subType === 'financial'} className="form-check-input" onChange={(e) => setSubType(e.target.value)} />
                    <label htmlFor="financial_type" className="form-check-label">Financial/Debt</label><br/>
                </div>
            </fieldset><br/>

            <label htmlFor="amount_id" className="form-label">Transaction Amount: </label><br />
            <input type="number" id="amount_id" placeholder="Amount" className="form-control" onChange={(e) => setAmount(e.target.value)} required={true}/><br /><br />

            <label htmlFor="date_id" className="form-label">Date of Transaction: </label><br />
            <input type="date" name="date" id="date_id" className="form-control" onChange={e => setDate(e.target.value)} required={true}/><br />

            <fieldset>
                <legend className="form-label">Recurring Transaction?: </legend>
                <div className="form-check form-check-inline">
                    <input type="radio" value="yes" id="recur_yes" name="recur_choice" checked={recur === true} className="form-check-input" onChange={() => {
                        setRecur(true)
                        setRecurType('daily')}} 
                    />
                    <label htmlFor="recur_yes" className="form-check-label">Yes</label>
                </div>

                <div className="form-check form-check-inline">
                    <input type="radio" value="no" id="recur_no" name="recur_choice" checked={recur === false} className="form-check-input" onChange={() => {
                        setRecur(false) 
                        setRecurType('N/A')}}
                    />
                    <label htmlFor="recur_no" className="form-check-label">No</label>
                </div>
            </fieldset><br/>

            <fieldset disabled={recur === false}>
                <legend className="form-label">When is this transaction's recurrence date? </legend><br />
                <div className="form-check form-check-inline">
                    <input type="radio" value='daily' name="date_type" id="d_val" className="form-check-input" onChange={(e) => setRecurType(e.target.value)} checked={recurType === 'daily'}/>
                    <label htmlFor="d_val" className="form-check-label">Daily</label>
                </div>

                <div className="form-check form-check-inline">
                    <input type="radio" value="weekly" name="date_type" id="w_val" className="form-check-input" onChange={(e) => setRecurType(e.target.value)} checked={recurType ==='weekly'}/>
                    <label htmlFor="w_val" className="form-check-label">Weekly</label>
                </div>

                <div className="form-check form-check-inline">
                    <input type="radio" value="monthly" name="date_type" id="m_val" className="form-check-input" onChange={(e) => setRecurType(e.target.value)} checked={recurType === 'monthly'}/>
                    <label htmlFor="m_val" className="form-check-label">Monthly</label>
                </div>

                <div className="form-check form-check-inline">
                    <input type="radio" value="annually" name="date_type" id="a_val" className="form-check-input" onChange={(e) => setRecurType(e.target.value)} checked={recurType === 'annually'}/>
                    <label htmlFor="a_val" className="form-check-label">Annually</label>
                </div>
            </fieldset><br/>

            <label htmlFor="message_id" className="form-label">Message: (Optional)</label>
            <textarea className="form-control form-control-sm" name="message" id="message_id" rows={3} value={message} placeholder="Optional Note" style={{width: '100%'}} onChange={(e) => setMessage(e.target.value)}></textarea><br />
            
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
    </>
    )
}