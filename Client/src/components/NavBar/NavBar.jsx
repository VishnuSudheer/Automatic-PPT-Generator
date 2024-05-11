import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const Navbar = () => {
  const downloadUrl = "http://localhost:3000/Presentation.pptx";

return (
    <nav className="navbar">
      <div className="navitems">
        <div className="navitem">
          <Link to={""}>Home</Link>
        </div>
        <div className="navitem">
          <a href={downloadUrl} download="Presentation.pptx">
            Download
          </a>
        </div>
        <div className="navitem">
          <Link to="/slideShow">Slideshow</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
