import { Link } from "react-router-dom";
import logo from "/Users/Dwijesh/Documents/Nyx/frontend/src/assets/Nyxlogo.png";
import React from "react";

export default function Footer() {
  return (
      <footer className="mt-12 bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-bold text-lg">Nyx Ai</div>
          <div className="flex space-x-4 text-gray-300 text-sm">
            <span>Privacy Policy & Terms and Conditions</span>
          </div>
          <div className="text-gray-400 text-sm">Contact</div>
          <div className="text-gray-400 text-sm">© 2026 Nyx Ai. All rights reserved.</div>
        </div>
      </footer>
  );
}

