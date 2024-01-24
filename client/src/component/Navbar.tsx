import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand">Todo.com</Link>
          <form className="d-flex" role="search">
            <button className="btn btn-outline-success mx-1" type="submit">
              <Link className="nav-link" to="/Signup">
                Sign Up
              </Link>
            </button>
            <button className="btn btn-outline-success mx-1" type="submit">
              <Link className="nav-link" to="/Login">
                Login
              </Link>
            </button>
          </form>
        </div>
      </nav>
    </>
  );
}
