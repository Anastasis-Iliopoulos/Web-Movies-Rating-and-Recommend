// ------->    PLACE TABLE NO BODY   <------------
function placeTableNoBody(pages){

    const divTableContainer = document.getElementById('divTableContainer');
    
    // Create Paginationg IF we have more than 1 pages
    if(pages>1){
        const divPaginationContainer = document.getElementById('divPaginationContainer');
        const tablePagination = document.createElement('div');
        divPaginationContainer.appendChild(tablePagination);
        tablePagination.setAttribute('id','tablePagination');
        tablePagination.setAttribute('class','tablePagination');
    }

    // Construct Table
    const table = document.createElement('table');
    table.setAttribute('id','tableMovies');
    table.setAttribute('class','tableMovies');
    // Append Table
    divTableContainer.appendChild(table);

    // Construct Table Head
    const tableHeadElement = document.createElement('thead');
    tableHeadElement.setAttribute('id', 'tableMoviesHead');
    tableHeadElement.setAttribute('class', 'tableMoviesHead');       

    // Construct Row and Headers for the Table Head and Append them
    const tableRowHeader = document.createElement('tr');
    table.appendChild(tableRowHeader);
    const tableHeaderTitle = document.createElement('th');
    const tableHeaderGenre = document.createElement('th');
    tableRowHeader.appendChild(tableHeaderTitle);
    tableRowHeader.appendChild(tableHeaderGenre);
    tableHeaderTitle.setAttribute('class','tableMoviesHeader');
    tableHeaderGenre.setAttribute('class','tableMoviesHeader');
    // Fill the Header Texts                        ----------> in title and genre or blank1 and 2 we can put headers <----------
    const titleHeader = document.createTextNode('');
    const genreHeader = document.createTextNode('');                
    tableHeaderTitle.appendChild(titleHeader);
    tableHeaderGenre.appendChild(genreHeader);
    // add blank cells for better looking 
    // (resizing problems in table when press a star "button")
    const blank1 = document.createElement('th');
    const blank2 = document.createElement('th');
    tableRowHeader.appendChild(blank1);
    tableRowHeader.appendChild(blank2);
}


