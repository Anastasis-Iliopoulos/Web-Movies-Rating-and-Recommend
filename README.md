# Frontend - Backend movie Rating and Recommendation using Pearson Correlation

## Frontend

---

### **main.js**

In the first line specify the ip and the port.

```javascript
usage: IPPORT = <ip:port>
example:
const IPPORT = '123.123.123.123:1234';
```

### **pearson.js**

In line 20 there is a condition in order to consider users that have at least 1% matched movies OR a specific matched Movies Percentage in interval (0,1).

This means if a user has less matched movies than 1% or mathed Movies Percentage then he will be excluded of the calculations of pearson correlation.

### **recommendation.js**

In the line 74 and 76 we specify the least precision and matched Movies Percentage in order to consinder for calculations (small numbers means more results but less acurracy, large numbers means more accuracy but higher probability not to find a match)

## Backend

---

### **app.js**

In the line 3 specify port

```javascript
usage: PORT = <port>
example:
const PORT = 1234;
```

In the line 4 specify the name of sqlite Database

```javascript
usage: DATABASE = 'moviesdatabase.db';
example:
const DATABASE = 'moviesdatabase.db';
```

Lines 9 and 16 specify CORS or no CORS (delete those lines for no cors)

### **DATABASE - sqlite3 module**

Assume a database in sqlite3 with schema as below. Steps to create the databese from csv files (consider movies.csv, ratings.csv see below for the schema)

Create DB 

```bash
sqlite3 moviesdatabese.db
```

Table rating

```bash
CREATE TABLE ratings(
-> "userId" int,
-> "movieId" int,
-> "rating" real,
-> "timestamp" int);
```

Table movies

```bash
CREATE TABLE movies(
-> "movieId" int,
-> "title" text,
-> "genres" text);
```

Ready to import csv files

```bash
.mode csv
```

Import ratings.csv (must have the above schema)

```bash
.import ratings.csv ratings
```

Import movies.csv (must have the above schema)

```bash
.import movies.csv movies
```

### **Nodejs**
See the package.json. To run use:

```bash
npm start
```