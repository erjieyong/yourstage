import React, { Fragment, useState } from "react";

const Putaway = () => {
  //create state for use later
  const [wave, setWave] = useState("");
  //const [stage_location, setStageLocation] = useState("");
  //const [no_of_pallets, setNoOfPallets] = useState("");
  const [putawayList, setputawayList] = useState([
    { stage_location: "", no_of_pallets: "" },
  ]);

  const sendData = async () => {
    for (let i = 0; i < putawayList.length; i++) {
      const body = {
        wave: wave,
        stage_location: putawayList[i].stage_location,
        no_of_pallets: putawayList[i].no_of_pallets,
      };

      const response = await fetch("/putaway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log(await response.json());
    }

    alert(`Wave ${wave} has been successfully moved to location!`);
    document.getElementById("putawayForm").reset();

    if (document.getElementById(`sendDataCancelled`)) {
      document.getElementById(`sendDataCancelled`).remove();
    }
  };

  /*   //submit a form to send data but prevent user from sending data if there's already cargo at location
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      let locationEmpty = [];

      //Get the current list of location occupied that has not been released
      const occupied = await fetch("/occupied", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      let occupiedLocation = await occupied.json();
      console.log(occupiedLocation);
      occupiedLocation = occupiedLocation.map((e) => {
        return e.stage_location;
      });

      //check if location is empty with occupiedLocation array
      for (let i = 0; i < putawayList.length; i++) {
        if (occupiedLocation.includes(putawayList[i].stage_location)) {
          locationEmpty.push(false);
          //remove the previous error prompt if it is already there
          if(document.getElementById(`duplicatedLoc${i}`)){
            document.getElementById(`duplicatedLoc${i}`).remove();
          }
          document
            .getElementById(`putawayRow${i}`)
            .insertAdjacentHTML(
              "afterend",
              `<p id="duplicatedLoc${i}"class="text-danger">There's already cargo in this location!</p>`
            );
        } else {
          locationEmpty.push(true);
          occupiedLocation.push(putawayList[i].stage_location);
        }
      }

      //function to check if locationEmpty array is all true or false
      let checker = arr => arr.every(Boolean);

      //ONLY IF all location to be putaway is EMPTY, then Loop through the list of stage_location & no_of_pallets pair that was input and save to database
      if (checker(locationEmpty)) {
        for (let i = 0; i < putawayList.length; i++) {
          //remove the previous error prompt if it is already there
          if(document.getElementById(`duplicatedLoc${i}`)){
            document.getElementById(`duplicatedLoc${i}`).remove();
          }
          const body = {
            wave: wave,
            stage_location: putawayList[i].stage_location,
            no_of_pallets: putawayList[i].no_of_pallets,
          };

          const response = await fetch("/putaway", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          console.log(await response.json());
        }

        alert(`Wave ${wave} has been successfully moved to location!`);
        document.getElementById("putawayForm").reset();
      }
    } catch (error) {
      console.error(error.message);
    }
  }; */

  //submit a form to send data but just a warning if there's already cargo at location
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      let conflictLocations = [];

      //Get the current list of location occupied that has not been released
      const occupied = await fetch("/occupied", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      let occupiedLocation = await occupied.json();
      occupiedLocation = occupiedLocation.map((e) => {
        return e.stage_location;
      });

      //check if there's any pending putaway locations that is already occupied. If yes, push them to conflictLocations
      for (let i = 0; i < putawayList.length; i++) {
        if (occupiedLocation.includes(putawayList[i].stage_location)) {
          conflictLocations.push(putawayList[i].stage_location);
        }
      }

      //if there's conflicted locations, display them to user and ask for confirmation to proceed. If user confirm, then send data to database
      if (conflictLocations.length > 0) {
        if (
          window.confirm(
            `There are items already at **${conflictLocations}**. Are you sure you want to proceed?`
          )
        ) {
          sendData();
        } else {
          if (document.getElementById(`sendDataCancelled`)) {
            document.getElementById(`sendDataCancelled`).remove();
          }
          document
            .getElementById("saveButton")
            .insertAdjacentHTML(
              "beforebegin",
              `<p id="sendDataCancelled" class="sendDataCancelled text-danger text-center">Please try again!</p>`
            );
        }
      } else {
        sendData();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...putawayList];
    list[index][name] = value;
    setputawayList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...putawayList];
    list.splice(index, 1);
    setputawayList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setputawayList([...putawayList, { stage_location: "", no_of_pallets: "" }]);
  };

  //return the form html
  return (
    <Fragment>
      <h1 className="text-center mt-3">Putaway</h1>
      <form id="putawayForm" onSubmit={onSubmitForm}>
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
              pattern="^[0-9]{5,6}$"
              title="5 or 6 digits required"
              maxLength="6"
              onChange={(e) => setWave(e.target.value)}
              required
            />
          </div>
        </div>

        {/**Dynamically display putaway fields */}
        {putawayList.map((x, i) => {
          return (
            <div key={`putawayField${i}`}>
              <div className="form-group">
                <div className="form-row" id={`putawayRow${i}`}>
                  <div className="col">
                    <input
                      className="form-control"
                      name="stage_location"
                      type="text"
                      placeholder="Stage Location"
                      pattern="\d{4}[A-z]{1}\d{1}$"
                      title="Please input with this pattern 3901A1"
                      maxLength="6"
                      onChange={(e) => handleInputChange(e, i)}
                      required
                    />
                  </div>
                  <div className="col">
                    <input
                      className="form-control"
                      name="no_of_pallets"
                      type="text"
                      inputMode="numeric"
                      placeholder="Number of Pallets"
                      title="Please input numbers only"
                      pattern="^[0-9]{1,2}$"
                      maxLength="2"
                      onChange={(e) => handleInputChange(e, i)}
                      required
                    />
                  </div>
                </div>
                <div className="btn-box">
                  {putawayList.length !== 1 && (
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => handleRemoveClick(i)}
                    >
                      Remove
                    </button>
                  )}
                  {putawayList.length - 1 === i && (
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={handleAddClick}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div id="saveButton" className="text-center mt-5">
          <button type="submit" className="btn-lg btn-primary">
            Save
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default Putaway;
