// IIFE Init
(function() {
  const container = document.getElementById("LBA");

  // Event listener for the Fetch button
  const fetchBtn = container.querySelector('#fetchData');
  
  fetchBtn.addEventListener('click', () => {
    // Inits blank variables to fill
    let nextPageToken = '',
    p = [],
    params = '',
    url = '',
    finalURL = '';

    nextPageToken = document.querySelector('#npt').textContent;
    
    // Assigns the Google Places API Key | URL to make the call | and the Proxy URL
    // Add your API key here
    const key = '',
      proxyURL = "https://cors-anywhere.herokuapp.com/";

    // Grabs the data entered by the user
    keywords = document.querySelector('#searchQuery').value;
    
    // Converts the entered keywords to an array
    p = keywords.trim().split(" ");

    // Defines the last object in the array
    const last = p[p.length - 1];

    // Loops through the array objects and
    // formats the params list for Google to understand
    for (let i = 0; i < p.length; i++) {
      let query = p[i];
      if (query !== last) {
        params += query + '%20';
      } else {
        params += query
      }
    };

    // Updates the URL with the params based on
    // if there is a next page token or not
    if (nextPageToken === '' || nextPageToken === undefined) {
      console.log(`Next page token not detected`);
      url = 'https://maps.googleapis.com/maps/api/place/textsearch/json' + "?query=" + params + "&key=" + key;
    } else {
      console.log(`Next page token detected`);
      url = 'https://maps.googleapis.com/maps/api/place/textsearch/json' + "?pagetoken=" + nextPageToken + "&key=" + key + "&query=" + params;
    }
    
    // Concats the Proxy & URL
    finalURL = proxyURL + url;

    if (fetchBtn.classList.contains('nextPage')) {
      nextPage(finalURL, fetchBtn);
    } else {
      fetchData(finalURL, fetchBtn);
    }
  });
  // Event listener for the Collapse Data button
  container.querySelector('#newSearch').addEventListener('click', function() {
    closeAll();
  });
})();

function fetchData(finalURL, fetchBtn) {
  fetch(finalURL, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {

      console.log(data);

      // Grabs the token for the next page
      document.querySelector('#npt').textContent=data.next_page_token;

      // Initializes the output data
      let output = '';
      for (let i = 0; i < data.results.length; i++) {
        let result = data.results[i];
        output += `
        <div class="business">
          <h2>${result.name}</h2>
          <div class="content">
            <p><span class="heading">Address:</span> ${result.formatted_address}</p>
            <p><span class="heading">Business Types:</span> ${result.types}</p>
            <p><span class="heading">Rating:</span> ${result.rating}</p>
          </div>
          <hr class="short">
        </div>
      `;
      }
      document.querySelector('#output').innerHTML = output;
    })
    // Sets a delay for the container to appear while the data loads from the API
    setTimeout(function() {
      document.querySelector('.container.output').classList.add('show');
      document.querySelector('.title').classList.add('hide');
      fetchBtn.textContent="Next Page";
      fetchBtn.classList.add('nextPage');
      exposeProcess();
    }, 1200);
}

function nextPage(finalURL, fetchBtn) {
  console.log(finalURL);

  fetch(finalURL, {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {

    console.log(data);

    // Places the token for the next page
    document.querySelector('#npt').textContent=data.next_page_token;

    // Initializes the output data
    let output = '';
    for (let i = 0; i < data.results.length; i++) {
      let result = data.results[i];
      output += `
      <div class="business">
        <h2>${result.name}</h2>
        <div class="content">
          <p><span class="heading">Address:</span> ${result.formatted_address}</p>
          <p><span class="heading">Business Types:</span> ${result.types}</p>
          <p><span class="heading">Rating:</span> ${result.rating}</p>
        </div>
        <hr class="short">
      </div>
    `;
    }
    document.querySelector('#output').innerHTML = output;
    
    if (document.querySelector('#npt').textContent == '') {
      setTimeout(function() {
        alert(`Last page reached. Please perform a new search.`);
        document.querySelector('#fetchData').textContent='Fetch';
        document.querySelector('#fetchData').classList.remove('nextPage');
        document.querySelector('#searchQuery').value='';
      }, 1200);
      fetchBtn.classList.remove('nextPage');
    };
  })
}

// Exposes the Export and Collapse buttons
function exposeProcess() {
  console.log(`Process Buttons Toggled`);
  document.querySelector('.process.buttons').classList.add('show');
  document.querySelector('.dataInput').classList.add('space-top');
  document.querySelector('.container.main').classList.add('move-left');
}

function closeAll() {
  document.querySelector('.process.buttons').classList.remove('show');
  document.querySelector('.container.output').classList.remove('show');
  document.querySelector('.title').classList.remove('hide');
  document.querySelector('.dataInput').classList.remove('space-top');
  document.querySelector('.container.main').classList.remove('move-left');
  document.querySelector('#fetchData').textContent='Fetch';
  document.querySelector('#fetchData').classList.remove('nextPage');
  document.querySelector('#searchQuery').value='';
}
