// Array for the filterMonth() functions
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

// function for the homepage plot - Specifically, filtering month/year
function filterMonth() {
    // Extracting values from DOM and parsed Date object
    var plot = document.getElementById('plot_graph');
    var date_val = document.getElementById('date_choice').value;
    var djangotoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // Extracting the Date value as an object to extract month and year values 
    var date = new Date(Date.parse(date_val));
    var month = date.getUTCMonth();
    year=date.getFullYear();

    fetch(
        window.location.href, {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'X-CSRFTOKEN': djangotoken
            },
            body: JSON.stringify({'month': month+1, 'year': year})
        }
    )
    .then(response => response.json())
    .then(data => {
        let vals = [{
            values: data.amount,
            labels: data.type,
            type: 'pie',
            color: data.type,
            textinfo: 'label+percent'
        }]
        // From the internet, to have a consistent color palette
        let layout = {
            colorway: [
                '#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A', 
                '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECb52'
            ],
            title: {
                text: 'Expenses vs Income',
                xref:'paper',
                x: 0.008
            }
        }
        Plotly.newPlot(plot, vals, layout);
        document.getElementById('home_header').innerHTML = `${months[month]} ${year}`;
    })
    .catch(error => console.log(`Error: ${error}`))

    
}

// Saving Changes of the edited information
function submitEdits(id, counter) {
    // Getting the transaction type
    let transaction_type = document.querySelector(`[name=t_type_${counter}]:checked`).value;

    // Fetching the sub-transaction type
    let subtransaction_type;
    if(transaction_type === 'income') {
        subtransaction_type = document.querySelector(`[name=sub_i_type_${counter}]:checked`).value;

    } else {
        subtransaction_type = document.querySelector(`[name=sub_e_type_${counter}]:checked`).value;
    }

    // Fetching the amount if typed, if the user hasn't entered anything, django will handle in the backend
    let amount = document.getElementById(`hid-1_${counter}`).value;
    
    // Fetching the date, same null/None type handling at the backend
    let date = document.getElementById(`hid-2_${counter}`).value;
    
    // Fetching the optional message
    let message = document.getElementById(`hid-3_${counter}`).value;

    // Fetching if the transaction is recurring or not
    let recurring = (document.querySelector(`[name=recur_choice_${counter}]:checked`).value === 'yes');

    // Fetching the recurring type, if the recurring is set to true
    let recurring_type = 'N/A';
    if (recurring == true) {
        recurring_type = document.querySelector(`[name=date_type_${counter}]:checked`).value;
    }


    // Initializing the payload in correlation to the attribute names
    var p = {id, transaction_type, subtransaction_type, amount, date, message, recurring, recurring_type}

    // URL for the current window to reference for a POST request
    var curr_url = window.location.href;

    // Django Token ref
    const django_token = document.querySelector('[name=csrfmiddlewaretoken]').value;

    // Fetch API to send POST data
    fetch(curr_url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': django_token
        },
        body: JSON.stringify(p)
    })
    .then(response => response.json())
    .then(data => console.log('Message: ', data))
    // Reload the window to show submitted changes
    window.location.reload()
}

// Deleting a Query from a database via the id provided
function deleteQuery(id) {
    // retreiving token via django middleware
    var djangotoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    // Get the current url
    var url = window.location.href;

    // Send it to the backend via the fetch API
    fetch(url ,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFTOKEN': djangotoken
        },
        body: id
    })
    .then(response => response.json())
    .then(data => console.log(`Successfully deleted: ${data}`));
    // refresh the page after deletion
    window.location.reload();
}

// Simple function to set the visibility attribute to visible when the button is clicked
function unhide(tag_id) {
    document.getElementById(tag_id).style.visibility = 'visible';
}

// Enabling the fieldset
function enableRange(id) {
    date_range = document.getElementById(id);
    if (date_range.disabled == true) {
        date_range.disabled = false;
    }
}

// Disabling the fieldset
function disableRange(id) {
    date_range = document.getElementById(id);
    if (date_range.disabled == false) {
        date_range.disabled = true;
    }
}

// Enabing sub groups to be disabled/enabled when Income or Expense is selected
function enableSubGroup(id1, id2) {
    obj1 = document.getElementById(id1);
    obj2 = document.getElementById(id2);

    if(obj1.disabled == true) { 
        obj1.disabled = false;
        obj2.disabled = true;
    }
}

// Checking form data and sending data as a POST request
function submitTransaction() {
    // Transaction type
    let t_type = document.querySelector('input[name=t_type]:checked').value;
    // Sub-transaction type
    let sub_type;
    if (t_type == 'income') { 
        sub_type = document.querySelector('input[name=sub_i_type]:checked').value; 
    }
    else { 
        sub_type = document.querySelector('input[name=sub_e_type]:checked').value; 
    }

    // Amount of the transaction
    let amount = document.getElementById('amount_id').value;

    // Date of the transaction
    let date = document.getElementById('date_id').value;

    // Whether or not the transaction is recurring via boolean value
    let recur = (document.querySelector('input[name=recur_choice]:checked').value === "yes");
    
    // The date range via the recur type
    let recur_type;
    if (recur) { 
        recur_type = document.querySelector('input[name=date_type]:checked').value; 
    }
    else { recur_type = "N/A"; }

    // Message that is optional and describes the transaction in more detail
    let message = document.getElementById('message_id').value;

    // Initializing the Payload
    let payload = {
        t_type,
        sub_type,
        amount,
        date,
        recur,
        recur_type,
        message
    }

    // Fetch api
    fetch(window.location.href, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if(response.ok) {
            window.location.reload();
        }
        console.log(response.json());
    })
    .catch(error => console.error(error))
}

// Parameterising the modal with the checked inputs that correlate with the data
function openModal(modalId, t_type, sub_type, recur, recur_type, counter) {
    // Fetching/Creating the modal via bootstrap
    let modalElement = document.getElementById(modalId);
    const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalElement);
    // Parameterise the modal inputs before it is shown
    let sub;
    // Prechecking the transaction type based off of the db query
    document.querySelector(`[name="t_type_${counter}"][value="${t_type}"]`).checked = true;

    // Having the previous subcategory pre-checked based off of what the transaction type
    if(t_type === 'income') {
        sub = document.querySelector(`[name="sub_i_type_${counter}"][value="${sub_type}"]`).checked = true;
        document.getElementById(`sub_expense_modal_${counter}`).disabled = true;
    } else {
        sub = document.querySelector(`[name="sub_e_type_${counter}"][value="${sub_type}"]`).checked = true;
        document.getElementById(`sub_income_modal_${counter}`).disabled = true;
    }
    // Changing it to boolean format
    recur = (recur === "True")

    // Pre-checking the recur choice fields, including the type
    if(recur === true) {
        document.querySelector(`[name=recur_choice_${counter}][value=yes]`).checked = true;
        document.querySelector(`[name=date_type_${counter}][value=${recur_type}]`).checked = true;
    } else {
        document.querySelector(`[name=recur_choice_${counter}][value=no]`).checked = true;
        document.getElementById(`date_range_id_${counter}`).disabled = true;
    }

    // Showing the modal to the user
    modalInstance.show();
}