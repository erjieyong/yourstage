import React, { Fragment, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import searchResultsContext from "./SearchResultsContext";

const Search = () => {
  //create state for use later
  const [wave, setWave] = useState("$perc");
  const [stage_location, setStageLocation] = useState("$perc");

  //to link to the parent state in app.js
  const { searchResults, setSearchResults } = useContext(searchResultsContext);

  const history = useHistory();

  //As most browser don't accept % in the url, we have to change the input of % into $perc and pass it to the server for processing
  const changeTo$Perc = (state) => {
    const stateSplit = state.split("");
    const stateChange = stateSplit.map((e) => {
      if (e === "%") {
        return (e = "$perc");
      }
      return e;
    });
    return stateChange.join("");
  };

  //if detect any '%' in wave, packHU and stageLocation, will run the function of changeTo$Perce. We added second argument because we dont want useEffect to re-render if there's no change in the wave from the previous after running function changeTo$Perc
  useEffect(() => {
    setWave(changeTo$Perc(wave));
    setStageLocation(changeTo$Perc(stage_location));
  }, [wave, stage_location]);

  //submit a search with define search field
  const submitSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/search/${wave}/${stage_location}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      setSearchResults(await response.json());
      console.log("search completed!!");
      //Reset Form and State
      document.getElementById("searchForm").reset();
      setWave("$perc");
      setStageLocation("$perc");

      let path = `/results`;
      history.push(path);
    } catch (error) {
      console.error(error.message);
    }
  };

  //submit a searchall request
  const submitSearchAll = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/search`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      setSearchResults(await response.json());
      let path = `/results`;
      history.push(path);
    } catch (error) {
      console.error(error.message);
    }
  };

  //return the form html
  return (
    <Fragment>
      <h1 className="text-center mt-3">Search</h1>
      <form id="searchForm" onSubmit={submitSearch}>
        <div className="form-group row">
          <label htmlFor="Wave" className="col-sm-2 col-form-label">
            Wave:
          </label>
          <div className="col-sm-12">
            <input
              type="text"
              inputMode="numeric"
              className="form-control"
              placeholder="Wave Number"
              maxLength="6"
              onChange={(e) => setWave(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="stage_location" className="col-sm-2 col-form-label">
            Stage Location:
          </label>
          <div className="col-sm-12">
            <input
              type="text"
              className="form-control"
              placeholder="Stage Location"
              maxLength="6"
              onChange={(e) => setStageLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="row text-center mt-5">
          <div className="col-12">
            You can make use of % as a wildcard during search.
          </div>
        </div>

        <div className="row text-center mt-5">
          {/**Search based on parameter*/}
          <div className="col-6">
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
          {/**Search ALL*/}
          <div className="col-6">
            <button
              type="button"
              className="btn-lg btn-primary"
              onClick={submitSearchAll}
            >
              Search ALL
            </button>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default Search;
