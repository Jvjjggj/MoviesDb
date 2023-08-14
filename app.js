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

app.get("/movies/", async (request, response) => {
  const dbQuery = `select * from movie`;
  const dbresponse = await db.all(dbQuery);
  let lst = [];
  for (let i of dbresponse) {
    lst.push(i.movie_name);
  }
  response.send(lst);
});

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  //https://github.com/Jvjjggj/MoviesDb.git
  const { director_id, movie_name, lead_actor } = movieDetails;
  const dbQuery = `insert into movie (director_id,movie_name,lead_actor) 
  values (${director_id},"${movie_name}","${lead_actor}");`;
  const dbresponse = await db.run(dbQuery);
  const movieId = dbresponse.lastID;

  const { stmt, lastID, changes } = dbresponse;
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const integer = Number(movieId.movieId);
  const getBookQuery = `
    SELECT
        *
    FROM
        movie
    WHERE
        movie_id=${movieId};
    `;

  const dbresponse = await db.get(getBookQuery);

  const change = (dbresponse) => {
    return {
      movieId: dbresponse.movie_id,
      directorId: dbresponse.director_id,
      movieName: dbresponse.movie_name,
      leadActor: dbresponse.lead_actor,
    };
  };

  const changedb = change(dbresponse);

  response.send(changedb);
});
