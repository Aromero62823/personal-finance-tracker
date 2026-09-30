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
    var data = []
    
    for(let x = 1; x < 6; x++) {
        if(x == 4) {
            let values = document.getElementsByName(`t_type_${counter}`);
            for(let i = 0; i < values.length; i++) {
                if (values[i].checked) {
                    data.push(values[i].value)
                    continue;
                }
            }
        } else if (x == 5) {
            let subs = []
            if(data[3] == 'Income') {
                subs = document.getElementsByName(`sub_i_type_${counter}`);
            } else if(data[4] == 'Expense'){
                subs = document.getElementsByName(`sub_e_type_${counter}`);
            } else {
                break
            }
            for(let i = 0;i < subs.length;i++) {
                if (subs[i].checked) {
                    data.push(subs[i].value)
                }
            }
        } else {
            data.push(document.getElementById(`hid-${x}_${counter}`).value);
        }
    }

    var payload = {
        'id': id,
        'amount': data[0],
        'date': data[1],
        'message': data[2],
        'transaction_type': data[3],
        'subtransaction_type': data[4]
    }
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
        body: JSON.stringify(payload)
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
function openModal(modalId, t_type, sub_type) {
    let modalElement = document.getElementById(modalId);
    const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalElement);
    // Parameterise the modal inputs before it is shown
    let sub;
    // Subcategory
    if(t_type === 'income') {
        alert('INCOME')
        document.getElementsByName(`sub_i_type[value=${sub_type}]`).checked = true;
    } else {
        let eleVal = document.querySelector(`[name="sub_e_type"][value="${sub_type}"]`).checked = true;
        alert(eleVal.checked)
    }
    modalInstance.show();
}