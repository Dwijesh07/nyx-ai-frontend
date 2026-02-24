import { Link } from "react-router-dom";
import logo from "/Users/Dwijesh/Documents/Nyx/frontend/src/assets/Nyxlogo.png";
import React from "react";

export default function Navbar() {
  return (
    <header>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={logo} className="h-10 max-w-[120px] object-contain" />
        </div>

        <nav className="space-x-6 flex">
          <Link to="/">Home</Link>
          <Link to="/tools">Tools</Link>
          <Link to="/about">About</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/account">Account</Link>
        </nav>
      </div>
    </header>
  );
}
