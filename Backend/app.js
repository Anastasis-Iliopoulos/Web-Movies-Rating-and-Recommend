process.title = 'node_backend_ergasia';

const PORT = 1234;
const DATABASE = 'moviesdatabase.db';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(DATABASE);

const cors = require('cors');
const bodyparser = require('body-parser');

const express = require('express');
const app = express();

app.listen(PORT);
app.use(cors());
app.use(bodyparser.json());
app.use(express.static('public'));

//URL: http://123.123.123.123:1234/movie/{mId}
//method: GET
//input: movie's mID as parameter - "id"
//output: json array - movies info
app.get('/movie/:id', async (req, res)=>{
    const query = `select movieId,title,genres from movies where movieId=${req.params.id};`;
    try{
        const results = await doQuery(query);
        res.json(results);
    } catch(err){
        console.error(err);
        res.status(500).send(err);
    }
});

//URL: http://123.123.123.123:1234/ratings/{id}
//method: GET
//input: movie's uID user as parameter - "id"
//output: json array with ratings and other movie's info 
//which user uID has seen(rate).
app.get('/ratings/:id', async (req, res)=>{
    const query = `select userId,movieId,rating,timestamp from ratings where userId=${req.params.id};`;
    try{
        const results = await doQuery(query);
        res.json(results);
    } catch(err){
        console.error(err);
        res.status(500).send(err);
    }
});

//URL: http://123.123.123.123:1234/movie
//method: POST
//input: string in json format in the form of {"keyword":"Toy"}
//output: json array with movies info and users id 
//movies beggin with string - input string.
app.post('/movie/', async (req, res)=>{
    const search = req.body;
    const query = `select movieId,title,genres from movies where title like "${search.keyword}%";`;
    try{
        const results = await doQuery(query);
        res.json(results);
    } catch(err){
        console.error(err);
        res.status(500).send(err);
    }
});

//URL: http://123.123.123.123:1234/ratings
//method: POST
//input: json include an array of movies' mID in the form of {"movieList":[4,5,12]}
//output: json array with ratings for every movie and every user
app.post('/ratings/', async (req, res)=>{
    const list = req.body.movieList;                                         //${list}
    const query = `select userId,movieId,rating,timestamp from ratings where movieId in (${list});`;
    try{
        const results = await doQuery(query);
        res.json(results);
    } catch(err){
        console.error(err);
        res.status(500).send(err);
    }
});

function doQuery (query){
    return new Promise((resolve, reject)=> {
        db.all(query, (err, data)=> {
            if(err){
                reject(err);
                return;
            }
            resolve(data)
        });
    });
}
