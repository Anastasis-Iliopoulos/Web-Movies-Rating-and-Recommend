
function placeRecommendations(recommendedArray){
    const divTableContainer = document.getElementById('divRecommendationContainer');
    //remove old
    const oldTable = document.getElementById('tableMoviesRecommendations');
    if(oldTable!=null){
        oldTable.remove();
    }

    // Construct Table
    const table = document.createElement('table');
    table.setAttribute('id','tableMoviesRecommendations');
    table.setAttribute('class','tableMoviesRecommendations');
    // Append Table
    divTableContainer.appendChild(table);

    // Construct Table Head
    const tableHeadElement = document.createElement('thead');
    tableHeadElement.setAttribute('id', 'tableMoviesRecommendationsHead');
    tableHeadElement.setAttribute('class', 'tableMoviesRecommendationsHead');       

    // Construct Row and Headers for the Table Head and Append them
    const tableRowHeader = document.createElement('tr');
    table.appendChild(tableRowHeader);
    const tableHeaderTitle = document.createElement('th');
    const tableHeaderGenre = document.createElement('th');
    tableRowHeader.appendChild(tableHeaderTitle);
    tableRowHeader.appendChild(tableHeaderGenre);
    tableHeaderTitle.setAttribute('class','tableMoviesRecommendationsHeader');
    tableHeaderGenre.setAttribute('class','tableMoviesRecommendationsHeader');
    // Fill the Header Texts    
    const titleHeader = document.createTextNode('');
    const genreHeader = document.createTextNode('');                
    tableHeaderTitle.appendChild(titleHeader);
    tableHeaderGenre.appendChild(genreHeader);

    const tableBody = document.createElement('tbody');
    table.appendChild(tableBody);
    tableBody.setAttribute('id', 'tableMoviesRecommendationsBody');
    tableBody.setAttribute('class', 'tableMoviesRecommendationsBody');

    // fetch promises to get movies info
    const promises = [];
    for(let movie of recommendedArray){
        const url = 'http://'+IPPORT+'/movie/'+movie;
        promises.push(fetch(url,{
            method: 'GET'
        }).then((response)=> response.json()).catch(err => console.log(reject(err))));
    }
    // when promises fullfiled fill the table
    let moviesArray = Promise.all(promises).then((result)=> {
        for(let row of result){
            const tmpRow = document.createElement('tr');
            tableBody.appendChild(tmpRow);
            const tmpDataTitle = document.createElement('td');
            const tmpDataGenre = document.createElement('td');
            tmpRow.appendChild(tmpDataTitle);
            tmpRow.appendChild(tmpDataGenre);
            tmpDataTitle.setAttribute('class','titleTD');
            tmpDataGenre.setAttribute('class','genreTD');
            const tmpTextNodeTitle = document.createTextNode(row[0].title)
            const tmpTextNodeGenre = document.createTextNode(row[0].genres)
            tmpDataTitle.appendChild(tmpTextNodeTitle);
            tmpDataGenre.appendChild(tmpTextNodeGenre);
        }
        
    }).catch(err => console.log(reject(err)));
    
}

async function getUserMovies(arrayOfRatings,arrayOfUserRatings){
    let recommendArray = [];
    let matchedMoviesPercent=0.95;
    while(recommendArray.length<10 && matchedMoviesPercent>0.20){
      let precision = 0.95;
      while (recommendArray.length<10 && precision>0.20){
        const pearsonSortedArray = pearsonALLArray(arrayOfRatings,arrayOfUserRatings,precision,matchedMoviesPercent);
            if(pearsonSortedArray.length>0){
                for(let i=0; i<pearsonSortedArray.length; i++){
                    if(recommendArray.length>=10){
                        break;
                    }
                    const url = 'http://'+IPPORT+'/ratings/'+pearsonSortedArray[i].userId;
                    await fetching(url,recommendArray,arrayOfUserRatings);
                }
            }
            precision-=0.05;
        }
        matchedMoviesPercent-=0.05;
    }  
    return recommendArray;
}

function fetching (url,recommendArray,arrayOfUserRatings){
    return new Promise((resolve, reject) => {
        fetch(url, { 
            method: "GET"
        })
        .then(response => response.json() )
        .then(resp => {
            while(resp.length>0 && recommendArray.length<10){
                // take a random number for the index, then take movie that match at this index and finally exclude this movie from the array
                // This implementation give 10 random movies
                const movieIndex = Math.floor(Math.random() * resp.length);
                const movie = resp[movieIndex];
                let movieWatched=false;
                if(movie.rating > 4.0){
                    for(const movieUser of arrayOfUserRatings){
                        if(movieUser.movieId == movie.movieId){
                            movieWatched=true;
                        }
                    }
                    if(!movieWatched){
                        recommendArray.push(movie.movieId);
                        
                    }
                }
                resp.splice(movieIndex, 1);
            }
            resolve(recommendArray);
        })
        .catch(err => console.log(reject(err)));  
    }) 
}

