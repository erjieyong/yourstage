import React, { Fragment, useState } from "react";
// import logo from "./logo.svg";
import "./App.css";
import { Route, BrowserRouter as Router, Link } from "react-router-dom";

//components
import Putaway from "./components/Putaway";
import Search from "./components/Search";
import SearchResultsContext from "./components/SearchResultsContext";
import DisplayResult from "./components/DisplayResult";
import About from "./components/About";

function App() {
  const [searchResults, setSearchResults] = useState("");
  return (
    <Router>
      <Fragment>
        <header>
          {/**Fixed nav bar */}
          <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
            <Link className="navbar-brand" to="/search">
              <img className="nav-bar-logo" src="/logo192-white.png" alt="logo"></img>
              YourStage - Waters
            </Link>
            <button
              className="navbar-toggler collapsed"
              type="button"
              data-toggle="collapse"
              data-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/**Collapsable menu */}
            <div className="navbar-collapse collapse" id="navbarCollapse">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/putaway">
                    Putaway
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/search">
                    Search / Move / Release
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">
                    About
                  </Link>
                </li>
              </ul>
              {/*               <form className="form-inline mt-2 mt-md-0">
                <input
                  className="form-control mr-sm-2"
                  type="text"
                  placeholder="Search"
                  aria-label="Search"
                  data-cip-id="cIPJQ342845639"
                ></input>
                <button
                  className="btn btn-outline-success my-2 my-sm-0"
                  type="submit"
                >
                  Search
                </button>
              </form> */}
            </div>
          </nav>
        </header>

        {/**main content */}
        <main role="main" className="container">
          <SearchResultsContext.Provider
            value={{ searchResults, setSearchResults }}
          >
            <Route path="/putaway" component={Putaway} />
            <Route path="/search" component={Search} />
            <Route path="/results" component={DisplayResult} />
            <Route path="/about" component={About} />
            <Route exact path="/" component={Search} />
          </SearchResultsContext.Provider>
        </main>

        {/**Sticky Footer */}
        <footer className="footer">
          <div className="container">
            <div className="row text-center">
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-default btn-outline-primary"
                >
                  <Link to="/putaway">Putaway</Link>
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-default btn-outline-primary"
                >
                  <Link to="/search">Search / Move / Release</Link>
                </button>
              </div>
            </div>
          </div>
        </footer>
      </Fragment>
    </Router>
  );
}

export default App;