// ------->    PRINT PAGE   <------------
function placePage(numberOfrowsAvailableInPage,page,arrayOfMovies){
    // Remove old Body in order to place the next body/page
    const oldTableBody = document.getElementById('tableMoviesBody');
    if(oldTableBody != null){
        oldTableBody.remove();
    }

    // Construct new Table Body and Append it
    const newtableBody = document.createElement('tbody');
    const table = document.getElementById('tableMovies');
    table.appendChild(newtableBody);
    newtableBody.setAttribute('id', 'tableMoviesBody');
    newtableBody.setAttribute('class', 'tableMoviesBody');
    
    // Place new Page of Table... Fill every row with Elements
    for(let i=(page-1)*numberOfrowsAvailableInPage; i<Math.min((page*numberOfrowsAvailableInPage),arrayOfMovies.length);i++){
        
        // Place Row, Table Data (3 cells title, genres, rating stars) 
        // Fill Cells With info from arrayOfMovies From end of previous page To End Of current page
        const tmpRow = document.createElement('tr');
        newtableBody.appendChild(tmpRow);
        
        
        const tmpDataTitle = document.createElement('td');
        tmpDataTitle.addEventListener('click', (e)=>{
            const oldPopup = document.getElementById('popup');
            
            
              
            if(oldPopup != null){
              if((oldPopup.parentElement === e.target) || (oldPopup===e.target) || (oldPopup===e.target.parentNode)){
                return;
              }
              oldPopup.remove();
            }
            const url = 'http://'+IPPORT+'/movie/'+arrayOfMovies[i].movieId;
            const async = true;
            const method = "GET";
            const xhr = new XMLHttpRequest ();
            xhr.open(method,url,async);
            xhr.onreadystatechange = function () {
              if(xhr.readyState == 4 && xhr.status == 200){
                const movieInfo = JSON.parse(xhr.responseText);
                const popup = document.createElement('div');
                const br = document.createElement('br');
                popup.setAttribute('class','popup');
                popup.setAttribute('id','popup');
                const popupTextTitleSpan = document.createElement('span');
                const popupTextGenresSpan = document.createElement('span');

                const popupTextTitle = document.createTextNode(movieInfo[0].title);
                const popupTextGenres = document.createTextNode(movieInfo[0].genres);

                popupTextTitleSpan.appendChild(popupTextTitle);
                popupTextGenresSpan.appendChild(popupTextGenres);
                popup.appendChild(popupTextTitleSpan);
                popup.appendChild(br);
                popup.appendChild(popupTextGenresSpan);
                tmpDataTitle.appendChild(popup);
              }  
            }
            xhr.send();
        });
        const tmpDataGenre = document.createElement('td');
        tmpRow.appendChild(tmpDataTitle);
        tmpRow.appendChild(tmpDataGenre);
        tmpDataTitle.setAttribute('class','titleTD');
        tmpDataGenre.setAttribute('class','genreTD');

        const tmpTextNodeTitle = document.createTextNode(arrayOfMovies[i].title)
        const tmpTextNodeGenre = document.createTextNode(arrayOfMovies[i].genres)
        tmpDataTitle.appendChild(tmpTextNodeTitle);
        tmpDataGenre.appendChild(tmpTextNodeGenre);
        
        const tmpRating = document.createElement('td');
        tmpRating.setAttribute('class','ratingTD');
        tmpRow.appendChild(tmpRating);
        
        // Costruct stars (5-star) 
        // Append class for checked/unchecked (change in event listener)
        // Append Event Listener to take Rating
        // Show a Submit Button in order to submit rating
        for(let j=0;j<5;j++){

            // Place Unchecked Stars
            const tmpStar = document.createElement('span');
            tmpStar.setAttribute('class','fa fa-star unchecked')
            tmpRating.appendChild(tmpStar);

            // Place Event Listener 
            // IF clicked Remove every submit button (to show a new one)
            // IF clicked Check this, Check the previous stars, Uncheck the next ones
            // Identify the Rating number match to Current Star
            tmpStar.addEventListener('click',(e)=>{
                let RATE = 0;
                const oldBtnSubmitRate = document.getElementById('btnSubmitRating');
                if(oldBtnSubmitRate){
                    oldBtnSubmitRate.parentElement.remove();
                }

                // Get Current Element to create and append Submit Button.
                let currentElement = e.target;
                const btnSubmitRating = document.createElement('input');
                btnSubmitRating.setAttribute('type','button');
                btnSubmitRating.setAttribute('id','btnSubmitRating');
                btnSubmitRating.setAttribute('value','Submit Rate!');
                const btnTd = document.createElement('td');
                btnTd.setAttribute('class','submitTD');
                btnTd.appendChild(btnSubmitRating);
                const parentTd = currentElement.parentElement;
                const parentRow = parentTd.parentElement;
                parentRow.appendChild(btnTd);

                // Add Listener to Submit Button
                btnSubmitRating.addEventListener('click',(e)=>{
                    saveToStorage(arrayOfMovies[i].movieId,RATE);
                });

                // Uncheck EVERY star is checked
                const arrayOfCheckedStars = document.getElementsByClassName('checked');
                if(arrayOfCheckedStars.length>0){
                    for(let i=arrayOfCheckedStars.length-1;i>-1;i--){
                        arrayOfCheckedStars[i].setAttribute('class','fa fa-star unchecked');
                    }
                }
                
                // Check the correct Stars
                while(currentElement){
                    RATE++;
                    currentElement.setAttribute('class','fa fa-star checked');
                    currentElement = currentElement.previousSibling;
                }
            });
        }
    }
}


