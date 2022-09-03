import React, { useContext, useEffect, Fragment } from "react";
import searchResultsContext from "./SearchResultsContext";
import { Link } from "react-router-dom";
import MoveSelected from "./MoveSelected";

const DisplayResult = () => {
  //to link to the parent state in app.js
  const { searchResults, setSearchResults } = useContext(searchResultsContext);

  try {
    //Release Button Function
    const releaseSelected = async () => {
      let checkedBoxArray = [];
      let checkedBoxes = document.querySelectorAll(
        "input[name=checkbox]:checked"
      );
      checkedBoxes.forEach((e) => {
        checkedBoxArray.push(e.value);
      });
      console.log(`checkboxes is ${checkedBoxes}`)
      console.log(`checkboxarray is ${checkedBoxArray}`);
      try {
        const release = await fetch(`/release${checkedBoxArray}`, {
          method: "PUT",
          headers: { "Content-type": "application/json" },
        });
        alert(`${checkedBoxArray} have been released!`);

        checkedBoxArray.forEach((wavLoc) => {
          const [wav, loc] = wavLoc.split(":");
          const index = searchResults.findIndex(
            (e) => e.wave === wav && e.stage_location === loc
          );

          //remove checked line from searchResults
          searchResults.splice(index, 1);

          //remove the line from being displayed
          let element = document.getElementById(`W${wav}L${loc}`);
          element.parentElement.removeChild(element);
        });
      } catch (error) {
        console.error(error.message);
      }
    };

    const deleteSelected = async (searchresult) => {
      if (
        window.confirm(
          `I confirm that I want to delete wave ${searchresult.wave} from ${searchresult.stage_location}`
        )
      ) {
        try {
          const deleteSelect = await fetch(
            `/delete${searchresult.wave}:${searchresult.stage_location}`,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            }
          );
          //remove the line from being displayed
          let element = document.getElementById(
            `W${searchresult.wave}L${searchresult.stage_location}`
          );
          element.parentElement.removeChild(element);
        } catch (error) {
          console.error(error.message);
        }
      } else {
        return;
      }
    };

    const allCheckBoxToggle = () => {
      let checkboxes = document.getElementsByName("checkbox");
      let checkboxToggle = document.getElementById("checkboxToggle").checked;
      if (checkboxToggle) {
        checkboxes.forEach((checkbox) => {
          checkbox.checked = true;
        });
      } else {
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      }
    };

    const sortTable = (n) => {
      let table,
        rows,
        switching,
        i,
        x,
        y,
        shouldSwitch,
        dir,
        switchcount = 0;
      table = document.getElementById("myTable");
      switching = true;
      //html for displaying up or down arrow
      const ascHTML =
        "<div id='SortAscending' style='display:inline'> &#9650;</div>";
      const descHTML =
        "<div id='SortDescending' style='display:inline'> &#9660;</div>";

      //Set the sorting direction to ascending:
      dir = "asc";

      /*Make a loop that will continue until
        no switching has been done:*/
      while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
         first, which contains table headers):*/
        for (i = 1; i < rows.length - 1; i++) {
          //start by saying there should be no switching:
          shouldSwitch = false;
          /*Get the two elements you want to compare,
          one from current row and one from the next:*/
          x = rows[i].getElementsByTagName("TD")[n + 1];
          y = rows[i + 1].getElementsByTagName("TD")[n + 1];
          /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
          if (dir == "asc") {
            if (x.innerHTML.localeCompare(y.innerHTML) > 0) {
              //if so, mark as a switch and break the loop:
              shouldSwitch = true;
              break;
            }
          } else if (dir == "desc") {
            if (x.innerHTML.localeCompare(y.innerHTML) < 0) {
              //if so, mark as a switch and break the loop:
              shouldSwitch = true;
              break;
            }
          }
        }
        if (shouldSwitch) {
          /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
          //Each time a switch is done, increase this count by 1:
          switchcount++;
        } else {
          /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
          if (switchcount == 0 && dir == "asc") {
            dir = "desc";
            switching = true;
          }
        }
      }
      //clear out all the up and down arrow
      let ascDisplayed = document.getElementById("SortAscending");
      let descDisplayed = document.getElementById("SortDescending");
      if (ascDisplayed) {
        ascDisplayed.parentElement.removeChild(ascDisplayed);
      }
      if (descDisplayed) {
        descDisplayed.parentElement.removeChild(descDisplayed);
      }
      //display the arrows beside table headers
      if (dir == "asc") {
        document
          .getElementById(`sortHeader${n}`)
          .insertAdjacentHTML("beforeend", ascHTML);
      } else {
        document
          .getElementById(`sortHeader${n}`)
          .insertAdjacentHTML("beforeend", descHTML);
      }
    };

    return (
      <Fragment>
        <h1 className="text-center mt-3">Results</h1>
        <input
          type="checkbox"
          id="checkboxToggle"
          onClick={allCheckBoxToggle}
        />
        <label htmlFor="checkboxToggle">Select All</label>
        <br />
        <div className="table-responsive">
          <table className="table table-striped" id="myTable">
            <thead>
              <tr>
                <th>#</th>
                <th id="sortHeader0" onClick={() => sortTable(0)}>
                  Wave
                </th>
                <th id="sortHeader1" onClick={() => sortTable(1)}>
                  Location
                  <div id="SortAscending" style={{ display: "inline" }}>
                    {" "}
                    &#9650;
                  </div>
                </th>
                <th id="sortHeader2" onClick={() => sortTable(2)}>
                  Pallets
                </th>
                <th id="sortHeader3" onClick={() => sortTable(3)}>
                  Date
                </th>
                <th>Move</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((searchresult) => {
                return (
                  <tr
                    id={`W${searchresult.wave}L${searchresult.stage_location}`}
                    key={`${searchresult.wave}${searchresult.stage_location}`}
                  >
                    <td>
                      <input
                        type="checkbox"
                        name="checkbox"
                        value={`${searchresult.wave}:${searchresult.stage_location}`}
                      />
                    </td>
                    <td>{searchresult.wave}</td>
                    <td>{searchresult.stage_location}</td>
                    <td>{searchresult.no_of_pallets}</td>
                    <td>{searchresult.created_date.substring(0, 10)}</td>
                    <td>
                      <MoveSelected searchresult={searchresult} />
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteSelected(searchresult)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="text-center p-3">
          {/**Search ALL*/}
          <button
            type="button"
            className="btn-lg btn-success"
            onClick={releaseSelected}
          >
            Release Selected
          </button>
        </div>
      </Fragment>
    );
  } catch (error) {
    console.error(error.message);
    return (
      <div className="text-center mt-3">
        Please enter perform a <Link to="/search">SEARCH</Link> first
      </div>
    );
  }
};

export default DisplayResult;
