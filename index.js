const apiKey = 'y5hcXta6CphCRK5nP8QxgjfbtQFE9qkZfFGliQNG'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  $('#results-list').empty();
  $(`<h2>You have ${responseJson.data.length} results</h2>`).insertBefore('#results-list');
  // iterate through the data array
  for (let i = 0; i < responseJson.data.length; i++)  {
    // for each park in the data 
    //array, add a list item to the results 
    //list with the full name, description, link and addresses
    // responseJson.data[i].addresses.forEach(function(address) {
    //   console.log(address.city);
    // });
    let addresses = [];

    responseJson.data[i].addresses.forEach(function(address, index)  {
      let addressReceived = 
      `<h4>Address ${index + 1}</h4>
      <p><b>Street:</b> ${address.line1}</p>
      <p><b>City:</b> ${address.city}</p>
      <p><b>Postal Code:</b> ${address.postalCode}</p>`;
      addresses.push(addressReceived);
    })

    addresses = addresses.join('');   
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></p>
      <h3>Available addresses:</h3>
      <div class="address">${addresses}</div>`);
    };
    console.log(responseJson.data[0].addresses[0]);
};

function getParksList(query, maxResults=10) {
  const params = {
    api_key: apiKey,
    stateCode: query,
    limit: maxResults
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;
  $('#results-list').empty();
  $('<h2>Fetching data...</h2>').insertBefore('#results-list');

  fetch(url)
    .then(response => {
      if (response.ok) {
        $('#js-error-message').empty(); //removes any text if there was any from the previous unsuccesfull search)

        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
      $('#results-list').empty();
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    let stateCodes = $('#js-state-code').val()
                                        .replace(/\ /g,'');
    const maxResults = $('#js-max-results').val();
    $('#results').removeClass('hidden');  //display the results section
    getParksList(stateCodes, maxResults);
  });
}

$(watchForm);