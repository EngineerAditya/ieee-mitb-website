import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react"; // Hamburger menu

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLinkClick() {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      {/* Full width invisible container */}
      <div className="fixed top-0 left-0 w-full z-50 px-4 pt-4 bg-black/10">
        {/* Floating navbar box */}
        <nav className="max-w-6xl mx-auto backdrop-blur-xl bg-black/30 border border-white/20 shadow-2xl px-6 py-3 flex justify-between items-center rounded-lg">
          {/* Logo */}
          <div className="logo">
            <Link to="/">
              <img src="/logo.png" alt="MIT Bengaluru Logo" className="h-12" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center justify-center gap-10 text-white">
            <li className="flex-1 flex justify-center">
              <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
            </li>
            <li className="flex-1 flex justify-center">
              <Link to="/events" className="hover:text-gray-300 transition-colors">Events</Link>
            </li>
            <li className="flex-1 flex justify-center relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-controls="societies-dropdown"
                className="hover:text-gray-300 transition-colors focus:outline-none"
              >
                Societies
              </button>
              {isDropdownOpen && (
                <ul
                  id="societies-dropdown"
                  role="menu"
                  className="absolute left-0 top-full mt-3 bg-black/75 border border-white/20 shadow-2xl rounded-lg w-80 text-white z-50 overflow-hidden ring-1 ring-white/5"
                >
                  <li>
                    <Link to="/societies-list" onClick={handleLinkClick} className="block px-4 py-3 hover:bg-white/8 transition-colors duration-200 text-sm font-semibold text-blue-300">Societies Overview</Link>
                  </li>
                  <li>
                    <Link to="/societies/antennas-and-propagation" onClick={handleLinkClick} className="block px-4 py-3 hover:bg-white/8 transition-colors duration-200 text-sm">Antennas and Propagation Society</Link>
                  </li>
                  <li>
                    <Link to="/societies/computer-society" onClick={handleLinkClick} className="block px-4 py-3 hover:bg-white/8 transition-colors duration-200 text-sm">Computer Society</Link>
                  </li>
                  <li>
                    <Link to="/societies/computational-intelligence" onClick={handleLinkClick} className="block px-4 py-3 hover:bg-white/8 transition-colors duration-200 text-sm">Computational Intelligence Society</Link>
                  </li>
                  <li>
                    <Link to="/societies/engineering-in-medicine-and-biology" onClick={handleLinkClick} className="block px-4 py-3 hover:bg-white/8 transition-colors duration-200 text-sm">Engineering in Medicine and Biology Society</Link>
                  </li>
                  <li>
                    <Link to="/societies/geoscience-and-remote-sensing" onClick={handleLinkClick} className="block px-4 py-3 hover:bg-white/8 transition-colors duration-200 text-sm">Geoscience and Remote Sensing Society</Link>
                  </li>
                  <li>
                    <Link to="/societies/microwave-theory-and-technology" onClick={handleLinkClick} className="block px-4 py-3 hover:bg-white/8 transition-colors duration-200 text-sm">Microwave Theory and Technology Society</Link>
                  </li>
                  <li>
                    <Link to="/societies/photonics-society" onClick={handleLinkClick} className="block px-4 py-3 hover:bg-white/8 transition-colors duration-200 text-sm">Photonics Society</Link>
                  </li>
                  <li>
                    <Link to="/societies/robotics-and-automation" onClick={handleLinkClick} className="block px-4 py-3 hover:bg-white/8 transition-colors duration-200 text-sm">Robotics and Automation Society</Link>
                  </li>
                  <li>
                    <Link to="/societies/vehicular-technology" onClick={handleLinkClick} className="block px-4 py-3 hover:bg-white/8 transition-colors duration-200 text-sm">Vehicular Technology Society</Link>
                  </li>

                  {/* Affinities */}
                  <li className="px-4 py-2 text-sm text-gray-300 border-t border-white/10">Affinities</li>
                  <li>
                    <Link to="/societies/women-in-engineering" onClick={handleLinkClick} className="block px-4 py-3 hover:bg-white/8 transition-colors duration-200 text-sm">Women in Engineering</Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link to="/membership" className="hover:text-gray-300 transition-colors">Membership</Link>
            </li>
            <li>
              <Link to="/articles" className="hover:text-gray-300 transition-colors">Articles</Link>
            </li>
          </ul>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 bg-black/75 border border-white/20 shadow-2xl rounded-lg p-4 text-white space-y-3 z-50 ring-1 ring-white/5 w-full max-w-xs right-6">
            <Link to="/" onClick={handleLinkClick} className="block py-2 px-2 hover:bg-white/8 rounded">Home</Link>
            {/* About link removed */}
            <Link to="/events" onClick={handleLinkClick} className="block py-2 px-2 hover:bg-white/8 rounded">Events</Link>
            <details className="group">
              <summary className="cursor-pointer hover:text-gray-300">Societies</summary>
              <div className="ml-4 mt-2 space-y-2">
                <Link to="/societies-list" onClick={handleLinkClick} className="block hover:text-blue-300 font-semibold">Societies Overview</Link>
                <Link to="/societies/antennas-and-propagation" onClick={handleLinkClick} className="block hover:text-gray-300">Antennas and Propagation Society</Link>
                <Link to="/societies/computer-society" onClick={handleLinkClick} className="block hover:text-gray-300">Computer Society</Link>
                <Link to="/societies/computational-intelligence" onClick={handleLinkClick} className="block hover:text-gray-300">Computational Intelligence Society</Link>
                <Link to="/societies/engineering-in-medicine-and-biology" onClick={handleLinkClick} className="block hover:text-gray-300">Engineering in Medicine and Biology</Link>
                <Link to="/societies/geoscience-and-remote-sensing" onClick={handleLinkClick} className="block hover:text-gray-300">Geoscience and Remote Sensing</Link>
                <Link to="/societies/microwave-theory-and-technology" onClick={handleLinkClick} className="block hover:text-gray-300">Microwave Theory and Technology</Link>
                <Link to="/societies/photonics-society" onClick={handleLinkClick} className="block hover:text-gray-300">Photonics Society</Link>
                <Link to="/societies/robotics-and-automation" onClick={handleLinkClick} className="block hover:text-gray-300">Robotics and Automation</Link>
                <Link to="/societies/vehicular-technology" onClick={handleLinkClick} className="block hover:text-gray-300">Vehicular Technology</Link>
                <span className="text-gray-400 text-sm">Affinities</span>
                <Link to="/societies/women-in-engineering" onClick={handleLinkClick} className="block hover:text-gray-300">Women in Engineering</Link>
              </div>
            </details>
            <Link to="/membership" onClick={handleLinkClick} className="block py-2 px-2 hover:bg-white/8 rounded">Membership</Link>
            <Link to="/articles" onClick={handleLinkClick} className="block py-2 px-2 hover:bg-white/8 rounded">Articles</Link>
          </div>
        )}
      </div>

      {/* Spacer matching navbar height */}
      <div className="h-[90px]"></div>
    </>
  );
}