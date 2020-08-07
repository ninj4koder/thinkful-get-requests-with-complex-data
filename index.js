const apiKey = 'y5hcXta6CphCRK5nP8QxgjfbtQFE9qkZfFGliQNG'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  console.log(responseJson.data.length);
  $('#results-list').empty();
  $('#results-list').append(
      `<h2>You have ${responseJson.data.length} results</h2>`);
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //list with the video title, description,
    //and thumbnail
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></p>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
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
    const stateCodes = $('#js-state-code').val();
    const maxResults = $('#js-max-results').val();
    getParksList(stateCodes, maxResults);
  });
}

$(watchForm);