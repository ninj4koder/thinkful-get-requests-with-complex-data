const apiKey = 'y5hcXta6CphCRK5nP8QxgjfbtQFE9qkZfFGliQNG'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  // if there are previous results, remove them
  $('#results-list').empty();
  $('#results-list').append(
      `<h2>You have ${responseJson.data.length} results</h2>`);
  // iterate through the data array
  for (let i = 0; i < responseJson.data.length; i++)  {
    // for each park in the data 
    //array, add a list item to the results 
    //list with the full name, description,
    //and link
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></p>`);
      for (let j = 0; j < responseJson.data[i].addresses.length; j++)  {
        $('#results-list').append(
          `<h4>Address ${j+1}</h4>
          <p><b>City:</b> ${responseJson.data[i].addresses[j].city}</p>
          <p><b>Street:</b> ${responseJson.data[i].addresses[j].line1}</p>
          <p><b>Postal code:</b> ${responseJson.data[i].addresses[j].postalCode}</p>
          <p><b>State:</b> ${responseJson.data[i].addresses[j].stateCode}</p>`);
      }
    };
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
  $('#results-list').append(
    `<h2>Fetching data...</h2>`);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
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