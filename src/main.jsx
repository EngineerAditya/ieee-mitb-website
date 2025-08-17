import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
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

// Export router so App.jsx can use it
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/events", element: <Events /> },
      { path: "/membership", element: <Membership /> },
      { path: "/articles", element: <Articles /> },

      // Societies
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
