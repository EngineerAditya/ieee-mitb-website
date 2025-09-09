import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Left Section - IEEE Logo & About */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                <img src="/ieee.svg" alt="IEEE Logo" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">IEEE MIT</h3>
                <p className="text-sm text-gray-400">Bengaluru</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-300">
              Inspiring innovation and technology for a better future. Join our community of engineers, researchers, and technologists.
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>📍 BSF Campus, Yelahanka Airforce Base, Bengaluru 560064</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 border-b border-gray-700 pb-2">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Home", path: "/" },
                { name: "Events", path: "/events" },
                { name: "Articles", path: "/articles" },
                { name: "Membership", path: "/membership" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links & Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 border-b border-gray-700 pb-2">Connect With Us</h4>
            <p className="text-sm mb-6 text-gray-300">Follow us on social media and stay updated with the latest tech trends.</p>
            <div className="flex flex-col gap-4 mb-6">
              <a
                href="https://www.linkedin.com/company/ieee-mit-bangalore/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IEEE MIT LinkedIn"
                className="flex items-center space-x-2 p-3 bg-gray-800 hover:bg-blue-600 rounded-lg transition-all duration-200 group"
              >
                <FaLinkedin className="text-xl group-hover:scale-110 transition-transform" />
                <span className="text-sm">LinkedIn</span>
              </a>
              <a
                href="https://instagram.com/ieee.mitb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IEEE MIT Instagram"
                className="flex items-center space-x-2 p-3 bg-gray-800 hover:bg-pink-600 rounded-lg transition-all duration-200 group"
              >
                <FaInstagram className="text-xl group-hover:scale-110 transition-transform" />
                <span className="text-sm">Instagram</span>
              </a>
            </div>
            <a
              href="mailto:ieee.mitblr@manipal.edu"
              aria-label="Email IEEE MIT"
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              <FaEnvelope />
              <span>ieee.mitblr@manipal.edu</span>
            </a>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="border-t border-gray-700 pt-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} IEEE MIT Bengaluru. All rights reserved.
            </div>
            <div className="text-sm text-gray-400">
              Made with ❤️ by{" "}
              <a
                href="https://linkedin.com/in/adityasinha2006/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200 font-medium"
              >
                Aditya Sinha
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
