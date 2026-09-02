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
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': django_token
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => console.log('Message: ', data))
}

// Simple function to set the visibility attribute to visible when the button is clicked
function unhide(tag_id) {
    document.getElementById(tag_id).style.visibility = 'visible';
}

