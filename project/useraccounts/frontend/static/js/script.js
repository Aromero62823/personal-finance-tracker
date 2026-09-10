// Array for the filterMonth() functions
months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

// function for the homepage plot - Specifically, filtering month/year
function filterMonth() {
    // Extracting values from DOM and parsed Date object
    plot = document.getElementById('plot_graph');
    date_val = document.getElementById('date_choice').value;
    djangotoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // Extracting the Date value as an object to extract month and year values 
    date = new Date(Date.parse(date_val));
    month = date.getUTCMonth();
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

// Coming Soon: Will Update the History View with whatever parameters set by the user
function updateHistoryView() {
    alert('Changed!')
}

// Saving Changes of the edited information
function submitEdits(id, counter) {
    data = []
    
    for(let x = 1; x < 5; x++) {
        if(x == 4) {
            values = document.getElementsByName(`t_type_${counter}`);
            for(let i = 0; i < values.length; i++) {
                if (values[i].checked) {
                    data.push(values[i].value)
                    break
                }
            }
        } else {
            data.push(document.getElementById(`hid-${x}_${counter}`).value);
        }
    }
    payload = {
        'id': id,
        'amount': data[0],
        'date': data[1],
        'message': data[2],
        'transaction_type': data[3]
    }
    // URL for the current window to reference for a POST request
    curr_url = window.location.href;

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

function deleteQuery(id) {
    // retreiving token via django middleware
    djangotoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    // Get the current url
    url = window.location.href;

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

// Submit transaction button
function submitTransaction() {
    // Initializing form data and retreiving data from the formData object
    form =  new FormData(document.getElementById('transaction_form'));
    amount = form.get('amount');
    date = form.get('date');
    type = form.get('t_type');
    // Keeping track of errors
    error = false;
    error_message = "";
    alert_message = [];

    if(amount == null || amount <= 0) {
        alert_message.push('Invalid amount!');
        error=true;
    }

    if(date == "" || date == null) {
        alert_message.push('Invalid date value!');
        error=true;
    }

    if(type == null || type == "") {
        alert_message.push('Transaction type not specified!');
        error=true;
    }

    if(error == true) {
        for(let x in alert_message) {
            error_message = error_message + `${alert_message[x]}\n`
        }
        alert(error_message);
    } else {
        alert('Transaction Submitted Successfully');
    }
}

// Simple function to set the visibility attribute to visible when the button is clicked
function unhide(tag_id) {
    document.getElementById(tag_id).style.visibility = 'visible';
}

