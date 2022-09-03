import React, { Fragment } from "react";

const About = () => {
  return (
    <Fragment>
      <h1 className="text-center mt-3">About</h1>
      <div className="text-center mt-3">
        Designed/Written by{" "}
        <a href="mailto:jie-yong.er@dbschenker.com">Jie Yong</a>
      </div>
      <div className="text-center mt-3">Version 1.0</div>
      <div className="text-center mt-3">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Upcoming Enhancement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>
                Enhance "Move" function modal popup such that it validates the
                location pattern
              </td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>
                Add in user log in option and ability to track who
                putaway/release/move/delete lines
              </td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>
                Add in second database table to set the list of locations
                allowed to be moved into
              </td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>
                Add in statistics for storage analysis (eg. how long packHU
                stored in warehouse, or how often each forwarder is used)
              </td>
            </tr>
            <tr>
              <th scope="row">5</th>
              <td>Add in function for multiple warehouses</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-center mt-3">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Version</th>
              <th scope="col">Date</th>
              <th scope="col">Change Log</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1.0</th>
              <td>06 Jun 20</td>
              <td>First Deployment</td>
            </tr>
            <tr>
              <th scope="row">2.0</th>
              <td>21 Mar 21</td>
              <td>
                <ul>
                  <li>Allow putaway of different wave into same location</li>
                  <li>Allow more than 1 wave per location</li>
                  <li>Allow putaway to multiple locations for single wave</li>
                  <li>Fix bug where when there's more than 1 wave in 1 location, program will auto release, move or delete button ALL the wave in the same location</li>
                  <li>Allow sorting of table by ascending or descending according to headers</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default About;
