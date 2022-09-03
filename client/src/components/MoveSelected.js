import React, { Fragment, useState } from "react";

const MoveSelected = ({ searchresult }) => {
  const [location, setLocation] = useState(searchresult.stage_location);
  const [wave, setWave] = useState(searchresult.wave);

  //update description function

  const updateLocation = async (e) => {
    e.preventDefault();
    try {
      const body = { new_stage_location: location };
      const response = await fetch(
        `/move${searchresult.wave}:${searchresult.stage_location}`,
        {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      //change the location of the particular row to match what was just input
      document.querySelector(`#W${searchresult.wave}L${searchresult.stage_location} td:nth-child(3)`).innerHTML = location;
      document.getElementById(`W${searchresult.wave}L${searchresult.stage_location}`).id = `W${searchresult.wave}L${location}`
      searchresult.stage_location = location;
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-warning"
        data-toggle="modal"
        data-target={`#id${searchresult.stage_location}`}
      >
        Move
      </button>

      <div
        className="modal"
        id={`id${searchresult.stage_location}`}
        onClick={() => setLocation(searchresult.stage_location)}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Move Location</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => setLocation(searchresult.stage_location)}
              ></button>
            </div>
            <form>
              <div className="modal-body">
                {/**PATTERN check NOT WORKING!!! */}
                <input
                  type="text"
                  className="form-control"
                  placeholder={searchresult.stage_location}
                  pattern="\d{4}[A-z]{1}\d{2}$"
                  title="Please input with this pattern 3901A1"
                  maxLength="6"
                  required
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-warning"
                  data-dismiss="modal"
                  onClick={(e) => updateLocation(e)}
                >
                  Confirm Move
                </button>
                <button
                  type="submit"
                  className="btn btn-danger"
                  data-dismiss="modal"
                  onClick={() => setLocation(searchresult.stage_location)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MoveSelected;
