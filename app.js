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
  const { directorId, movieName, leadActor };
});
