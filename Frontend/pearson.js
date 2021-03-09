//return array of pearson
function pearsonALLArray (arrayOfRatings,arrayOfUserRatings, pearsonPrecision, matchedMoviesPercent){
    // key == userID     value == [{movieId: mID, rating: rate}, {movieId: mID2, rating: rate}, {movieId: mID3, rating: rate}....]
    const map = new Map();
    for(let rec of arrayOfRatings){
        if(map.has(rec.userId)){
            const newValue = map.get(rec.userId);
            const tmpObj = {'movieId': rec.movieId, 'rating':rec.rating};
            newValue.push(tmpObj);
            map.set(rec.userId,newValue);
        } else {
            const newValue = [{'movieId': rec.movieId, 'rating':rec.rating}];
            map.set(rec.userId,newValue);
        }
    }
    
    // matchedMoviesPercent = how many movies do we need to hava a match       from 0.1=lower bound .. to 1=higher bound means ALL
    // Delete those users who do not fit in the Interval [low, userOFmapMovies/matchedMoviesPercent]
    for(let user of map){
        if((user[1].length/arrayOfUserRatings.length < 0.01) || (user[1].length/arrayOfUserRatings.length < matchedMoviesPercent)){
            map.delete(user[0]);
        }
    }
    
    // Create an Array to add All Pearson correlation coefficient 
    // MDN -> user == [key, value]
    // for each user call pearsonXY to return Pearson correlation coefficient
    // arrayX = frontend user ratings      arrayY = DB users ratings
    // Finally add each Pearson correlation coefficient to Array and sort the array
    const pearsonArray = [];
    for(let user of map){
        let arrayX = [];
        let arrayY = [];
        for(let i=0;i<user[1].length;i++){
            arrayY.push(user[1][i].rating);
            for(let j=0; j<arrayOfUserRatings.length;j++){
                // calculate the movies that match for both (e.g userX= [1,2,3], userY[1,3] calculate only the movie 1 and movie 3... movie 2 does not exist to Y)
                if(user[1][i].movieId == arrayOfUserRatings[j].movieId){
                    arrayX.push(arrayOfUserRatings[j].rating);
                    break;
                }
            }
        }
        
        let pearson = pearsonXY(arrayX,arrayY);
        // Exclude if pearson < pearsonPrecision      pearsonPrecision:   From 0.01 = really low To: 1 = really High
        if(pearson > pearsonPrecision){
            let pearsonObject = {'userId': user[0], 'pearson':pearson};
            pearsonArray.push(pearsonObject);
        } 
        
    }

    // implement sort function -> sort based on Pearson correlation coefficient
    pearsonArray.sort(function(x, y) {
        if (x.pearson > y.pearson) {
            return -1;
        }
        if (x.pearson < y.pearson) {
            return 1;
        }
            return 0;
    });
       
    return pearsonArray;
    // key == userID     value == [{movieId: mID, rating: rate}, {movieId: mID2, rating: rate}, {movieId: mID3, rating: rate}....]
}

// Pearson correlation coefficient 
// r_xy = \frac{ n*\sum{x_i * y_i} - \sum{x_i} * \sum{y_i} }{ \sqrt{n*\sum{{x_i}^2} - {\sum{x_i}^2} * \sqrt{n*\sum{{y_i}^2} - {\sum{y_i}^2} }
function pearsonXY (arrayX,arrayY){
    let sumX=0;
    let sumY=0;
    let n = arrayY.length;
    let sumXY = 0;
    let sumSquareX=0;
    let sumSquareY=0;
    for(let i=0;i<n;i++){
        sumX = sumX + arrayX[i];
        sumY = sumY + arrayY[i];
        sumXY = sumXY + arrayX[i]*arrayY[i];
        sumSquareX = sumSquareX + arrayX[i]*arrayX[i];
        sumSquareY = sumSquareY + arrayY[i]*arrayY[i];
    }

    let numerator = (n*sumXY) - (sumX*sumY);
    let denominator = Math.sqrt((n*sumSquareX) - (sumX*sumX)) * Math.sqrt((n*sumSquareY) - (sumY*sumY));
    
    let r_xy = 0;
    if(denominator != 0){
        r_xy = numerator/denominator;
    }
    
    return r_xy;
}