// ------->    PLACE PAGINATION ELEMENTS   <------------
function placePaginationElements(numberOfrowsAvailableInPage,pages,arrayOfMovies){
    const divPaginationContainer = document.getElementById('tablePagination');

    
    // Setup Next and Previous Button, type, id, class, value
    const nextBtn = document.createElement('input');
    const previousBtn = document.createElement('input');
    nextBtn.setAttribute('id','btnNext');
    nextBtn.setAttribute('class','btnNext');
    nextBtn.setAttribute('type','button');
    nextBtn.setAttribute('value','Next');
    previousBtn.setAttribute('id','btnPrevious');
    previousBtn.setAttribute('class','btnPrevious');
    previousBtn.setAttribute('type','button');
    previousBtn.setAttribute('value','previous');

    // Append Button in the correvt order
    divPaginationContainer.appendChild(previousBtn);
    divPaginationContainer.appendChild(nextBtn);

    // Setup label for pages to inform user
    const divLabelContainer = document.createElement('div');
    const spanCurrentPage = document.createElement('span');
    const spanTotalPages = document.createElement('span');
    divLabelContainer.setAttribute('id','lblContainer');
    spanCurrentPage.setAttribute('id','lblCurrentPage');
    spanTotalPages.setAttribute('id','lblTotalPages');

    // Append
    divPaginationContainer.appendChild(divLabelContainer);
    divLabelContainer.appendChild(document.createTextNode('Page: '));
    divLabelContainer.appendChild(spanCurrentPage);
    divLabelContainer.appendChild(document.createTextNode('/'));
    divLabelContainer.appendChild(spanTotalPages);

    // Number first page and total
    const txtCurrentPage = document.createTextNode(1);
    const txtTotalPages = document.createTextNode(pages);
    spanCurrentPage.appendChild(txtCurrentPage);
    spanTotalPages.appendChild(txtTotalPages);

    nextPage(numberOfrowsAvailableInPage,pages,arrayOfMovies);
    previousPage(numberOfrowsAvailableInPage,arrayOfMovies);
}


// ------->    NEXT PAGE   <------------
function nextPage(numberOfrowsAvailableInPage,pages,arrayOfMovies){
    document.getElementById('btnNext').addEventListener('click', (e)=>{
        const currentPageElement = document.getElementById('lblCurrentPage');
        let currentPage = currentPageElement.childNodes[0].textContent;
        if(currentPage<pages){
            currentPage++;
            placePage(numberOfrowsAvailableInPage,currentPage,arrayOfMovies);
            currentPageElement.childNodes[0].nodeValue=currentPage;
        }
    });
}


// ------->    PREVIOUS PAGE   <------------
function previousPage(numberOfrowsAvailableInPage,arrayOfMovies){
    document.getElementById('btnPrevious').addEventListener('click', (e)=>{
        const currentPageElement = document.getElementById('lblCurrentPage');
        let currentPage = currentPageElement.childNodes[0].textContent;
        if(currentPage>1){
            currentPage--;
            placePage(numberOfrowsAvailableInPage,currentPage,arrayOfMovies);
            currentPageElement.childNodes[0].nodeValue=currentPage;
        }
    });
}

// ------->    Save To Storage   <------------
function saveToStorage(movieID, rate){
    const USER = 'userV';
    try {
      if(sessionStorage.getItem(USER)){
        let arrayOfUserRatings = JSON.parse(sessionStorage.getItem(USER));
        let movieIDExist = -1;
        for(let i=0; i<arrayOfUserRatings.length;i++){
          if ( arrayOfUserRatings[i].movieId == movieID ){
            movieIDExist=i;
          }
        }
        if(movieIDExist==-1){
          arrayOfUserRatings.push({movieId: movieID, rating: rate});
          sessionStorage.setItem(USER, JSON.stringify(arrayOfUserRatings));
        } else {
          if(confirm('You have already rate this movie. Do you want to save the new Rating?')){
            arrayOfUserRatings[movieIDExist].rating=rate;
            sessionStorage.setItem(USER, JSON.stringify(arrayOfUserRatings));
          }
        }
      } else {
        const arrayOfUserRatings = [{movieId: movieID, rating: rate}];
        sessionStorage.setItem(USER, JSON.stringify(arrayOfUserRatings));
      }
      
    } catch (error) {
      alert(error);
      alert('Try again or Restart!');
    }
  }