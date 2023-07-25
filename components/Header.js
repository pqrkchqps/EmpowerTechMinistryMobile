import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
function Header() {
  const [useHam, setUseHam] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const handleClick = (e) => {
    setUseHam(!useHam);
    setHasOpened(true);
    setIsClosing(true);
    setTimeout(function () {
      setIsClosing(false);
    }, 1000);
  };

  return (
    <header
      className={(useHam ? "responsive " : "") + (hasOpened ? "opened" : "")}
    >
      <nav>
        <ul
          className={
            (useHam ? "responsive " : "") +
            (hasOpened ? "opened " : "") +
            (isClosing ? "closing" : "")
          }
        >
          <Link to="/">
            <li>
              <p>Home</p>
            </li>
          </Link>
          <Link to="/services">
            <li>
              <p>Services</p>
            </li>
          </Link>
          <Link to="/contact">
            <li>
              <p>Contact</p>
            </li>
          </Link>
          <Link to="/about">
            <li>
              <p>About</p>
            </li>
          </Link>
        </ul>
        <FaBars className="icon" onClick={handleClick} />
      </nav>
    </header>
  );
}

export default Header;
