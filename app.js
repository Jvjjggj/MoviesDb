const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
const path = require("path");
const dbpath = path.join(__dirname, "moviesData.db");
let db = null;
const connetDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3003, () => {
      console.log(`Server is Running`);
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

connetDBAndServer();

const directorFormat = function (i) {
  return {
    directorId: i.director_id,
    directorName: i.director_name,
  };
};

const movieFormat = function (i) {
  return {
    movieId: i.movie_id,
    directorId: i.director_id,
    movieName: i.movie_name,
    leadActor: i.lead_actor,
  };
};
// API 1
app.get("/movies/", async (request, response) => {
  const dbQuery = `select * from movie`;
  const dbresponse = await db.all(dbQuery);
  let lst = [];
  for (let i of dbresponse) {
    lst.push({
      movieName: i.movie_name,
    });
  }
  response.send(lst);
});

// API 2
app.post("/movies/", async (request, response) => {
  const bookDetails = request.body;
  const { directorId, movieName, leadActor } = bookDetails;
  const addBookQuery = `INSERT INTO
      movie (director_id,movie_name,lead_actor)
    VALUES
      (${directorId},"${movieName}","${leadActor}"
      );`;

  const dbResponse = await db.run(addBookQuery);
  const bookId = dbResponse.lastID;
  response.send("Movie Successfully Added");
});
// API 3
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const query = `
  select * from movie 
  where movie_id=${movieId}`;
  const dbresponse = await db.get(query);
  response.send(movieFormat(dbresponse));
});

// API 4

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const query = `
  update  movie 
  set director_id=${directorId} ,movie_name="${movieName}" ,lead_actor="${leadActor}" ;`;

  const dbresponse = await db.run(query);
  response.send("Movie Details Updated");
});

// API 5
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const query = `
    delete from movie 
    where movie_id=${movieId}`;
  const dbresponse = await db.run(query);
  response.send("Movie Removed");
});

// API 6
app.get("/directors/", async (request, response) => {
  const query = `
    select * from 
    director`;
  const dbresponse = await db.all(query);
  const lst = [];
  for (let i of dbresponse) {
    const change = directorFormat(i);
    lst.push(change);
  }
  response.send(lst);
});

// API 7

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const query = `
  select * from movie 
  where 
     director_id=${directorId}`;
  const dbresponse = await db.all(query);
  let lst = [];
  const format = (i) => {
    return {
      movieName: i.movie_name,
    };
  };
  for (let i of dbresponse) {
    const change = format(i);
    lst.push(change);
  }
  response.send(lst);
});

module.exports = app;
