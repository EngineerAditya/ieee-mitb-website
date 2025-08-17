import React, { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import { router } from "./main"; // import your router config from main.jsx

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loader for ~2.5s
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen fadeOut={!loading} />
      ) : (
        <RouterProvider router={router} />
      )}
    </>
  );
}
