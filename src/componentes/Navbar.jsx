import { Link } from "react-router-dom";
import React from "react";
import "./componentes.css";

function Navbar() {
  return (
    <header>
      <img src="./src/assets/sundaelogo2.png" className="px-5"></img>
      <nav>
        <ul className="navbar space-x-10 fuente-bold">
          <li>
            <Link className="navbar-item" to="/recipes">Recipes</Link>
          </li>
          <li>
            <Link className="navbar-item" to="/ingredients">Ingredients</Link>
          </li>
          <li>
            <Link className="navbar-item" to="/login">Login / out</Link>
          </li>
          <li>
            <Link className="navbar-item" to="/register">Register</Link>
          </li>
          <li>
            <Link className="navbar-item" to="/shopping-list">Shopping List</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
