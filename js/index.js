console.log('App is running!');
// Utility functions:
// 1. Utility function to get DOM element from string
function getElementFromString(string) {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div.firstElementChild;
}

// Initialize number of parameters
let addedParamCount = 0;
// Hide the parameters box initially
let parametersBox = document.getElementById('parametersBox');
parametersBox.style.display = 'none';

// If the user click on params box, hide the json box
let paramsRadio = document.getElementById('paramsRadio');
paramsRadio.addEventListener('click', () => {
    document.getElementById('requestJsonBox').style.display = 'none';
    document.getElementById('parametersBox').style.display = 'block';
})

// If the user click on json box, hide the params box
let jsonRadio = document.getElementById('jsonRadio');
jsonRadio.addEventListener('click', () => {
    document.getElementById('parametersBox').style.display = 'none';
    document.getElementById('requestJsonBox').style.display = 'block';
})

// If the users click on + button, add more parameters
let addParam = document.getElementById('addParams');
addParam.addEventListener('click', () => {
    let params = document.getElementById('params');
    let string = `<div class="row my-2">
                    <label for="url" class="col-sm-2 col-form-label">Parameters ${addedParamCount + 2} :</label>
                    <div class="col">
                    <input
                        type="text"
                        class="form-control"
                        id="parameterKey${addedParamCount + 2}"
                        placeholder="Enter parameter ${addedParamCount + 2} Key"/>
                    </div>
                    <div class="col">
                    <input
                        type="text"
                        class="form-control"
                        id="parameterValue${addedParamCount + 2}"
                        placeholder="Enter parameter ${addedParamCount + 2} Value"/>
                    </div>
                    <button class="col btn btn-primary deleteParam"><b> X </b></button>
                </div>`;
    // Convert the element string to DOM node
    let paramElement = getElementFromString(string);
    // console.log(paramElement);
    params.appendChild(paramElement);

    // Add a event listener to remove the parameter on clicking X button
    let deleteParam = document.getElementsByClassName('deleteParam');
    for (item of deleteParam) {
        item.addEventListener('click', (e) => {
            e.target.parentElement.remove();
        })
    }
    addedParamCount++;
})

// If the user click on submit button
let submit = document.getElementById('submit');
submit.addEventListener('click', ()=>{
    // Show please wait in the response box to request patience from the user
    document.getElementById('responsePrism').value = `Please wait ... Fetching response ...`;

    // Fetch all the value user has entered
    let url = document.getElementById('url').value;
    let requestType = document.querySelector("input[name='requestType']:checked").value;
    let contentType = document.querySelector("input[name='contentType']:checked").value;

    // If user has used params option instead of json, collect all the parameters in an object
    if (contentType == 'params') {
        data = {};
        for (let i = 0; i < addedParamCount + 1; i++) {
            if (document.getElementById('parameterKey' + (i+1)) != undefined) {
                let key = document.getElementById('parameterKey' + (i+1)).value;
                let value = document.getElementById('parameterValue' + (i+1)).value;
                data[key] = value; 
            }
        }
        data = JSON.stringify(data);
    }
    else {
        data = document.getElementById('responsePrism').value;
    }

    // Log all the values in the console for debugging
    console.log('URL is ', url);
    console.log('requestType is ', requestType);
    console.log('contentType is ', contentType);
    console.log('data is ', data);

    // if the request type is get, invoke fetch api to create a post request
    if (requestType == 'GET') {
        fetch(url, {
            method: 'GET'
        })
        .then(response => response.text())
        .then((text) => {
            document.getElementById('responsePrism').innerHTML = text;
            Prism.highlightAll();
        });
    } else {
        fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(response => response.text())
        .then((text) => {
            document.getElementById('responsePrism').innerHTML = text;
            Prism.highlightAll();
        });
    }
});