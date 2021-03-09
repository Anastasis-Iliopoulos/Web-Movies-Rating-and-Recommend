const IPPORT = '123.123.123.123:1234';
// this is to prevent multiple call from multiple clicks (triple clicks or keep enter down)
let isRunning=false;
window.addEventListener('load',(e) => {
  //close popup
  document.getElementById('mainPageID').addEventListener('click', (e)=>{
    const oldPopup = document.getElementById('popup');
    const oldBtnSubmitRate = document.getElementById('btnSubmitRating');
    if((oldBtnSubmitRate != null) && (e.target.parentElement.className !=='submitTD') && (e.target.parentElement.className !=='ratingTD')){
        oldBtnSubmitRate.parentElement.remove();
    }
    if((oldPopup != null) && (e.target.className !=='titleTD')&& (e.target.parentElement.className !=='titleTD')&& (e.target.parentElement.className !=='popup')){
      oldPopup.remove();
    }
  }); 
  

  document.getElementById('txtInputSearch').addEventListener('keydown', (e)=>{
    if (e.key === 'Enter') {
      document.getElementById("btnGO").click();
    }

  });

  document.getElementById('btnGO').addEventListener('click', (e)=>{
    const oldWarning = document.getElementById('warningMessage');
    if(oldWarning!=null){
      oldWarning.remove();
    }
    const txtSearch =document.getElementById('txtInputSearch').value;
    if(isRunning){
      return;
    }
    if(txtSearch.length<3){
      const warningMessageContainer = document.createElement('div');
      warningMessageContainer.setAttribute('id','warningMessage');
      warningMessageContainer.setAttribute('class','warningMessage');
      const txtTextNode = document.createTextNode('Searching must be at least 3 letters!');
      warningMessageContainer.appendChild(txtTextNode);
      const parent = document.getElementById('txtInputSearch').parentElement;
      parent.appendChild(warningMessageContainer);
      return;
    } else if(txtSearch.charAt(0) == " "){
      const warningMessageContainer = document.createElement('div');
      warningMessageContainer.setAttribute('id','warningMessage');
      warningMessageContainer.setAttribute('class','warningMessage');
      const txtTextNode = document.createTextNode('Please remove the space in front of your search.');
      warningMessageContainer.appendChild(txtTextNode);
      const parent = document.getElementById('txtInputSearch').parentElement;
      parent.appendChild(warningMessageContainer);
      return;
    }
    isRunning=true;
    // correct mistakes, null, not found,
    // if all ok then go further....

    // Take divTable Container To Place Loading...
    const divTableContainer = document.getElementById('divTableContainer');

    // search for old table/pagination divs if != null then remove them
    const oldTableElement = document.getElementById('tableMovies');
    const oldTablePaginationElement = document.getElementById('tablePagination');
    if(oldTableElement != null){
      oldTableElement.remove();
    }
    if(oldTablePaginationElement!=null){
      oldTablePaginationElement.remove();
    }

    //    -------->    Start with a Clean html    <----------
    
    
    // create and set text "Loading..." to Table Container
    const txtLoadingContainer = document.createElement('div');
    const txtTextNode = document.createTextNode('Loading...');
    txtLoadingContainer.setAttribute('id','divLoadingContainer')
    txtLoadingContainer.setAttribute('class','divLoadingContainer');
    txtLoadingContainer.appendChild(txtTextNode);
    divTableContainer.appendChild(txtLoadingContainer);

    // Setup everything to send request
    const url = 'http://'+IPPORT+'/movie';
    const async = true;
    const method = "POST";
    const xhr = new XMLHttpRequest ();
    xhr.open(method,url,async);
    xhr.setRequestHeader('Content-Type','application/json')
    xhr.send(JSON.stringify({keyword:txtSearch}));

    xhr.onreadystatechange = function () {
      if(xhr.readyState == 4 && xhr.status == 200){
        // Now we have the response
        // First delete txtLoading container in order to put the Table of Movies
        const txtLoadingContainer = document.getElementById('divLoadingContainer');
        txtLoadingContainer.remove();

        // Get the response and setup constant variables and get size of Table
        const arrayOfMovies = JSON.parse(xhr.responseText);
        if(arrayOfMovies.length!=0){
          const numberOfrowsAvailableInPage = 10;
          const pages=Math.ceil(arrayOfMovies.length/numberOfrowsAvailableInPage);

          // place a Table without Body                
          placeTableNoBody(pages);
          // Place Body
          placePage(numberOfrowsAvailableInPage,1,arrayOfMovies);
          // Place Pagination Elements IF needed
          if(pages>1){
            placePaginationElements(numberOfrowsAvailableInPage,pages,arrayOfMovies);
          }  
        } else {
          // If there is no results!
          const nomoviesContainer = document.createElement('div');
          const nomoviesTxtNode = document.createTextNode('No matches found. Try a different search ...');
          nomoviesContainer.appendChild(nomoviesTxtNode);
          nomoviesContainer.setAttribute('id','tableMovies');
          divTableContainer.appendChild(nomoviesContainer);
        }
        isRunning =false;
      }  
    }
  });

  document.getElementById('btnRecommend').addEventListener('click', (e)=>{
    if(isRunning){
      return;
    }
    isRunning = true;
    const USER = 'userV';

    // Rate more movies
    if(sessionStorage.getItem(USER)==null){
      alert('You have Rated 0 movies \nPLEASE RATE AT LEAST 5 MOVIES');
      isRunning = false;
      return;

    } else if (JSON.parse(sessionStorage.getItem(USER)).length<5){
      alert('You have Rated '+JSON.parse(sessionStorage.getItem(USER)).length+' movies \nPLEASE RATE AT LEAST 5 MOVIES');
      isRunning = false;
      return;
    }

    // Get Frontend User's Ratings and Movies title
    const arrayOfUserRatings = JSON.parse(sessionStorage.getItem(USER));
    const arrayOfUserWatchedMovies = [];
    for(movie of arrayOfUserRatings){
      arrayOfUserWatchedMovies.push(movie.movieId);
    }
    
    // ----------> Create a Custom Progress Bar for Long Task <----------
    const progressBarContainer = document.getElementById('divHeaderContainer');
    const progressBar = document.createElement('div');
    progressBar.setAttribute('id', 'progressBar');
    progressBarContainer.appendChild(progressBar);

    // This is for the text e.g. 33% for the progress bar
    let txtProgressBar = document.createTextNode('');
    progressBar.appendChild(txtProgressBar);

    // Setup the request
    const url = 'http://'+IPPORT+'/ratings';
    const async = true;
    const method = "POST";
    const xhr = new XMLHttpRequest ();
    xhr.open(method,url,async);
    xhr.setRequestHeader('Content-Type','application/json');
    
    // What to do on load start ---> place progress bar
    xhr.onloadstart = function () {
      progressBar.style.width = 0+'%;';
      txtProgressBar.textContent = '0%';
    };

    // What to do on progress (downloading data) ---> update progress bar width and progress bar text
    xhr.onprogress = function (event) {
      const currentDownloaded = event.loaded;
      const totalDownloaded = event.total;
      let percentOfProgress = Math.round(currentDownloaded/totalDownloaded*100);
      txtProgressBar.textContent = percentOfProgress + '%';
      progressBar.style.width = percentOfProgress + '%';
    };

    // What to do on readyState change
    xhr.onreadystatechange = async function () {
      if(xhr.readyState == 4 && xhr.status == 200){
        const arrayOfRatings = JSON.parse(xhr.responseText);
        const recommendArray = await getUserMovies(arrayOfRatings,arrayOfUserRatings);
        if(recommendArray.length<1){
          alert('There are no Recommendations for you. Pearson Coef is too low! \n\n Please Rate More Movies')
        }
        placeRecommendations(recommendArray);
        const progressBarContainer = document.getElementById('progressBar');
        progressBarContainer.remove();
        isRunning = false;
      }
    }

    // send
    xhr.send(JSON.stringify({movieList: arrayOfUserWatchedMovies}));

  });
});