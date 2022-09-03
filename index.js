const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const path = require("path");
const PORT = process.env.PORT || 5000;

//process.env.PORT
//process.env.NODE_ENV=> production or undefined

//middleware
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  //server static content
  //npm run build
  app.use(express.static(path.join(__dirname, "client/build")));
  app.use(express.static("client/public"));
}

//perform a putaway
app.post("/putaway", async (req, res) => {
  try {
    const { wave, stage_location, no_of_pallets } = req.body;
    const newPutaway = await pool.query(
      "INSERT INTO stage (wave, stage_location, no_of_pallets) VALUES($1, $2, $3) RETURNING *",
      [wave, stage_location, no_of_pallets]
    );
    res.json(newPutaway.rows[0]);
  } catch (error) {
    if (
      error.message.includes(
        'duplicate key value violates unique constraint "stage_stage_location_key"'
      )
    ) {
      res.json(`Duplicated Key`);
    }
    res.json(error.message);
  }
});

//perform a search ALL
app.get("/search", async (req, res) => {
  try {
    const allStage = await pool.query(
      "SELECT * FROM stage WHERE released  = 'f' ORDER BY stage_location ASC"
    );
    res.json(allStage.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//perform a search for all the current occupied rows
app.get("/occupied", async (req, res) => {
  try {
    const allStage = await pool.query(
      "SELECT stage_location FROM stage WHERE released  = 'f' ORDER BY stage_location ASC"
    );
    res.json(allStage.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//perform search for one or multiple field
app.get("/search/:wave/:loc", async (req, res) => {
  try {
    const searchParams = req.params;

    //since we cannnot straight away input % into the url, we have to enter in as $perc first, then replace $perc with '%'
    for (var value in searchParams) {
      if (searchParams.hasOwnProperty(value)) {
        searchParams[value] = searchParams[value].replace("$perc", "%");
      }
    }

    const searchResult = await pool.query(
      "SELECT * FROM stage WHERE CAST(wave AS TEXT) LIKE $1 AND stage_location LIKE $2 AND released  = 'f' ORDER BY stage_location ASC",
      [searchParams.wave, searchParams.loc]
    );

    res.json(searchResult.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//moving pallet location
app.put("/move:wavLoc", async (req, res) => {
  try {
    const { wavLoc } = req.params;
    [wav, loc] = wavLoc.split(":");
    const { new_stage_location } = req.body;
    const updateLocation = await pool.query(
      "UPDATE stage SET stage_location = $1 WHERE wave = $2 AND stage_location = $3 AND released  = 'f'",
      [new_stage_location, wav, loc]
    );
    res.json(`Cargo has been moved to ${new_stage_location}`);
  } catch (error) {
    console.error(error.message);
  }
});

//delete a stage entry
app.delete("/delete:wavLoc", async (req, res) => {
  try {
    const { wavLoc } = req.params;
    [wav, loc] = wavLoc.split(":");

    const deleteStageLine = await pool.query(
      "DELETE FROM stage WHERE wave = $1 AND stage_location = $2 AND released  = 'f'",
      [wav, loc]
    );
    res.json(`wave ${wav} in location: ${loc} has been deleted`);
  } catch (error) {
    console.error(error.message);
  }
});

//release multiple pack HU at the same time
app.put("/release:wavLoc", async (req, res) => {
  try {
    const { wavLoc } = req.params;
    const splitwavLoc = wavLoc.split(",");

    for (e of splitwavLoc) {
      [wav, loc] = e.split(":");

      const releaseCargo = await pool.query(
        "UPDATE stage SET released = 't', released_date = CURRENT_DATE, released_time = CURRENT_TIME WHERE wave = ($1::BIGINT) AND stage_location = ($2)",
        [wav, loc]
      );
    }
    res.json(`${splitwavLoc} has been released!`);
  } catch (error) {
    console.error(error.message);
  }
});

//Catch all method. in case user type in something not expected in the url field
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
