/**
 * Main Entry Point - Application Setup and Routing Configuration
 * 
 * This file is the first JavaScript file that runs when the app loads.
 * 
 * Responsibilities:
 * 1. Import all page components and societies
 * 2. Define the routing structure (what URL shows what component)
 * 3. Create the React Router instance
 * 4. Render the root React component into the DOM
 * 
 * Routing Structure:
 * - Uses createBrowserRouter for client-side routing
 * - Layout component wraps all pages (provides Navbar, Footer, Background)
 * - Nested routes under Layout (children array)
 * - Each route maps a path to a component
 * 
 * How to add a new page:
 * 1. Create component in src/pages/YourPage.jsx
 * 2. Import it here: import YourPage from './pages/YourPage';
 * 3. Add route: { path: '/your-page', element: <YourPage /> }
 * 
 * Routes:
 * - / → Home page
 * - /events → All events with filters
 * - /membership → IEEE membership info
 * - /articles → Articles and resources
 * - /societies-list → Overview of all societies
 * - /societies/* → Individual society pages (10 different societies)
 */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Membership from "./pages/Membership";
import Articles from "./pages/Articles";

// Societies imports
import AntennasAndPropagationSociety from "./societies/AntennasAndPropagationSociety";
import ComputerSociety from "./societies/ComputerSociety";
import ComputationalIntelligenceSociety from "./societies/ComputationalIntelligenceSociety";
import EngineeringInMedicineAndBiologySociety from "./societies/EngineeringInMedicineAndBiologySociety";
import GeoscienceAndRemoteSensingSociety from "./societies/GeoscienceAndRemoteSensingSociety";
import MicrowaveTheoryAndTechnologySociety from "./societies/MicrowaveTheoryAndTechnologySociety";
import PhotonicsSociety from "./societies/PhotonicsSociety";
import RoboticsAndAutomationSociety from "./societies/RoboticsAndAutomationSociety";
import VehicularTechnologySociety from "./societies/VehicularTechnologySociety";
import WomenInEngineering from "./societies/WomenInEngineering";
import SocietiesList from "./pages/SocietiesList";

// Export router so App.jsx can use it
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      
      { path: "/events", element: <Events /> },
      { path: "/membership", element: <Membership /> },
      { path: "/articles", element: <Articles /> },

  // Societies
  { path: "/societies-list", element: <SocietiesList /> },
      { path: "/societies/antennas-and-propagation", element: <AntennasAndPropagationSociety /> },
      { path: "/societies/computer-society", element: <ComputerSociety /> },
      { path: "/societies/computational-intelligence", element: <ComputationalIntelligenceSociety /> },
      { path: "/societies/engineering-in-medicine-and-biology", element: <EngineeringInMedicineAndBiologySociety /> },
      { path: "/societies/geoscience-and-remote-sensing", element: <GeoscienceAndRemoteSensingSociety /> },
      { path: "/societies/microwave-theory-and-technology", element: <MicrowaveTheoryAndTechnologySociety /> },
      { path: "/societies/photonics-society", element: <PhotonicsSociety /> },
      { path: "/societies/robotics-and-automation", element: <RoboticsAndAutomationSociety /> },
      { path: "/societies/vehicular-technology", element: <VehicularTechnologySociety /> },
      { path: "/societies/women-in-engineering", element: <WomenInEngineering /> },
    ],
  },
]);

// Render the root component
// StrictMode helps catch potential problems during development
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
